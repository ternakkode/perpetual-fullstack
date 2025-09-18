import { useMemo } from "react";
import { useHyperliquidSDKStore } from "@/store/useHyperliquidSDKStore";
import { PositionData } from "../interfaces/positions";

export const usePositions = () => {
  const { webData2, allMids } = useHyperliquidSDKStore();

  const columns = useMemo(
    () => [
      { label: "Asset" },
      { label: "Size" },
      { label: "Value" },
      { label: "Entry Price" },
      { label: "Mark Price" },
      { label: "PnL" },
      { label: "Liq. Price" },
      { label: "Margin" },
      { label: "Funding" },
    ],
    []
  );

  const positions = useMemo<PositionData[]>(() => {
    if (!webData2?.clearinghouseState?.assetPositions) {
      return [];
    }

    return webData2.clearinghouseState.assetPositions
      .filter(assetPos => {
        const szi = parseFloat(assetPos.position?.szi || "0");
        return Math.abs(szi) > 1e-10; // Only show positions with actual size
      })
      .map((assetPos) => {
        const position = assetPos.position!;
        const coin = position.coin;
        const szi = parseFloat(position.szi);
        const positionValue = parseFloat(position.positionValue || "0");
        const entryPrice = parseFloat(position.entryPx || "0");
        const unrealizedPnl = parseFloat(position.unrealizedPnl || "0");
        const marginUsed = parseFloat(position.marginUsed || "0");
        const liquidationPrice = parseFloat(position.liquidationPx || "0");
        
        // Get current market price from allMids or fallback to entry price
        const markPrice = allMids[coin] ? parseFloat(allMids[coin]) : entryPrice;
        
        // Calculate PnL percentage
        const pnlPercentage = entryPrice > 0 ? (unrealizedPnl / (Math.abs(szi) * entryPrice)) * 100 : 0;
        
        // Get funding information
        const sinceOpenFunding = parseFloat(position.cumFunding?.sinceOpen || "0");
        
        return {
          assets: {
            base: [{ token: coin, size: Math.abs(szi) }],
            quote: [{ token: "USDC", size: Math.abs(positionValue) }],
          },
          size: szi, // Keep the sign to show long (+) or short (-)
          value: Math.abs(positionValue),
          entry_price: entryPrice,
          market_price: markPrice,
          pnl: {
            value: unrealizedPnl,
            percentage: pnlPercentage,
          },
          liquid_price: liquidationPrice,
          margin: marginUsed,
          funding: sinceOpenFunding,
        };
      });
  }, [webData2, allMids]);

  return {
    columns,
    positions,
  };
};
