export interface IAssetAllocation {
  size: number;
  token: string;
}

export interface IAssetAllocationPairs {
  base: IAssetAllocation[];
  quote: IAssetAllocation[];
}

export interface IAssetOption {
  marked?: boolean;
  token: string;
}

export interface IAssetPairs {
  base: TokenPairs;
  quote: TokenPairs;
}

export interface IMarketData {
  price: number;
  change: number;
  netFunding: number;
}

export type TokenPairs = string[];

export type PositionType = "long" | "short";
