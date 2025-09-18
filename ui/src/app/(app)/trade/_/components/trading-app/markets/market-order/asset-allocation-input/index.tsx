"use client";

import { SwitchVertical01 } from "@untitled-ui/icons-react";

import { Separator } from "@brother-terminal/components/ui/separator";
import { cn } from "@brother-terminal/lib/utils";
import { IAssetOption, IAssetAllocation, PositionType } from "../../../../../interfaces/trading";

import { AssetAllocation } from "./asset-allocation";

export const AssetAllocationInput = ({
  assetList,
  baseAssets,
  positionType,
  quoteAssets,
  switchPosition,
  updateAssetSize,
  updateAssetToken,
}: {
  assetList: IAssetOption[];
  baseAssets: IAssetAllocation[];
  positionType: PositionType;
  quoteAssets: IAssetAllocation[];
  switchPosition: () => void;
  updateAssetSize: (
    asset: string,
    size: number
  ) => { on: (side: "base" | "quote") => void };
  updateAssetToken: (
    asset: string,
    token: string
  ) => { on: (side: "base" | "quote") => void };
}) => {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg bg-white-4 border">
      <AssetAllocation
        assetList={assetList.filter(
          (asset) => !quoteAssets.some((a) => asset.token === a.token)
        )}
        assets={baseAssets}
        className={cn(positionType === "long" ? "order-1" : "order-3")}
        type="long"
        onTokenChanged={(asset, token) => {
          updateAssetToken(asset.token, token).on("base");
        }}
        onSizeChanged={(asset, size) => {
          updateAssetSize(asset.token, size).on("base");
        }}
      />
      <div className="order-2 flex items-center gap-4">
        <Separator className="flex-1" />
        <button aria-label="Switch Position" onClick={switchPosition}>
          <SwitchVertical01 className="size-4 text-white-32" />
        </button>
        <Separator className="flex-1" />
      </div>
      <AssetAllocation
        assetList={assetList.filter(
          (asset) => !baseAssets.some((a) => asset.token === a.token)
        )}
        assets={quoteAssets}
        className={cn(positionType === "short" ? "order-1" : "order-3")}
        type="short"
        onTokenChanged={(asset, token) => {
          updateAssetToken(asset.token, token).on("quote");
        }}
        onSizeChanged={(asset, size) => {
          updateAssetSize(asset.token, size).on("quote");
        }}
      />
    </div>
  );
};
