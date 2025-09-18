"use client";

import {
  Clock,
  CurrencyDollarCircle,
  LineChartUp02,
  Target03,
  BarChart03,
  TrendUp02,
  InfoCircle,
} from "@untitled-ui/icons-react";
import { forwardRef, useEffect, useState } from "react";

import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@brother-terminal/components/ui/tooltip";
import { cn } from "@brother-terminal/lib/utils";
import { IMarketData } from "../../../interfaces/trading";

import { formatPrice } from "../../../utils/price-utils";

// Extended market data interface for comprehensive trading info
interface ExtendedMarketData extends IMarketData {
  markPrice?: number;
  oraclePrice?: number;
  volume24h?: number;
  openInterest?: number;
  changeAbs?: number;
}

export const MarketInformation = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ExtendedMarketData
>(({ change, netFunding, price, markPrice, oraclePrice, volume24h, openInterest, changeAbs, ...props }, ref) => {
  // Mock data - in real app this would come from props/API
  const marketData = {
    markPrice: markPrice || 42.707,
    oraclePrice: oraclePrice || 42.694,
    price: price || 42.707,
    change24h: change || -1.55,
    changeAbs: changeAbs || -0.673,
    volume24h: volume24h || 603916183.87,
    openInterest: openInterest || 1143410060.33,
    fundingRate: netFunding || 0.0013,
  };

  return (
    <div
      ref={ref}
      {...props}
      className={cn("grid grid-cols-2 lg:grid-cols-6 gap-3", props.className)}
    >
      <MarketInformationCard 
        label="Mark" 
        value={formatPrice(marketData.markPrice)}
        tooltip="Current mark price used for funding and liquidations"
      />
      <MarketInformationCard 
        label="Oracle" 
        value={formatPrice(marketData.oraclePrice)}
        tooltip="Oracle price from external price feeds"
      />
      <MarketInformationCard
        highlight
        label="24h Change"
        value={`${marketData.changeAbs >= 0 ? '+' : ''}${marketData.changeAbs.toFixed(3)} / ${marketData.change24h >= 0 ? '+' : ''}${marketData.change24h.toFixed(2)}%`}
      />
      <MarketInformationCard
        label="24h Volume"
        value={`$${formatLargeNumber(marketData.volume24h)}`}
        tooltip="Total trading volume in the last 24 hours"
      />
      <MarketInformationCard
        label="Open Interest"
        value={`$${formatLargeNumber(marketData.openInterest)}`}
        tooltip="Total value of outstanding positions"
      />
      <MarketInformationCard
        label="Funding"
        value={`${marketData.fundingRate >= 0 ? '+' : ''}${marketData.fundingRate.toFixed(4)}%`}
        tooltip="Current funding rate for perpetual contracts"
        countdown={true}
      />
    </div>
  );
});
MarketInformation.displayName = "MarketInformation";

// Helper function to format large numbers
const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
};

// Countdown timer hook for funding countdown
const useFundingCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<string>("2:34:16");
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Mock countdown - in real app this would calculate actual time until next funding
      const now = new Date();
      const nextFunding = new Date(now);
      nextFunding.setHours(nextFunding.getHours() + 3); // Next funding in ~3 hours
      nextFunding.setMinutes(0, 0, 0);
      
      const diff = nextFunding.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return timeLeft;
};

export const MarketInformationCard = ({
  className,
  highlight,
  label,
  tooltip,
  value,
  countdown,
}: {
  className?: string;
  highlight?: boolean;
  label: "Mark" | "Oracle" | "24h Change" | "24h Volume" | "Open Interest" | "Funding";
  tooltip?: string;
  value: string;
  countdown?: boolean;
}) => {
  const countdownTime = useFundingCountdown();
  
  const icons = {
    Mark: Target03,
    Oracle: CurrencyDollarCircle,
    "24h Change": TrendUp02,
    "24h Volume": BarChart03,
    "Open Interest": LineChartUp02,
    "Funding": Clock,
  };

  const renderIcon = () => {
    const Icon = icons[label];
    if (!Icon) {
      console.warn(`Icon not found for label: ${label}`);
      return <InfoCircle className="size-3" />;
    }
    return <Icon className="size-3" />;
  };

  const renderValue = () => {
    const displayValue = countdown ? (
      <div className="flex flex-col">
        <span className="text-sm font-medium">{value}</span>
        <span className="text-xs text-white-48 font-mono">{countdownTime}</span>
      </div>
    ) : (
      <p
        className={cn(
          "text-sm font-medium",
          className,
          highlight
            ? value.includes('-')
              ? "text-red-500"
              : "text-emerald-500"
            : null
        )}
      >
        {value}
      </p>
    );

    return displayValue;
  };

  return (
    <div className="flex-1 flex flex-col gap-0">
      <div className="flex items-center gap-1 text-white-48">
        {renderIcon()}
        <p className="text-xs whitespace-nowrap">{label}</p>
      </div>
      {tooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                {renderValue()}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {tooltip}
              <TooltipArrow className="fill-tooltips" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        renderValue()
      )}
    </div>
  );
};
