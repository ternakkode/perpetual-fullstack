"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@brother-terminal/components/ui/tooltip";
import { InfoCircle } from "@untitled-ui/icons-react";
import { formatToCurrencyString } from "@brother-terminal/lib/utils";

const formatPrice = (v: number) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "decimal",
      minimumFractionDigits: v >= 1000 ? 2 : 3,
      maximumFractionDigits: 6,
    }).format(v);
  } catch {
    return String(v);
  }
};

function EstimateRow({
  label,
  tooltip,
  value,
}: {
  label: string;
  tooltip: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="inline-flex items-center gap-2 text-white-64">
        <span className="text-sm leading-relaxed">{label}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="inline-flex items-center text-white-32 hover:text-white-64 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
              <InfoCircle className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">{tooltip}</TooltipContent>
        </Tooltip>
      </div>
      <div className="text-sm font-semibold ml-4">{value}</div>
    </div>
  );
}

function RiskBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-2 rounded-full bg-white-8 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: `${clamped}%`,
          background:
            "linear-gradient(90deg, #10b981 0%, #f59e0b 60%, #ff453a 100%)",
        }}
      />
    </div>
  );
}

interface OrderEstimatesProps {
  liquidationPrice: number;
  riskPct: number;
  orderValueUSD: number;
  marginRequired: number;
  estFees: number;
}

export function OrderEstimates({
  liquidationPrice,
  riskPct,
  orderValueUSD,
  marginRequired,
  estFees
}: OrderEstimatesProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <EstimateRow 
          label="Liquidation Price" 
          tooltip="Price at which the position will be liquidated based on Hyperliquid's margin requirements." 
          value={liquidationPrice > 0 ? `${formatPrice(liquidationPrice)} USD` : '--'} 
        />
        <RiskBar value={riskPct} />
        <EstimateRow 
          label="Order Value" 
          tooltip="Total notional value of this order." 
          value={formatToCurrencyString(orderValueUSD)} 
        />
        <EstimateRow 
          label="Margin Required" 
          tooltip="Initial margin required based on leverage (Order Value / Leverage)." 
          value={formatToCurrencyString(marginRequired)} 
        />
        <EstimateRow 
          label="Fees" 
          tooltip="Brother Terminal fee: 0.05% applied to order value." 
          value={formatToCurrencyString(estFees)} 
        />
      </div>
    </div>
  );
}