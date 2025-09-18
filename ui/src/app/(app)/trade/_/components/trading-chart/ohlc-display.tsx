"use client";

import { useEffect, useState } from "react";
import { useHyperliquidSDKStore } from "@/store/useHyperliquidSDKStore";
import { useUserSelectionStore } from "@/store/useUserSelectionStore";
import { ChartLoader } from "./chart-loader";
import * as hl from "@nktkas/hyperliquid";

interface OHLCData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  change: number;
  changePercent: number;
}

export const OHLCDisplay = () => {
  const { subscriptionClient } = useHyperliquidSDKStore();
  const { selectedAsset } = useUserSelectionStore();
  const [ohlcData, setOhlcData] = useState<OHLCData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create HTTP client for fetching latest candle
  const infoClient = new hl.InfoClient({
    transport: new hl.HttpTransport()
  });

  useEffect(() => {
    if (!selectedAsset) {
      setOhlcData(null);
      setIsLoading(false);
      return;
    }

    const fetchLatestOHLC = async () => {
      try {
        setIsLoading(true);
        
        // Get the last 2 candles to calculate change
        const endTime = Date.now();
        const startTime = endTime - (2 * 24 * 60 * 60 * 1000); // Last 2 days
        
        const candles = await infoClient.candleSnapshot({
          coin: selectedAsset.name,
          interval: "1d",
          startTime,
          endTime,
        });

        if (candles && candles.length > 0) {
          const latestCandle = candles[candles.length - 1];
          const previousCandle = candles.length > 1 ? candles[candles.length - 2] : null;
          
          const open = parseFloat(latestCandle.o);
          const high = parseFloat(latestCandle.h);
          const low = parseFloat(latestCandle.l);
          const close = parseFloat(latestCandle.c);
          const volume = latestCandle.v ? parseFloat(latestCandle.v) : undefined;
          
          let change = 0;
          let changePercent = 0;
          
          if (previousCandle) {
            const previousClose = parseFloat(previousCandle.c);
            change = close - previousClose;
            changePercent = (change / previousClose) * 100;
          }

          setOhlcData({
            open,
            high,
            low,
            close,
            volume,
            change,
            changePercent,
          });
        }
      } catch (error) {
        console.error("Error fetching OHLC data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestOHLC();

    // Subscribe to real-time candle updates
    let subscription: hl.Subscription | null = null;
    
    if (subscriptionClient) {
      subscriptionClient.candle(
        { coin: selectedAsset.name, interval: "1d" },
        (candleData: hl.Candle) => {
          const open = parseFloat(candleData.o);
          const high = parseFloat(candleData.h);
          const low = parseFloat(candleData.l);
          const close = parseFloat(candleData.c);
          const volume = candleData.v ? parseFloat(candleData.v) : undefined;
          
          // For real-time updates, calculate change from open to close
          const change = close - open;
          const changePercent = (change / open) * 100;

          setOhlcData({
            open,
            high,
            low,
            close,
            volume,
            change,
            changePercent,
          });
        }
      ).then(sub => {
        subscription = sub;
      }).catch(error => {
        console.error("Error subscribing to candle updates:", error);
      });
    }

    // Cleanup subscription
    return () => {
      if (subscription) {
        subscription.unsubscribe().catch(console.error);
      }
    };
  }, [selectedAsset?.name, subscriptionClient]);

  if (!selectedAsset) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <ChartLoader 
          message="Loading OHLC data..."
          size="sm"
          className="h-10"
        />
      </div>
    );
  }

  if (!ohlcData) {
    return (
      <div className="flex items-center space-x-4 text-sm text-gray-400">
        <span>No OHLC data available</span>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(2)}K`;
    }
    return volume.toFixed(2);
  };

  const isPositive = ohlcData.change >= 0;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <div className="flex items-center space-x-6 text-sm">
      {/* Asset Name */}
      <div className="font-medium text-white">
        {selectedAsset.name}
      </div>
      
      {/* Current Price & Change */}
      <div className="flex items-center space-x-2">
        <span className="text-white font-medium">
          ${formatPrice(ohlcData.close)}
        </span>
        <span className={`${changeColor} text-xs`}>
          {isPositive ? '+' : ''}${formatPrice(ohlcData.change)} ({isPositive ? '+' : ''}{ohlcData.changePercent.toFixed(2)}%)
        </span>
      </div>

      {/* OHLC Values */}
      <div className="flex items-center space-x-4 text-xs text-gray-300">
        <span>O: <span className="text-white">${formatPrice(ohlcData.open)}</span></span>
        <span>H: <span className="text-green-400">${formatPrice(ohlcData.high)}</span></span>
        <span>L: <span className="text-red-400">${formatPrice(ohlcData.low)}</span></span>
        <span>C: <span className="text-white">${formatPrice(ohlcData.close)}</span></span>
        {ohlcData.volume && (
          <span>Vol: <span className="text-blue-400">{formatVolume(ohlcData.volume)}</span></span>
        )}
      </div>
    </div>
  );
};