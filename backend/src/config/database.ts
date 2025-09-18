import { Injectable, Inject } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Logger } from 'nestjs-pino';
import { ApiKey } from '@/entities/api-key.entity';
import { TradingOrder } from '@/entities/trading-order.entity';
import { Scheduler } from '@/entities/scheduler.entity';
import { AdvanceTrigger } from '@/entities/advance-trigger.entity';
import { BetaRegistration } from '@/entities/beta-registration.entity';
import { BetaCommunity } from '@/entities/beta-community.entity';
import { TypeOrmPinoLogger } from '../libs/typeorm-pino-logger';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(@Inject(Logger) private readonly logger: Logger) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'brother_terminal',
      entities: [
        ApiKey,
        TradingOrder,
        Scheduler,
        AdvanceTrigger,
        BetaRegistration,
        BetaCommunity,
      ],
      synchronize: false,
      migrations: ['dist/migrations/*.js'],
      migrationsRun: false,
      logging: false,
      ssl: false,
      extra: {
        connectionTimeoutMillis: 5000,
        max: process.env.NODE_ENV === 'test' ? 5 : 20,
        min: process.env.NODE_ENV === 'test' ? 1 : 5,
        acquireTimeoutMillis: process.env.NODE_ENV === 'test' ? 5000 : 30000,
        createTimeoutMillis: process.env.NODE_ENV === 'test' ? 5000 : 30000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200,
      },
    };
  }
}
