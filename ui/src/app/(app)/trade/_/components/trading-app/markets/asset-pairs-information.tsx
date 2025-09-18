"use client";

import { Star04 } from "@untitled-ui/icons-react";
import { forwardRef } from "react";

import { cn } from "@brother-terminal/lib/utils";
import { IAssetOption, IAssetPairs } from "../../../interfaces/trading";

import { AssetSelector } from "../core/asset-selector";

interface AssetPairsInformationProps {
  assetList?: IAssetOption[];
  assetsSelection?: IAssetPairs;
  updateAssetToken?: (
    asset: string,
    token: string
  ) => { on: (side: "base" | "quote") => void };
  asset?: string;
  type?: "SPOT" | "PERP";
  onAssetChange?: (newAsset: string) => void;
  isLoading?: boolean;
}

export const AssetPairsInformation = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & AssetPairsInformationProps
>(({ assetList, assetsSelection, updateAssetToken, asset = "ETH", type = "PERP", onAssetChange, isLoading = false, ...props }, ref) => {
  if (isLoading) {
    return (
      <div
        ref={ref}
        {...props}
        className={cn("flex items-center gap-3", props.className)}
      >
        <div className="animate-pulse">
          <div className="size-5 bg-white-8 rounded"></div>
        </div>
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
    <div
      ref={ref}
      {...props}
      className={cn("flex items-center gap-3", props.className)}
    >
      <button aria-label="Mark Favorite" className="group outline-none">
        <Star04 className="transition-colors size-5 text-white-24 group-hover:text-yellow-500 group-focus-visible:text-yellow-500" />
      </button>
      
      {/* Single Asset Display for Mobile */}
      <AssetSelector
        assets={assetList || []}
        tokens={[asset]}
        onAssetSelected={(newAsset) => {
          onAssetChange?.(newAsset);
        }}
        className="text-sm"
        displayStyle="full"
        assetType={type}
      />
    </div>
  );
});
AssetPairsInformation.displayName = "AssetPairsInformation";
