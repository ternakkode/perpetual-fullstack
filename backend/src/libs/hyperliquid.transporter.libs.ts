import { HttpRequestError, HttpTransportOptions, IRequestTransport, MaybePromise } from '@nktkas/hyperliquid';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class HttpTransport implements IRequestTransport, HttpTransportOptions {
    isTestnet: boolean;
    timeout: number | null;
    server: {
        mainnet: {
            api: string | URL;
            rpc: string | URL;
        };
        testnet: {
            api: string | URL;
            rpc: string | URL;
        };
    };
    fetchOptions: Omit<RequestInit, "body" | "method">;
    onRequest?: (request: Request) => MaybePromise<Request | void | null | undefined>;
    onResponse?: (response: Response) => MaybePromise<Response | void | null | undefined>;
    private axios: AxiosInstance;

    constructor(@Inject(Logger) private readonly logger: Logger) {
        this.isTestnet = process.env.HYPERLIQUID_TESTNET === 'true';
        this.timeout = 10_000;
        this.server = {
            mainnet: {
                api: "https://api.hyperliquid.xyz",
                rpc: "https://rpc.hyperliquid.xyz",
            },
            testnet: {
                api: "https://api.hyperliquid-testnet.xyz",
                rpc: "https://rpc.hyperliquid-testnet.xyz",
            },
        };
        this.fetchOptions = {};

        const axiosConfig: AxiosRequestConfig = {
            timeout: this.timeout || undefined,
            headers: {
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Content-Type': 'application/json',
            },
            validateStatus: () => true,
        };

        const proxy = process.env.HYPERLIQUID_HTTPS_PROXY
        if (proxy) {
            axiosConfig.httpsAgent = new HttpsProxyAgent(proxy);
        }

        this.axios = axios.create(axiosConfig);
    }

    async request<T>(endpoint: "info" | "exchange" | "explorer", payload: unknown, signal?: AbortSignal): Promise<T> {
        const maxRetries = 3;
        let retryCount = 0;

        while (retryCount <= maxRetries) {
            try {
                const url = new URL(
                    endpoint,
                    this.server[this.isTestnet === true ? "testnet" : "mainnet"][endpoint === "explorer" ? "rpc" : "api"],
                ).toString();

                const requestHeaders = this.mergeHeaders(
                    {
                        'Accept-Encoding': 'gzip, deflate, br, zstd',
                        'Content-Type': 'application/json',
                    },
                    this.fetchOptions.headers || {}
                );

                let request = new Request(url, {
                    method: 'POST',
                    headers: requestHeaders,
                    body: JSON.stringify(payload),
                    signal: signal || (this.timeout ? AbortSignal.timeout(this.timeout) : undefined),
                    ...this.fetchOptions,
                });

                if (this.onRequest) {
                    const customRequest = await this.onRequest(request);
                    if (customRequest instanceof Request) request = customRequest;
                }

                const axiosConfig: AxiosRequestConfig = {
                    method: 'POST',
                    url: request.url,
                    data: await request.text(),
                    headers: Object.fromEntries(request.headers.entries()),
                    signal: request.signal,
                };

                const proxy = process.env.HYPERLIQUID_HTTPS_PROXY
                if (proxy) {
                    axiosConfig.httpsAgent = new HttpsProxyAgent(proxy);
                }

                this.logger.log({
                    message: 'Hyperliquid API request',
                    url: axiosConfig.url,
                    endpoint,
                    method: 'POST',
                    payload,
                    retryCount,
                    isTestnet: this.isTestnet
                }, 'Hyperliquid Request');

                const axiosResponse = await this.axios.request(axiosConfig);
                
                this.logger.log({
                    message: 'Hyperliquid API response received',
                    url: axiosConfig.url,
                    endpoint,
                    status: axiosResponse.status,
                    statusText: axiosResponse.statusText,
                    retryCount,
                    responseSize: JSON.stringify(axiosResponse.data).length,
                    responseBody: axiosResponse.data
                }, 'Hyperliquid Response');

                const responseHeaders = new Headers();
                Object.entries(axiosResponse.headers).forEach(([key, value]) => {
                    if (value) responseHeaders.set(key, String(value));
                });

                let response = new Response(
                    typeof axiosResponse.data === 'string'
                        ? axiosResponse.data
                        : JSON.stringify(axiosResponse.data),
                    {
                        status: axiosResponse.status,
                        statusText: axiosResponse.statusText,
                        headers: responseHeaders,
                    }
                );

                if (this.onResponse) {
                    const customResponse = await this.onResponse(response);
                    if (customResponse instanceof Response) response = customResponse;
                }

                if (response.status === 429 && retryCount < maxRetries) {
                    retryCount++;
                    const backoffDelay = Math.pow(2, retryCount - 1) * 100;
                    
                    this.logger.warn({
                        message: 'Rate limit hit, retrying request',
                        url: axiosConfig.url,
                        endpoint,
                        retryCount,
                        backoffDelay,
                        maxRetries
                    }, 'Hyperliquid Rate Limit');
                    
                    await new Promise(resolve => setTimeout(resolve, backoffDelay));
                    continue;
                }

                if (!response.ok || !response.headers.get("Content-Type")?.includes("application/json")) {
                    const body = await response.text().catch(() => undefined);
                    
                    this.logger.error({
                        message: 'Hyperliquid API request failed',
                        url: axiosConfig.url,
                        endpoint,
                        status: response.status,
                        statusText: response.statusText,
                        contentType: response.headers.get("Content-Type"),
                        body,
                        retryCount
                    }, 'Hyperliquid Request Error');
                    
                    throw new HttpRequestError(response, body);
                }

                const body = await response.json();

                if (body?.type === "error") {
                    this.logger.error({
                        message: 'Hyperliquid API returned error response',
                        url: axiosConfig.url,
                        endpoint,
                        errorType: body?.type,
                        errorMessage: body?.message,
                        retryCount
                    }, 'Hyperliquid API Error');
                    
                    throw new HttpRequestError(response, body?.message);
                }

                return body;
            } catch (error) {
                if (error instanceof HttpRequestError) {
                    if (error.response.status === 429 && retryCount < maxRetries) {
                        retryCount++;
                        const backoffDelay = Math.pow(2, retryCount - 1) * 100;
                        
                        this.logger.warn({
                            message: 'HTTP request error with rate limit, retrying',
                            endpoint,
                            status: error.response.status,
                            retryCount,
                            backoffDelay,
                            maxRetries
                        }, 'Hyperliquid Rate Limit Error');
                        
                        await new Promise(resolve => setTimeout(resolve, backoffDelay));
                        continue;
                    }
                    
                    this.logger.error({
                        message: 'HTTP request error occurred',
                        endpoint,
                        status: error.response.status,
                        statusText: error.response.statusText,
                        errorMessage: error.message,
                        retryCount
                    }, 'Hyperliquid HTTP Error');
                    
                    throw error;
                }

                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError;
                    const response = new Response(
                        axiosError.response?.data ? JSON.stringify(axiosError.response.data) : undefined,
                        {
                            status: axiosError.response?.status || 0,
                            statusText: axiosError.response?.statusText || 'Network Error',
                        }
                    );

                    if (axiosError.response?.status === 429 && retryCount < maxRetries) {
                        retryCount++;
                        const backoffDelay = Math.pow(2, retryCount - 1) * 100;
                        
                        this.logger.warn({
                            message: 'Axios error with rate limit, retrying',
                            endpoint,
                            status: axiosError.response?.status,
                            statusText: axiosError.response?.statusText,
                            retryCount,
                            backoffDelay,
                            maxRetries
                        }, 'Hyperliquid Axios Rate Limit');
                        
                        await new Promise(resolve => setTimeout(resolve, backoffDelay));
                        continue;
                    }

                    this.logger.error({
                        message: 'Axios error occurred',
                        endpoint,
                        status: axiosError.response?.status || 0,
                        statusText: axiosError.response?.statusText || 'Network Error',
                        errorMessage: axiosError.message,
                        code: axiosError.code,
                        retryCount
                    }, 'Hyperliquid Axios Error');

                    throw new HttpRequestError(response, axiosError.message);
                }

                this.logger.error({
                    message: 'Unknown error occurred',
                    endpoint,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    stack: error instanceof Error ? error.stack : undefined,
                    retryCount
                }, 'Hyperliquid Unknown Error');

                throw new HttpRequestError(
                    new Response(null, { status: 0, statusText: 'Unknown Error' }),
                    error instanceof Error ? error.message : 'Unknown error'
                );
            }
        }

        this.logger.error({
            message: 'Maximum retry attempts reached for rate limit',
            endpoint,
            maxRetries,
            finalRetryCount: retryCount
        }, 'Hyperliquid Max Retries Exceeded');

        throw new HttpRequestError(
            new Response(null, { status: 429, statusText: 'Too Many Requests' }),
            'Maximum retry attempts reached for rate limit'
        );
    }

    private mergeHeaders(...headerInits: (HeadersInit | undefined)[]): Headers {
        const merged = new Headers();

        for (const headers of headerInits) {
            if (!headers) continue;

            if (headers instanceof Headers) {
                headers.forEach((value, key) => merged.set(key, value));
            } else if (Array.isArray(headers)) {
                headers.forEach(([key, value]) => merged.set(key, value));
            } else {
                Object.entries(headers).forEach(([key, value]) => {
                    if (value !== undefined) merged.set(key, String(value));
                });
            }
        }

        return merged;
    }
}