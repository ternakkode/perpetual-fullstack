"use client";

import { Button } from "@brother-terminal/components/ui/button";

import { MarketOrderDrawer } from "./market-order/market-order-drawer";
import { useUserSelectionSync } from "@brother-terminal/store/useUserSelectionSync";

export const TradingActions = () => {
  // Get selected asset from store
  const { selectedAsset, isLoading } = useUserSelectionSync();
  
  // Show loading state if data isn't ready
  if (isLoading) {
    return (
      <aside className="md:hidden bg-card border-t border-border rounded-t-xl px-4 pt-3 pb-8 flex items-center gap-2 shadow-lg">
        <div className="w-full h-12 bg-white-8 rounded animate-pulse"></div>
      </aside>
    );
  }

  if (!selectedAsset) {
    return (
      <aside className="md:hidden bg-card border-t border-border rounded-t-xl px-4 pt-3 pb-8 flex items-center gap-2 shadow-lg">
        <Button disabled className="w-full h-12 text-base font-semibold">
          Loading...
        </Button>
      </aside>
    );
  }

  const currentAsset = selectedAsset.name;
  const marketData = {
    price: selectedAsset.price,
    change: selectedAsset.change24h,
    netFunding: parseFloat(selectedAsset.funding8h === "--" ? "0" : selectedAsset.funding8h),
  };

  return (
    <aside className="md:hidden bg-card border-t border-border rounded-t-xl px-4 pt-3 pb-8 flex items-center gap-2 shadow-lg">
      <MarketOrderDrawer marketInformation={marketData} position="trade">
        <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-0">
          Trade {currentAsset}
        </Button>
      </MarketOrderDrawer>
    </aside>
  );
};
