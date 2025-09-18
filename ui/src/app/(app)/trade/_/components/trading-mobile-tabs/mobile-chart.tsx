"use client";

import { TradingViewChart } from "../trading-chart";

export const MobileChart = () => {
  return (
    <div className="w-full h-full">
      <TradingViewChart 
        symbol="BTCUSD"
        interval="1H"
        className="w-full h-full"
      />
    </div>
  );
};