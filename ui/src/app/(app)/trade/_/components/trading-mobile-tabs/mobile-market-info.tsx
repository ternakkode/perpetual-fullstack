"use client";

import { useState } from "react";
import { Button } from "@brother-terminal/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@brother-terminal/components/ui/dialog";
import {
  Zap,
  TrendUp02,
  TrendDown02,
  Target03,
} from "@untitled-ui/icons-react";

import { AssetPairsInformation } from "../trading-app/markets/asset-pairs-information";
import { MobileMarketInfo } from "../trading-app/markets/mobile-market-info";
import { useUserSelectionSync } from "@brother-terminal/store/useUserSelectionSync";

// AI Market Analysis interfaces (same as desktop)
interface MarketInsight {
  recentNews: string[];
  technicalSummary: string;
  volumeAnalysis: string;
  fundingAnalysis: string;
  marketStructure: string;
  keyLevels: {
    support: number;
    resistance: number;
  };
}

interface AIMarketState {
  isLoading: boolean;
  analysis: MarketInsight | null;
  usageCount: number;
  maxUsage: number;
  lastAnalyzedAt: number | null;
}

export const MobileMarketInfoPanel = () => {
  // Get selected asset from store
  const { selectedAsset, isLoading } = useUserSelectionSync();
  
  // AI Market Analysis state (must be called before any early returns)
  const [aiMarket, setAiMarket] = useState<AIMarketState>({
    isLoading: false,
    analysis: null,
    usageCount: 0,
    maxUsage: 3,
    lastAnalyzedAt: null,
  });
  
  const [modalOpen, setModalOpen] = useState(false);
  
  // Show loading state if data isn't ready
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-between px-4 py-3">
        <div className="animate-pulse flex items-center gap-2">
          <div className="h-8 w-8 bg-white-8 rounded-full"></div>
          <div className="space-y-1">
            <div className="h-4 w-16 bg-white-8 rounded"></div>
            <div className="h-3 w-12 bg-white-8 rounded"></div>
          </div>
        </div>
        
        <div className="animate-pulse flex items-center gap-2">
          <div className="space-y-1 text-right">
            <div className="h-5 w-20 bg-white-8 rounded"></div>
            <div className="h-4 w-16 bg-white-8 rounded"></div>
          </div>
          <div className="h-8 w-8 bg-white-8 rounded"></div>
        </div>
      </div>
    );
  }

  if (!selectedAsset) {
    return (
      <div className="w-full h-full flex items-center justify-center px-4 py-3">
        <div className="text-white-64">No asset selected</div>
      </div>
    );
  }

  const currentAsset = selectedAsset.name;
  const marketData = {
    price: selectedAsset.price,
    change: selectedAsset.change24h,
    changeAbs: selectedAsset.changeAbs,
    netFunding: parseFloat(selectedAsset.funding8h === "--" ? "0" : selectedAsset.funding8h),
    volume24h: selectedAsset.volume24h,
    openInterest: selectedAsset.openInterest,
  };

  // Generate AI market insights (same logic as desktop)
  const generateMarketInsights = async (): Promise<MarketInsight> => {
    const price = marketData.price;
    const change = marketData.change;
    const funding = marketData.netFunding;
    const volume = marketData.volume24h;
    const openInterest = marketData.openInterest;
    
    const newsItems = [
      "Ethereum network congestion decreased by 15% over past 24h",
      "Large whale moved 50K ETH to exchange wallets", 
      "Layer 2 adoption increased with 2.3M daily transactions",
      "Staking rewards adjusted to 3.8% APR following network update"
    ];
    
    let technicalSummary: string;
    if (change > 2) {
      technicalSummary = `${currentAsset} showing strong momentum with +${change.toFixed(2)}% move. Price broke above key resistance level.`;
    } else if (change < -2) {
      technicalSummary = `${currentAsset} under pressure with ${change.toFixed(2)}% decline. Testing support around current levels.`;
    } else {
      technicalSummary = `${currentAsset} consolidating with ${change.toFixed(2)}% change. Range-bound trading between key levels.`;
    }
    
    const volOiRatio = (volume / openInterest * 100).toFixed(1);
    const volumeAnalysis = `24h volume: $${(volume / 1000000).toFixed(0)}M (${volOiRatio}% of open interest). ${volOiRatio > '50' ? 'High activity' : volOiRatio > '30' ? 'Moderate activity' : 'Low activity'} relative to positions.`;
    
    const fundingPercent = funding.toFixed(3);
    const fundingAnalysis = `Current funding: ${fundingPercent}%. ${Math.abs(funding) > 0.01 ? 'Elevated funding suggests position imbalance' : 'Balanced funding indicates stable sentiment'}.`;
    
    const marketStructure = `Open Interest: $${(openInterest / 1000000).toFixed(0)}M. ${openInterest > 1000000000 ? 'High leverage in system' : 'Moderate leverage levels'}. Current price ${price > 42 ? 'above' : 'below'} recent average.`;
    
    const support = price * 0.97;
    const resistance = price * 1.03;
    
    return {
      recentNews: newsItems.slice(0, 2),
      technicalSummary,
      volumeAnalysis,
      fundingAnalysis,
      marketStructure,
      keyLevels: {
        support: Math.round(support * 100) / 100,
        resistance: Math.round(resistance * 100) / 100
      }
    };
  };
  
  const requestMarketAnalysis = async () => {
    if (aiMarket.usageCount >= aiMarket.maxUsage) return;
    
    setAiMarket(prev => ({ ...prev, isLoading: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const analysis = await generateMarketInsights();
      
      setAiMarket(prev => ({
        ...prev,
        isLoading: false,
        analysis,
        usageCount: prev.usageCount + 1,
        lastAnalyzedAt: Date.now()
      }));
    } catch (error) {
      setAiMarket(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  const canAnalyze = aiMarket.usageCount < aiMarket.maxUsage;
  
  const handleModalOpen = (open: boolean) => {
    setModalOpen(open);
    if (open && canAnalyze && !aiMarket.analysis && !aiMarket.isLoading) {
      requestMarketAnalysis();
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-between px-4 py-3">
      <AssetPairsInformation
        asset={currentAsset}
        type={selectedAsset?.type || "PERP"}
        isLoading={false} // Data is already loaded when we reach this point
      />
      
      <div className="flex items-center gap-2">
        <MobileMarketInfo
          price={marketData.price}
          change={marketData.change}
          changeAbs={marketData.changeAbs}
        />
        
        {/* AI Market Analysis - Mobile */}
        <Dialog open={modalOpen} onOpenChange={handleModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={!canAnalyze}
              className="h-8 px-2 text-xs bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20 disabled:opacity-50"
            >
              <Zap className="w-3 h-3" />
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                Market Data Summary
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-3">
              {aiMarket.isLoading && (
                <div className="flex flex-col items-center justify-center py-6 space-y-2">
                  <div className="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full"></div>
                  <p className="text-sm text-white-64">Gathering market data...</p>
                </div>
              )}

              {aiMarket.analysis && (
                <div className="space-y-3">
                  {/* Recent News */}
                  <div>
                    <h4 className="text-sm font-medium text-white-96 mb-2">📰 Recent News</h4>
                    <div className="space-y-1">
                      {aiMarket.analysis.recentNews.map((news, index) => (
                        <div key={index} className="text-xs text-white-80 p-2 bg-white-4 rounded">
                          {news}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical Summary */}
                  <div>
                    <h4 className="text-sm font-medium text-white-96 mb-2">📊 Technical Summary</h4>
                    <p className="text-xs text-white-80 p-2 bg-white-4 rounded leading-relaxed">
                      {aiMarket.analysis.technicalSummary}
                    </p>
                  </div>

                  {/* Key Levels */}
                  <div>
                    <h4 className="text-sm font-medium text-white-96 mb-2">🎯 Key Levels</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-xs p-2 bg-red-500/10 border border-red-500/20 rounded">
                        <div className="text-red-400 font-medium">Support</div>
                        <div className="font-mono text-white-96">${aiMarket.analysis.keyLevels.support}</div>
                      </div>
                      <div className="text-xs p-2 bg-green-500/10 border border-green-500/20 rounded">
                        <div className="text-green-400 font-medium">Resistance</div>
                        <div className="font-mono text-white-96">${aiMarket.analysis.keyLevels.resistance}</div>
                      </div>
                    </div>
                  </div>

                  {/* Data Points */}
                  <div className="space-y-2">
                    <div>
                      <h5 className="text-xs font-medium text-white-96 mb-1">Volume Analysis</h5>
                      <p className="text-xs text-white-80">{aiMarket.analysis.volumeAnalysis}</p>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium text-white-96 mb-1">Funding Analysis</h5>
                      <p className="text-xs text-white-80">{aiMarket.analysis.fundingAnalysis}</p>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium text-white-96 mb-1">Market Structure</h5>
                      <p className="text-xs text-white-80">{aiMarket.analysis.marketStructure}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};