import { PositionType } from "./trading";

export interface OrderHistoryData {
  time: Date;
  asset: string;
  direction: PositionType;
  price: number;
  size: number;
  trade_value: number;
  fee: number;
  closed_pnl: number;
}
