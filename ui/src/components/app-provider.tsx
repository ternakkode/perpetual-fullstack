"use client";

import { HyperliquidSDKProvider } from "./hyperliquid-sdk-provider";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // RainbowKit handles loading states internally, no need for custom ready state
  return (
    <>
      <HyperliquidSDKProvider />
      {children}
    </>
  );
};
