"use client";

import { Separator } from "@brother-terminal/components/ui/separator";
import { useTradingApp } from "../../../../hooks/use-trading-app";
import { PositionType } from "../../../../interfaces/trading";

import { AccountOverview } from "./account-overview";
import { AssetAllocationInput } from "./asset-allocation-input";
import { AvailableBalanceInformation } from "./available-balance-information";
import { MarketOrderActions } from "./market-order-actions";
import { OrderSummary } from "./order-summary";
import { PlaceOrderButton } from "./place-order-button";
import { TradeAmountInput } from "./trade-amount-input";

export const MarketOrderPlacement = ({
  position,
  onOrderPlaced,
}: {
  position: PositionType;
  onOrderPlaced?: () => void;
}) => {
  const {
    assetList,
    assetsSelection,
    updateAssetSize,
    updateAssetToken,
    tradingSizeInput,
    setTradingSizeInput,
    swapAssetsSelection,
  } = useTradingApp();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <AssetAllocationInput
          assetList={assetList}
          baseAssets={assetsSelection.base}
          positionType={position}
          quoteAssets={assetsSelection.quote}
          switchPosition={swapAssetsSelection}
          updateAssetSize={updateAssetSize}
          updateAssetToken={updateAssetToken}
        />
        <TradeAmountInput
          assetNames={[
            ...assetsSelection.base.map((asset) => asset.token),
            ...assetsSelection.quote.map((asset) => asset.token),
          ]}
          coinWithInterestCap={[]}
          minimumLimit={10}
          onSizeChanged={setTradingSizeInput}
          percentage={0}
          size={tradingSizeInput}
          userBalance={0}
        />
        <AvailableBalanceInformation />
      </div>
      <PlaceOrderButton
        positionType={position}
        onOrderPlaced={() => {
          onOrderPlaced?.();
        }}
      />
      <Separator />
      <OrderSummary
        marginRequired="$0.0"
        positionSize="$0"
        minPositionSize="$316"
        slippage="$0.0"
      />
      <MarketOrderActions />
      <AccountOverview
        balance="$625.39"
        unrealizedPnl="$252.81"
        equity="$878.21"
        crossMarginRatio="0.00%"
        maintenanceMargin="$0.00"
        crossAccountLeverage="11.67x"
      />
    </div>
  );
};
