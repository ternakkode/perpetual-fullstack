"use client";

import { useState, useEffect, useRef } from "react";
import { LinkExternal01 } from "@untitled-ui/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@brother-terminal/components/ui/select";
import { cn } from "@brother-terminal/lib/utils";
import { useHyperliquidSDKStore } from "@brother-terminal/store/useHyperliquidSDKStore";
import { useUserSelectionSync } from "@brother-terminal/store/useUserSelectionSync";
import { getGroupingOptions } from "@brother-terminal/components/hyperliquid-sdk-provider";
import type * as hl from '@nktkas/hyperliquid';

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

interface Trade {
  price: number;
  size: number;
  time: string;
  side: "buy" | "sell";
  hash?: string;
}

// Data processing utilities
const processOrderBookLevels = (levels: any): OrderBookEntry[] => {
  if (!levels || !Array.isArray(levels) || levels.length === 0) {
    return [];
  }
  
  let runningTotal = 0;
  return levels
    .map((level: any) => {
      const { price, size } = parseOrderBookLevel(level);
      if (price <= 0 || size <= 0) return null;
      
      runningTotal += size;
      return { price, size, total: runningTotal };
    })
    .filter(Boolean) as OrderBookEntry[];
};

const parseOrderBookLevel = (level: any): { price: number; size: number } => {
  let priceStr: string, sizeStr: string;
  
  if (Array.isArray(level) && level.length >= 2) {
    [priceStr, sizeStr] = level;
  } else if (level?.px && level?.sz) {
    priceStr = level.px;
    sizeStr = level.sz;
  } else {
    console.warn('Unexpected order book level format:', level);
    return { price: 0, size: 0 };
  }
  
  return {
    price: parseFloat(priceStr),
    size: parseFloat(sizeStr)
  };
};

const processTradeData = (tradeData: hl.WsTrade): Trade => {
  try {
    return {
      price: parseFloat(tradeData.px),
      size: parseFloat(tradeData.sz),
      side: tradeData.side === "A" ? "sell" : "buy",
      time: new Date(tradeData.time).toLocaleTimeString([], { hour12: false }),
      hash: tradeData.hash,
    };
  } catch (error) {
    console.error('Error processing trade data:', error, tradeData);
    return {
      price: 0,
      size: 0,
      side: "buy",
      time: new Date().toLocaleTimeString([], { hour12: false }),
      hash: 'error',
    };
  }
};

// Custom hooks for data processing
const useOrderBookData = (selectedAsset: any, orderBooks: any, priceGrouping: string) => {
  return {
    currentOrderBook: selectedAsset?.name && orderBooks[selectedAsset.name] 
      ? orderBooks[selectedAsset.name][priceGrouping] 
      : null,
    asks: (() => {
      try {
        const orderBook = selectedAsset?.name && orderBooks[selectedAsset.name] 
          ? orderBooks[selectedAsset.name][priceGrouping] 
          : null;
        if (!orderBook?.levels?.[1]) return [];
        return processOrderBookLevels(orderBook.levels[1]).sort((a, b) => b.price - a.price);
      } catch (error) {
        console.error('Error processing asks:', error);
        return [];
      }
    })(),
    bids: (() => {
      try {
        const orderBook = selectedAsset?.name && orderBooks[selectedAsset.name] 
          ? orderBooks[selectedAsset.name][priceGrouping] 
          : null;
        if (!orderBook?.levels?.[0]) return [];
        return processOrderBookLevels(orderBook.levels[0]).sort((a, b) => b.price - a.price);
      } catch (error) {
        console.error('Error processing bids:', error);
        return [];
      }
    })()
  };
};

const useMarketMetrics = (asks: OrderBookEntry[], bids: OrderBookEntry[]) => {
  const bestAsk = asks.length > 0 ? Math.min(...asks.map(a => a.price)) : 0;
  const bestBid = bids.length > 0 ? Math.max(...bids.map(b => b.price)) : 0;
  const spread = bestAsk > 0 && bestBid > 0 ? bestAsk - bestBid : 0;
  const spreadPercent = bestBid > 0 ? (spread / bestBid) * 100 : 0;
  const maxSize = Math.max(
    asks.length > 0 ? Math.max(...asks.map(a => a.size)) : 0,
    bids.length > 0 ? Math.max(...bids.map(b => b.size)) : 0,
    1
  );
  
  return { bestAsk, bestBid, spread, spreadPercent, maxSize };
};

const useAutoScroll = (asks: OrderBookEntry[], bids: OrderBookEntry[], selectedAsset: any, priceGrouping: string) => {
  const asksContainerRef = useRef<HTMLDivElement>(null);
  const bidsContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (asksContainerRef.current && asks.length > 0) {
      asksContainerRef.current.scrollTop = asksContainerRef.current.scrollHeight;
    }
    
    if (bidsContainerRef.current && bids.length > 0) {
      bidsContainerRef.current.scrollTop = 0;
    }
  }, [asks.length, bids.length, selectedAsset?.name, priceGrouping]);
  
  return { asksContainerRef, bidsContainerRef };
};

// Formatting utilities
const formatPrice = (price: number) => price.toFixed(3);
const formatSize = (size: number) => {
  if (size >= 1000000) {
    return `${(size / 1000000).toFixed(1)}M`;
  } else if (size >= 1000) {
    return `${(size / 1000).toFixed(1)}K`;
  } else if (size < 1) {
    return size.toFixed(8).replace(/\.?0+$/, '');
  } else {
    return size.toFixed(1);
  }
};
const formatTotal = (total: number) => {
  if (total >= 1000000) {
    return `${(total / 1000000).toFixed(1)}M`;
  } else if (total >= 1000) {
    return `${(total / 1000).toFixed(1)}K`;
  } else if (total < 1) {
    return total.toFixed(8).replace(/\.?0+$/, '');
  } else {
    return total.toFixed(1);
  }
};

export const OrderBookTrades = () => {
  const { selectedAsset, isLoading } = useUserSelectionSync();
  const { orderBooks, tradesData, isConnected, priceGrouping, setPriceGrouping } = useHyperliquidSDKStore();
  
  const availableGroupings = selectedAsset ? getGroupingOptions(selectedAsset.price) : ["1", "10"];
  const { currentOrderBook, asks, bids } = useOrderBookData(selectedAsset, orderBooks, priceGrouping);
  const { spread, spreadPercent, maxSize } = useMarketMetrics(asks, bids);
  const { asksContainerRef, bidsContainerRef } = useAutoScroll(asks, bids, selectedAsset, priceGrouping);
  
  const currentTrades = selectedAsset?.name ? tradesData[selectedAsset.name] || [] : [];
  const trades: Trade[] = currentTrades.map(processTradeData);
  
  useEffect(() => {
    if (selectedAsset && availableGroupings.length > 0 && !availableGroupings.includes(priceGrouping)) {
      setPriceGrouping(availableGroupings[0]);
    }
  }, [selectedAsset?.name, availableGroupings, priceGrouping, setPriceGrouping]);
  
  const isLoadingOrderBook = !currentOrderBook && isConnected && selectedAsset;
  const isLoadingTrades = currentTrades.length === 0 && isConnected && selectedAsset;

  // Show loading state when no asset is selected or data is loading
  if (isLoading || !selectedAsset) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="p-4 space-y-4">
          <div className="animate-pulse">
            <div className="h-4 w-24 bg-white-8 rounded mb-2"></div>
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-3 w-16 bg-white-8 rounded"></div>
                  <div className="h-3 w-20 bg-white-8 rounded"></div>
                  <div className="h-3 w-16 bg-white-8 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Order Book Section */}
      <div className="flex-shrink-0">
        {/* Order Book Header */}
        <div className="p-3 border-b border-white-8 flex items-center justify-between">
          <h3 className="text-sm font-medium">Order Book</h3>
          <Select value={priceGrouping} onValueChange={setPriceGrouping}>
            <SelectTrigger className="w-24 h-6 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableGroupings.map((grouping) => (
                <SelectItem key={grouping} value={grouping}>
                  {grouping}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Order Book Headers */}
        <div className="px-3 py-2 border-b border-white-4">
          <div className="grid grid-cols-3 gap-2 text-xs text-white-64">
            <div className="text-left">Price</div>
            <div className="text-right">Size</div>
            <div className="text-right">Total</div>
          </div>
        </div>

        {/* Asks (Sells) */}
        <div ref={asksContainerRef} className="max-h-[200px] overflow-y-auto">
          {isLoadingOrderBook ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={`ask-loading-${index}`} className="px-3 py-1 animate-pulse">
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-3 w-12 bg-white-8 rounded"></div>
                  <div className="h-3 w-16 bg-white-8 rounded"></div>
                  <div className="h-3 w-14 bg-white-8 rounded"></div>
                </div>
              </div>
            ))
          ) : 
            // Show 6 lowest asks (closest to spread)
            asks.slice(-6).map((ask, index) => {
              const widthPercent = (ask.size / maxSize) * 100;
              return (
                <div
                  key={`${selectedAsset?.name || 'unknown'}-ask-${index}`}
                  className="relative px-3 py-1 hover:bg-white-4 group"
                >
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-red-500/10 group-hover:bg-red-500/15"
                    style={{ width: `${widthPercent}%` }}
                  />
                  <div className="relative grid grid-cols-3 gap-2 text-xs">
                    <div className="text-red-500 font-mono">{formatPrice(ask.price)}</div>
                    <div className="text-right text-white-80 font-mono">{formatSize(ask.size)}</div>
                    <div className="text-right text-white-64 font-mono">{formatTotal(ask.total)}</div>
                  </div>
                </div>
              );
            })
          }
        </div>

        {/* Spread */}
        <div className="px-3 py-2 border-y border-white-8 bg-white-4">
          <div className="text-center">
            <div className="text-xs text-white-64">Spread</div>
            <div className="text-xs font-mono">
              {formatPrice(spread)} ({spreadPercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        {/* Bids (Buys) */}
        <div ref={bidsContainerRef} className="max-h-[200px] overflow-y-auto">
          {isLoadingOrderBook ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={`bid-loading-${index}`} className="px-3 py-1 animate-pulse">
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-3 w-12 bg-white-8 rounded"></div>
                  <div className="h-3 w-16 bg-white-8 rounded"></div>
                  <div className="h-3 w-14 bg-white-8 rounded"></div>
                </div>
              </div>
            ))
          ) : 
            // Show 6 highest bids (closest to spread)
            bids.slice(0, 6).map((bid, index) => {
              const widthPercent = (bid.size / maxSize) * 100;
              return (
                <div
                  key={`${selectedAsset?.name || 'unknown'}-bid-${index}`}
                  className="relative px-3 py-1 hover:bg-white-4 group"
                >
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 group-hover:bg-emerald-500/15"
                    style={{ width: `${widthPercent}%` }}
                  />
                  <div className="relative grid grid-cols-3 gap-2 text-xs">
                    <div className="text-emerald-500 font-mono">{formatPrice(bid.price)}</div>
                    <div className="text-right text-white-80 font-mono">{formatSize(bid.size)}</div>
                    <div className="text-right text-white-64 font-mono">{formatTotal(bid.total)}</div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>

      {/* Trades Section */}
      <div className="flex-1 flex flex-col min-h-0 border-t border-white-8">
        {/* Trades Header */}
        <div className="p-3 border-b border-white-8 flex-shrink-0">
          <h3 className="text-sm font-medium">Trades</h3>
        </div>

        {/* Trades Headers */}
        <div className="px-3 py-2 border-b border-white-4 flex-shrink-0">
          <div className="grid grid-cols-3 gap-2 text-xs text-white-64">
            <div className="text-left">Price</div>
            <div className="text-right">Size</div>
            <div className="text-right">Time</div>
          </div>
        </div>

        {/* Trades List */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingTrades && trades.length === 0 ? (
            Array.from({ length: 10 }).map((_, index) => (
              <div key={`trade-loading-${index}`} className="px-3 py-1 animate-pulse">
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-3 w-12 bg-white-8 rounded"></div>
                  <div className="h-3 w-16 bg-white-8 rounded"></div>
                  <div className="h-3 w-14 bg-white-8 rounded"></div>
                </div>
              </div>
            ))
          ) : trades.length > 0 ? (
            trades.map((trade, index) => (
              <div
                key={`${selectedAsset?.name || 'unknown'}-trade-${index}`}
                className="px-3 py-1 hover:bg-white-4 group"
              >
                <div className="grid grid-cols-3 gap-2 text-xs items-center">
                  <div className={cn(
                    "font-mono",
                    trade.side === "buy" ? "text-emerald-500" : "text-red-500"
                  )}>
                    {formatPrice(trade.price)}
                  </div>
                  <div className="text-right text-white-80 font-mono">
                    {formatSize(trade.size)}
                  </div>
                  <div className="text-right text-white-64 flex items-center justify-end gap-1">
                    <span className="font-mono text-xs">{trade.time}</span>
                    <LinkExternal01 className="size-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center py-8">
              <div className="text-center text-white-48">
                <p>No trades yet</p>
                <p className="text-xs mt-1">Waiting for {selectedAsset?.name} trades...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};