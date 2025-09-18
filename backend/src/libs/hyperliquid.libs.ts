import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AppConfigService } from '../config/app-config.service';
import * as hl from '@nktkas/hyperliquid';
import { ethers } from 'ethers';
import { HttpTransport } from './hyperliquid.transporter.libs';
import { RedisService } from './redis.libs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

export interface AllAssetInformation {
  universe: hl.PerpsUniverse;
  assetsCtx: hl.PerpsAssetCtx;
}

interface OptimizedAssetData {
  universe: hl.PerpsUniverse;
  assetCtx: hl.PerpsAssetCtx;
  index: number;
}

@Injectable()
export class HyperliquidService {
  private infoClient!: hl.InfoClient;
  private transport!: HttpTransport;
  private defaultPrivateKey!: string;
  private allMidsData: hl.WsAllMids | null = null;
  private webData2: hl.WsWebData2 | null = null;

  // Optimized caches
  private assetBySymbol: Map<string, OptimizedAssetData> = new Map();
  private allAssetsCache: AllAssetInformation[] | null = null;

  // AllMids callbacks
  private allMidsCallbacks: Set<(data: hl.AllMids) => Promise<void>> = new Set();
  private webDataCallbacks: Set<(data: AllAssetInformation[]) => Promise<void>> = new Set();

  constructor(
    @InjectPinoLogger(HyperliquidService.name)
    private readonly logger: PinoLogger,
    private appConfig: AppConfigService,
    private redisService: RedisService,
    private httpTransport: HttpTransport,
  ) {
    this.logger.info({
      isTestnet: this.appConfig.hyperliquidTestnet,
      wsUrl: this.appConfig.hyperliquidWsUrl,
      nodeEnv: this.appConfig.nodeEnv,
    }, 'Initializing HyperliquidService...');

    this.transport = this.httpTransport;

    this.infoClient = new hl.InfoClient({ transport: this.transport });
    const wsTransport = new hl.WebSocketTransport({
      url: this.appConfig.hyperliquidWsUrl,
    })
    const subsClient = new hl.SubscriptionClient({ transport: wsTransport });

    subsClient.allMids((data) => {
      this.allMidsData = data;
      if (this.appConfig.enableBackgroundJob === true) {
        this.allMidsCallbacks.forEach(callback => callback(data.mids));
      }
    })

    subsClient.webData2({
      user: "0x0000000000000000000000000000000000000000",
    }, (data) => {
      this.webData2 = data;
      this.refreshAssetCache();
      this.webDataCallbacks.forEach(callback => callback(this.allAssetsCache!));
    });
  }

  getInfoClient(): hl.InfoClient {
    return this.infoClient;
  }

  getExchangeClient(privateKey?: string): hl.ExchangeClient {
    const key = privateKey || this.defaultPrivateKey;
    const wallet = new ethers.Wallet(key);
    return new hl.ExchangeClient({
      isTestnet: this.appConfig.hyperliquidTestnet,
      wallet,
      transport: this.transport,
    });
  }

  /**
   * Refresh asset cache when webData2 updates
   */
  private refreshAssetCache(): void {
    if (!this.webData2?.meta.universe || !this.webData2?.assetCtxs) return;

    this.assetBySymbol.clear();
    this.allAssetsCache = null;

    // Build optimized lookup map
    this.webData2.meta.universe.forEach((universe, index) => {
      const assetCtx = this.webData2!.assetCtxs[index];
      if (assetCtx) {
        this.assetBySymbol.set(universe.name, {
          universe,
          assetCtx,
          index
        });
      }
    });
  }

  /**
   * Get asset information by symbol - O(1) lookup
   */
  getAssetInfo(symbol: string): hl.PerpsUniverse | null {
    return this.assetBySymbol.get(symbol)?.universe || null;
  }

  /**
   * Get asset context by symbol - O(1) lookup
   */
  getAssetCtx(symbol: string): hl.PerpsAssetCtx | null {
    return this.assetBySymbol.get(symbol)?.assetCtx || null;
  }

  /**
   * Get asset index by symbol - O(1) lookup
   */
  getAssetIndex(symbol: string): number | null {
    const data = this.assetBySymbol.get(symbol);
    return data ? data.index : null;
  }

  /**
   * Get all assets with caching
   */
  getAllAssets(): AllAssetInformation[] {
    if (this.allAssetsCache) {
      return this.allAssetsCache;
    }

    this.allAssetsCache = Array.from(this.assetBySymbol.values()).map(data => ({
      universe: data.universe,
      assetsCtx: data.assetCtx,
    }));

    return this.allAssetsCache;
  }

  /**
   * Get current market price for an asset
   */
  getMarketPrice(symbol: string): number {
    return parseFloat(this.allMidsData?.mids[symbol] || '0');
  }

  /**
   * Get optimal decimal places for an asset
   */
  getOptimalDecimal(symbol: string): number {
    const asset = this.getAssetInfo(symbol);

    return asset ? asset.szDecimals : 8;
  }

  /**
   * Get user's open positions
   */
  async getUserPositions(address: string): Promise<hl.AssetPosition[]> {
    return (await this.infoClient.clearinghouseState({ user: address as `0x${string}` })).assetPositions;
  }

  /**
   * Get user's order history
   */
  async getUserOrders(address: string): Promise<any> {
    return await this.infoClient.openOrders({ user: address as `0x${string}` });
  }

  async getCandleSnapshot(
    symbol: string,
    interval: "1m" | "3m" | "5m" | "15m" | "30m" | "1h" | "2h" | "4h" | "8h" | "12h" | "1d" | "3d" | "1w" | "1M",
    startTime?: number,
    endTime?: number
  ): Promise<hl.Candle[]> {
    const start = startTime || Math.floor(Date.now() / 1000) - 3600;
    const end = endTime || Math.floor(Date.now() / 1000);

    const cacheKey = `candle:${symbol}:${interval}:${start}:${end}`;

    try {
      const cached = await this.redisService.getClient().get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn('Cache retrieval failed:', error);
    }

    const data = await this.infoClient.candleSnapshot({
      coin: symbol,
      interval,
      startTime: start,
      endTime: end,
    });

    try {
      await this.redisService.getClient().setEx(cacheKey, 3600, JSON.stringify(data));
    } catch (error) {
      console.warn('Cache storage failed:', error);
    }

    return data;
  }

  async getUserFills(
    address: string,
    startTime: number
  ) {
    return await this.infoClient.userFillsByTime({
      user: address as `0x${string}`,
      startTime: startTime
    })
  }

  /**
   * Add callback for AllMids data updates
   */
  addAllMidsCallback(callback: (data: hl.AllMids) => Promise<void>): void {
    this.allMidsCallbacks.add(callback);
  }

  addWebDataCallback(callback: (data: AllAssetInformation[]) => Promise<void>): void {
    this.webDataCallbacks.add(callback);
  }

  getAccountSummary(address: string): Promise<hl.PerpsClearinghouseState> {
    return this.infoClient.clearinghouseState({ user: address as `0x${string}` });
  }
}