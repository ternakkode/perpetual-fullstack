"use client";

import { AssetSelector } from "../core/asset-selector";
import { cn } from "@brother-terminal/lib/utils";

export const SingleAssetInformation = ({
  asset,
  type,
  onAssetChange,
  isLoading = false,
}: {
  asset: string;
  type: "SPOT" | "PERP";
  onAssetChange?: (newAsset: string) => void;
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <div className="animate-pulse flex items-center gap-2">
          <div className="h-8 w-8 bg-white-8 rounded-full"></div>
          <div className="space-y-1">
            <div className="h-5 w-24 bg-white-8 rounded"></div>
            <div className="h-3 w-16 bg-white-8 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Single Clickable Asset Selector with full display */}
      <div className="relative">
        <AssetSelector
          assets={[]} // This would be populated with available assets
          tokens={[asset]}
          onAssetSelected={(newAsset) => {
            onAssetChange?.(newAsset);
          }}
          className="text-sm"
          displayStyle="full" // Custom prop to show full display
          assetType={type}
        />
      </div>
    </div>
  );
};