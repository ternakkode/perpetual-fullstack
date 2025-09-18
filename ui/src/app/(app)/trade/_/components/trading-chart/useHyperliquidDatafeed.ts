"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as hl from "@nktkas/hyperliquid";
import { useHyperliquidSDKStore } from "@/store/useHyperliquidSDKStore";
import { useUserSelectionStore } from "@/store/useUserSelectionStore";

// TradingView data feed interfaces
export interface Bar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface SymbolInfo {
  name: string;
  ticker: string;
  description: string;
  type: string;
  session: string;
  timezone: string;
  exchange: string;
  minmov: number;
  pricescale: number;
  has_intraday: boolean;
  has_daily: boolean;
  has_weekly_and_monthly: boolean;
  supported_resolutions: string[];
  volume_precision: number;
  data_status: string;
  has_no_volume: boolean;
}

interface PeriodParams {
  from: number;
  to: number;
  firstDataRequest: boolean;
}

type OnReadyCallback = (configuration: {
  supports_marks: boolean;
  supports_timescale_marks: boolean;
  supports_time: boolean;
  supported_resolutions: string[];
  exchanges: Array<{
    value: string;
    name: string;
    desc: string;
  }>;
}) => void;

type HistoryCallback = (bars: Bar[], options: { noData?: boolean }) => void;
type ErrorCallback = (error: Error) => void;

export interface Datafeed {
  onReady: (callback: OnReadyCallback) => void;
  resolveSymbol: (
    symbolName: string,
    onSymbolResolvedCallback: (symbolInfo: SymbolInfo) => void,
    onResolveErrorCallback: (error: Error) => void,
  ) => void;
  getBars: (
    symbolInfo: SymbolInfo,
    resolution: string,
    periodParams: PeriodParams,
    onHistoryCallback: HistoryCallback,
    onErrorCallback: ErrorCallback,
  ) => void;
  subscribeBars: (
    symbolInfo: SymbolInfo,
    resolution: string,
    onRealtimeCallback: (bar: Bar) => void,
    subscribeUID: string,
    onResetCacheNeededCallback: () => void,
  ) => void;
  unsubscribeBars: (subscribeUID: string) => void;
}

// Convert TradingView resolution to Hyperliquid interval format
const convertResolution = (resolution: string): "1M" | "1m" | "3m" | "5m" | "15m" | "30m" | "1h" | "2h" | "4h" | "8h" | "12h" | "1d" | "3d" | "1w" => {
  switch (resolution) {
    case "1": return "1m";
    case "3": return "3m";
    case "5": return "5m";
    case "15": return "15m";
    case "30": return "30m";
    case "60": return "1h";
    case "120": return "2h";
    case "240": return "4h";
    case "480": return "8h";
    case "720": return "12h";
    case "1D": return "1d";
    case "3D": return "3d";
    case "1W": return "1w";
    case "1M": return "1M";
    default: return "1h";
  }
};

// Convert Hyperliquid candle to TradingView bar
const convertCandleToBar = (candle: hl.Candle): Bar => ({
  time: candle.t, // Hyperliquid already provides Unix timestamp in milliseconds
  open: parseFloat(candle.o),
  high: parseFloat(candle.h),
  low: parseFloat(candle.l),
  close: parseFloat(candle.c),
  volume: candle.v ? parseFloat(candle.v) : undefined,
});

/**
 * Custom hook that creates a Hyperliquid datafeed instance for TradingView charts
 */
export function useHyperliquidDatafeed(): Datafeed {
  const { subscriptionClient } = useHyperliquidSDKStore();
  const { selectedAsset } = useUserSelectionStore();

  // Track active subscriptions and latest bars for real-time updates
  const activeSubscriptions = useRef<Map<string, hl.Subscription>>(new Map());
  const realtimeCallbacks = useRef<Map<string, (bar: Bar) => void>>(new Map());
  const [lastCandles, setLastCandles] = useState<Map<string, Bar>>(new Map());

  // Create HTTP client for historical data
  const infoClient = useMemo(() =>
    new hl.InfoClient({
      transport: new hl.HttpTransport()
    }), []
  );

  // Clean up subscriptions on unmount
  useEffect(() => {
    return () => {
      activeSubscriptions.current.forEach(subscription => {
        subscription.unsubscribe().catch(console.error);
      });
      activeSubscriptions.current.clear();
    };
  }, []);

  const datafeed: Datafeed = useMemo(() => ({
    // Configuration data for TradingView
    onReady: (callback: OnReadyCallback): void => {
      setTimeout(() => callback({
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: true,
        supported_resolutions: ["1", "3", "5", "15", "30", "60", "120", "240", "480", "720", "1D", "3D", "1W", "1M"],
        exchanges: [{
          value: "HYPERLIQUID",
          name: "Hyperliquid",
          desc: "Hyperliquid DEX",
        }],
      }), 0);
    },

    // Resolve symbol information
    resolveSymbol: (
      symbolName: string,
      onSymbolResolvedCallback: (symbolInfo: SymbolInfo) => void,
      onResolveErrorCallback: (error: Error) => void,
    ): void => {
      try {
        // Extract coin from symbol (e.g., "BTC/USD" -> "BTC")
        const coin = symbolName.split('/')[0] || symbolName;

        const symbolInfo: SymbolInfo = {
          name: symbolName,
          ticker: coin,
          description: `${coin} Perpetual`,
          type: "crypto",
          session: "24x7",
          timezone: "Etc/UTC",
          exchange: "HYPERLIQUID",
          minmov: 1,
          pricescale: 100000, // 5 decimal places
          has_intraday: true,
          has_daily: true,
          has_weekly_and_monthly: true,
          supported_resolutions: ["1", "3", "5", "15", "30", "60", "120", "240", "480", "720", "1D", "3D", "1W", "1M"],
          volume_precision: 8,
          data_status: "streaming",
          has_no_volume: false,
        };

        setTimeout(() => onSymbolResolvedCallback(symbolInfo), 0);
      } catch (error) {
        setTimeout(() => onResolveErrorCallback(error as Error), 0);
      }
    },

    // Get historical bars
    getBars: async (
      symbolInfo: SymbolInfo,
      resolution: string,
      periodParams: PeriodParams,
      onHistoryCallback: HistoryCallback,
      onErrorCallback: ErrorCallback,
    ): Promise<void> => {
      try {
        const { from, to, firstDataRequest } = periodParams;
        const coin = symbolInfo.ticker;
        const interval = convertResolution(resolution);

        // Convert from seconds to milliseconds
        const startTime = from * 1000;
        const endTime = to * 1000;

        console.log(`Fetching candles for ${coin}, interval ${interval}, from ${new Date(startTime).toISOString()} to ${new Date(endTime).toISOString()}`);

        // Fetch historical candles from Hyperliquid
        const candles = await infoClient.candleSnapshot({
          coin,
          interval,
          startTime,
          endTime,
        });

        if (!candles || candles.length === 0) {
          console.log(`No candles found for ${coin}`);
          onHistoryCallback([], { noData: true });
          return;
        }

        // Convert candles to TradingView bars
        const bars: Bar[] = candles
          .map(convertCandleToBar)
          .sort((a, b) => a.time - b.time); // Ensure chronological order

        console.log(`Fetched ${bars.length} candles for ${coin}`);

        // Store the latest candle for real-time updates
        if (bars.length > 0) {
          const latestBar = bars[bars.length - 1];
          setLastCandles(prev => new Map(prev.set(`${coin}_${interval}`, latestBar)));
        }

        onHistoryCallback(bars, { noData: false });
      } catch (error) {
        console.error('Error fetching historical data:', error);
        onErrorCallback(error as Error);
      }
    },

    // Subscribe to real-time updates
    subscribeBars: async (
      symbolInfo: SymbolInfo,
      resolution: string,
      onRealtimeCallback: (bar: Bar) => void,
      subscribeUID: string,
      onResetCacheNeededCallback: () => void,
    ): Promise<void> => {
      if (!subscriptionClient) {
        console.warn('Subscription client not available');
        return;
      }

      try {
        const coin = symbolInfo.ticker;
        const interval = convertResolution(resolution);
        const subscriptionKey = `${coin}_${interval}`;

        // Store the callback for this subscription
        realtimeCallbacks.current.set(subscribeUID, onRealtimeCallback);

        // Check if we already have a subscription for this coin/interval
        if (activeSubscriptions.current.has(subscriptionKey)) {
          console.log(`Already subscribed to ${subscriptionKey}`);
          return;
        }

        console.log(`Subscribing to real-time candles for ${coin}, interval ${interval}`);

        // Subscribe to candle updates
        const subscription = await subscriptionClient.candle(
          { coin, interval },
          (candleData: hl.Candle) => {

            const newBar = convertCandleToBar(candleData);

            // Update our stored candle
            setLastCandles(prev => new Map(prev.set(subscriptionKey, newBar)));

            // Call all callbacks for this symbol/resolution
            realtimeCallbacks.current.forEach((callback, uid) => {
              if (uid.includes(coin)) {
                callback(newBar);
              }
            });
          }
        );

        activeSubscriptions.current.set(subscriptionKey, subscription);
        console.log(`Successfully subscribed to ${subscriptionKey}`);

      } catch (error) {
        console.error('Error subscribing to real-time data:', error);
      }
    },

    // Unsubscribe from real-time updates
    unsubscribeBars: async (subscribeUID: string): Promise<void> => {
      console.log(`Unsubscribing ${subscribeUID}`);

      // Remove the callback
      realtimeCallbacks.current.delete(subscribeUID);

      // If no more callbacks for this subscription, unsubscribe from WebSocket
      const hasOtherCallbacks = Array.from(realtimeCallbacks.current.keys())
        .some(uid => uid !== subscribeUID);

      if (!hasOtherCallbacks) {
        // Find and unsubscribe the WebSocket subscription
        for (const [key, subscription] of activeSubscriptions.current.entries()) {
          if (subscribeUID.includes(key.split('_')[0])) {
            try {
              await subscription.unsubscribe();
              activeSubscriptions.current.delete(key);
              console.log(`Unsubscribed from ${key}`);
            } catch (error) {
              console.error('Error unsubscribing:', error);
            }
            break;
          }
        }
      }
    },
  }), [infoClient, subscriptionClient]);

  return datafeed;
}