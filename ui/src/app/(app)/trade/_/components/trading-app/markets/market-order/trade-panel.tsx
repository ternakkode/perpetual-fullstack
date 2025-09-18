"use client";

import { useMemo, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { TooltipProvider } from "@brother-terminal/components/ui/tooltip";
import { Button } from "@brother-terminal/components/ui/button";
import { ArrowLeft, ArrowRight } from "@untitled-ui/icons-react";
import { useWalletAuth } from "@/components/wallet-auth-provider";
import { AgentWalletInfoDialog } from "@/components/agent-wallet-info-dialog";
import { formatToCurrencyString } from "@brother-terminal/lib/utils";
import { useHyperliquidSDKStore } from "@/store/useHyperliquidSDKStore";
import { useUserSelectionStore } from "@/store/useUserSelectionStore";
import { tradingService } from "@/services/tradingService";

// Import all the new components
import { OrderTypeSelector, type Mode } from "./components/order-type-selector";
import { LeverageMarginDialog, type MarginMode } from "./components/leverage-margin-dialog";
import { TradeDirectionSelector, type Side } from "./components/trade-direction-selector";
import { AITradeAssistant, type AISuggestion, type AIAssistantState } from "./components/ai-trade-assistant";
import { ModeSpecificInputs, type TriggerType, type TriggerDirection, type TradingAsset } from "./components/mode-specific-inputs";
import { OrderSizeInput, type Unit } from "./components/order-size-input";
import { OrderSizeSlider } from "./components/order-size-slider";
import { OrderOptions } from "./components/order-options";
import { OrderSubmitButton } from "./components/order-submit-button";
import { OrderEstimates } from "./components/order-estimates";
import { AccountInfo } from "./components/account-info";

type PositionMode = "oneway" | "hedge";

interface TradePanelProps {
  symbol?: string;
  price?: number;
  connected?: boolean;
  balanceUSD?: number;
}

export function TradePanel({
  symbol = "ETH",
  price = 3421.12,
  connected = false,
  balanceUSD = 5249.32,
}: TradePanelProps) {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { webData2, allMids, activeAssetData } = useHyperliquidSDKStore();
  const { selectedAsset } = useUserSelectionStore();
  const { isAgentWalletReady, isLoading: agentWalletLoading } = useWalletAuth();

  // Form state
  const [mode, setMode] = useState<Mode>("market");
  const [side, setSide] = useState<Side>("buy");
  const [leverage, setLeverage] = useState<string>("10");
  const [leverageDialogOpen, setLeverageDialogOpen] = useState<boolean>(false);
  const [isUpdatingLeverage, setIsUpdatingLeverage] = useState<boolean>(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);
  const [marginMode, setMarginMode] = useState<MarginMode>("cross");
  const [positionMode, setPositionMode] = useState<PositionMode>("oneway");
  const [asset, setAsset] = useState<string>(symbol);
  const [orderSize, setOrderSize] = useState<string>("");
  const [unit, setUnit] = useState<Unit>("USD");
  const [sizePct, setSizePct] = useState<number>(0);
  const [reduceOnly, setReduceOnly] = useState<boolean>(false);
  const [useTpsl, setUseTpsl] = useState<boolean>(false);
  const [tpPrice, setTpPrice] = useState<string>("");
  const [tpGain, setTpGain] = useState<string>("");
  const [slPrice, setSlPrice] = useState<string>("");
  const [slLoss, setSlLoss] = useState<string>("");
  const [limitPrice, setLimitPrice] = useState<string>("");
  
  // TWAP fields
  const [twapHours, setTwapHours] = useState<string>("1");
  const [twapMinutes, setTwapMinutes] = useState<string>("0");
  
  // Scale fields
  const [scaleStartUSD, setScaleStartUSD] = useState<string>("");
  const [scaleEndUSD, setScaleEndUSD] = useState<string>("");
  const [scaleTotalOrders, setScaleTotalOrders] = useState<string>("5");
  const [scaleSizeSkew, setScaleSizeSkew] = useState<string>("0");
  
  // Stop fields
  const [stopPrice, setStopPrice] = useState<string>("");
  const [stopLimitPrice, setStopLimitPrice] = useState<string>("");
  
  // Schedule fields
  const [scheduleDate, setScheduleDate] = useState<string>("");
  const [scheduleTime, setScheduleTime] = useState<string>("");
  const [cronExpression, setCronExpression] = useState<string>("0 9 * * 1");
  
  // Advanced trigger fields
  const [triggerType, setTriggerType] = useState<TriggerType>("ASSET_PRICE");
  const [triggerAsset, setTriggerAsset] = useState<string | null>(null);
  const [triggerValue, setTriggerValue] = useState<number | null>(null);
  const [triggerDirection, setTriggerDirection] = useState<TriggerDirection>("MORE_THAN");

  // AI Assistant state
  const [aiAssistant, setAiAssistant] = useState<AIAssistantState>({
    isLoading: false,
    suggestion: null,
    usageCount: 0,
    maxUsage: 5,
    lastUsedAt: null,
  });

  // Agent wallet dialog state
  const [agentWalletDialogOpen, setAgentWalletDialogOpen] = useState(false);

  // Get trigger asset from real data
  const triggerAssets = useMemo<TradingAsset[]>(() => {
    if (!webData2?.meta?.universe || !webData2?.assetCtxs) {
      return [];
    }

    return webData2.meta.universe.map((asset, index) => {
      const assetCtx = webData2.assetCtxs[index];
      const midPrice = allMids[asset.name] ? parseFloat(allMids[asset.name]) : 0;
      
      const currentPrice = midPrice || (assetCtx ? parseFloat(assetCtx.markPx) : 0);
      const prevDayPrice = assetCtx ? parseFloat(assetCtx.prevDayPx) : currentPrice;
      const priceChange = prevDayPrice > 0 ? ((currentPrice - prevDayPrice) / prevDayPrice) * 100 : 0;
      
      return {
        symbol: asset.name,
        name: asset.name,
        price: currentPrice,
        volume: assetCtx?.dayNtlVlm ? parseFloat(assetCtx.dayNtlVlm) : 0,
        openInterest: assetCtx?.openInterest ? parseFloat(assetCtx.openInterest) : 0,
        dayChange: priceChange,
        assetIndex: index,
      };
    }).filter(asset => asset.price > 0);
  }, [webData2, allMids]);
  
  const selectedTriggerAsset = triggerAssets.find(a => a.symbol === triggerAsset);

  // AI Assistant functions
  const generateAISuggestion = async (): Promise<AISuggestion> => {
    const volatility = Math.abs(Math.random() * 10 + 2);
    const balance = balanceUSD;
    const currentPrice = price;
    
    let leverage: number;
    let stopLossPercent: number;
    let takeProfitPercent: number;
    let riskLevel: 'low' | 'medium' | 'high';
    
    if (balance < 1000) {
      leverage = Math.floor(Math.random() * 3) + 2;
      stopLossPercent = 2 + Math.random() * 2;
      takeProfitPercent = 4 + Math.random() * 4;
      riskLevel = 'low';
    } else if (balance < 10000) {
      leverage = Math.floor(Math.random() * 3) + 3;
      stopLossPercent = 1.5 + Math.random() * 2;
      takeProfitPercent = 3 + Math.random() * 4;
      riskLevel = 'medium';
    } else {
      leverage = Math.floor(Math.random() * 5) + 3;
      stopLossPercent = 1 + Math.random() * 2;
      takeProfitPercent = 2 + Math.random() * 6;
      riskLevel = 'high';
    }

    const stopLossPrice = side === 'buy' 
      ? currentPrice * (1 - stopLossPercent / 100)
      : currentPrice * (1 + stopLossPercent / 100);
    
    const takeProfitPrice = side === 'buy'
      ? currentPrice * (1 + takeProfitPercent / 100)
      : currentPrice * (1 - takeProfitPercent / 100);

    const reasoning = `Based on your $${balance.toLocaleString()} balance and ${volatility.toFixed(1)}% market volatility, AI recommends ${leverage}x leverage with SL at $${stopLossPrice.toFixed(2)} and TP at $${takeProfitPrice.toFixed(2)}.`;

    return {
      leverage,
      stopLoss: stopLossPrice,
      takeProfit: takeProfitPrice,
      reasoning,
      riskLevel
    };
  };

  const requestAISuggestion = async () => {
    if (aiAssistant.usageCount >= aiAssistant.maxUsage) return;
    
    setAiAssistant(prev => ({ ...prev, isLoading: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const suggestion = await generateAISuggestion();
      
      setAiAssistant(prev => ({
        ...prev,
        isLoading: false,
        suggestion,
        usageCount: prev.usageCount + 1,
        lastUsedAt: Date.now()
      }));
    } catch (error) {
      setAiAssistant(prev => ({ ...prev, isLoading: false }));
    }
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    setLeverage(suggestion.leverage.toString());
    setSlPrice(suggestion.stopLoss.toFixed(2));
    setTpPrice(suggestion.takeProfit.toFixed(2));
    setUseTpsl(true);
    setAiAssistant(prev => ({ ...prev, suggestion: null }));
  };

  const dismissSuggestion = () => {
    setAiAssistant(prev => ({ ...prev, suggestion: null }));
  };

  const canUseAI = aiAssistant.usageCount < aiAssistant.maxUsage;

  // Extract account equity data from webData2
  const getAccountEquityData = () => {
    if (!webData2) {
      return {
        spotEquity: 0,
        perpsEquity: 0,
        balance: 0,
        unrealizedPnl: 0,
        crossMarginRatio: 0,
        maintenanceMargin: 0,
        crossAccountLeverage: 0,
        totalVaultEquity: 0
      };
    }

    const spotBalance = webData2.spotState?.balances?.reduce((total, balance) => {
      return total + parseFloat(balance.total || "0");
    }, 0) || 0;

    const accountValue = parseFloat(webData2.clearinghouseState?.marginSummary?.accountValue || "0");
    const totalNtlPos = parseFloat(webData2.clearinghouseState?.marginSummary?.totalNtlPos || "0");
    const totalRawUsd = parseFloat(webData2.clearinghouseState?.marginSummary?.totalRawUsd || "0");
    const totalMarginUsed = parseFloat(webData2.clearinghouseState?.marginSummary?.totalMarginUsed || "0");
    const crossMaintenanceMargin = parseFloat(webData2.clearinghouseState?.crossMaintenanceMarginUsed || "0");
    const withdrawable = parseFloat(webData2.clearinghouseState?.withdrawable || "0");
    
    const unrealizedPnl = webData2.clearinghouseState?.assetPositions?.reduce((total, assetPosition) => {
      if (assetPosition?.position?.unrealizedPnl) {
        return total + parseFloat(assetPosition.position.unrealizedPnl);
      }
      return total;
    }, 0) || 0;
    
    // Cross Margin Ratio = (Maintenance Margin Used / Account Value) * 100
    // This represents what percentage of your account value is being used for maintenance margin
    const crossMarginRatio = accountValue > 0 ? (crossMaintenanceMargin / accountValue) * 100 : 0;
    const crossAccountLeverage = accountValue > 0 ? (totalNtlPos / accountValue) : 0;
    const totalVaultEquity = parseFloat(webData2.totalVaultEquity || "0");

    return {
      spotEquity: spotBalance,
      perpsEquity: accountValue,
      balance: accountValue,
      unrealizedPnl: unrealizedPnl,
      crossMarginRatio,
      maintenanceMargin: crossMaintenanceMargin,
      crossAccountLeverage,
      totalVaultEquity
    };
  };

  const accountData = getAccountEquityData();

  // Get tradeable balance from webData2 withdrawable field
  const getTradeableBalance = () => {
    if (!webData2?.clearinghouseState) {
      return 0;
    }
    
    const withdrawable = parseFloat(webData2.clearinghouseState.withdrawable || "0");
    return Math.max(0, withdrawable);
  };

  // Get current open position for selected asset
  const getCurrentPosition = () => {
    if (!webData2?.clearinghouseState?.assetPositions || !selectedAsset) {
      return {
        size: 0,
        value: 0,
        hasPosition: false,
        unrealizedPnl: 0,
        leverage: 0,
        entryPrice: 0
      };
    }

    const position = webData2.clearinghouseState.assetPositions.find(
      pos => pos.position?.coin === selectedAsset.name
    );

    if (!position || !position.position) {
      return {
        size: 0,
        value: 0,
        hasPosition: false,
        unrealizedPnl: 0,
        leverage: 0,
        entryPrice: 0
      };
    }

    const szi = parseFloat(position.position.szi || "0");
    
    if (Math.abs(szi) < 1e-10) {
      return {
        size: 0,
        value: 0,
        hasPosition: false,
        unrealizedPnl: 0,
        leverage: 0,
        entryPrice: 0
      };
    }

    const positionValue = parseFloat(position.position.positionValue || "0");
    const unrealizedPnl = parseFloat(position.position.unrealizedPnl || "0");
    const leverage = position.position.leverage?.value || 0;
    const entryPrice = parseFloat(position.position.entryPx || "0");
    
    return {
      size: szi,
      value: positionValue,
      hasPosition: true,
      unrealizedPnl,
      leverage,
      entryPrice
    };
  };

  const tradeableBalance = getTradeableBalance();
  const currentPosition = getCurrentPosition();

  // Calculate maximum order sizes based on tradeable balance and leverage
  const getMaxOrderSizes = () => {
    if (!selectedAsset || tradeableBalance <= 0) {
      return {
        maxUSD: 0,
        maxAsset: 0,
        maxPercentage: 0
      };
    }

    const currentPrice = selectedAsset.price || price;
    const lev = parseFloat(leverage) || 1;
    
    const maxUSD = tradeableBalance * lev;
    const maxAsset = maxUSD / currentPrice;
    const maxPercentage = 100;

    return {
      maxUSD,
      maxAsset,
      maxPercentage
    };
  };

  // Calculate minimum order sizes
  const getMinOrderSizes = () => {
    if (!selectedAsset) {
      return {
        minUSD: 10,
        minAsset: 0,
        minPercentage: 0
      };
    }

    const currentPrice = selectedAsset.price || price;
    const lev = parseFloat(leverage) || 1;
    
    const minUSD = 10;
    const minAsset = minUSD / currentPrice;
    const minPercentage = tradeableBalance > 0 ? (minUSD / (tradeableBalance * lev)) * 100 : 0;

    return {
      minUSD,
      minAsset,
      minPercentage: Math.min(minPercentage, 100)
    };
  };

  const maxOrderSizes = getMaxOrderSizes();
  const minOrderSizes = getMinOrderSizes();

  // Check if current order size exceeds limits and meets minimum
  const isOrderSizeValid = () => {
    if (!orderSize || parseFloat(orderSize) <= 0) return true;
    
    const size = parseFloat(orderSize);
    
    switch (unit) {
      case "USD":
        return size >= minOrderSizes.minUSD && size <= maxOrderSizes.maxUSD;
      case "%":
        return size >= minOrderSizes.minPercentage && size <= maxOrderSizes.maxPercentage;
      case "ASSET":
        return size >= minOrderSizes.minAsset && size <= maxOrderSizes.maxAsset;
      default:
        return true;
    }
  };

  const orderSizeValid = isOrderSizeValid();

  // Initialize leverage and margin mode from activeAssetData when selected asset changes
  useEffect(() => {
    if (selectedAsset?.name && activeAssetData[selectedAsset.name]) {
      const assetData = activeAssetData[selectedAsset.name];
      setLeverage(String(assetData.leverage));
      setMarginMode(assetData.isCross ? "cross" : "isolated");
      console.log(`Initialized leverage: ${assetData.leverage}x, margin: ${assetData.isCross ? "cross" : "isolated"} for ${selectedAsset.name}`);
    }
  }, [selectedAsset?.name, activeAssetData]);

  // Reset leverage if it exceeds the new asset's maximum
  useEffect(() => {
    const currentLeverage = parseInt(leverage) || 1;
    const maxLev = getMaxLeverage();
    
    if (currentLeverage > maxLev!) {
      setLeverage(String(maxLev));
    }
  }, [selectedAsset?.name, leverage]);

  // Handle leverage and margin mode update
  const handleLeverageUpdate = async () => {
    if (!selectedAsset || !isConnected) {
      console.error("Selected asset or authentication not available", {
        selectedAsset: !!selectedAsset,
        authenticated: !!isConnected
      });
      return;
    }

    try {
      setIsUpdatingLeverage(true);
      
      const leverageValue = parseInt(leverage) || 1;
      const isCross = marginMode === "cross";
      
      const response = await tradingService.setLeverage({
        asset: selectedAsset.name,
        leverage: leverageValue,
        isCross: isCross
      });

      if (response.success) {
        console.log("Leverage updated successfully");
        
        const currentAssetData = activeAssetData[selectedAsset.name] || {
          coin: selectedAsset.name,
          leverage: leverageValue,
          isCross: isCross
        };
        
        const updatedAssetData = {
          ...currentAssetData,
          leverage: leverageValue,
          isCross: isCross
        };
        
        const { setActiveAssetData } = useHyperliquidSDKStore.getState();
        setActiveAssetData(selectedAsset.name, updatedAssetData);
        
        setLeverageDialogOpen(false);
      } else {
        throw new Error(response.error || 'Failed to update leverage');
      }
    } catch (error: any) {
      console.error("Failed to update leverage:", error);
      alert(`Failed to update leverage: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUpdatingLeverage(false);
    }
  };

  // Handle order submission
  const handleOrderSubmit = async () => {
    if (!selectedAsset || !orderSize || parseFloat(orderSize) <= 0) {
      alert('Please enter a valid order size');
      return;
    }

    try {
      setIsSubmittingOrder(true);

      // Convert order size to USD based on unit
      let sizeInUSD = 0;
      const size = parseFloat(orderSize);
      const currentPrice = selectedAsset.price || price;
      const lev = parseFloat(leverage) || 1;

      switch (unit) {
        case "USD":
          sizeInUSD = size;
          break;
        case "%":
          sizeInUSD = (size / 100) * tradeableBalance * lev;
          break;
        case "ASSET":
          sizeInUSD = size * currentPrice;
          break;
        default:
          throw new Error('Invalid unit type');
      }

      // Prepare take profit and stop loss if enabled
      let tpSl = undefined;
      if (useTpsl) {
        tpSl = {
          takeProfitPrice: tpPrice ? parseFloat(tpPrice) : undefined,
          stopLossPrice: slPrice ? parseFloat(slPrice) : undefined
        };
      }

      let response;

      if (mode === "market") {
        response = await tradingService.executeMarketOrder({
          asset: selectedAsset.name,
          side: side === "buy" ? "BUY" : "SELL",
          size: sizeInUSD,
          reduceOnly: reduceOnly,
          tpSl: tpSl
        });
      } else if (mode === "limit") {
        if (!limitPrice || parseFloat(limitPrice) <= 0) {
          throw new Error('Please enter a valid limit price');
        }
        
        response = await tradingService.executeLimitOrder({
          asset: selectedAsset.name,
          side: side === "buy" ? "BUY" : "SELL",
          size: sizeInUSD,
          limitPrice: parseFloat(limitPrice),
          reduceOnly: reduceOnly,
          tpSl: tpSl
        });
      } else if (mode === "twap") {
        const twapHoursValue = parseInt(twapHours) || 0;
        const twapMinutesValue = parseInt(twapMinutes) || 0;
        const twapRunningTimeMinutes = (twapHoursValue * 60) + twapMinutesValue;
        
        if (twapRunningTimeMinutes <= 0) {
          throw new Error('Please enter a valid TWAP duration');
        }
        
        response = await tradingService.executeTwapOrder({
          asset: selectedAsset.name,
          side: side === "buy" ? "BUY" : "SELL",
          size: sizeInUSD,
          twapRunningTime: twapRunningTimeMinutes,
          twapRandomize: true,
          reduceOnly: reduceOnly
        });
      } else if (mode === "scale") {
        if (!scaleStartUSD || !scaleEndUSD || !scaleTotalOrders) {
          throw new Error('Please fill in all scale order parameters');
        }
        
        const startUSD = parseFloat(scaleStartUSD);
        const endUSD = parseFloat(scaleEndUSD);
        const totalOrders = parseInt(scaleTotalOrders);
        const sizeSkew = parseFloat(scaleSizeSkew) || 0;
        
        if (startUSD <= 0 || endUSD <= 0 || totalOrders <= 0) {
          throw new Error('Please enter valid scale order parameters');
        }
        
        if (side === "buy" && startUSD <= endUSD) {
          throw new Error('For buy orders, start price should be higher than end price');
        }
        
        if (side === "sell" && startUSD >= endUSD) {
          throw new Error('For sell orders, start price should be lower than end price');
        }
        
        response = await tradingService.executeScaleOrder({
          asset: selectedAsset.name,
          side: side === "buy" ? "BUY" : "SELL",
          startUsd: startUSD,
          endUsd: endUSD,
          totalSize: sizeInUSD,
          totalOrders: totalOrders,
          sizeSkew: sizeSkew,
          reduceOnly: reduceOnly,
          tpSl: tpSl
        });
      } else if (mode === "stop_limit") {
        if (!stopPrice || !stopLimitPrice || parseFloat(stopPrice) <= 0 || parseFloat(stopLimitPrice) <= 0) {
          throw new Error('Please enter valid stop price and limit price');
        }
        
        response = await tradingService.executeStopLimitOrder({
          asset: selectedAsset.name,
          side: side === "buy" ? "BUY" : "SELL",
          size: sizeInUSD,
          stopPrice: parseFloat(stopPrice),
          limitPrice: parseFloat(stopLimitPrice),
          reduceOnly: reduceOnly,
          tpSl: tpSl
        });
      } else if (mode === "stop_market") {
        if (!stopPrice || parseFloat(stopPrice) <= 0) {
          throw new Error('Please enter a valid stop price');
        }
        
        response = await tradingService.executeStopMarketOrder({
          asset: selectedAsset.name,
          side: side === "buy" ? "BUY" : "SELL",
          size: sizeInUSD,
          stopPrice: parseFloat(stopPrice),
          reduceOnly: reduceOnly,
          tpSl: tpSl
        });
      } else {
        throw new Error(`Order type "${mode}" not yet implemented`);
      }

      if (response.success) {
        console.log("Order submitted successfully:", response);
        alert(`Order submitted successfully! ${response.externalTxnHash ? `TX: ${response.externalTxnHash.slice(0, 10)}...` : ''}`);
        
        // Clear order form
        setOrderSize("");
        setSizePct(0);
        setLimitPrice("");
        setUseTpsl(false);
        setTpPrice("");
        setSlPrice("");
        setTpGain("");
        setSlLoss("");
        setTwapHours("1");
        setTwapMinutes("0");
        setScaleStartUSD("");
        setScaleEndUSD("");
        setScaleTotalOrders("5");
        setScaleSizeSkew("0");
        setStopPrice("");
        setStopLimitPrice("");
      } else {
        throw new Error(response.error || 'Order submission failed');
      }

    } catch (error: any) {
      console.error("Failed to submit order:", error);
      alert(`Failed to submit order: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Get current value for selected trigger type and asset
  const getCurrentTriggerValue = () => {
    if (!selectedTriggerAsset) return null;
    
    switch (triggerType) {
      case 'ASSET_PRICE':
        return selectedTriggerAsset.price;
      case 'VOLUME':
        return selectedTriggerAsset.volume;
      case 'OPEN_INTEREST':
        return selectedTriggerAsset.openInterest;
      case 'DAY_CHANGE_PERCENTAGE':
        return selectedTriggerAsset.dayChange;
      default:
        return null;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatCurrentValue = (value: number | null) => {
    if (value === null) return '';
    
    switch (triggerType) {
      case 'ASSET_PRICE':
        return `$${value.toLocaleString()}`;
      case 'VOLUME':
      case 'OPEN_INTEREST':
        return formatNumber(value);
      case 'DAY_CHANGE_PERCENTAGE':
        return `${value.toFixed(2)}%`;
      default:
        return value.toString();
    }
  };

  const currentTriggerValue = getCurrentTriggerValue();
  const formattedCurrentValue = formatCurrentValue(currentTriggerValue);

  // Get max leverage for selected asset
  const getMaxLeverage = (): number => {
    if (selectedAsset?.name && webData2?.meta?.universe) {
      const assetMetadata = webData2.meta.universe.find(asset => asset.name === selectedAsset.name);
      if (assetMetadata?.maxLeverage) {
        return assetMetadata.maxLeverage;
      }
    }
    
    if (selectedAsset?.rawAsset?.maxLeverage) {
      return selectedAsset.rawAsset.maxLeverage;
    }
    
    if (selectedAsset?.name && activeAssetData[selectedAsset.name]?.maxLeverage) {
      return activeAssetData[selectedAsset.name].maxLeverage!;
    }
    
    return 20;
  };

  // Get maintenance margin rate based on max leverage
  const getMaintenanceMarginRate = () => {
    const maxLev = getMaxLeverage();
    return (1 / (maxLev || 20)) / 2;
  };

  const orderValueUSD = useMemo(() => {
    const size = parseFloat(orderSize) || 0;
    const currentPrice = selectedAsset?.price || price;
    const lev = parseFloat(leverage) || 1;
    
    if (unit === "USD") return size;
    if (unit === "%") return (size / 100) * tradeableBalance * lev;
    return size * currentPrice;
  }, [orderSize, unit, tradeableBalance, selectedAsset?.price, price, leverage]);

  const marginRequired = useMemo(() => {
    const lev = parseFloat(leverage) || 1;
    if (lev <= 0 || orderValueUSD <= 0) return 0;
    return orderValueUSD / lev;
  }, [orderValueUSD, leverage]);

  const estFees = useMemo(() => {
    return orderValueUSD * 0.0005;
  }, [orderValueUSD]);

  const liquidationPrice = useMemo(() => {
    if (!selectedAsset || orderValueUSD <= 0 || !marginRequired) return 0;
    
    const currentPrice = selectedAsset.price || price;
    const positionSize = orderValueUSD / currentPrice;
    const sideMultiplier = side === "buy" ? 1 : -1;
    const maintenanceMarginRate = getMaintenanceMarginRate();
    
    const marginAvailable = marginMode === "cross" 
      ? Math.max(0, tradeableBalance - (getCurrentPosition().value * maintenanceMarginRate))
      : marginRequired;
    
    const maintenanceLeverage = 1 / maintenanceMarginRate;
    const l = 1 / maintenanceLeverage;
    
    if (Math.abs(1 - l * sideMultiplier) < 1e-10) return 0;
    
    const liquidationPrice = currentPrice - sideMultiplier * marginAvailable / positionSize / (1 - l * sideMultiplier);
    
    return Math.max(0.0001, liquidationPrice);
  }, [selectedAsset, price, leverage, side, orderValueUSD, marginRequired, tradeableBalance, marginMode, getCurrentPosition]);

  const riskPct = useMemo(() => {
    if (!liquidationPrice || liquidationPrice <= 0) return 0;
    
    const currentPrice = selectedAsset?.price || price;
    const dist = Math.abs(currentPrice - liquidationPrice);
    const denom = Math.max(currentPrice, 1);
    
    const pct = Math.min(100, Math.max(0, (1 - dist / denom) * 100));
    return pct;
  }, [selectedAsset?.price, price, liquidationPrice]);

  return (
    <TooltipProvider>
      <div className="bg-card space-y-3 md:space-y-3">
        {/* Order Type Selector */}
        <OrderTypeSelector mode={mode} onModeChange={setMode} />

        {/* Controls */}
        <div className="grid grid-cols-1">
          <LeverageMarginDialog
            leverage={leverage}
            setLeverage={setLeverage}
            marginMode={marginMode}
            setMarginMode={setMarginMode}
            leverageDialogOpen={leverageDialogOpen}
            setLeverageDialogOpen={setLeverageDialogOpen}
            isUpdatingLeverage={isUpdatingLeverage}
            getMaxLeverage={getMaxLeverage}
            handleLeverageUpdate={handleLeverageUpdate}
            isConnected={isConnected}
          />
        </div>

        {/* Trade Direction */}
        <TradeDirectionSelector side={side} setSide={setSide} />

        {/* AI Trade Assistant */}
        <AITradeAssistant
          aiAssistant={aiAssistant}
          canUseAI={canUseAI}
          onRequestSuggestion={requestAISuggestion}
          onApplySuggestion={applySuggestion}
          onDismissSuggestion={dismissSuggestion}
        />

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
                `${currentPosition.size > 0 ? '+' : ''}${currentPosition.size.toFixed(4)} ${selectedAsset?.name || asset} (${currentPosition.size > 0 ? '+' : ''}${formatToCurrencyString(currentPosition.value)})`
              ) : (
                `No position in ${selectedAsset?.name || asset}`
              )}
            </span>
          </div>
        </div>

        {/* Mode-specific inputs */}
        <ModeSpecificInputs
          mode={mode}
          price={price}
          limitPrice={limitPrice}
          setLimitPrice={setLimitPrice}
          twapHours={twapHours}
          setTwapHours={setTwapHours}
          twapMinutes={twapMinutes}
          setTwapMinutes={setTwapMinutes}
          scaleStartUSD={scaleStartUSD}
          setScaleStartUSD={setScaleStartUSD}
          scaleEndUSD={scaleEndUSD}
          setScaleEndUSD={setScaleEndUSD}
          scaleTotalOrders={scaleTotalOrders}
          setScaleTotalOrders={setScaleTotalOrders}
          scaleSizeSkew={scaleSizeSkew}
          setScaleSizeSkew={setScaleSizeSkew}
          stopPrice={stopPrice}
          setStopPrice={setStopPrice}
          stopLimitPrice={stopLimitPrice}
          setStopLimitPrice={setStopLimitPrice}
          scheduleDate={scheduleDate}
          setScheduleDate={setScheduleDate}
          scheduleTime={scheduleTime}
          setScheduleTime={setScheduleTime}
          cronExpression={cronExpression}
          setCronExpression={setCronExpression}
          triggerType={triggerType}
          setTriggerType={setTriggerType}
          triggerAsset={triggerAsset}
          setTriggerAsset={setTriggerAsset}
          triggerValue={triggerValue}
          setTriggerValue={setTriggerValue}
          triggerDirection={triggerDirection}
          setTriggerDirection={setTriggerDirection}
          selectedTriggerAsset={selectedTriggerAsset}
          currentTriggerValue={currentTriggerValue}
          formattedCurrentValue={formattedCurrentValue}
        />

        {/* Order Size Input */}
        <OrderSizeInput
          orderSize={orderSize}
          setOrderSize={setOrderSize}
          unit={unit}
          setUnit={setUnit}
          selectedAssetName={selectedAsset?.name || asset}
          orderSizeValid={orderSizeValid}
          maxOrderSizes={maxOrderSizes}
          minOrderSizes={minOrderSizes}
          setSizePct={setSizePct}
        />

        {/* Size Slider */}
        <OrderSizeSlider
          orderSize={orderSize}
          setOrderSize={setOrderSize}
          unit={unit}
          selectedAssetName={selectedAsset?.name || asset}
          maxOrderSizes={maxOrderSizes}
          minOrderSizes={minOrderSizes}
          setSizePct={setSizePct}
        />

        {/* Options */}
        <OrderOptions
          reduceOnly={reduceOnly}
          setReduceOnly={setReduceOnly}
          useTpsl={useTpsl}
          setUseTpsl={setUseTpsl}
          tpPrice={tpPrice}
          setTpPrice={setTpPrice}
          tpGain={tpGain}
          setTpGain={setTpGain}
          slPrice={slPrice}
          setSlPrice={setSlPrice}
          slLoss={slLoss}
          setSlLoss={setSlLoss}
        />

        {/* CTA */}
        <OrderSubmitButton
          side={side}
          isConnected={isConnected}
          isAgentWalletReady={isAgentWalletReady}
          agentWalletLoading={agentWalletLoading}
          isSubmittingOrder={isSubmittingOrder}
          orderSizeValid={orderSizeValid}
          orderSize={orderSize}
          onConnectWallet={() => openConnectModal?.()}
          onEnableTrading={() => setAgentWalletDialogOpen(true)}
          onSubmitOrder={handleOrderSubmit}
        />

        {/* Separator */}
        <div className="border-t border-white-8"></div>

        {/* Estimates */}
        <div className="space-y-3 mt-6">
          <OrderEstimates
            liquidationPrice={liquidationPrice}
            riskPct={riskPct}
            orderValueUSD={orderValueUSD}
            marginRequired={marginRequired}
            estFees={estFees}
          />
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

        {/* Agent Wallet Info Dialog */}
        <AgentWalletInfoDialog
          open={agentWalletDialogOpen}
          onOpenChange={setAgentWalletDialogOpen}
          onApprove={() => {
            console.log("Agent wallet approved, refreshing state");
          }}
        />
      </div>
    </TooltipProvider>
  );
}

export default TradePanel;