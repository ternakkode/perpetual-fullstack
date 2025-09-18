import { MultiAssetOrderBlock } from "./multi-asset-order-block";
import { NarrativeDrivenBlock } from "./narrative-driven-block";
import { ThousandOfPairsBlock } from "./thousand-of-pairs-block";

export const FeatureBento = () => {
  return (
    <div className="flex flex-col gap-5 md:grid md:grid-cols-2 md:gap-8">
      <div className="col-span-2">
        <MultiAssetOrderBlock />
      </div>
      <NarrativeDrivenBlock />
      <ThousandOfPairsBlock />
    </div>
  );
};
