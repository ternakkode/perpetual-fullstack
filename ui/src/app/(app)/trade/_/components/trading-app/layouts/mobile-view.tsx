import { Fragment } from "react";

import { TradingManagementTabs } from "../../trading-management-tabs";
import { TradingMobileTabs } from "../../trading-mobile-tabs";
import { MobileMarketInfoPanel } from "../../trading-mobile-tabs/mobile-market-info";
import { TradingActions } from "../markets/trading-actions";
import { TradingChat } from "../../trading-chat";

export const MobileView = () => {
  return (
    <Fragment>
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto px-3">
        {/* Asset Info Panel */}
        <div className="shrink-0 bg-card border border-border rounded-lg shadow-sm">
          <MobileMarketInfoPanel />
        </div>
        
        {/* Chart Panel */}
        <div className="shrink-0 h-[480px] bg-card border border-border rounded-lg shadow-sm">
          <TradingMobileTabs />
        </div>
        
        {/* Management Tabs */}
        <div className="bg-card border border-border rounded-lg shadow-sm">
          <TradingManagementTabs />
        </div>
      </div>
      <TradingActions />
      
      {/* Trading Chat - floating component */}
      <TradingChat />
    </Fragment>
  );
};
