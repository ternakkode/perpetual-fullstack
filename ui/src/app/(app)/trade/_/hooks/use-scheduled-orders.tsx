import { useEffect, useMemo, useState } from "react";

interface ScheduledOrderData {
  id: string;
  baseToken: string;
  quoteToken: string;
  symbol: string;
  side: "buy" | "sell";
  type: string;
  size: number;
  price?: number;
  triggerCondition: string;
  scheduledTime: string;
  status: "pending" | "executed" | "cancelled" | "expired";
  timeRemaining: string;
}


export const useScheduledOrders = () => {
  const columns = useMemo(
    () => [
      { label: "Asset" },
      { label: "Side" },
      { label: "Type" },
      { label: "Size" },
      { label: "Price" },
      { label: "Trigger" },
      { label: "Scheduled Time" },
      { label: "Status" },
      { label: "Time Remaining" },
    ],
    []
  );

  const [scheduledOrders, setScheduledOrders] = useState<ScheduledOrderData[]>([]);

  const cancelScheduledOrder = (orderId: string) => {
    setScheduledOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: "cancelled" as const, timeRemaining: "-" }
          : order
      )
    );
  };

  return {
    columns,
    scheduledOrders,
    cancelScheduledOrder,
  };
};