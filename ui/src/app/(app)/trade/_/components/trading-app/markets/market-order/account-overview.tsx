"use client";

import { Fragment } from "react";

import { useAccount } from "wagmi";

import { AppList } from "@brother-terminal/components/app/app-list";
import { Separator } from "@brother-terminal/components/ui/separator";
import { Skeleton } from "@brother-terminal/components/ui/skeleton";

interface AccountOverviewProps {
  balance: string;
  unrealizedPnl: string;
  equity: string;
  crossMarginRatio: string;
  maintenanceMargin: string;
  crossAccountLeverage: string;
}

export const AccountOverview = ({
  balance,
  unrealizedPnl,
  equity,
  crossMarginRatio,
  maintenanceMargin,
  crossAccountLeverage,
}: AccountOverviewProps) => {
  const { isConnected } = useAccount();

  if (!isConnected) return null;
  return (
    <Fragment>
      <Separator />
      <AppList>
        <AppList.Item label="Balance" value={balance} />
        <AppList.Item label="Unrealized PNL" highlight value={unrealizedPnl} />
        <AppList.Item label="Equity" value={equity} />
        <AppList.Item label="Cross Margin Ratio" value={crossMarginRatio} />
        <AppList.Item label="Maintenance Margin" value={maintenanceMargin} />
        <AppList.Item
          label="Cross Account Leverage"
          value={crossAccountLeverage}
        />
      </AppList>
    </Fragment>
  );
};
