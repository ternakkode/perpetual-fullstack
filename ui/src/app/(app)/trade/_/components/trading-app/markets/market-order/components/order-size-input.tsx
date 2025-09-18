"use client";

import { Button } from "@brother-terminal/components/ui/button";
import { Input } from "@brother-terminal/components/ui/input";
import TokenIcon from "@brother-terminal/components/ui/token-icon";
import { formatToCurrencyString } from "@brother-terminal/lib/utils";

export type Unit = "USD" | "%" | "ASSET";

interface OrderSizeInputProps {
  orderSize: string;
  setOrderSize: (size: string) => void;
  unit: Unit;
  setUnit: (unit: Unit) => void;
  selectedAssetName: string;
  orderSizeValid: boolean;
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

export function OrderSizeInput({
  orderSize,
  setOrderSize,
  unit,
  setUnit,
  selectedAssetName,
  orderSizeValid,
  maxOrderSizes,
  minOrderSizes,
  setSizePct
}: OrderSizeInputProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
          <TokenIcon size="16" symbol={selectedAssetName}/>
          <span className="text-sm font-medium text-white-64">{selectedAssetName}</span>
        </div>
        <Input
          inputMode="decimal"
          value={orderSize}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.]/g, "");
            const numValue = parseFloat(value) || 0;
            
            // Get current maximum based on selected unit
            let maxAllowed;
            switch (unit) {
              case "USD":
                maxAllowed = maxOrderSizes.maxUSD;
                break;
              case "%":
                maxAllowed = maxOrderSizes.maxPercentage;
                break;
              case "ASSET":
                maxAllowed = maxOrderSizes.maxAsset;
                break;
              default:
                maxAllowed = Infinity;
            }
            
            // Only update if within limits or if clearing the input
            if (value === "" || numValue <= maxAllowed) {
              setOrderSize(value);
              
              // Update sizePct if unit is percentage
              if (unit === "%" && numValue > 0) {
                setSizePct(numValue);
              }
            }
          }}
          placeholder="0.00"
          className={`h-10 sm:h-9 text-sm pl-20 pr-16 ${
            !orderSizeValid ? "border-red-500 focus:border-red-500" : ""
          }`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="bg-transparent text-sm text-white-64 border-none outline-none cursor-pointer"
          >
            <option value="USD">USD</option>
            <option value="%">%</option>
            <option value="ASSET">{selectedAssetName}</option>
          </select>
        </div>
      </div>
      
      {/* Helper text showing minimum and maximum allowed */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-white-48">
            Min: {
              unit === "USD" ? formatToCurrencyString(minOrderSizes.minUSD) :
              unit === "%" ? `${minOrderSizes.minPercentage.toFixed(2)}%` :
              `${minOrderSizes.minAsset.toFixed(6)} ${selectedAssetName}`
            } | Max: {
              unit === "USD" ? formatToCurrencyString(maxOrderSizes.maxUSD) :
              unit === "%" ? `${maxOrderSizes.maxPercentage}%` :
              `${maxOrderSizes.maxAsset.toFixed(6)} ${selectedAssetName}`
            }
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
            onClick={() => {
              const maxValue = unit === "USD" ? maxOrderSizes.maxUSD.toString() :
                              unit === "%" ? maxOrderSizes.maxPercentage.toString() :
                              maxOrderSizes.maxAsset.toString();
              setOrderSize(maxValue);
              if (unit === "%") {
                setSizePct(maxOrderSizes.maxPercentage);
              }
            }}
          >
            MAX
          </Button>
        </div>
        {!orderSizeValid && (
          <span className="text-red-400">
            {(() => {
              const size = parseFloat(orderSize) || 0;
              switch (unit) {
                case "USD":
                  if (size < minOrderSizes.minUSD) return "Below minimum size";
                  if (size > maxOrderSizes.maxUSD) return "Exceeds maximum size";
                  break;
                case "%":
                  if (size < minOrderSizes.minPercentage) return "Below minimum size";
                  if (size > maxOrderSizes.maxPercentage) return "Exceeds maximum size";
                  break;
                case "ASSET":
                  if (size < minOrderSizes.minAsset) return "Below minimum size";
                  if (size > maxOrderSizes.maxAsset) return "Exceeds maximum size";
                  break;
              }
              return "Invalid size";
            })()}
          </span>
        )}
      </div>
    </div>
  );
}