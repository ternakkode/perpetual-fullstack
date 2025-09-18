"use client";

import { DesktopView } from "./layouts/desktop-view";
import { MobileView } from "./layouts/mobile-view";

export const TradingApp = ({ isMobile }: { isMobile: boolean }) => {
  return !isMobile ? <DesktopView /> : <MobileView />;
};
