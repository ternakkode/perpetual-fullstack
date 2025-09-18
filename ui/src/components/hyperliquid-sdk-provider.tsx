"use client";

import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import * as hl from "@nktkas/hyperliquid";
import { useHyperliquidSDKStore } from "@/store/useHyperliquidSDKStore";
import { useUserSelectionStore } from "@/store/useUserSelectionStore";
import { useWalletAuth } from "@/components/wallet-auth-provider";

const DUMMY_USER = "0x0000000000000000000000000000000000000000";

// Helper function to generate grouping options based on asset price
const getGroupingOptions = (price: number): string[] => {
  if (price >= 100000) {
    // High-Value Assets (≥ $100k) - e.g., BTC
    return ["1", "10", "20", "50", "100", "1000", "10000"];
  } else if (price >= 10000) {
    // Mid-High Range ($10k - $100k)
    return ["1", "0.1", "0.01", "0.005", "0.002", "0.001"];
  } else if (price >= 1000) {
    // Mid Range ($1k - $10k)
    return ["1", "0.1", "0.01", "0.001"];
  } else if (price >= 100) {
    // Low-Mid Range ($100 - $1k)
    return ["1", "0.1", "0.01"];
  } else if (price >= 10) {
    // Low Range ($10 - $100)
    return ["1", "0.1", "0.01"];
  } else if (price >= 1) {
    // Small Value ($1 - $10)
    return ["0.1", "0.01", "0.001"];
  } else if (price >= 0.1) {
    // Micro Value ($0.1 - $1)
    return ["0.01", "0.001", "0.0001"];
  } else if (price >= 0.01) {
    // Very Small Value ($0.01 - $0.1)
    return ["0.001", "0.0001", "0.00001"];
  } else if (price >= 0.001) {
    // Ultra-Small Value ($0.001 - $0.01) - e.g., PUMP tokens
    return ["0.00000001", "0.00000002", "0.00000005", "0.0000001", "0.000001", "0.0001"];
  } else {
    // Micro-Cap (< $0.001)
    return ["0.00000001", "0.00000002", "0.00000005"];
  }
};

// Helper function to convert grouping value to SDK parameters
const getGroupingParameters = (grouping: string): { nSigFigs?: 2 | 3 | 4 | 5 | null; mantissa?: 2 | 5 | null } => {
  switch (grouping) {
    // Integer Groupings (High-value assets)
    case "1":
      return { nSigFigs: 5, mantissa: null };    // Most precise
    case "10":
      return { nSigFigs: null, mantissa: null }; // Full precision
    case "20":
      return { nSigFigs: 5, mantissa: 2 };       // 2-based rounding
    case "50":
      return { nSigFigs: 5, mantissa: 5 };       // 5-based rounding
    case "100":
      return { nSigFigs: 4, mantissa: null };    // Moderate precision
    case "1000":
      return { nSigFigs: 3, mantissa: null };    // Lower precision
    case "10000":
      return { nSigFigs: 2, mantissa: null };    // Least precise

    // Decimal Groupings (Lower-value assets)
    case "0.1":
      return { nSigFigs: 3, mantissa: null };    // Lower precision
    case "0.01":
      return { nSigFigs: 4, mantissa: null };    // Moderate precision
    case "0.005":
      return { nSigFigs: 5, mantissa: 5 };       // High precision, 5-based
    case "0.002":
      return { nSigFigs: 5, mantissa: 2 };       // High precision, 2-based
    case "0.001":
      return { nSigFigs: 5, mantissa: null };    // High precision
    case "0.0001":
      return { nSigFigs: 4, mantissa: null };    // Moderate precision
    case "0.00001":
      return { nSigFigs: 3, mantissa: null };    // Lower precision

    // Ultra-Small Decimal Groupings (Micro-cap tokens)
    case "0.000001":
      return { nSigFigs: 5, mantissa: null };    // High precision
    case "0.0000001":
      return { nSigFigs: 4, mantissa: null };    // Moderate precision
    case "0.00000005":
      return { nSigFigs: 5, mantissa: 5 };       // High precision, 5-based
    case "0.00000002":
      return { nSigFigs: 5, mantissa: 2 };       // High precision, 2-based
    case "0.00000001":
      return { nSigFigs: 3, mantissa: null };    // Lower precision

    default:
      return { nSigFigs: null, mantissa: null }; // Default to full precision
  }
};

export const HyperliquidSDKProvider: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { wallet, isAuthenticated } = useWalletAuth();

  const subscriptionClientRef = useRef<hl.SubscriptionClient | null>(null);
  const infoClientRef = useRef<hl.InfoClient | null>(null);
  const exchangeClientRef = useRef<hl.ExchangeClient | null>(null);
  const subscriptionsRef = useRef<{
    allMids?: hl.Subscription;
    webData2?: hl.Subscription;
    userFills?: hl.Subscription;
    userFundings?: hl.Subscription;
    orderBooks?: Record<string, hl.Subscription>; // grouping level -> subscription
    trades?: hl.Subscription;
    activeAssetData?: hl.Subscription;
  }>({});
  const currentAssetRef = useRef<string | null>(null);
  const currentGroupingRef = useRef<string>("1"); // Default grouping

  const {
    setAllMids,
    setWebData2,
    setSpotMeta,
    setUserFills,
    addUserFill,
    setUserFundings,
    addUserFunding,
    setOrderBook,
    addTrade,
    setActiveAssetData,
    setSubscriptionClient,
    setExchangeClient,
    setIsConnected,
    setSubscribedUser,
    subscribedUser,
    priceGrouping,
    setLoadingState,
    setError,
    clearAllData,
  } = useHyperliquidSDKStore();

  const { selectedAsset } = useUserSelectionStore();

  // Initialize subscription client
  useEffect(() => {
    const initializeClient = async () => {
      try {
        const transport = new hl.WebSocketTransport({
          keepAlive: {
            interval: 10000, // Send ping every 10 seconds
          },
          reconnect: {
            maxRetries: 5,
            connectionDelay: (attempt) => Math.min(1000 * Math.pow(2, attempt), 10000), // Exponential backoff
          },
          autoResubscribe: true, // Automatically resubscribe after reconnection
        });

        subscriptionClientRef.current = new hl.SubscriptionClient({
          transport,
        });

        infoClientRef.current = new hl.InfoClient({
          transport: new hl.HttpTransport(),
        });

        await transport.ready();
        setIsConnected(true);
        setSubscriptionClient(subscriptionClientRef.current);
        // ExchangeClient will be initialized separately when user authenticates
        setError('webData2', null);
        setError('allMids', null);
        setError('userFills', null);
        setError('userFundings', null);

        // Fetch spot metadata
        try {
          const spotMeta = await infoClientRef.current.spotMeta();
          setSpotMeta(spotMeta);
        } catch (error) {
          console.error("Failed to fetch spot metadata:", error);
        }
      } catch (error) {
        console.error("Failed to initialize Hyperliquid SDK client:", error);
        setIsConnected(false);
        setError('webData2', error instanceof Error ? error.message : 'Connection failed');
      }
    };

    initializeClient();

    return () => {
      // Cleanup on unmount
      const cleanup = async () => {
        if (subscriptionsRef.current.allMids) {
          await subscriptionsRef.current.allMids.unsubscribe();
        }
        if (subscriptionsRef.current.webData2) {
          await subscriptionsRef.current.webData2.unsubscribe();
        }
        if (subscriptionsRef.current.userFills) {
          await subscriptionsRef.current.userFills.unsubscribe();
        }
        if (subscriptionsRef.current.userFundings) {
          await subscriptionsRef.current.userFundings.unsubscribe();
        }
        if (subscriptionsRef.current.orderBooks) {
          for (const subscription of Object.values(subscriptionsRef.current.orderBooks)) {
            await subscription.unsubscribe();
          }
        }
        if (subscriptionsRef.current.trades) {
          await subscriptionsRef.current.trades.unsubscribe();
        }
        if (subscriptionsRef.current.activeAssetData) {
          await subscriptionsRef.current.activeAssetData.unsubscribe();
        }
        if (subscriptionClientRef.current) {
          await subscriptionClientRef.current[Symbol.asyncDispose]();
        }
        setSubscriptionClient(null);
        setExchangeClient(null);
      };
      cleanup();
    };
  }, [setIsConnected, setError]);

  // Subscribe to allMids (always active)
  useEffect(() => {
    const subscribeToAllMids = async () => {
      if (!subscriptionClientRef.current) return;

      try {
        setLoadingState('allMids', true);
        setError('allMids', null);

        // Unsubscribe if already subscribed
        if (subscriptionsRef.current.allMids) {
          await subscriptionsRef.current.allMids.unsubscribe();
        }

        subscriptionsRef.current.allMids = await subscriptionClientRef.current.allMids((data) => {
          setAllMids(data.mids || {});
        });

        setLoadingState('allMids', false);
      } catch (error) {
        console.error("Failed to subscribe to allMids:", error);
        setError('allMids', error instanceof Error ? error.message : 'Subscription failed');
        setLoadingState('allMids', false);
      }
    };

    if (subscriptionClientRef.current) {
      subscribeToAllMids();
    }
  }, [setAllMids, setLoadingState, setError]);

  // Handle wallet changes and manage subscriptions
  useEffect(() => {
    const handleWalletChange = async () => {
      if (!subscriptionClientRef.current) return;

      const currentUser = isConnected && address ? address : DUMMY_USER;

      // If user hasn't changed, do nothing
      if (subscribedUser === currentUser) return;

      try {
        // Unsubscribe from previous user-specific subscriptions
        if (subscriptionsRef.current.webData2) {
          await subscriptionsRef.current.webData2.unsubscribe();
          subscriptionsRef.current.webData2 = undefined;
        }
        if (subscriptionsRef.current.userFills) {
          await subscriptionsRef.current.userFills.unsubscribe();
          subscriptionsRef.current.userFills = undefined;
        }
        if (subscriptionsRef.current.userFundings) {
          await subscriptionsRef.current.userFundings.unsubscribe();
          subscriptionsRef.current.userFundings = undefined;
        }

        // Clear user-specific data when wallet changes
        if (subscribedUser && subscribedUser !== DUMMY_USER) {
          setUserFills([]);
          setUserFundings({ fundings: [] } as any);
        }

        // Unsubscribe from previous activeAssetData when user changes
        if (subscriptionsRef.current.activeAssetData) {
          await subscriptionsRef.current.activeAssetData.unsubscribe();
          subscriptionsRef.current.activeAssetData = undefined;
        }

        // Subscribe to webData2 (always, with appropriate user)
        await subscribeToWebData2(currentUser);

        // Subscribe to userFills and userFundings only if user is connected
        if (isConnected && address) {
          await subscribeToUserFills(currentUser);
          await subscribeToUserFundings(currentUser);
          
          // Re-subscribe to activeAssetData for current asset if there is one
          if (selectedAsset?.name) {
            try {
              subscriptionsRef.current.activeAssetData = await subscriptionClientRef.current.activeAssetData(
                {
                  user: address as `0x${string}`,
                  coin: selectedAsset.name
                },
                (data: any) => {
                  // Extract leverage and margin mode from the response
                  if (data && data.coin) {
                    const leverageValue = data.leverage?.value || 1;
                    const leverageType = data.leverage?.type || 'cross';
                    
                    // Get maxLeverage from universe data first, then existing store data
                    const { webData2 } = useHyperliquidSDKStore.getState();
                    const assetMetadata = webData2?.meta?.universe?.find(asset => asset.name === data.coin);
                    const maxLeverageFromUniverse = assetMetadata?.maxLeverage;
                    
                    const existingAssetData = useHyperliquidSDKStore.getState().activeAssetData[data.coin];
                    const maxLeverageFromExisting = existingAssetData?.maxLeverage;
                    
                    const activeAssetData = {
                      coin: data.coin,
                      leverage: leverageValue,
                      isCross: leverageType === 'cross',
                      maxLeverage: data.maxLeverage || maxLeverageFromUniverse || maxLeverageFromExisting || 20, // priority: data > universe > existing > fallback
                      markPx: data.markPx ? parseFloat(data.markPx) : undefined,
                      maxTradeSzs: data.maxTradeSzs,
                      availableToTrade: data.availableToTrade
                    };
                    setActiveAssetData(data.coin, activeAssetData);
                    console.log(`Active asset data for ${data.coin} after user change:`, activeAssetData);
                  }
                }
              );
            } catch (error) {
              console.error("Failed to re-subscribe to activeAssetData after user change:", error);
            }
          }
        }

        setSubscribedUser(currentUser);
      } catch (error) {
        console.error("Failed to handle wallet change:", error);
      }
    };

    handleWalletChange();
  }, [isConnected, address, subscribedUser, selectedAsset?.name, setSubscribedUser, setUserFills, setUserFundings, setActiveAssetData]);

  // No more manual authentication triggering - useAuth handles everything automatically

  // Handle exchange client with wallet when user authenticates
  useEffect(() => {
    const initializeExchangeClientWithWallet = async () => {
      if (!isConnected || !wallet.isConnected || !wallet.signer || !isAuthenticated) {
        // Clear exchange client when not ready, not connected, no wallet signer, or not connected to backend
        setExchangeClient(null);
        exchangeClientRef.current = null;
        return;
      }

      try {
        // Create exchange client with wallet signer for signing transactions
        exchangeClientRef.current = new hl.ExchangeClient({
          transport: new hl.HttpTransport(),
          wallet: wallet.signer, // Use wallet signer from our custom hook
        });

        setExchangeClient(exchangeClientRef.current);
        console.log("Exchange client initialized with wallet and backend auth:", wallet.account);
      } catch (error) {
        console.error("Failed to initialize exchange client with wallet:", error);
        setExchangeClient(null);
        exchangeClientRef.current = null;
      }
    };

    initializeExchangeClientWithWallet();
  }, [isConnected, wallet.isConnected, wallet.signer, wallet.account, isAuthenticated, setExchangeClient]);

  const subscribeToWebData2 = async (userAddress: string) => {
    if (!subscriptionClientRef.current) return;

    try {
      setLoadingState('webData2', true);
      setError('webData2', null);

      subscriptionsRef.current.webData2 = await subscriptionClientRef.current.webData2(
        { user: userAddress as `0x${string}` },
        (data) => {
          setWebData2(data);
        }
      );

      setLoadingState('webData2', false);
    } catch (error) {
      console.error("Failed to subscribe to webData2:", error);
      setError('webData2', error instanceof Error ? error.message : 'WebData2 subscription failed');
      setLoadingState('webData2', false);
    }
  };

  const subscribeToUserFills = async (userAddress: string) => {
    if (!subscriptionClientRef.current || userAddress === DUMMY_USER) return;

    try {
      setLoadingState('userFills', true);
      setError('userFills', null);

      subscriptionsRef.current.userFills = await subscriptionClientRef.current.userFills(
        {
          user: userAddress as `0x${string}`,
          aggregateByTime: true
        },
        (data) => {
          if (data.isSnapshot) {
            setUserFills(data.fills || []);
          } else {
            // Add new fills to the beginning of the array
            data.fills?.forEach(fill => {
              addUserFill(fill);
            });
          }
        }
      );

      setLoadingState('userFills', false);
    } catch (error) {
      console.error("Failed to subscribe to userFills:", error);
      setError('userFills', error instanceof Error ? error.message : 'UserFills subscription failed');
      setLoadingState('userFills', false);
    }
  };

  const subscribeToUserFundings = async (userAddress: string) => {
    if (!subscriptionClientRef.current || userAddress === DUMMY_USER) return;

    try {
      setLoadingState('userFundings', true);
      setError('userFundings', null);

      subscriptionsRef.current.userFundings = await subscriptionClientRef.current.userFundings(
        {
          user: userAddress as `0x${string}`
        },
        (data) => {
          if (data.isSnapshot) {
            setUserFundings(data);
          } else {
            // Add new funding data
            addUserFunding(data);
          }
        }
      );

      setLoadingState('userFundings', false);
    } catch (error) {
      console.error("Failed to subscribe to userFundings:", error);
      setError('userFundings', error instanceof Error ? error.message : 'UserFundings subscription failed');
      setLoadingState('userFundings', false);
    }
  };

  // Manage asset-specific subscriptions (order book and trades)
  useEffect(() => {
    const handleAssetOrGroupingChange = async () => {
      if (!subscriptionClientRef.current || !selectedAsset?.name) return;

      const newAsset = selectedAsset.name;
      const newGrouping = priceGrouping;

      // If neither asset nor grouping has changed, do nothing
      if (currentAssetRef.current === newAsset && currentGroupingRef.current === newGrouping) return;

      try {
        // Unsubscribe from previous asset subscriptions only if asset changed
        if (currentAssetRef.current !== newAsset) {
          if (subscriptionsRef.current.orderBooks) {
            for (const subscription of Object.values(subscriptionsRef.current.orderBooks)) {
              await subscription.unsubscribe();
            }
            subscriptionsRef.current.orderBooks = {};
          }
          if (subscriptionsRef.current.trades) {
            await subscriptionsRef.current.trades.unsubscribe();
            subscriptionsRef.current.trades = undefined;
          }
        } else if (currentGroupingRef.current !== newGrouping) {
          // Only unsubscribe from order book if just grouping changed
          if (subscriptionsRef.current.orderBooks?.[currentGroupingRef.current]) {
            await subscriptionsRef.current.orderBooks[currentGroupingRef.current].unsubscribe();
            delete subscriptionsRef.current.orderBooks[currentGroupingRef.current];
          }
        }

        // Initialize orderBooks object if needed
        if (!subscriptionsRef.current.orderBooks) {
          subscriptionsRef.current.orderBooks = {};
        }

        // Subscribe to new asset's order book with current grouping
        const groupingParams = getGroupingParameters(newGrouping);
        subscriptionsRef.current.orderBooks[newGrouping] = await subscriptionClientRef.current.l2Book(
          {
            coin: newAsset,
            ...groupingParams
          },
          (data) => {
            setOrderBook(newAsset, newGrouping, data);
          }
        );

        // Subscribe to new asset's trades (only if asset changed)
        if (currentAssetRef.current !== newAsset) {
          subscriptionsRef.current.trades = await subscriptionClientRef.current.trades(
            { coin: newAsset },
            (tradesArray) => {
              // The trades subscription sends an array of trades
              if (Array.isArray(tradesArray)) {
                tradesArray.forEach((trade) => {
                  addTrade(newAsset, trade);
                });
              } else {
                // Handle single trade case (if it exists)
                addTrade(newAsset, tradesArray);
              }
            }
          );
        }

        // Subscribe to activeAssetData for leverage and margin mode (always when user is connected)
        if (isConnected && address) {
          // Unsubscribe from previous activeAssetData if exists
          if (subscriptionsRef.current.activeAssetData) {
            await subscriptionsRef.current.activeAssetData.unsubscribe();
          }

          subscriptionsRef.current.activeAssetData = await subscriptionClientRef.current.activeAssetData(
            {
              user: address as `0x${string}`,
              coin: newAsset
            },
            (data: any) => {
              // Extract leverage and margin mode from the response
              if (data && data.coin) {
                const leverageValue = data.leverage?.value || 1;
                const leverageType = data.leverage?.type || 'cross';
                
                // Get maxLeverage from universe data first, then existing store data
                const { webData2 } = useHyperliquidSDKStore.getState();
                const assetMetadata = webData2?.meta?.universe?.find(asset => asset.name === data.coin);
                const maxLeverageFromUniverse = assetMetadata?.maxLeverage;
                
                const existingAssetData = useHyperliquidSDKStore.getState().activeAssetData[data.coin];
                const maxLeverageFromExisting = existingAssetData?.maxLeverage;
                
                const activeAssetData = {
                  coin: data.coin,
                  leverage: leverageValue,
                  isCross: leverageType === 'cross',
                  maxLeverage: data.maxLeverage || maxLeverageFromUniverse || maxLeverageFromExisting || 20, // priority: data > universe > existing > fallback
                  markPx: data.markPx ? parseFloat(data.markPx) : undefined,
                  maxTradeSzs: data.maxTradeSzs,
                  availableToTrade: data.availableToTrade
                };
                setActiveAssetData(data.coin, activeAssetData);
                console.log(`Active asset data for ${data.coin}:`, activeAssetData);
              }
            }
          );
        }

        currentAssetRef.current = newAsset;
        currentGroupingRef.current = newGrouping;
        console.log(`Subscribed to order book (${newGrouping}) and trades for ${newAsset}`);
      } catch (error) {
        console.error(`Failed to setup subscriptions for ${newAsset} with grouping ${newGrouping}:`, error);
      }
    };

    handleAssetOrGroupingChange();
  }, [selectedAsset?.name, priceGrouping, isConnected, address, setOrderBook, addTrade, setActiveAssetData]);


  return null;
};

// Export helper function for use in components
export { getGroupingOptions };
