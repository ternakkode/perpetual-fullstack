export interface AppConfig {
  // Database
  dbHost: string;
  dbPort: number;
  dbUsername: string;
  dbPassword: string;
  dbName: string;

  // Redis
  redisHost: string;
  redisPort: number;
  redisPassword?: string;
  redisDb: number;

  // JWT
  jwtPrivateKey: string;
  jwtPublicKey: string;
  jwtAccessTokenDuration: string;
  jwtRefreshTokenDuration: string;

  // Hyperliquid
  hyperliquidTestnet: boolean;
  hyperliquidWsUrl: string;
  hyperliquidHttpsProxy?: string;
  hyperliquidBuilderCodeAddress: string;
  hyperliquidBuilderCodeFee: Number;
  hyperliquidMaxPerpetualBuilderFee: string;

  // EIP-712
  eip712ChainId: number;
  eip712VerifyingContract: string;

  // Application
  nodeEnv: string;
  port: number;
  enableBackgroundJob: boolean;
  agentWalletEncryptionKey: string;

}