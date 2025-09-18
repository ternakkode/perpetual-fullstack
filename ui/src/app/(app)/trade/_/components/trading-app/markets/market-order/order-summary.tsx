"use client";

import { AppList } from "@brother-terminal/components/app/app-list";

interface OrderSummaryProps {
  marginRequired: string;
  positionSize: string;
  minPositionSize: string;
  slippage: string;
}

export const OrderSummary = ({
  marginRequired,
  positionSize,
  minPositionSize,
  slippage,
}: OrderSummaryProps) => {
  return (
    <AppList>
      <AppList.Item label="Margin Required" value={marginRequired} />
      <AppList.Item label="Position Size" value={positionSize} />
      <AppList.Item label="Min. Position Size" value={minPositionSize} />
      <AppList.Item label="Slippage" value={slippage} />
    </AppList>
  );
};
