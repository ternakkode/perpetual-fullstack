import { create } from 'zustand';
import type * as hl from '@nktkas/hyperliquid';

// Use SDK types directly
type AllMidsData = hl.WsAllMids['mids'];
type WebData2Data = hl.WsWebData2;
type UserFill = hl.Fill;
type UserFunding = hl.WsUserFundings;
type OrderBookData = hl.Book;
type TradeData = hl.WsTrade;
type TwapState = {
  coin: string;
  user: string;
  side: 'B' | 'A';
  sz: string;
  executedSz: string;
  executedNtl: string;
  minutes: number;
  reduceOnly: boolean;
  randomize: boolean;
  timestamp: number;
};

type ActiveAssetData = {
  coin: string;
  leverage: number;
  isCross: boolean;
  maxLeverage?: number;
  markPx?: number;
  maxTradeSzs?: string[];
  availableToTrade?: string[];
};

interface HyperliquidSDKState {
  // All mid prices data
  allMids: AllMidsData;
  setAllMids: (data: AllMidsData) => void;
  
  // WebData2 comprehensive data
  webData2: WebData2Data | null;
  setWebData2: (data: WebData2Data) => void;
  
  // Spot metadata
  spotMeta: hl.SpotMeta | null;
  setSpotMeta: (data: hl.SpotMeta) => void;
  
  // User fills data
  userFills: UserFill[];
  setUserFills: (fills: UserFill[]) => void;
  addUserFill: (fill: UserFill) => void;
  
  // User fundings data
  userFundings: UserFunding | null;
  setUserFundings: (data: UserFunding) => void;
  addUserFunding: (data: UserFunding) => void;
  
  // Order book data by asset and grouping level
  orderBooks: Record<string, Record<string, OrderBookData>>;
  setOrderBook: (asset: string, grouping: string, data: OrderBookData) => void;
  
  // Current price grouping level for order book
  priceGrouping: string;
  setPriceGrouping: (grouping: string) => void;
  
  // Trades data by asset (keeping last 50 trades per asset)
  tradesData: Record<string, TradeData[]>;
  addTrade: (asset: string, trade: TradeData) => void;
  
  // TWAP orders data
  twapStates: Array<[number, TwapState]>;
  setTwapStates: (states: Array<[number, TwapState]>) => void;
  
  // Active asset data (leverage and margin mode)
  activeAssetData: Record<string, ActiveAssetData>;
  setActiveAssetData: (coin: string, data: ActiveAssetData) => void;
  
  // Subscription client reference
  subscriptionClient: hl.SubscriptionClient | null;
  setSubscriptionClient: (client: hl.SubscriptionClient | null) => void;
  
  // Exchange client reference
  exchangeClient: hl.ExchangeClient | null;
  setExchangeClient: (client: hl.ExchangeClient | null) => void;
  
  // Connection states
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  
  // Current subscribed user
  subscribedUser: string | null;
  setSubscribedUser: (user: string | null) => void;
  
  // Loading states
  isLoadingAllMids: boolean;
  isLoadingWebData2: boolean;
  isLoadingUserFills: boolean;
  isLoadingUserFundings: boolean;
  setLoadingState: (type: 'allMids' | 'webData2' | 'userFills' | 'userFundings', loading: boolean) => void;
  
  // Error states
  errors: {
    allMids: string | null;
    webData2: string | null;
    userFills: string | null;
    userFundings: string | null;
  };
  setError: (type: 'allMids' | 'webData2' | 'userFills' | 'userFundings', error: string | null) => void;
  
  // Clear all data
  clearAllData: () => void;
}

export const useHyperliquidSDKStore = create<HyperliquidSDKState>((set, get) => ({
  // Initial state
  allMids: {},
  webData2: null,
  spotMeta: null,
  userFills: [],
  userFundings: null,
  orderBooks: {},
  priceGrouping: "1", // Default grouping (most precise)
  tradesData: {},
  twapStates: [],
  activeAssetData: {},
  subscriptionClient: null,
  exchangeClient: null,
  isConnected: false,
  subscribedUser: null,
  isLoadingAllMids: false,
  isLoadingWebData2: false,
  isLoadingUserFills: false,
  isLoadingUserFundings: false,
  errors: {
    allMids: null,
    webData2: null,
    userFills: null,
    userFundings: null,
  },
  
  // Actions
  setAllMids: (data: AllMidsData) => set({ allMids: data }),
  
  setWebData2: (data: WebData2Data) => {
    // Extract twapStates from webData2 if available
    // Based on the example, twapStates is in the data structure
    const twapStates = (data as any)?.data?.twapStates || (data as any)?.twapStates || [];
    set({ 
      webData2: data,
      twapStates: twapStates
    });
  },
  
  setSpotMeta: (data: hl.SpotMeta) => set({ spotMeta: data }),
  
  setUserFills: (fills: UserFill[]) => set({ userFills: fills }),
  
  addUserFill: (fill: UserFill) => {
    const currentFills = get().userFills;
    set({ userFills: [fill, ...currentFills] });
  },
  
  setUserFundings: (data: UserFunding) => set({ userFundings: data }),
  
  addUserFunding: (data: UserFunding) => {
    // For incremental updates, we replace the entire data
    set({ userFundings: data });
  },
  
  setOrderBook: (asset: string, grouping: string, data: OrderBookData) => {
    const currentOrderBooks = get().orderBooks;
    const assetOrderBooks = currentOrderBooks[asset] || {};
    set({ 
      orderBooks: { 
        ...currentOrderBooks, 
        [asset]: {
          ...assetOrderBooks,
          [grouping]: data
        }
      } 
    });
  },
  
  setPriceGrouping: (grouping: string) => set({ priceGrouping: grouping }),
  
  addTrade: (asset: string, trade: TradeData) => {
    const currentTradesData = get().tradesData;
    const currentAssetTrades = currentTradesData[asset] || [];
    const newTrades = [trade, ...currentAssetTrades].slice(0, 50); // Keep last 50 trades
    set({
      tradesData: {
        ...currentTradesData,
        [asset]: newTrades
      }
    });
  },
  
  setTwapStates: (states: Array<[number, TwapState]>) => set({ twapStates: states }),
  
  setActiveAssetData: (coin: string, data: ActiveAssetData) => {
    const currentActiveAssetData = get().activeAssetData;
    set({
      activeAssetData: {
        ...currentActiveAssetData,
        [coin]: data
      }
    });
  },
  
  setSubscriptionClient: (client: hl.SubscriptionClient | null) => set({ subscriptionClient: client }),
  
  setExchangeClient: (client: hl.ExchangeClient | null) => set({ exchangeClient: client }),
  
  setIsConnected: (connected: boolean) => set({ isConnected: connected }),
  
  setSubscribedUser: (user: string | null) => set({ subscribedUser: user }),
  
  setLoadingState: (type: 'allMids' | 'webData2' | 'userFills' | 'userFundings', loading: boolean) => {
    const key = `isLoading${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof HyperliquidSDKState;
    set({ [key]: loading });
  },
  
  setError: (type: 'allMids' | 'webData2' | 'userFills' | 'userFundings', error: string | null) => {
    const currentErrors = get().errors;
    set({
      errors: {
        ...currentErrors,
        [type]: error,
      },
    });
  },
  
  clearAllData: () => set({
    allMids: {},
    webData2: null,
    spotMeta: null,
    userFills: [],
    userFundings: null,
    orderBooks: {},
    tradesData: {},
    twapStates: [],
    activeAssetData: {},
    subscribedUser: null,
    errors: {
      allMids: null,
      webData2: null,
      userFills: null,
      userFundings: null,
    },
  }),
}));