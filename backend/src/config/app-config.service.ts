import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './app-config.interface';

@Injectable()
export class AppConfigService implements AppConfig {
  constructor(private readonly configService: ConfigService) {}

  // Database
  get dbHost(): string {
    return this.configService.get<string>('DB_HOST', 'localhost');
  }

  get dbPort(): number {
    return Number(this.configService.get<number>('DB_PORT', 5432));
  }

  get dbUsername(): string {
    return this.configService.get<string>('DB_USERNAME', 'postgres');
  }

  get dbPassword(): string {
    return this.configService.get<string>('DB_PASSWORD', 'password');
  }

  get dbName(): string {
    return this.configService.get<string>('DB_NAME', 'hyperliquid');
  }

  // Redis
  get redisHost(): string {
    return this.configService.get<string>('REDIS_HOST', 'localhost');
  }

  get redisPort(): number {
    return Number(this.configService.get<number>('REDIS_PORT', 6379));
  }

  get redisPassword(): string | undefined {
    return this.configService.get<string>('REDIS_PASSWORD');
  }

  get redisDb(): number {
    return this.configService.get<number>('REDIS_DB', 0);
  }

  // JWT
  get jwtPrivateKey(): string {
    return this.configService.get<string>('JWT_PRIVATE_KEY')!;
  }

  get jwtPublicKey(): string {
    return this.configService.get<string>('JWT_PUBLIC_KEY')!;
  }

  get jwtAccessTokenDuration(): string {
    return this.configService.get<string>('JWT_ACCESS_TOKEN_DURATION', '15m');
  }

  get jwtRefreshTokenDuration(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_DURATION', '7d');
  }

  // Hyperliquid
  get hyperliquidTestnet(): boolean {
    const value = this.configService.get<string>('HYPERLIQUID_TESTNET', 'false');
    return value.toLowerCase() === 'true';
  }

  get hyperliquidWsUrl(): string {
    return this.configService.get<string>('HYPERLIQUID_WS_URL', 'wss://api.hyperliquid-testnet.xyz/ws');
  }

  get hyperliquidHttpsProxy(): string | undefined {
    return this.configService.get<string>('HYPERLIQUID_HTTPS_PROXY');
  }

  get hyperliquidBuilderCodeAddress(): string {
    return this.configService.get<string>('HYPERLIQUID_BUILDER_CODE_ADDRESS', '0x0000000000000000000000000000000000000000');
  }

  get hyperliquidBuilderCodeFee(): number {
    return Number(this.configService.get<number>('HYPERLIQUID_BUILDER_CODE_FEE', 50));
  }

  get hyperliquidMaxPerpetualBuilderFee(): string {
    return this.configService.get<string>('HYPERLIQUID_MAX_PERPETUAL_BUILDER_FEE', '0.1%');
  }

  // EIP-712
  get eip712ChainId(): number {
    return Number(this.configService.get<number>('EIP712_CHAIN_ID', 42161));
  }

  get eip712VerifyingContract(): string {
    return this.configService.get<string>('EIP712_VERIFYING_CONTRACT', '0x0000000000000000000000000000000000000000');
  }

  // Application
  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get port(): number {
    return Number(this.configService.get<number>('PORT', 3000));
  }

  get enableBackgroundJob(): boolean {
    const value = this.configService.get<string>('ENABLE_BACKGROUND_JOB', 'false');
    return value.toLowerCase() === 'true';
  }

  get agentWalletEncryptionKey(): string {
    return this.configService.get<string>('AGENT_WALLET_ENCRYPTION_KEY', 'default-encryption-key-please-change-in-production')!;
  }

  // Better Stack Logging
  get betterStackEnabled(): boolean {
    const value = this.configService.get<string>('BETTER_STACK_ENABLED', 'false');
    return value.toLowerCase() === 'true';
  }

  get betterStackToken(): string | undefined {
    return this.configService.get<string>('BETTER_STACK_TOKEN');
  }

  get betterStackEndpoint(): string {
    return this.configService.get<string>('BETTER_STACK_ENDPOINT', 'https://in.logs.betterstack.com');
  }

}