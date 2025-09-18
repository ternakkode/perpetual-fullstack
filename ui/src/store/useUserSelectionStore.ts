import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type * as hl from '@nktkas/hyperliquid';

// Helper functions for localStorage and URL management
const STORAGE_KEY = 'hyperliquid_selected_asset';

const saveToLocalStorage = (asset: SelectedAsset | null) => {
  if (typeof window === 'undefined') return;
  
  if (asset) {
    const storageData = {
      name: asset.name,
      type: asset.type,
      selectedAt: asset.selectedAt
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

const loadFromLocalStorage = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load asset from localStorage:', error);
  }
  return null;
};

const updateUrlSlug = (asset: SelectedAsset | null) => {
  if (typeof window === 'undefined') return;
  
  try {
    const currentPath = window.location.pathname;
    const newPath = asset 
      ? `/trade/${asset.name}-${asset.type}` 
      : '/trade';
    
    if (currentPath !== newPath) {
      window.history.replaceState({}, '', newPath);
    }
  } catch (error) {
    console.warn('Failed to update URL:', error);
  }
};

const parseUrlSlug = (): { name: string; type: string } | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const pathParts = window.location.pathname.split('/');
    const tradePart = pathParts.find(part => part.includes('-'));
    
    if (tradePart && tradePart.includes('-')) {
      const [name, type] = tradePart.split('-');
      if (name && type) {
        return { name: name.toUpperCase(), type: type.toUpperCase() };
      }
    }
  } catch (error) {
    console.warn('Failed to parse URL slug:', error);
  }
  return null;
};

// Selected asset interface with all available data
interface SelectedAsset {
  // Basic asset info
  name: string;
  symbol: string; // e.g., "BTC/USD"
  type: "PERP";
  assetIndex: number;
  
  // Price data
  price: number;
  change24h: number;
  changeAbs: number;
  
  // Trading data
  funding8h: string;
  volume24h: number;
  openInterest: number;
  maxLeverage?: number;
  
  // Categories
  categories: string[];
  
  // Raw SDK data for reference
  rawAsset?: hl.PerpsUniverse;
  rawAssetCtx?: hl.PerpsAssetCtx;
  
  // Timestamp when selected
  selectedAt: number;
}

interface UserSelectionState {
  // Currently selected asset
  selectedAsset: SelectedAsset | null;
  setSelectedAsset: (asset: SelectedAsset | null) => void;
  
  // Helper to select by asset name
  selectAssetByName: (assetName: string) => void;
  
  // Clear selection
  clearSelection: () => void;
  
  // Get current asset name (for convenience)
  getCurrentAssetName: () => string | null;
  
  // Initialize from URL or localStorage
  initializeFromUrlOrStorage: () => void;
  
  // Get stored asset info for initialization
  getStoredAssetInfo: () => { name: string; type: string } | null;
}

export const useUserSelectionStore = create<UserSelectionState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    selectedAsset: null,
    
    // Actions
    setSelectedAsset: (asset: SelectedAsset | null) => {
      set({ selectedAsset: asset });
      // Update localStorage and URL when asset changes
      saveToLocalStorage(asset);
      updateUrlSlug(asset);
    },
    
    selectAssetByName: (assetName: string) => {
      // This will be handled by the asset selector component
      // when it has access to the webData2 to construct the full asset data
      console.log(`Selecting asset: ${assetName}`);
    },
    
    clearSelection: () => {
      set({ selectedAsset: null });
    },
    
    getCurrentAssetName: () => {
      return get().selectedAsset?.name || null;
    },
    
    initializeFromUrlOrStorage: () => {
      // Try URL first, then localStorage
      const urlAsset = parseUrlSlug();
      const storedAsset = loadFromLocalStorage();
      
      // Return the asset info for initialization (will be used by sync hook)
      return urlAsset || storedAsset;
    },
    
    getStoredAssetInfo: () => {
      // Try URL first, then localStorage
      const urlAsset = parseUrlSlug();
      const storedAsset = loadFromLocalStorage();
      
      return urlAsset || storedAsset;
    },
  }))
);

// Helper function to create SelectedAsset from webData2 and asset name
export const createSelectedAssetFromWebData2 = (
  assetName: string,
  webData2: hl.WsWebData2,
  allMids: hl.WsAllMids['mids']
): SelectedAsset | null => {
  if (!webData2?.meta?.universe || !webData2?.assetCtxs) {
    return null;
  }

  const assetIndex = webData2.meta.universe.findIndex(asset => asset.name === assetName);
  if (assetIndex === -1) {
    return null;
  }

  const asset = webData2.meta.universe[assetIndex];
  const assetCtx = webData2.assetCtxs[assetIndex];
  
  if (!asset || !assetCtx) {
    return null;
  }

  const midPrice = allMids[asset.name] ? parseFloat(allMids[asset.name]) : 0;
  const markPrice = parseFloat(assetCtx.markPx);
  
  // Calculate price change - prioritize midPrice if available, fallback to markPrice
  const currentPrice = midPrice > 0 ? midPrice : markPrice;
  const prevDayPrice = parseFloat(assetCtx.prevDayPx);
  const priceChange = prevDayPrice > 0 ? ((currentPrice - prevDayPrice) / prevDayPrice) * 100 : 0;
  const changeAbs = currentPrice - prevDayPrice;
  
  // Format funding rate
  const fundingRate = assetCtx.funding ? (parseFloat(assetCtx.funding) * 100).toFixed(4) : "--";
  
  // Get asset categories (import this logic from asset-selector if needed)
  const ASSET_CATEGORIES = {
    ai: ["FET", "IO", "RENDER", "TAO", "WLD"],
    defi: ["AAVE", "COMP", "CRV", "DYDX", "ENA", "GMX", "JUP", "LDO", "LINK", "MKR", "PENDLE", "RUNE", "SNX", "SUSHI", "UNI"],
    layer1: ["ADA", "APT", "ATOM", "AVAX", "BCH", "BNB", "BTC", "DOT", "ETH", "HBAR", "INJ", "LTC", "NEAR", "SEI", "SOL", "SUI", "TIA", "TON", "TRX", "XRP"],
    layer2: ["ARB", "BLAST", "IMX", "MANTA", "OP", "STX", "STRK", "ZK", "ZRO"],
    meme: ["BOME", "BRETT", "DOGE", "kBONK", "kFLOKI", "kPEPE", "kSHIB", "MEME", "MEW", "PEOPLE", "POPCAT", "TRUMP", "TURBO", "WIF"],
  } as const;
  
  const getAssetCategories = (symbol: string): string[] => {
    const categories: string[] = [];
    
    Object.entries(ASSET_CATEGORIES).forEach(([category, symbols]) => {
      if ((symbols as readonly string[]).includes(symbol)) {
        categories.push(category);
      }
    });
    
    return categories;
  };
  
  const assetCategories = getAssetCategories(asset.name);
  const categories = ["perp", ...assetCategories];

  return {
    name: asset.name,
    symbol: `${asset.name}/USD`,
    type: "PERP",
    assetIndex,
    price: currentPrice,
    change24h: priceChange,
    changeAbs: changeAbs,
    funding8h: fundingRate,
    volume24h: assetCtx.dayNtlVlm ? parseFloat(assetCtx.dayNtlVlm) : 0,
    openInterest: assetCtx.openInterest ? parseFloat(assetCtx.openInterest) : 0,
    maxLeverage: asset.maxLeverage,
    categories,
    rawAsset: asset,
    rawAssetCtx: assetCtx,
    selectedAt: Date.now(),
  };
};