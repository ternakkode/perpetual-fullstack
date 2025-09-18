import { useMemo } from "react";
import { useHyperliquidSDKStore } from "@/store/useHyperliquidSDKStore";

interface OpenOrderData {
  id: string;
  baseToken: string;
  quoteToken: string;
  symbol: string;
  side: "buy" | "sell";
  type: string;
  size: number;
  price: number;
  filled: number;
  remaining: number;
  timestamp: string;
}

export const useOpenOrders = () => {
  const { webData2, exchangeClient } = useHyperliquidSDKStore();

  const columns = useMemo(
    () => [
      { label: "Asset" },
      { label: "Side" },
      { label: "Type" },
      { label: "Size" },
      { label: "Price" },
      { label: "Filled" },
      { label: "Remaining" },
      { label: "Time" },
    ],
    []
  );

  const openOrders = useMemo<OpenOrderData[]>(() => {
    if (!webData2?.openOrders) {
      return [];
    }

    return webData2.openOrders.map((order) => {
      const size = parseFloat(order.sz);
      const price = parseFloat(order.limitPx);
      const originalSize = parseFloat(order.origSz);
      const filled = originalSize - size; // Filled = Original Size - Remaining Size
      const remaining = size;
      
      // Determine side based on Hyperliquid's side field ("A" = Ask/Sell, "B" = Bid/Buy)
      const side: "buy" | "sell" = order.side === "B" ? "buy" : "sell";
      
      // Format timestamp
      const timestamp = new Date(order.timestamp).toISOString();
      
      // Determine order type
      let orderType = "Limit"; // Default to Limit
      if (order.isTrigger) {
        orderType = order.orderType || "Stop";
      } else {
        orderType = order.orderType || "Limit";
      }

      return {
        id: order.oid.toString(),
        baseToken: order.coin,
        quoteToken: "USD", // Hyperliquid uses USD as quote
        symbol: `${order.coin}/USD`,
        side: side,
        type: orderType,
        size: originalSize,
        price: price,
        filled: filled,
        remaining: remaining,
        timestamp: timestamp,
      };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Sort by newest first
  }, [webData2]);

  const cancelOrder = async (orderId: string) => {
    if (!exchangeClient) {
      console.error("Exchange client not available for order cancellation");
      return;
    }

    try {
      // Find the order to get required details
      const order = openOrders.find(o => o.id === orderId);
      if (!order) {
        console.error("Order not found:", orderId);
        return;
      }

      // TODO: Implement actual order cancellation with exchangeClient
      // await exchangeClient.cancelOrder({
      //   asset: order.baseToken,
      //   oid: parseInt(orderId)
      // });
      
      console.log(`Would cancel order ${orderId} for ${order.symbol}`);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  return {
    columns,
    openOrders,
    cancelOrder,
  };
};