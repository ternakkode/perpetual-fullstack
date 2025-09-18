"use client";

import { useEffect, useRef } from "react";
import { useHyperliquidDatafeed } from "./useHyperliquidDatafeed";
import { useUserSelectionStore } from "@/store/useUserSelectionStore";
import { useHyperliquidSDKStore } from "@/store/useHyperliquidSDKStore";
import { ChartLoader } from "./chart-loader";

interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
  className?: string;
}

export const TradingViewChart = ({ 
  symbol: propSymbol, 
  interval = "1D",
  className = "w-full h-full"
}: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const containerIdRef = useRef<string>(`tradingview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  // Get Hyperliquid data feed and selected asset
  const datafeed = useHyperliquidDatafeed();
  const { selectedAsset } = useUserSelectionStore();
  const { isConnected } = useHyperliquidSDKStore();
  
  // Use selected asset or fallback to prop symbol
  const symbol = selectedAsset ? `${selectedAsset.name}/USD` : (propSymbol || "BTC/USD");

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous widget
    if (widgetRef.current && widgetRef.current.remove) {
      widgetRef.current.remove();
      widgetRef.current = null;
    }

    const loadTradingView = () => {
      if (!(window as any).TradingView) {
        // Try different TradingView library files
        const scripts = [
          "/chart/charting_library/charting_library.standalone.js",
          "/chart/charting_library/charting_library.js"
        ];

        let scriptIndex = 0;
        const loadScript = () => {
          if (scriptIndex >= scripts.length) {
            console.error('Failed to load TradingView library');
            return;
          }

          const script = document.createElement("script");
          script.src = scripts[scriptIndex];
          script.async = true;
          script.onload = () => {
            setTimeout(initWidget, 200);
          };
          script.onerror = () => {
            scriptIndex++;
            loadScript();
          };
          document.head.appendChild(script);
        };

        loadScript();
      } else {
        setTimeout(initWidget, 200);
      }
    };

    const initWidget = () => {
      if (!containerRef.current || !(window as any).TradingView) return;

      try {
        widgetRef.current = new (window as any).TradingView.widget({
          container: containerRef.current,
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
          symbol: symbol,
          interval: interval,
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1", // Candlestick
          locale: "en",
          toolbar_bg: "transparent",
          enable_publishing: false,
          allow_symbol_change: false,
          save_image: false,
          hide_top_toolbar: true,
          hide_legend: true,
          hide_side_toolbar: true,
          details: false,
          hotlist: false,
          calendar: false,
          news: [],
          show_popup_button: false,
          disabled_features: [
            "header_symbol_search",
            "symbol_search_hot_key",
            "header_compare",
            "compare_symbol",
            "header_undo_redo",
            "header_screenshot",
            "header_chart_type",
            "header_settings",
            "header_indicators",
            "header_fullscreen_button",
            "use_localstorage_for_settings",
            "right_bar_stays_on_scroll",
            "header_saveload",
            "context_menus"
          ],
          library_path: "/chart/charting_library/",
          autosize: true,
          fullscreen: false,
          // Use Hyperliquid datafeed for real data
          datafeed: datafeed,
          overrides: {
            "paneProperties.background": "rgba(0, 0, 0, 0)",
            "paneProperties.backgroundType": "solid",
            "paneProperties.vertGridProperties.color": "#27272a",
            "paneProperties.horzGridProperties.color": "#27272a",
            "scalesProperties.backgroundColor": "rgba(0, 0, 0, 0)",
            "scalesProperties.textColor": "#f5f5f5",
            "scalesProperties.lineColor": "#27272a",
            "mainSeriesProperties.candleStyle.upColor": "#00d4aa",
            "mainSeriesProperties.candleStyle.downColor": "#ff6b6b",
            "mainSeriesProperties.candleStyle.borderUpColor": "#00d4aa",
            "mainSeriesProperties.candleStyle.borderDownColor": "#ff6b6b",
            "mainSeriesProperties.candleStyle.wickUpColor": "#00d4aa",
            "mainSeriesProperties.candleStyle.wickDownColor": "#ff6b6b",
            "volumePaneSize": "small",
            "mainSeriesProperties.showCountdown": false,
            "timeScale.rightOffset": 5,
            "timeScale.barSpacing": 6,
            // Make all toolbar and UI elements transparent
            "paneProperties.topMargin": 0,
            "paneProperties.bottomMargin": 0,
            "paneProperties.leftAxisProperties.autoScale": true,
            "paneProperties.rightAxisProperties.autoScale": true,
            "symbolWatermarkProperties.transparency": 100,
            "scalesProperties.showLeftScale": false,
            "scalesProperties.showRightScale": true,
            "scalesProperties.showTopTimeScale": false,
            "scalesProperties.showBottomTimeScale": true,
            "timeScale.backgroundColor": "rgba(0, 0, 0, 0)",
            "crossHairStyle": 0,
          },
          studies_overrides: {},
          loading_screen: {
            backgroundColor: "rgba(0, 0, 0, 0)",
            foregroundColor: "#f5f5f5"
          },
          // Remove custom CSS to avoid loading issues
          // custom_css_url: "/chart/themed.css",
        });
      } catch (error) {
        console.error('TradingView widget initialization failed:', error);
      }
    };

    loadTradingView();

    return () => {
      if (widgetRef.current && widgetRef.current.remove) {
        try {
          widgetRef.current.remove();
        } catch (e) {
          console.warn('Widget cleanup failed:', e);
        }
        widgetRef.current = null;
      }
    };
  }, [symbol, interval, datafeed, isConnected]);

  // Show loading state when not connected or no selected asset
  if (!isConnected || !selectedAsset) {
    const message = !isConnected 
      ? 'Connecting to Hyperliquid...' 
      : 'Select an asset to view chart';
      
    return (
      <div className={className}>
        <ChartLoader 
          message={message} 
          size="lg"
          className="bg-transparent"
        />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      id={containerIdRef.current}
      className={className}
      style={{ 
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        backgroundColor: 'transparent',
        overflow: 'hidden'
      }}
    />
  );
};