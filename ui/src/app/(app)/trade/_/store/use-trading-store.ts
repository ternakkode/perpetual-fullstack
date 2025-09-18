import { create } from "zustand";
import { IMarketData, IAssetAllocationPairs } from "../interfaces/trading";

interface TradingState {
  marketInformation: IMarketData;
  assetsSelection: IAssetAllocationPairs;
  setAssetsSelection: (value: IAssetAllocationPairs) => void;
  tradingSizeInput: number;
  setTradingSizeInput: (value: number) => void;
}

export const useTradingStore = create<TradingState>()((set) => ({
  marketInformation: {
    price: 0,
    change: 0,
    netFunding: 0,
  },
  assetsSelection: {
    base: [],
    quote: [],
  },
  setAssetsSelection: (value) => set({ assetsSelection: value }),
  tradingSizeInput: 0,
  setTradingSizeInput: (value) => set({ tradingSizeInput: value }),
}));
