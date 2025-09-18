"use client";

import { Target03, TrendUp02 } from "@untitled-ui/icons-react";
import { forwardRef } from "react";
import { cn } from "@brother-terminal/lib/utils";
import { formatPrice } from "../../../utils/price-utils";

interface MobileMarketInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  price?: number;
  change?: number;
  changeAbs?: number;
}

export const MobileMarketInfo = forwardRef<HTMLDivElement, MobileMarketInfoProps>(
  ({ price, change, changeAbs, ...props }, ref) => {
    // Mock data - in real app this would come from props/API
    const marketData = {
      price: price || 42.707,
      change24h: change || -1.55,
      changeAbs: changeAbs || -0.673,
    };

    return (
      <div
        ref={ref}
        {...props}
        className={cn("flex items-center gap-6", props.className)}
      >
        {/* Mark Price */}
        <div className="flex-1 flex flex-col gap-0">
          <div className="flex items-center gap-1 text-white-48">
            <Target03 className="size-3" />
            <p className="text-xs whitespace-nowrap">Mark</p>
          </div>
          <p className="text-sm font-medium">{formatPrice(marketData.price)}</p>
        </div>

        {/* 24h Change */}
        <div className="flex-1 flex flex-col gap-0">
          <div className="flex items-center gap-1 text-white-48">
            <TrendUp02 className="size-3" />
            <p className="text-xs whitespace-nowrap">24h Change</p>
          </div>
          <p
            className={cn(
              "text-sm font-medium",
              marketData.changeAbs >= 0 ? "text-emerald-500" : "text-red-500"
            )}
          >
            {marketData.changeAbs >= 0 ? '+' : ''}{marketData.changeAbs.toFixed(3)} / {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h.toFixed(2)}%
          </p>
        </div>
      </div>
    );
  }
);

MobileMarketInfo.displayName = "MobileMarketInfo";