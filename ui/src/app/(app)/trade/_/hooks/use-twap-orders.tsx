import { useEffect, useMemo, useState } from "react";
import { useHyperliquidSDKStore } from "../../../../../store/useHyperliquidSDKStore";

interface TwapOrderData {
  id: string;
  baseToken: string;
  quoteToken: string;
  symbol: string;
  side: "buy" | "sell";
  totalSize: number;
  durationMinutes: number;
  progressPercentage: number;
  filledSize: number;
  avgPrice?: number;
  status: "active" | "paused" | "completed" | "cancelled";
}


export const useTwapOrders = () => {
  const { twapStates, webData2 } = useHyperliquidSDKStore();
  
  
  const columns = useMemo(
    () => [
      { label: "Asset" },
      { label: "Side" },
      { label: "Total Size" },
      { label: "Duration" },
      { label: "Progress" },
      { label: "Filled" },
      { label: "Avg Price" },
      { label: "Status" },
    ],
    []
  );

  const [twapOrders, setTwapOrders] = useState<TwapOrderData[]>([]);
  
  // Convert TWAP states from the store to display format
  const convertTwapStates = useMemo(() => {
    if (!twapStates || twapStates.length === 0) {
      return []; // Return empty array when no data
    }
    
    return twapStates.map(([id, twapState]) => {
      const progressPercentage = parseFloat(twapState.sz) > 0 
        ? (parseFloat(twapState.executedSz) / parseFloat(twapState.sz)) * 100
        : 0;
      
      const avgPrice = parseFloat(twapState.executedNtl) > 0 && parseFloat(twapState.executedSz) > 0
        ? parseFloat(twapState.executedNtl) / parseFloat(twapState.executedSz)
        : undefined;
      
      // Determine status based on progress and current time
      const isCompleted = progressPercentage >= 100;
      const isExpired = Date.now() > twapState.timestamp + (twapState.minutes * 60 * 1000);
      
      let status: "active" | "paused" | "completed" | "cancelled";
      if (isCompleted) {
        status = "completed";
      } else if (isExpired) {
        status = "cancelled";
      } else {
        status = "active";
      }
      
      return {
        id: id.toString(),
        baseToken: twapState.coin,
        quoteToken: "USDC", // Assuming USDC as quote token
        symbol: `${twapState.coin}/USDC`,
        side: twapState.side === "B" ? "buy" as const : "sell" as const,
        totalSize: parseFloat(twapState.sz),
        durationMinutes: twapState.minutes,
        progressPercentage,
        filledSize: parseFloat(twapState.executedSz),
        avgPrice,
        status,
      };
    });
  }, [twapStates]);
  
  useEffect(() => {
    setTwapOrders(convertTwapStates);
  }, [convertTwapStates]);

  const cancelTwapOrder = (orderId: string) => {
    setTwapOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: "cancelled" as const }
          : order
      )
    );
  };

  const pauseTwapOrder = (orderId: string) => {
    setTwapOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: "paused" as const }
          : order
      )
    );
  };

  const resumeTwapOrder = (orderId: string) => {
    setTwapOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: "active" as const }
          : order
      )
    );
  };

  return {
    columns,
    twapOrders,
    cancelTwapOrder,
    pauseTwapOrder,
    resumeTwapOrder,
  };
};