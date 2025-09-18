"use client";

import { Check, SearchMd, XClose, ChevronDown, Star04 } from "@untitled-ui/icons-react";
import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@brother-terminal/components/ui/dialog";
import TokenIcon from "@brother-terminal/components/ui/token-icon";
import { useMediaQuery } from "@brother-terminal/hooks/use-media-query";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@brother-terminal/components/ui/drawer";
import { Input } from "@brother-terminal/components/ui/input";
import { Button } from "@brother-terminal/components/ui/button";
import { cn } from "@brother-terminal/lib/utils";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@brother-terminal/components/ui/toggle-group";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@brother-terminal/components/ui/tabs";

import { EmptyState } from "./empty-state";
import { IAssetOption, TokenPairs } from "../../../interfaces/trading";
import { useHyperliquidSDKStore } from "@brother-terminal/store/useHyperliquidSDKStore";
import { useUserSelectionStore, createSelectedAssetFromWebData2 } from "@brother-terminal/store/useUserSelectionStore";

interface TradingPair {
  symbol: string;
  type: "SPOT" | "PERP";
  price: number;
  change24h: number;
  changeAbs: number;
  funding8h: string;
  volume24h: number;
  openInterest: number;
  categories: string[];
  assetIndex: number;
  maxLeverage?: number;
}

// Asset category mapping
const ASSET_CATEGORIES = {
  ai: ["FET", "IO", "RENDER", "TAO", "WLD"],
  defi: ["AAVE", "COMP", "CRV", "DYDX", "ENA", "GMX", "JUP", "LDO", "LINK", "MKR", "PENDLE", "RUNE", "SNX", "SUSHI", "UNI"],
  layer1: ["ADA", "APT", "ATOM", "AVAX", "BCH", "BNB", "BTC", "DOT", "ETH", "HBAR", "INJ", "LTC", "NEAR", "SEI", "SOL", "SUI", "TIA", "TON", "TRX", "XRP"],
  layer2: ["ARB", "BLAST", "IMX", "MANTA", "OP", "STX", "STRK", "ZK", "ZRO"],
  meme: ["BOME", "BRETT", "DOGE", "kBONK", "kFLOKI", "kPEPE", "kSHIB", "MEME", "MEW", "PEOPLE", "POPCAT", "TRUMP", "TURBO", "WIF"],
} as const;

// Helper function to get categories for a symbol
const getAssetCategories = (symbol: string): string[] => {
  const categories: string[] = [];
  
  Object.entries(ASSET_CATEGORIES).forEach(([category, symbols]) => {
    if ((symbols as readonly string[]).includes(symbol)) {
      categories.push(category);
    }
  });
  
  return categories;
};


export const AssetSelector = ({
  assets = [],
  className,
  iconSize,
  tokens,
  onAssetSelected,
  displayStyle = "compact",
  assetType,
}: {
  assets?: IAssetOption[];
  className?: string;
  iconSize?: string;
  tokens: TokenPairs;
  onAssetSelected: (asset: string) => void;
  displayStyle?: "compact" | "full";
  assetType?: "SPOT" | "PERP";
}) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Full display mode for market panel
  if (displayStyle === "full") {
    if (isDesktop) {
      return (
        <div className="relative">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1 hover:bg-white-8 focus-within:bg-white-8 transition-colors py-1 px-3 rounded-lg group">
                <TokenIcon className={className} symbol={tokens[0]} size="32" />
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold">{tokens[0]}-USD</h1>
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded font-medium text-white",
                      assetType === "SPOT" ? "bg-blue-500" : "bg-orange-500"
                    )}
                  >
                    {assetType || "PERP"}
                  </span>
                </div>
                <ChevronDown className="size-4 opacity-60 group-hover:opacity-100 ml-2" />
              </button>
            </DialogTrigger>
            <DialogContent
              className="md:w-[95vw] md:h-[90vh] md:max-w-none z-[60] md:mt-16"
              innerClassname="flex flex-col p-0"
            >
              <DialogHeader className="px-6 py-4 border-b">
                <DialogTitle>Markets</DialogTitle>
                <DialogDescription className="sr-only" />
              </DialogHeader>
              <div className="flex-1 overflow-hidden">
                <TradingPairsList
                  onAssetSelected={(asset) => {
                    setOpen(false);
                    onAssetSelected(asset);
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    // Mobile full display mode
    return (
      <div className="relative">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <button className="flex items-center gap-1 hover:bg-white-8 focus-within:bg-white-8 transition-colors py-1 px-3 rounded-lg group">
              <TokenIcon className={className} symbol={tokens[0]} size="32" />
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold">{tokens[0]}-USD</h1>
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded font-medium text-white",
                    assetType === "SPOT" ? "bg-blue-500" : "bg-orange-500"
                  )}
                >
                  {assetType || "PERP"}
                </span>
              </div>
              <ChevronDown className="size-4 opacity-60 group-hover:opacity-100 ml-2" />
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <div className="relative">
                <DrawerTitle className="text-center">Markets</DrawerTitle>
                <DrawerDescription className="sr-only" />
                <DrawerClose
                  asChild
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                >
                  <button aria-label="Close Drawer">
                    <XClose className="size-5 text-white-48" />
                  </button>
                </DrawerClose>
              </div>
            </DrawerHeader>
            <div className="px-4 flex-1 overflow-hidden">
              <TradingPairsList
                onAssetSelected={(asset) => {
                  setOpen(false);
                  onAssetSelected(asset);
                }}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  // Compact display mode (original)
  if (isDesktop) {
    return (
      <div className="relative hover:bg-white-8 focus-within:bg-white-8 transition-colors py-1 px-1.5 rounded">
        <TokenIcon className={className} symbol={tokens[0]} size={iconSize || "16"} />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              aria-label="Switch Token"
              className="absolute inset-0 outline-none"
            />
          </DialogTrigger>
          <DialogContent
            className="md:w-[95vw] md:h-[90vh] md:max-w-none z-[60] md:mt-16"
            innerClassname="flex flex-col p-0"
          >
            <DialogHeader className="px-6 py-4 border-b">
              <DialogTitle>Markets</DialogTitle>
              <DialogDescription className="sr-only" />
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              <TradingPairsList
                onAssetSelected={(asset) => {
                  setOpen(false);
                  onAssetSelected(asset);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Mobile compact mode
  return (
    <div className="relative hover:bg-white-8 focus-within:bg-white-8 transition-colors py-1 px-1.5 rounded">
      <TokenIcon className={className} symbol={tokens[0]} size={iconSize || "16"} />
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button
            aria-label="Switch Token"
            className="absolute inset-0 outline-none"
          />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <div className="relative">
              <DrawerTitle className="text-center">Markets</DrawerTitle>
              <DrawerDescription className="sr-only" />
              <DrawerClose
                asChild
                className="absolute right-0 top-1/2 -translate-y-1/2"
              >
                <button aria-label="Close Drawer">
                  <XClose className="size-5 text-white-48" />
                </button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="px-4 flex-1 overflow-hidden">
            <TradingPairsList
              onAssetSelected={(asset) => {
                setOpen(false);
                onAssetSelected(asset);
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

const TradingPairsList = ({
  onAssetSelected,
}: {
  onAssetSelected: (asset: string) => void;
}) => {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchMode, setSearchMode] = useState<"strict" | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortColumn, setSortColumn] = useState<string>("volume");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const { webData2, allMids, isLoadingWebData2, isConnected } = useHyperliquidSDKStore();
  const { setSelectedAsset } = useUserSelectionStore();

  const categories = [
    { id: "all", label: "All Coins" },
    { id: "ai", label: "AI" },
    { id: "defi", label: "DeFi" },
    { id: "layer1", label: "Layer 1" },
    { id: "layer2", label: "Layer 2" },
    { id: "meme", label: "Meme" },
  ];

  // Transform webData2 into trading pairs
  const tradingPairs = useMemo<TradingPair[]>(() => {
    if (!webData2?.meta?.universe || !webData2?.assetCtxs) {
      return [];
    }

    return webData2.meta.universe.map((asset, index) => {
      const assetCtx = webData2.assetCtxs[index];
      const midPrice = allMids[asset.name] ? parseFloat(allMids[asset.name]) : 0;
      
      // Calculate price change (using mid price vs previous day price)
      const currentPrice = midPrice || (assetCtx ? parseFloat(assetCtx.markPx) : 0);
      const prevDayPrice = assetCtx ? parseFloat(assetCtx.prevDayPx) : currentPrice;
      const priceChange = prevDayPrice > 0 ? ((currentPrice - prevDayPrice) / prevDayPrice) * 100 : 0;
      const changeAbs = currentPrice - prevDayPrice;
      
      // Format funding rate
      const fundingRate = assetCtx?.funding ? (parseFloat(assetCtx.funding) * 100).toFixed(4) : "--";
      
      // Get asset categories
      const assetCategories = getAssetCategories(asset.name);
      const categories = ["perp", ...assetCategories];
      
      return {
        symbol: `${asset.name}/USD`,
        type: "PERP" as const,
        price: currentPrice,
        change24h: priceChange,
        changeAbs: changeAbs,
        funding8h: fundingRate,
        volume24h: assetCtx?.dayNtlVlm ? parseFloat(assetCtx.dayNtlVlm) : 0,
        openInterest: assetCtx?.openInterest ? parseFloat(assetCtx.openInterest) : 0,
        categories: categories,
        assetIndex: index,
        maxLeverage: asset.maxLeverage,
      };
    }).filter(pair => pair.price > 0);
  }, [webData2, allMids]);

  const filteredPairs = useMemo(() => {
    let filtered = tradingPairs;

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(pair => pair.categories.includes(selectedCategory));
    }

    // Search filter
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.trim().toLowerCase();
      if (searchMode === "strict") {
        filtered = filtered.filter(pair => 
          pair.symbol.toLowerCase().includes(keyword)
        );
      } else {
        filtered = filtered.filter(pair => 
          pair.symbol.toLowerCase().includes(keyword) ||
          pair.symbol.split('/')[0].toLowerCase().includes(keyword)
        );
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortColumn) {
        case "symbol":
          aVal = a.symbol;
          bVal = b.symbol;
          break;
        case "price":
          aVal = a.price;
          bVal = b.price;
          break;
        case "change":
          aVal = a.change24h;
          bVal = b.change24h;
          break;
        case "volume":
          aVal = a.volume24h;
          bVal = b.volume24h;
          break;
        case "funding":
          aVal = parseFloat(a.funding8h === "--" ? "0" : a.funding8h);
          bVal = parseFloat(b.funding8h === "--" ? "0" : b.funding8h);
          break;
        default:
          return 0;
      }

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [searchKeyword, searchMode, selectedCategory, sortColumn, sortDirection]);

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(2);
  };

  const formatPrice = (price: number) => {
    if (price >= 1) return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return price.toFixed(6);
  };

  const sortBy = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search and Controls */}
      <div className="p-4 space-y-4 border-b">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchMd className="absolute left-3 top-1/2 -translate-y-1/2 text-white-48 pointer-events-none size-4" />
            <Input
              className="pl-9"
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search pairs..."
              value={searchKeyword}
            />
          </div>
          <ToggleGroup type="single" value={searchMode} onValueChange={(v) => v && setSearchMode(v as "strict" | "all")}>
            <ToggleGroupItem value="strict" className="px-3 text-xs">Strict</ToggleGroupItem>
            <ToggleGroupItem value="all" className="px-3 text-xs">All</ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs whitespace-nowrap">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Table Header */}
      <div className="px-4 py-3 border-b bg-white-4">
        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-white-64">
          <div className="col-span-3 cursor-pointer flex items-center gap-1" onClick={() => sortBy("symbol")}>
            Symbol
            {sortColumn === "symbol" && <ChevronDown className={cn("size-3", sortDirection === "asc" && "rotate-180")} />}
          </div>
          <div className="col-span-2 cursor-pointer flex items-center gap-1 justify-end" onClick={() => sortBy("price")}>
            Last Price
            {sortColumn === "price" && <ChevronDown className={cn("size-3", sortDirection === "asc" && "rotate-180")} />}
          </div>
          <div className="col-span-2 cursor-pointer flex items-center gap-1 justify-end" onClick={() => sortBy("change")}>
            24h Change
            {sortColumn === "change" && <ChevronDown className={cn("size-3", sortDirection === "asc" && "rotate-180")} />}
          </div>
          <div className="col-span-2 cursor-pointer flex items-center gap-1 justify-end" onClick={() => sortBy("funding")}>
            8h Funding
            {sortColumn === "funding" && <ChevronDown className={cn("size-3", sortDirection === "asc" && "rotate-180")} />}
          </div>
          <div className="col-span-2 cursor-pointer flex items-center gap-1 justify-end" onClick={() => sortBy("volume")}>
            Volume
            {sortColumn === "volume" && <ChevronDown className={cn("size-3", sortDirection === "asc" && "rotate-180")} />}
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto">
        {!isConnected || isLoadingWebData2 ? (
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-white-48">Loading markets...</p>
            </div>
          </div>
        ) : filteredPairs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-8">
            <EmptyState />
          </div>
        ) : (
          <div className="divide-y">
            {filteredPairs.map((pair, index) => (
              <div
                key={pair.symbol}
                className="px-4 py-3 hover:bg-white-4 cursor-pointer grid grid-cols-12 gap-2 items-center text-sm"
                onClick={() => {
                  const assetName = pair.symbol.split('/')[0];
                  
                  // Create and store the selected asset with all data
                  if (webData2 && allMids) {
                    const selectedAssetData = createSelectedAssetFromWebData2(assetName, webData2, allMids);
                    if (selectedAssetData) {
                      setSelectedAsset(selectedAssetData);
                    }
                  }
                  
                  // Call the original callback
                  onAssetSelected(assetName);
                }}
              >
                <div className="col-span-3 flex items-center gap-2">
                  <TokenIcon symbol={pair.symbol.split('/')[0]} size="24" />
                  <div>
                    <div className="font-medium">{pair.symbol}</div>
                    <div className="flex gap-1">
                      <span className={cn(
                        "text-[10px] px-1 py-0.5 rounded text-white font-medium leading-none",
                        pair.type === "SPOT" ? "bg-blue-500" : "bg-orange-500"
                      )}>
                        {pair.type === "PERP" && pair.maxLeverage ? `${pair.maxLeverage}x` : pair.type}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2 text-right font-mono">
                  ${formatPrice(pair.price)}
                </div>
                
                <div className="col-span-2 text-right">
                  <div className={cn("font-medium", pair.change24h >= 0 ? "text-emerald-500" : "text-red-500")}>
                    {pair.change24h >= 0 ? "+" : ""}{pair.change24h.toFixed(2)}%
                  </div>
                  <div className="text-xs text-white-48">
                    {pair.changeAbs >= 0 ? "+" : ""}{formatPrice(Math.abs(pair.changeAbs))}
                  </div>
                </div>
                
                <div className="col-span-2 text-right font-mono text-xs">
                  {pair.funding8h === "--" ? "--" : `${pair.funding8h}%`}
                </div>
                
                <div className="col-span-2 text-right font-mono text-xs">
                  ${formatNumber(pair.volume24h)}
                </div>
                
                <div className="col-span-1 flex justify-end">
                  <Star04 className="size-4 text-white-32 hover:text-yellow-500 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
