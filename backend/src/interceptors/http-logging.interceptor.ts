import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(
    @InjectPinoLogger(HttpLoggingInterceptor.name)
    private readonly logger: PinoLogger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    // Log incoming request with complete details
    this.logRequest(request, requestId);

    return next.handle().pipe(
      tap({
        next: (responseBody) => {
          const duration = Date.now() - startTime;
          this.logResponse(request, response, responseBody, duration, requestId);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logError(request, response, error, duration, requestId);
        },
      }),
    );
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private logRequest(request: Request, requestId: string): void {
    const logData = {
      message: 'HTTP request received',
      type: 'http_request',
      requestId,
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      path: request.path,
      ip: request.ip || request.socket?.remoteAddress,
      userAgent: request.get('user-agent'),
      contentType: request.get('content-type'),
      queryParameters: request.query,
      routeParameters: request.params,
      headers: this.sanitizeHeaders(request.headers),
      body: request.body ? this.sanitizeBody(request.body) : undefined,
    };

    this.logger.info(logData);
  }

  private logResponse(
    request: Request,
    response: Response,
    responseBody: any,
    duration: number,
    requestId: string,
  ): void {
    const logData = {
      message: 'HTTP response sent',
      type: 'http_response',
      requestId,
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      statusCode: response.statusCode,
      statusMessage: response.statusMessage || 'OK',
      duration: `${duration}ms`,
      responseHeaders: response.getHeaders(),
      responseBody: responseBody ? this.sanitizeResponseBody(responseBody) : undefined,
    };

    this.logger.info(logData);
  }

  private logError(
    request: Request,
    response: Response,
    error: any,
    duration: number,
    requestId: string,
  ): void {
    const logData = {
      message: 'HTTP request error',
      type: 'http_error',
      requestId,
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      statusCode: response.statusCode || 500,
      duration: `${duration}ms`,
      error: {
        message: error.message || 'Unknown error',
        stack: error.stack || 'No stack trace available',
        name: error.name,
      },
    };

    this.logger.error(logData);
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
    
    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'secret', 'token', 'privateKey', 'signature'];
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  private sanitizeResponseBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'secret', 'token', 'privateKey', 'signature'];
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }
}