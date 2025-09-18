"use client";

import { motion } from "framer-motion";
import { useAccount } from "wagmi";

import { AppLoginButton } from "@brother-terminal/components/app/app-login-button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@brother-terminal/components/ui/tabs";

import { AdvancedTriggerTable } from "./advanced-trigger-tab/advanced-trigger-table";
import { BalancesTable } from "./balances-tab/balances-table";
import { DepositAndWithdrawalTable } from "./deposit-and-withdrawal-tab/deposit-and-withdrawal-table";
import { FundingHistoryTable } from "./funding-history-tab/funding-history-table";
import { OpenOrdersTable } from "./open-orders-tab/open-orders-table";
import { OrderHistoryTable } from "./order-history-tab/order-history-table";
import { PositionsTable } from "./positions-tab/positions-table";
import { ScheduledOrderTable } from "./scheduled-order-tab/scheduled-order-table";
import { TwapTable } from "./twap-tab/twap-table";

const tabs = [
  { id: "balances", label: "Balances", component: BalancesTable },
  { id: "position", label: "Positions", component: PositionsTable },
  { id: "open-orders", label: "Open Orders", component: OpenOrdersTable },
  { id: "twap", label: "TWAP", component: TwapTable },
  { id: "funding", label: "Funding History", component: FundingHistoryTable },
  { id: "order", label: "Order History", component: OrderHistoryTable },
  { id: "scheduled", label: "Scheduled Order", component: ScheduledOrderTable },
  { id: "advanced", label: "Advanced Trigger", component: AdvancedTriggerTable },
];

export const TradingManagementTabs = () => {
  const { isConnected } = useAccount();

  return (
    <Tabs className="w-full h-full flex flex-col" defaultValue="balances">
      <TabsList className="shrink-0 md:px-4 md:gap-2">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            className="shrink-0 w-1/2 md:shrink-[unset] md:w-auto"
            value={tab.id}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="relative h-[240px] md:h-full flex flex-col overflow-hidden">
        {!isConnected ? (
          <AppLoginButton className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            Connect
          </AppLoginButton>
        ) : (
          tabs.map((tab) => (
            <TabsContent
              className="flex-1 overflow-y-auto"
              key={tab.id}
              value={tab.id}
            >
              <tab.component />
            </TabsContent>
          ))
        )}
      </div>
    </Tabs>
  );
};
