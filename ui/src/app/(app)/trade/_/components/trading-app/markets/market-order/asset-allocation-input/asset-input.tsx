import { cn } from "@brother-terminal/lib/utils";
import { IAssetOption, PositionType } from "../../../../../interfaces/trading";

import { AssetSelector } from "../../../core/asset-selector";
import { NumericInput } from "../../../core/numeric-input";

export const AssetInput = ({
  assetList,
  assetPrice,
  assetSize,
  assetToken,
  maximumSize = 99,
  type,
  onSizeChanged,
  onTokenSelected,
}: {
  assetList: IAssetOption[];
  assetPrice: number;
  assetSize: number;
  assetToken: string;
  maximumSize?: number;
  type: PositionType;
  onSizeChanged: (value: number) => void;
  onTokenSelected: (token: string) => void;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-1.5 pl-3 rounded-md border",
        type === "long"
          ? "bg-primary-base border-primary"
          : "bg-danger-base border-danger"
      )}
    >
      <NumericInput
        defaultValue={assetSize}
        placeholder={String(maximumSize)}
        opts={{
          max: maximumSize,
          min: 1,
          suffix: " %",
          rightAlign: false,
        }}
        onChange={onSizeChanged}
      />
      <div className="flex items-center gap-2">
        <span className="text-[9px] text-white-48">{assetPrice}</span>
        <AssetSelector
          assets={assetList}
          className="md:text-xs"
          tokens={[assetToken]}
          onAssetSelected={onTokenSelected}
        />
      </div>
    </div>
  );
};
