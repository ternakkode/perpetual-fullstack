"use client";

import { Button } from "@brother-terminal/components/ui/button";
import { ArrowLeft, ArrowRight } from "@untitled-ui/icons-react";
import { formatToCurrencyString } from "@brother-terminal/lib/utils";

interface AccountData {
  spotEquity: number;
  perpsEquity: number;
  balance: number;
  unrealizedPnl: number;
  crossMarginRatio: number;
  maintenanceMargin: number;
  crossAccountLeverage: number;
  totalVaultEquity: number;
}

interface AccountInfoProps {
  accountData: AccountData;
  tradeableBalance: number;
  currentPosition: {
    size: number;
    value: number;
    hasPosition: boolean;
  };
  selectedAssetName: string;
}

export function AccountInfo({
  accountData,
  tradeableBalance,
  currentPosition,
  selectedAssetName
}: AccountInfoProps) {
  return (
    <div className="space-y-4">
      {/* Tradeable Balance and Position */}
      <div className="space-y-2 text-xs leading-relaxed p-3 border border-white-8 rounded-lg bg-white-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white-56">Tradeable Balance:</span>
          <span className="text-white-56">{formatToCurrencyString(tradeableBalance)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-white-56">Current Open Position:</span>
          <span className={currentPosition.hasPosition ? (currentPosition.size > 0 ? "text-emerald-500" : "text-red-500") : "text-white-56"}>
            {currentPosition.hasPosition ? (
              `${currentPosition.size > 0 ? '+' : ''}${currentPosition.size.toFixed(4)} ${selectedAssetName} (${currentPosition.size > 0 ? '+' : ''}${formatToCurrencyString(currentPosition.value)})`
            ) : (
              `No position in ${selectedAssetName}`
            )}
          </span>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-white-8"></div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {/* Deposit/Withdraw */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" className="h-10 sm:h-9 w-full text-sm font-medium py-2">Deposit</Button>
          <Button variant="secondary" className="h-10 sm:h-9 w-full text-sm font-medium py-2">Withdraw</Button>
        </div>
        
        {/* Trading Mode Switches */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" className="h-10 sm:h-9 w-full text-sm font-medium py-2 flex items-center gap-1">
            Perps 
            <div className="flex items-center">
              <ArrowLeft className="size-2" />
              <ArrowRight className="size-2" />
            </div>
            Spot
          </Button>
          <Button variant="secondary" className="h-10 sm:h-9 w-full text-sm font-medium py-2 flex items-center gap-1">
            Core 
            <div className="flex items-center">
              <ArrowLeft className="size-2" />
              <ArrowRight className="size-2" />
            </div>
            EVM
          </Button>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-white-8"></div>

      {/* Account Equity */}
      <div className="space-y-4">
        <div className="text-sm font-semibold text-white-96">Account Equity</div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white-64">Spot</span>
            <span className="text-sm font-medium">{formatToCurrencyString(accountData.spotEquity)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white-64">Perps</span>
            <span className="text-sm font-medium">{formatToCurrencyString(accountData.perpsEquity)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white-64">Vault</span>
            <span className="text-sm font-medium">{formatToCurrencyString(accountData.totalVaultEquity)}</span>
          </div>
        </div>
      </div>

      {/* Perps Overview */}
      <div className="space-y-4">
        <div className="text-sm font-semibold text-white-96">Perps Overview</div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white-64">Balance</span>
            <span className="text-sm font-medium">{formatToCurrencyString(accountData.balance)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white-64">Unrealized PNL</span>
            <span className={`text-sm font-medium ${
              accountData.unrealizedPnl >= 0 ? 'text-emerald-500' : 'text-red-500'
            }`}>
              {accountData.unrealizedPnl >= 0 ? '+' : ''}{formatToCurrencyString(accountData.unrealizedPnl)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white-64">Cross Margin Ratio</span>
            <span className="text-sm font-medium">{accountData.crossMarginRatio.toFixed(2)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white-64">Maintenance Margin</span>
            <span className="text-sm font-medium">{formatToCurrencyString(accountData.maintenanceMargin)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white-64">Cross Account Leverage</span>
            <span className="text-sm font-medium">{accountData.crossAccountLeverage.toFixed(2)}x</span>
          </div>
        </div>
      </div>
    </div>
  );
}