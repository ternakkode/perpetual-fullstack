import { cn } from "@brother-terminal/lib/utils";
import { IAssetOption, IAssetAllocation, PositionType } from "../../../../../interfaces/trading";

import { AssetInput } from "./asset-input";

export const AssetAllocation = ({
  assetList,
  assets,
  className,
  type,
  onSizeChanged,
  onTokenChanged,
}: {
  assetList: IAssetOption[];
  assets: IAssetAllocation[];
  className?: string;
  type: PositionType;
  onSizeChanged: (asset: IAssetAllocation, value: number) => void;
  onTokenChanged: (asset: IAssetAllocation, token: string) => void;
}) => {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <p className="text-xs text-white-48 capitalize">{type}</p>
      <div className="flex flex-col gap-1.5">
        {assets.map((asset) => (
          <AssetInput
            key={asset.token}
            assetList={assetList}
            assetPrice={1767.6}
            assetSize={asset.size}
            assetToken={asset.token}
            type={type}
            onSizeChanged={(value) => onSizeChanged(asset, value)}
            onTokenSelected={(value) => onTokenChanged(asset, value)}
          />
        ))}
      </div>
    </div>
  );
};
