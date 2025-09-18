import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { TradingOrderRepository } from '@/persistance/repositories/trading-order.repository';
import { CreateSchedulerUseCase } from './create-scheduler.usecase';
import { CreateAdvanceTriggerUseCase } from './create-advance-trigger.usecase';
import { 
  CreateUnifiedExecutionRequest, 
  CreateUnifiedExecutionResponse,
  SchedulerTriggerConfig,
  AdvanceTriggerConfig 
} from '@/dtos/execution.dto';
import { CreateSchedulerRequest } from '@/dtos/scheduler.dto';
import { CreateAdvanceTriggerRequest } from '@/dtos/advance-trigger.dto';
import { TradingOrderStatus } from '@/entities/trading-order.entity';
import { TradingWebSocketGateway } from '@/websocket/trading-websocket.gateway';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateUnifiedExecutionUseCase {
  private readonly logger = new Logger(CreateUnifiedExecutionUseCase.name);

  constructor(
    private readonly tradingOrderRepository: TradingOrderRepository,
    private readonly createSchedulerUseCase: CreateSchedulerUseCase,
    private readonly createAdvanceTriggerUseCase: CreateAdvanceTriggerUseCase,
    private readonly tradingWebSocketGateway: TradingWebSocketGateway,
  ) {}

  async execute(request: CreateUnifiedExecutionRequest): Promise<CreateUnifiedExecutionResponse> {
    this.logger.log(`Creating unified execution for user: ${request.userAddress}, trigger type: ${request.trigger.type}`);

    // Validate the request
    this.validateRequest(request);

    try {
      // 1. Create the parent trading order first
      const tradingOrderId = uuidv4();
      
      const tradingOrder = await this.tradingOrderRepository.create({
        id: tradingOrderId,
        user_address: request.userAddress,
        execution_type: request.tradingOrder.executionType,
        perpetual_side: request.tradingOrder.perpetualSide,
        is_twap: request.tradingOrder.isTwap,
        asset: request.tradingOrder.asset,
        usdc_size: request.tradingOrder.usdcSize,
        leverage: request.tradingOrder.leverage,
        twap_running_time: request.tradingOrder.twapRunningTime || null,
        twap_randomize: request.tradingOrder.twapRandomize || null,
        status: TradingOrderStatus.PENDING,
      });

      this.logger.log(`Trading order created successfully for user: ${request.userAddress}, ID: ${tradingOrder.id}`);

      // 2. Create the child trigger based on type
      let schedulerResponse = undefined;
      let advanceTriggerResponse = undefined;
      let message = '';

      if (request.trigger.type === 'SCHEDULER') {
        const schedulerTrigger = request.trigger as SchedulerTriggerConfig;
        
        const schedulerRequest: CreateSchedulerRequest = {
          tradingOrderId: tradingOrder.id,
          userAddress: request.userAddress,
          triggerType: schedulerTrigger.triggerType,
          scheduledAt: schedulerTrigger.scheduledAt,
          cron: schedulerTrigger.cron,
          timezone: schedulerTrigger.timezone || 'UTC',
        };

        schedulerResponse = await this.createSchedulerUseCase.execute(schedulerRequest);
        message = `Unified execution created: Trading order ${tradingOrder.id} with scheduler ${schedulerResponse.id}`;

      } else if (request.trigger.type === 'ADVANCE_TRIGGER') {
        const advanceTrigger = request.trigger as AdvanceTriggerConfig;
        
        const advanceTriggerRequest: CreateAdvanceTriggerRequest = {
          tradingOrderId: tradingOrder.id,
          userAddress: request.userAddress,
          triggerType: advanceTrigger.triggerType,
          triggerAsset: advanceTrigger.triggerAsset,
          triggerValue: advanceTrigger.triggerValue,
          triggerDirection: advanceTrigger.triggerDirection,
        };

        advanceTriggerResponse = await this.createAdvanceTriggerUseCase.execute(advanceTriggerRequest);
        message = `Unified execution created: Trading order ${tradingOrder.id} with advance trigger ${advanceTriggerResponse.id}`;
      }

      this.logger.log(`Unified execution created successfully: ${message}`);

      // 3. Trigger WebSocket update for the complete unified view
      try {
        await this.tradingWebSocketGateway.refreshAllForAddress(request.userAddress);
      } catch (wsError) {
        this.logger.error('Failed to send WebSocket update:', wsError);
      }

      return {
        tradingOrder: {
          id: tradingOrder.id,
          status: tradingOrder.status,
          createdAt: tradingOrder.created_at,
        },
        scheduler: schedulerResponse ? {
          id: schedulerResponse.id,
          status: schedulerResponse.status,
          createdAt: schedulerResponse.createdAt,
        } : undefined,
        advanceTrigger: advanceTriggerResponse ? {
          id: advanceTriggerResponse.id,
          status: advanceTriggerResponse.status,
          createdAt: advanceTriggerResponse.createdAt,
        } : undefined,
        message,
      };

    } catch (error) {
      this.logger.error(`Failed to create unified execution for user ${request.userAddress}:`, error);
      throw error;
    }
  }

  private validateRequest(request: CreateUnifiedExecutionRequest): void {
    // Validate trading order details
    if (!request.tradingOrder) {
      throw new BadRequestException('Trading order details are required');
    }

    if (!request.tradingOrder.asset || request.tradingOrder.asset.trim() === '') {
      throw new BadRequestException('Asset is required');
    }

    if (request.tradingOrder.usdcSize <= 0) {
      throw new BadRequestException('USDC size must be greater than 0');
    }

    if (request.tradingOrder.leverage <= 0) {
      throw new BadRequestException('Leverage must be greater than 0');
    }

    // Validate trigger configuration
    if (!request.trigger) {
      throw new BadRequestException('Trigger configuration is required');
    }

    if (request.trigger.type === 'SCHEDULER') {
      this.validateSchedulerTrigger(request.trigger as SchedulerTriggerConfig);
    } else if (request.trigger.type === 'ADVANCE_TRIGGER') {
      this.validateAdvanceTrigger(request.trigger as AdvanceTriggerConfig);
    } else {
      throw new BadRequestException('Invalid trigger type. Must be SCHEDULER or ADVANCE_TRIGGER');
    }
  }

  private validateSchedulerTrigger(trigger: SchedulerTriggerConfig): void {
    if (trigger.triggerType === 'SCHEDULED') {
      if (!trigger.scheduledAt) {
        throw new BadRequestException('scheduledAt is required for SCHEDULED trigger type');
      }
      if (trigger.cron) {
        throw new BadRequestException('cron should not be provided for SCHEDULED trigger type');
      }
    } else if (trigger.triggerType === 'CRON') {
      if (!trigger.cron) {
        throw new BadRequestException('cron is required for CRON trigger type');
      }
      if (trigger.scheduledAt) {
        throw new BadRequestException('scheduledAt should not be provided for CRON trigger type');
      }
    } else {
      throw new BadRequestException('Invalid scheduler trigger type');
    }
  }

  private validateAdvanceTrigger(trigger: AdvanceTriggerConfig): void {
    if (!trigger.triggerAsset || trigger.triggerAsset.trim() === '') {
      throw new BadRequestException('triggerAsset is required for advance triggers');
    }

    if (trigger.triggerValue <= 0) {
      throw new BadRequestException('triggerValue must be greater than 0');
    }

    if (!trigger.triggerDirection) {
      throw new BadRequestException('triggerDirection is required');
    }

    if (!trigger.triggerType) {
      throw new BadRequestException('triggerType is required for advance triggers');
    }
  }
}