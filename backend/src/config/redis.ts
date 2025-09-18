import { Injectable } from '@nestjs/common';
import { SharedBullConfigurationFactory, BullRootModuleOptions } from '@nestjs/bull';
import { createClient } from 'redis';
import { AppConfigService } from './app-config.service';

@Injectable()
export class RedisConfig implements SharedBullConfigurationFactory {
  constructor(private readonly appConfig: AppConfigService) {}

  createSharedConfiguration(): BullRootModuleOptions {
    return {
      redis: {
        host: this.appConfig.redisHost,
        port: this.appConfig.redisPort,
        password: this.appConfig.redisPassword,
        db: this.appConfig.redisDb,
      },
    };
  }
}

export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  password: process.env.REDIS_PASSWORD,
  database: parseInt(process.env.REDIS_DB || '0'),
});