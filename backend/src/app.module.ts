import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { DatabaseConfig } from './config/database';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/app-config.service';
import { PersistenceModule } from './persistance/persistence.module';

// Controllers
import { HealthController } from './controllers/health.controller';
import { AgentWalletController } from './controllers/agent-wallet.controller';
import { AuthController } from './controllers/auth.controller';
import { TradeController } from './controllers/trade.controller';
import { ExchangeController } from './controllers/exchange.controller';
import { ExecutionsController } from './controllers/executions.controller';

// Services
import { AgentWalletService } from './services/agent-wallet.service';
import { RedisService } from './libs/redis.libs';
import { HyperliquidService } from './libs/hyperliquid.libs';
import { HttpTransport } from './libs/hyperliquid.transporter.libs';
import { AuthService } from './services/auth.service';
import { JwtService } from './libs/jwt.service';
import { EIP712Service } from './libs/eip712.service';
import { OrderExecutionService } from './services/order-execution.service';

// Guards
import { AuthGuard } from './guards/auth.guard';

import { ApiKey } from './entities/api-key.entity';
import { TradingOrder } from './entities/trading-order.entity';
import { Scheduler } from './entities/scheduler.entity';
import { AdvanceTrigger } from './entities/advance-trigger.entity';
import { BetaRegistration } from './entities/beta-registration.entity';
import { BetaCommunity } from './entities/beta-community.entity';
import { ApiKeysController } from './controllers/api-keys.controller';
import { BetaRegistrationController } from './controllers/beta-registration.controller';
import { CreateApiKeyUseCase } from './services/usecase/create-api-key.usecase';
import { GetUserApiKeysUseCase } from './services/usecase/get-user-api-keys.usecase';

// Interceptors
import { HttpLoggingInterceptor } from './interceptors/http-logging.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import pino from 'pino';
import { AllMidsSchedulerExecutor } from './services/usecase/all-mids-scheduler-executor';
import { ExecuteOrderUseCase } from './services/usecase/execute-order.usecase';
import { ScheduledExecutorUseCase } from './services/usecase/scheduled-executor.usecase';
import { WebDataSchedulerExecutor } from './services/usecase/web-data-scheduler-executor';
import { SchedulerManagerService } from './services/scheduler-manager.service';
import { SchedulerService } from './services/scheduler.service';
import { MarketOrderUseCase } from './services/usecase/market-order.usecase';
import { LimitOrderUseCase } from './services/usecase/limit-order.usecase';
import { ScaleOrderUseCase } from './services/usecase/scale-order.usecase';
import { StopLimitOrderUseCase } from './services/usecase/stop-limit-order.usecase';
import { StopMarketOrderUseCase } from './services/usecase/stop-market-order.usecase';
import { TwapOrderUseCase } from './services/usecase/twap-order.usecase';
import { SetLeverageUseCase } from './services/usecase/set-leverage.usecase';
import { CreateUnifiedExecutionUseCase } from './services/usecase/create-unified-execution.usecase';
import { GetUnifiedExecutionsUseCase } from './services/usecase/get-unified-executions.usecase';
import { CancelUnifiedExecutionUseCase } from './services/usecase/cancel-unified-execution.usecase';
import { CreateSchedulerUseCase } from './services/usecase/create-scheduler.usecase';
import { CancelSchedulerUseCase } from './services/usecase/cancel-scheduler.usecase';
import { CreateAdvanceTriggerUseCase } from './services/usecase/create-advance-trigger.usecase';
import { CancelAdvanceTriggerUseCase } from './services/usecase/cancel-advance-trigger.usecase';
import { CronExecutionUseCase } from './services/usecase/cron-execution.usecase';
import { ScheduledExecutionUseCase } from './services/usecase/scheduled-execution.usecase';
import { MarketDataSchedulerUseCase } from './services/usecase/market-data-scheduler.usecase';
import { AssetPriceSchedulerUseCase } from './services/usecase/asset-price-scheduler.usecase';
import { TradingWebSocketGateway } from './websocket/trading-websocket.gateway';

// Beta Registration Use Cases
import { CreatePublicRegistrationUseCase } from './services/usecase/create-public-registration.usecase';
import { CreateCommunityRegistrationUseCase } from './services/usecase/create-community-registration.usecase';
import { GetRegistrationStatsUseCase } from './services/usecase/get-registration-stats.usecase';
import { CreateCommunityUseCase } from './services/usecase/create-community.usecase';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SentryModule.forRoot(),
    LoggerModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfig: AppConfigService) => {
        if (appConfig.betterStackEnabled && appConfig.betterStackToken) {
          console.log('Using Better Stack for logging');
          return {
            pinoHttp: [
              {
                level: process.env.LOG_LEVEL || 'info',
                autoLogging: false,
              },
              pino.transport({
                target: '@logtail/pino',
                options: {
                  sourceToken: appConfig.betterStackToken,
                  options: {
                    endpoint: appConfig.betterStackEndpoint,
                  },
                },
              }),
            ],
          };
        }

        console.log('Using default pino configuration (Better Stack disabled)');
        return {
          pinoHttp: {
            level: process.env.LOG_LEVEL || 'info',
            autoLogging: true,
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
              },
            },
          },
        };
      },
      inject: [AppConfigService],
    }),
    AppConfigModule,
    PersistenceModule,
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    TypeOrmModule.forFeature([
      ApiKey,
      TradingOrder,
      Scheduler,
      AdvanceTrigger,
      BetaRegistration,
      BetaCommunity,
    ]),
    BullModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfig: AppConfigService) => ({
        redis: {
          host: appConfig.redisHost,
          port: appConfig.redisPort,
          password: appConfig.redisPassword,
          db: appConfig.redisDb,
        },
      }),
      inject: [AppConfigService],
    }),
    BullModule.registerQueue({
      name: 'twap-chunks',
    }),
  ],
  controllers: [
    HealthController,
    AgentWalletController,
    AuthController,
    ApiKeysController,
    BetaRegistrationController,
    TradeController,
    ExchangeController,
    ExecutionsController,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
    AgentWalletService,
    RedisService,
    HyperliquidService,
    HttpTransport,
    AuthService,
    JwtService,
    EIP712Service,
    OrderExecutionService,
    SchedulerManagerService,
    SchedulerService,
    AuthGuard,
    CreateApiKeyUseCase,
    GetUserApiKeysUseCase,
    AllMidsSchedulerExecutor,
    ExecuteOrderUseCase,
    ScheduledExecutorUseCase,
    WebDataSchedulerExecutor,
    MarketOrderUseCase,
    LimitOrderUseCase,
    ScaleOrderUseCase,
    StopLimitOrderUseCase,
    StopMarketOrderUseCase,
    TwapOrderUseCase,
    SetLeverageUseCase,
    CreateUnifiedExecutionUseCase,
    GetUnifiedExecutionsUseCase,
    CancelUnifiedExecutionUseCase,
    CreateSchedulerUseCase,
    CancelSchedulerUseCase,
    CreateAdvanceTriggerUseCase,
    CancelAdvanceTriggerUseCase,
    CronExecutionUseCase,
    ScheduledExecutionUseCase,
    MarketDataSchedulerUseCase,
    AssetPriceSchedulerUseCase,
    TradingWebSocketGateway,
    // Beta Registration Use Cases
    CreatePublicRegistrationUseCase,
    CreateCommunityRegistrationUseCase,
    GetRegistrationStatsUseCase,
    CreateCommunityUseCase
  ],
})
export class AppModule { }