import { useMemo } from "react";
import { useHyperliquidSDKStore } from "@/store/useHyperliquidSDKStore";

interface BalanceData {
  token: string;
  symbol: string;
  total: number;
  available: number;
  locked: number;
  usdValue: number;
}

export const useBalances = () => {
  const { webData2, allMids } = useHyperliquidSDKStore();

  const columns = useMemo(
    () => [
      { label: "Asset" },
      { label: "Total" },
      { label: "Available" },
      { label: "Locked" },
      { label: "USD Value" },
    ],
    []
  );

  const balances = useMemo<BalanceData[]>(() => {
    const balancesList: BalanceData[] = [];
    
    // Add spot balances
    if (webData2?.spotState?.balances) {
      const spotBalances = webData2.spotState.balances.map((balance) => {
        const total = parseFloat(balance.total || "0");
        const hold = parseFloat(balance.hold || "0");
        const available = total - hold; // Available = Total - Hold
        const locked = hold; // Hold represents locked amount
        
        // Get price from allMids for USD value calculation
        const midPrice = allMids[balance.coin] ? parseFloat(allMids[balance.coin]) : 1;
        const usdValue = balance.coin === "USDC" ? total : total * midPrice;
        
        return {
          token: balance.coin,
          symbol: balance.coin === "USDC" ? "USDC (Spot)" : balance.coin,
          total,
          available,
          locked,
          usdValue,
        };
      }).filter(balance => balance.total > 0); // Only show balances with value
      
      balancesList.push(...spotBalances);
    }
    
    // Add perpetual balance (USDC from clearinghouseState)
    if (webData2?.clearinghouseState?.marginSummary) {
      const accountValue = parseFloat(webData2.clearinghouseState.marginSummary.accountValue || "0");
      const withdrawable = parseFloat(webData2.clearinghouseState.withdrawable || "0");
      const locked = Math.max(0, accountValue - withdrawable);
      
      if (accountValue > 0) {
        balancesList.push({
          token: "USDC",
          symbol: "USDC (Perps)",
          total: accountValue,
          available: withdrawable,
          locked: locked,
          usdValue: accountValue,
        });
      }
    }
    
    return balancesList;
  }, [webData2, allMids]);

  return {
    columns,
    balances,
  };
};