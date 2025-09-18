import { useTradingStore } from "../store/use-trading-store";
import { IAssetOption } from "../interfaces/trading";

export const useTradingApp = () => {
  const { assetsSelection, setAssetsSelection, tradingSizeInput, setTradingSizeInput } = useTradingStore();

  // Mock asset list - in a real app, this would come from an API
  const assetList: IAssetOption[] = [
    { token: "BTC" },
    { token: "ETH" },
    { token: "SOL" },
    { token: "USDC" },
  ];

  const updateAssetSize = (asset: string, size: number) => ({
    on: (side: "base" | "quote") => {
      const newSelection = { ...assetsSelection };
      const assetIndex = newSelection[side].findIndex(a => a.token === asset);
      if (assetIndex >= 0) {
        newSelection[side][assetIndex].size = size;
        setAssetsSelection(newSelection);
      }
    }
  });

  const updateAssetToken = (oldToken: string, newToken: string) => ({
    on: (side: "base" | "quote") => {
      const newSelection = { ...assetsSelection };
      const assetIndex = newSelection[side].findIndex(a => a.token === oldToken);
      if (assetIndex >= 0) {
        newSelection[side][assetIndex].token = newToken;
        setAssetsSelection(newSelection);
      }
    }
  });

  const swapAssetsSelection = () => {
    const newSelection = {
      base: assetsSelection.quote,
      quote: assetsSelection.base,
    };
    setAssetsSelection(newSelection);
  };

  return {
    assetList,
    assetsSelection,
    updateAssetSize,
    updateAssetToken,
    tradingSizeInput,
    setTradingSizeInput,
    swapAssetsSelection,
  };
};