"use client";

import { useMemo, useState } from "react";
import { ChevronDown, SearchMd } from "@untitled-ui/icons-react";
import TokenIcon from "@brother-terminal/components/ui/token-icon";
import { useHyperliquidSDKStore } from "@/store/useHyperliquidSDKStore";

export type TriggerType = 
  | "ASSET_PRICE"
  | "FEAR_GREED_INDEX" 
  | "ALTCOIN_SEASON_INDEX"
  | "BITCOIN_DOMINANCE"
  | "VOLUME"
  | "OPEN_INTEREST"
  | "DAY_CHANGE_PERCENTAGE"
  | "SCHEDULED"
  | "CRON";

export interface TradingAsset {
  symbol: string;
  name: string;
  price: number;
  volume: number;
  openInterest: number;
  dayChange: number;
  assetIndex: number;
}

const formatNumber = (num: number) => {
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

interface TriggerAssetSelectorProps {
  selectedAsset: TradingAsset | undefined;
  onAssetSelect: (symbol: string) => void;
  triggerType: TriggerType;
  placeholder?: string;
}

export function TriggerAssetSelector({ 
  selectedAsset, 
  onAssetSelect,
  triggerType,
  placeholder = "Select asset"
}: TriggerAssetSelectorProps) {
  const { webData2, allMids } = useHyperliquidSDKStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  // Get real trading assets from webData2
  const tradingAssets = useMemo<TradingAsset[]>(() => {
    if (!webData2?.meta?.universe || !webData2?.assetCtxs) {
      return [];
    }

    return webData2.meta.universe.map((asset, index) => {
      const assetCtx = webData2.assetCtxs[index];
      const midPrice = allMids[asset.name] ? parseFloat(allMids[asset.name]) : 0;
      
      // Calculate price change
      const currentPrice = midPrice || (assetCtx ? parseFloat(assetCtx.markPx) : 0);
      const prevDayPrice = assetCtx ? parseFloat(assetCtx.prevDayPx) : currentPrice;
      const priceChange = prevDayPrice > 0 ? ((currentPrice - prevDayPrice) / prevDayPrice) * 100 : 0;
      
      return {
        symbol: asset.name,
        name: asset.name,
        price: currentPrice,
        volume: assetCtx?.dayNtlVlm ? parseFloat(assetCtx.dayNtlVlm) : 0,
        openInterest: assetCtx?.openInterest ? parseFloat(assetCtx.openInterest) : 0,
        dayChange: priceChange,
        assetIndex: index,
      };
    }).filter(asset => asset.price > 0);
  }, [webData2, allMids]);
  
  const filteredAssets = tradingAssets.filter(asset => 
    asset.symbol.toLowerCase().includes(search.toLowerCase())
  );

  // Get the relevant data for the asset based on trigger type
  const getAssetData = (asset: TradingAsset) => {
    switch (triggerType) {
      case 'ASSET_PRICE':
        return {
          primary: `$${asset.price.toLocaleString()}`,
          secondary: `${asset.dayChange >= 0 ? '+' : ''}${asset.dayChange.toFixed(2)}%`
        };
      case 'VOLUME':
        return {
          primary: formatNumber(asset.volume),
          secondary: `Price: $${asset.price.toLocaleString()}`
        };
      case 'OPEN_INTEREST':
        return {
          primary: formatNumber(asset.openInterest),
          secondary: `Price: $${asset.price.toLocaleString()}`
        };
      case 'DAY_CHANGE_PERCENTAGE':
        return {
          primary: `${asset.dayChange >= 0 ? '+' : ''}${asset.dayChange.toFixed(2)}%`,
          secondary: `Price: $${asset.price.toLocaleString()}`
        };
      default:
        return {
          primary: `$${asset.price.toLocaleString()}`,
          secondary: `${asset.dayChange >= 0 ? '+' : ''}${asset.dayChange.toFixed(2)}%`
        };
    }
  };

  // Get data for selected asset in the button
  const selectedAssetData = selectedAsset ? getAssetData(selectedAsset) : null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-9 px-3 rounded-lg border border-white-8 bg-transparent hover:bg-white-4 text-left text-sm transition-colors flex items-center justify-between"
      >
        {selectedAsset && selectedAssetData ? (
          <div className="flex items-center gap-2">
            <TokenIcon symbol={selectedAsset.symbol} size="16" />
            <span className="font-medium">{selectedAsset.symbol}</span>
            <span className="text-white-48">{selectedAssetData.primary}</span>
          </div>
        ) : (
          <span className="text-white-48">{placeholder}</span>
        )}
        <ChevronDown className="w-4 h-4 text-white-48" />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-white-8 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-white-8">
            <div className="relative">
              <SearchMd className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white-48" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assets..."
                className="w-full pl-8 pr-2 py-1.5 bg-white-4 border border-white-8 rounded text-sm text-white placeholder-white-48 focus:outline-none focus:border-white-16"
                autoFocus
              />
            </div>
          </div>

          {/* Asset List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => {
                    onAssetSelect(asset.symbol);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-white-4 transition-colors flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <TokenIcon symbol={asset.symbol} size="20" />
                    <div>
                      <div className="font-medium">{asset.symbol}</div>
                      <div className="text-xs text-white-48">{asset.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono">{getAssetData(asset).primary}</div>
                    <div className="text-xs text-white-48">
                      {getAssetData(asset).secondary}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-white-48">
                {tradingAssets.length === 0 ? "Loading assets..." : "No assets found"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}