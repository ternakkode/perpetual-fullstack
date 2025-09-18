import { IAssetAllocationPairs } from "./trading";

export interface PositionPnl {
  value: number;
  percentage: number;
}

export interface PositionData {
  assets: IAssetAllocationPairs;
  size: number;
  value: number;
  entry_price: number;
  market_price: number;
  pnl: PositionPnl;
  liquid_price: number;
  margin: number;
  funding: number;
}
