import { AppPanel } from "@brother-terminal/components/app/app-panel";

import { TradingViewChart } from "../../trading-chart";
import { MarketOrderPanel } from "../markets/market-order/market-order-panel";
import { MarketPanel } from "../markets/market-panel";
import { OrderBookTrades } from "../markets/order-book-trades";
import { TradingActions } from "../markets/trading-actions";
import { TradingManagementTabs } from "../../trading-management-tabs";
import { TradingChat } from "../../trading-chat";

export const DesktopView = () => {
  return (
    <div className="flex gap-3 p-3 pt-0 min-w-0">
      {/* Left section: Chart + Order Book + Management Tabs */}
      <div className="flex flex-col gap-3 flex-1 min-w-0">
        {/* Top row: Market Panel + Chart + Order Book */}
        <div className="flex gap-3 h-[80vh] min-w-0">
          {/* Chart Area */}
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <AppPanel
              className="flex flex-col lg:flex-row lg:items-center justify-between md:gap-2 lg:gap-3 py-4 px-3"
              render={<MarketPanel />}
            />
            <AppPanel className="flex-1 p-0" render={<TradingViewChart symbol="BTCUSD" interval="1D" className="w-full h-full" />} />
          </div>

          {/* Order Book & Trades Panel */}
          <div className="w-[280px] xl:w-[280px] lg:w-[240px] md:w-[200px] min-w-[180px] shrink-0">
            <AppPanel className="h-full p-0" render={<OrderBookTrades />} />
          </div>
        </div>

        {/* Bottom: Trading Management Tabs - only spans chart + orderbook width */}
        <div className="min-h-[300px]">
          <AppPanel className="h-full p-0" render={<TradingManagementTabs />} />
        </div>
      </div>

      {/* Right section: Trading Panel */}
      <div className="w-[320px] xl:w-[320px] lg:w-[280px] md:w-[240px] min-w-[220px] shrink-0 flex flex-col gap-3">
        <AppPanel className="p-0" render={<MarketOrderPanel />} />
        <TradingActions />
      </div>

      {/* Trading Chat - floating component */}
      <TradingChat />
    </div>
  );
};
