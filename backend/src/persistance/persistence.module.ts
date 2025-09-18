import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from '@/entities/api-key.entity';
import { TradingOrder } from '@/entities/trading-order.entity';
import { Scheduler } from '@/entities/scheduler.entity';
import { AdvanceTrigger } from '@/entities/advance-trigger.entity';
import { BetaRegistration } from '@/entities/beta-registration.entity';
import { BetaCommunity } from '@/entities/beta-community.entity';
import { 
  ApiKeyRepository,
  TradingOrderRepository,
  SchedulerRepository,
  AdvanceTriggerRepository 
} from './repositories';
import { BetaRegistrationRepository } from './repositories/beta-registration.repository';
import { BetaCommunityRepository } from './repositories/beta-community.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApiKey,
      TradingOrder,
      Scheduler,
      AdvanceTrigger,
      BetaRegistration,
      BetaCommunity,
    ]),
  ],
  providers: [
    ApiKeyRepository,
    TradingOrderRepository,
    SchedulerRepository,
    AdvanceTriggerRepository,
    BetaRegistrationRepository,
    BetaCommunityRepository,
  ],
  exports: [
    ApiKeyRepository,
    TradingOrderRepository,
    SchedulerRepository,
    AdvanceTriggerRepository,
    BetaRegistrationRepository,
    BetaCommunityRepository,
  ],
})
export class PersistenceModule { }