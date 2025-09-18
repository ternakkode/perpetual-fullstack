"use client";

import { formatToCurrencyString } from "@brother-terminal/lib/utils";
import type { Unit } from "./order-size-input";

interface OrderSizeSliderProps {
  orderSize: string;
  setOrderSize: (size: string) => void;
  unit: Unit;
  selectedAssetName: string;
  maxOrderSizes: {
    maxUSD: number;
    maxAsset: number;
    maxPercentage: number;
  };
  minOrderSizes: {
    minUSD: number;
    minAsset: number;
    minPercentage: number;
  };
  setSizePct: (pct: number) => void;
}

export function OrderSizeSlider({
  orderSize,
  setOrderSize,
  unit,
  selectedAssetName,
  maxOrderSizes,
  minOrderSizes,
  setSizePct
}: OrderSizeSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white-64">Size</span>
        <span className="text-sm font-medium">
          {unit === "USD" ? formatToCurrencyString(parseFloat(orderSize) || 0) :
           unit === "%" ? `${parseFloat(orderSize) || 0}%` :
           `${parseFloat(orderSize) || 0} ${selectedAssetName}`}
        </span>
      </div>
      <div className="relative">
        <div className="h-2 bg-white-8 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-200 ease-out"
            style={{ 
              width: `${(() => {
                const size = parseFloat(orderSize) || 0;
                switch (unit) {
                  case "USD":
                    return maxOrderSizes.maxUSD > 0 ? (size / maxOrderSizes.maxUSD) * 100 : 0;
                  case "%":
                    return maxOrderSizes.maxPercentage > 0 ? (size / maxOrderSizes.maxPercentage) * 100 : 0;
                  case "ASSET":
                    return maxOrderSizes.maxAsset > 0 ? (size / maxOrderSizes.maxAsset) * 100 : 0;
                  default:
                    return 0;
                }
              })()}%` 
            }}
          />
        </div>
        <input
          type="range"
          min={(() => {
            switch (unit) {
              case "USD": return minOrderSizes.minUSD;
              case "%": return minOrderSizes.minPercentage;
              case "ASSET": return minOrderSizes.minAsset;
              default: return 0;
            }
          })()}
          max={(() => {
            switch (unit) {
              case "USD": return maxOrderSizes.maxUSD;
              case "%": return maxOrderSizes.maxPercentage;
              case "ASSET": return maxOrderSizes.maxAsset;
              default: return 100;
            }
          })()}
          step={(() => {
            switch (unit) {
              case "USD": return "0.01";
              case "%": return "0.1";
              case "ASSET": return "0.000001";
              default: return "1";
            }
          })()}
          value={parseFloat(orderSize) || 0}
          onChange={(e) => {
            const value = Number(e.target.value);
            
            // Ensure value is within limits
            let cappedValue;
            switch (unit) {
              case "USD":
                cappedValue = Math.max(minOrderSizes.minUSD, Math.min(value, maxOrderSizes.maxUSD));
                break;
              case "%":
                cappedValue = Math.max(minOrderSizes.minPercentage, Math.min(value, maxOrderSizes.maxPercentage));
                setSizePct(cappedValue);
                break;
              case "ASSET":
                cappedValue = Math.max(minOrderSizes.minAsset, Math.min(value, maxOrderSizes.maxAsset));
                break;
              default:
                cappedValue = value;
            }
            
            setOrderSize(String(cappedValue));
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}