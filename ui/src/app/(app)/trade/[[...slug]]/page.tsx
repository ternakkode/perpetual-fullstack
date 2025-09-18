"use client";

import { Fragment, use } from "react";

import { AppLoader } from "@brother-terminal/components/app/app-loader";
import { AppNavigation } from "@brother-terminal/components/app/app-navigation";

import { useMediaQuery } from "@brother-terminal/hooks/use-media-query";

import { TradingApp } from "../_/components/trading-app";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default function Page({ params }: PageProps) {
  const isTabletOrAbove = useMediaQuery("(min-width: 768px)");

  // The slug param will contain the asset-type information (e.g., ["BTC-PERP"])
  // This will be handled by the TradingApp component and its stores
  const resolvedParams = use(params);
  
  return (
    <div className="w-full h-dvh md:h-auto flex flex-col bg-background">
      {isTabletOrAbove === undefined ? (
        <AppLoader />
      ) : (
        <Fragment>
          <AppNavigation isMobile={!isTabletOrAbove} />
          <TradingApp isMobile={!isTabletOrAbove} />
        </Fragment>
      )}
    </div>
  );
}