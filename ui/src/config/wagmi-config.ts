import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, arbitrum, base, optimism, polygon, sepolia } from 'viem/chains';
import { getConfig } from './config';

// Define Hyperliquid EVM chain
export const hyperliquidEvm = {
  id: 999,
  name: 'Hyperliquid EVM',
  nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.hyperliquid.xyz/evm'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://app.hyperliquid.xyz/explorer' },
  },
} as const;

// Define Hyperliquid Testnet chain
export const hyperliquidTestnet = {
  id: 1337,
  name: 'Hyperliquid Testnet',
  nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.hyperliquid-testnet.xyz/evm'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://app.hyperliquid.xyz/explorer' },
  },
} as const;

export const config = getDefaultConfig({
  appName: 'Hyperliquid Connect',
  projectId: getConfig().walletConnectProjectId || 'YOUR_PROJECT_ID',
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    hyperliquidEvm,
    hyperliquidTestnet,
    ...(process.env.NODE_ENV === 'development' ? [sepolia] : []),
  ],
  ssr: true,
});