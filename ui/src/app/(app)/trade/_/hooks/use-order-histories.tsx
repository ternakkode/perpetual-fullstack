import { useMemo } from "react";
import { useHyperliquidSDKStore } from "@/store/useHyperliquidSDKStore";
import { OrderHistoryData } from "../interfaces/order-histories";

export const useOrderHistories = () => {
  const { userFills, isLoadingUserFills } = useHyperliquidSDKStore();

  const columns = useMemo(
    () => [
      { label: "Time" },
      { label: "Asset" },
      { label: "Direction" },
      { label: "Price" },
      { label: "Size" },
      { label: "Trade Value" },
      { label: "Fee" },
      { label: "Closed PNL" },
    ],
    []
  );

  const orderHistories = useMemo<OrderHistoryData[]>(() => {
    if (!userFills || userFills.length === 0) {
      return [];
    }

    return userFills.map((fill) => {
      const price = parseFloat(fill.px);
      const size = parseFloat(fill.sz);
      const fee = parseFloat(fill.fee || "0");
      const tradeValue = price * Math.abs(size);
      
      // Determine direction: positive size = buy/long, negative size = sell/short
      const direction = size > 0 ? "long" : "short";
      
      // Parse timestamp (Hyperliquid provides timestamp in milliseconds)
      const time = new Date(fill.time);
      
      // Closed PnL would be calculated based on the fill vs previous positions
      // For now, we'll set it to 0 as it requires more complex calculation
      const closedPnl = parseFloat(fill.closedPnl || "0");

      return {
        time,
        asset: fill.coin,
        direction: direction as "long" | "short",
        price,
        size: Math.abs(size),
        trade_value: tradeValue,
        fee,
        closed_pnl: closedPnl,
      };
    }).sort((a, b) => b.time.getTime() - a.time.getTime()); // Sort by newest first
  }, [userFills]);

  return {
    columns,
    orderHistories,
    isLoadingUserFills,
  };
};
