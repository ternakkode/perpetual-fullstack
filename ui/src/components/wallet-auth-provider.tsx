"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { useAccount, useDisconnect, useSignMessage, useSignTypedData, useSwitchChain } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import * as hl from '@nktkas/hyperliquid';
import { authService } from '@/services/authService';
import type { UserProfile } from '@/services/authService';

export type WalletAuthStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'authenticating'
  | 'setting-up-agent'
  | 'ready'
  | 'error';

export interface WalletState {
  account: string | null;
  isConnected: boolean;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  chainId: number | null;
}

export interface AgentWalletState {
  address: string | null;
  name: string | null;
  status: 'ACTIVE' | 'EXPIRED' | 'NOT_FOUND' | 'PENDING' | null;
  isActive: boolean;
}

export interface WalletAuthState {
  status: WalletAuthStatus;
  wallet: WalletState;
  agentWallet: AgentWalletState;
  user: UserProfile | null;
  error: string | null;
  isReady: boolean;
}

type WalletAuthContextValue = ReturnType<typeof useProvideWalletAuth>;

const WalletAuthContext = createContext<WalletAuthContextValue | null>(null);

export function WalletAuthProvider({ children }: { children: React.ReactNode }) {
  const value = useProvideWalletAuth();
  return <WalletAuthContext.Provider value={value}>{children}</WalletAuthContext.Provider>;
}

export function useWalletAuth() {
  const ctx = useContext(WalletAuthContext);
  if (!ctx) throw new Error('useWalletAuth must be used within WalletAuthProvider');
  return ctx;
}

function useProvideWalletAuth() {
  // Wagmi hooks
  const { address, isConnected, connector, chainId } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { signTypedDataAsync } = useSignTypedData();
  const { switchChain } = useSwitchChain();

  // Local state
  const [state, setState] = useState<WalletAuthState>({
    status: 'disconnected',
    wallet: {
      account: null,
      isConnected: false,
      provider: null,
      signer: null,
      chainId: null,
    },
    agentWallet: {
      address: null,
      name: null,
      status: null,
      isActive: false,
    },
    user: null,
    error: null,
    isReady: false,
  });

  const mountedRef = useRef(true);
  const isProcessingRef = useRef(false);
  const didInitFromStorageRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const updateState = useCallback((updates: Partial<WalletAuthState>) => {
    if (!mountedRef.current) return;
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setError = useCallback((error: string) => {
    updateState({ status: 'error', error });
  }, [updateState]);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // Setup wallet provider and signer
  const setupWalletProvider = useCallback(async (): Promise<{ provider: BrowserProvider; signer: JsonRpcSigner } | null> => {
    if (!isConnected || !connector) return null;

    try {
      const rawProvider = await connector.getProvider();
      if (!rawProvider || typeof window === 'undefined') return null;

      const provider = new BrowserProvider(rawProvider as any);
      const signer = await provider.getSigner();

      return { provider, signer };
    } catch (err) {
      console.error('Failed to setup wallet provider:', err);
      return null;
    }
  }, [isConnected, connector]);

  // Authenticate with backend
  const authenticateWithBackend = useCallback(async (walletAddress: string, signer: JsonRpcSigner): Promise<UserProfile | null> => {
    try {
      // Get EIP712 message
      const authDetails = await authService.getEIP712Message(walletAddress);

      // Check if we need to switch networks
      if (authDetails.domain.chainId && chainId !== authDetails.domain.chainId) {
        try {
          await switchChain({ chainId: authDetails.domain.chainId });
          // Wait a moment for the network switch to take effect
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (switchError) {
          console.error('Failed to switch network:', switchError);
          throw new Error(`Please switch to network with chainId ${authDetails.domain.chainId} to continue authentication.`);
        }
      }

      // Sign typed data
      const signature = await signTypedDataAsync({
        domain: authDetails.domain as any,
        types: authDetails.types as any,
        primaryType: Object.keys(authDetails.types)[0],
        message: authDetails.message as any,
      });

      // Authenticate
      const authResponse = await authService.authenticate({
        method: 'eip712',
        address: walletAddress,
        details: { signature, timestamp: authDetails.timestamp },
      });

      const user: UserProfile = {
        userId: authResponse.address.toLowerCase(),
        address: authResponse.address.toLowerCase(),
        appId: 'hyperliquid-trading-app'
      };

      return user;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      console.error('Backend authentication failed:', err);
      throw new Error(message);
    }
  }, [signTypedDataAsync, chainId, switchChain]);

  // Setup agent wallet
  const setupAgentWallet = useCallback(async (): Promise<AgentWalletState> => {
    try {
      updateState({ status: 'setting-up-agent' });
      
      // Check if agent wallet already exists
      const existingWallet = await authService.getAgentWallet();

      if (existingWallet.status === 'ACTIVE') {
        const agentWalletState = {
          address: existingWallet.agentWalletAddress,
          name: existingWallet.agentName,
          status: 'ACTIVE' as const,
          isActive: true,
        };
        
        updateState({
          agentWallet: agentWalletState,
          isReady: true,
          status: 'ready'
        });
        
        return agentWalletState;
      }

      // Create new agent wallet if needed
      if (existingWallet.status === 'NOT_FOUND' || existingWallet.status === 'EXPIRED') {
        const newWallet = await authService.createAgentWallet();

        const exchClient = new hl.ExchangeClient({
          wallet: state.wallet.signer!,
          transport: new hl.HttpTransport()
        });

        await exchClient.approveAgent({
          agentAddress: newWallet.agentWalletAddress as `0x${string}`,
          agentName: 'Trading Agent',
        });

        await exchClient.approveBuilderFee({
          builder: "0x4cb5eF084E9Fe906b412c99ac276eD6c3A18E4e4".toLowerCase() as `0x${string}`,
          maxFeeRate: "0.1%",
        });

        const agentWalletState = {
          address: newWallet.agentWalletAddress,
          name: 'Trading Agent',
          status: 'ACTIVE' as const,
          isActive: true,
        };
        
        updateState({
          agentWallet: agentWalletState,
          isReady: true,
          status: 'ready'
        });
        
        return agentWalletState;
      }

      // Handle pending status
      const agentWalletState = {
        address: existingWallet.agentWalletAddress,
        name: existingWallet.agentName,
        status: existingWallet.status,
        isActive: false,
      };
      
      updateState({
        agentWallet: agentWalletState,
        isReady: false,
        status: 'ready'
      });
      
      return agentWalletState;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to setup agent wallet';
      console.error('Agent wallet setup failed:', err);
      updateState({ status: 'error', error: message });
      throw new Error(message);
    }
  }, [state.wallet, updateState]);

  const hydrateFromExistingSession = useCallback(async (walletAddress: string) => {
    // Ensure wallet details are set for this instance
    const walletSetup = await setupWalletProvider();
    if (walletSetup) {
      const { provider, signer } = walletSetup;
      updateState({
        wallet: {
          account: walletAddress,
          isConnected: true,
          provider,
          signer,
          chainId: chainId ?? null,
        },
      });
    }

    // Restore user from token
    if (authService.isAuthenticated()) {
      const token = authService.getAccessToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const tokenAddress = String(payload.sub || payload.address || '').toLowerCase();
          if (tokenAddress) {
            updateState({
              user: {
                userId: tokenAddress,
                address: tokenAddress,
                appId: 'hyperliquid-trading-app',
              },
            });
          }
        } catch (e) {
          // ignore
        }
      }
    }

    // Fetch current agent wallet status
    if (authService.isAuthenticated()) {
      try {
        const existingWallet = await authService.getAgentWallet();
        const mapped: AgentWalletState = {
          address: existingWallet.agentWalletAddress,
          name: existingWallet.agentName,
          status: existingWallet.status as AgentWalletState['status'],
          isActive: existingWallet.status === 'ACTIVE',
        };

        updateState({
          agentWallet: mapped,
          isReady: mapped.isActive,
        });
      } catch {
        // ignore
      }
    }
  }, [setupWalletProvider, chainId, updateState]);

  // Complete setup flow
  const runSetupFlow = useCallback(async (walletAddress: string) => {
    if (isProcessingRef.current) return;

    try {
      isProcessingRef.current = true;
      clearError();

      updateState({ status: 'connected' });

      // Step 1: Setup wallet provider/signer
      const walletSetup = await setupWalletProvider();
      if (!walletSetup) {
        throw new Error('Failed to setup wallet provider');
      }

      const { provider, signer } = walletSetup;
      updateState({
        wallet: {
          account: walletAddress,
          isConnected: true,
          provider,
          signer,
          chainId: chainId ?? null,
        },
      });

      // Step 2: Authenticate with backend
      updateState({ status: 'authenticating' });
      const user = await authenticateWithBackend(walletAddress, signer);
      updateState({ user });

      // Step 3: Check for existing agent wallet after authentication
      try {
        const existingWallet = await authService.getAgentWallet();
        const agentWalletState: AgentWalletState = {
          address: existingWallet.agentWalletAddress,
          name: existingWallet.agentName,
          status: existingWallet.status as AgentWalletState['status'],
          isActive: existingWallet.status === 'ACTIVE',
        };

        updateState({
          agentWallet: agentWalletState,
          isReady: agentWalletState.isActive,
          status: 'ready'
        });
      } catch (err) {
        // If fetching agent wallet fails, still mark as ready but without agent wallet
        updateState({
          status: 'ready',
          isReady: false
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Setup failed';
      console.error('Setup flow failed:', err);
      setError(message);
    } finally {
      isProcessingRef.current = false;
    }
  }, [clearError, setupWalletProvider, authenticateWithBackend, chainId, updateState, setError]);

  // Initialize from storage on mount
  useEffect(() => {
    if (didInitFromStorageRef.current) return;
    try {
      authService.initializeFromStorage();
    } catch (err) {
      console.error('Failed to initialize from storage:', err);
    } finally {
      didInitFromStorageRef.current = true;
    }
  }, []);

  // Handle wallet connection changes
  useEffect(() => {
    const currentAddress = address?.toLowerCase();

    if (!isConnected || !currentAddress) {
      // Wallet disconnected - reset everything
      if (state.status !== 'disconnected') {
        setState({
          status: 'disconnected',
          wallet: {
            account: null,
            isConnected: false,
            provider: null,
            signer: null,
            chainId: null,
          },
          agentWallet: {
            address: null,
            name: null,
            status: null,
            isActive: false,
          },
          user: null,
          error: null,
          isReady: false,
        });
        isProcessingRef.current = false;
      }
      return;
    }

    // Determine if we already have a valid authenticated session for this address
    const token = authService.getAccessToken();
    let tokenAddress: string | null = null;
    if (authService.isAuthenticated() && token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        tokenAddress = String(payload.sub || payload.address || '').toLowerCase();
      } catch {}
    }

    const hasValidSession = !!tokenAddress && tokenAddress === currentAddress;
    if (hasValidSession) {
      hydrateFromExistingSession(currentAddress);
    } else {
      runSetupFlow(currentAddress);
    }
  }, [isConnected, address, state.status, hydrateFromExistingSession, runSetupFlow]);

  // Actions
  const connectWallet = useCallback(async () => {
    try {
      updateState({ status: 'connecting' });
      clearError();
      if (openConnectModal) {
        openConnectModal();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to open connect modal';
      setError(message);
    }
  }, [openConnectModal, updateState, clearError, setError]);

  const disconnectWallet = useCallback(async () => {
    try {
      await disconnect();
      await authService.logout();
      isProcessingRef.current = false;
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  }, [disconnect]);

  const signMessage = useCallback(
    async (message: string) => {
      try {
        return await signMessageAsync({ message });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to sign message';
        throw new Error(msg);
      }
    },
    [signMessageAsync]
  );

  const signTypedData = useCallback(
    async (
      domain: Record<string, unknown>,
      types: Record<string, Array<{ name: string; type: string }>>,
      message: Record<string, unknown>
    ) => {
      try {
        return await signTypedDataAsync({
          domain: domain as any,
          types: types as any,
          primaryType: Object.keys(types)[0],
          message: message as any,
        });
      } catch (err: any) {
        if (err?.message?.includes('chainId')) {
          throw new Error('Chain mismatch detected. Please switch to the correct network.');
        }
        const msg = err instanceof Error ? err.message : 'Failed to sign typed data';
        throw new Error(msg);
      }
    },
    [signTypedDataAsync]
  );

  const switchChainTo = useCallback(
    async (targetChainId: number) => {
      try {
        await switchChain({ chainId: targetChainId });
      } catch (err: any) {
        console.error('Failed to switch chain:', err);
        throw new Error(`Failed to switch to chain ${targetChainId}: ${err?.message || 'Unknown error'}`);
      }
    },
    [switchChain]
  );

  // Derived state
  const isLoading = useMemo(() => {
    return ['connecting', 'authenticating', 'setting-up-agent'].includes(state.status);
  }, [state.status]);

  const isAuthenticated = useMemo(() => {
    return state.user !== null;
  }, [state.user]);

  const isAgentWalletReady = useMemo(() => {
    return state.agentWallet.isActive;
  }, [state.agentWallet.isActive]);

  return {
    // State
    ...state,
    isLoading,
    isAuthenticated,
    isAgentWalletReady,

    // Actions
    connectWallet,
    disconnectWallet,
    setupAgentWallet,
    signMessage,
    signTypedData,
    switchChain: switchChainTo,
  };
}

