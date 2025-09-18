interface HyperliquidConfig {
  baseUrl: string;
  websocketUrl: string;
  chain: string;
  builderFee: {
    address: string;
    maximum: string;
    value: number;
  };
  referralCode: string;
}

interface BackendConfig {
  baseUrl: string;
  websocketUrl: string;
}

interface Config {
  walletConnectProjectId: string;
  isMultiPairSupported: boolean;
  defaultLeverageValue: number,
  minimumPositionSize: number,
  maximumSlippage: number;
  hyperliquid: HyperliquidConfig;
  backend: BackendConfig;
  watchlists: string[];
  mixPanelToken: string;
}

export const getConfig = (): Config => ({
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  isMultiPairSupported: process.env.NEXT_PUBLIC_IS_MULTI_PAIR_SUPPORTED === "true" || false,
  defaultLeverageValue: Number(process.env.NEXT_PUBLIC_DEFAULT_LEVERAGE_VALUE || 3),
  minimumPositionSize: Number(process.env.NEXT_PUBLIC_MINIMUM_POSITION_SIZE || 11),
  maximumSlippage: Number(process.env.NEXT_PUBLIC_MAXIMUM_SLIPPAGE || 0.08),
  hyperliquid: {
    baseUrl:
      process.env.NEXT_PUBLIC_HYPERLIQUID_BASE_URL ||
      "https://api.hyperliquid.xyz",
    websocketUrl:
      process.env.NEXT_PUBLIC_HYPERLIQUID_WEBSOCKET_URL ||
      "wss://api.hyperliquid.xyz/ws",
    chain: process.env.NEXT_PUBLIC_HYPERLIQUID_CHAIN || "Mainnet",
    builderFee: {
      address:
        process.env.NEXT_PUBLIC_HYPERLIQUID_BUILDER_FEE_ADDRESS ||
        "0x4cb5eF084E9Fe906b412c99ac276eD6c3A18E4e4",
      maximum:
        process.env.NEXT_PUBLIC_HYPERLIQUID_MAXIMUM_BUILDER_FEE || "0.05%",
      value: Number(process.env.NEXT_PUBLIC_HYPERLIQUID_BUILDER_FEE || 50),
    },
    referralCode: process.env.NEXT_PUBLIC_HYPERLIQUID_REFERRAL_FEE || "BROTHERTERMINAL"
  },
  backend: {
    baseUrl:
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "https://api.brother-terminal.xyz",
    websocketUrl:
      process.env.NEXT_PUBLIC_BACKEND_WEBSOCKET_URL ||
      "wss://api.brother-terminal.xyz/ws",
  },
  watchlists: process.env.NEXT_PUBLIC_WATCHLISTS?.split(",") || [
    "BTC",
    "HYPE",
    "ETH",
    "SOL",
  ],
  mixPanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "",
});
