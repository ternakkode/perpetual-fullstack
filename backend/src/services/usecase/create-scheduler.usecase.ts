import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { SchedulerRepository } from '@/persistance/repositories/scheduler.repository';
import { TradingOrderRepository } from '@/persistance/repositories/trading-order.repository';
import { SchedulerStatus } from '@/entities/scheduler.entity';
import { CreateSchedulerRequest, CreateSchedulerResponse } from '@/dtos/scheduler.dto';
import { TradingWebSocketGateway } from '@/websocket/trading-websocket.gateway';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateSchedulerUseCase {
  private readonly logger = new Logger(CreateSchedulerUseCase.name);

  constructor(
    private readonly schedulerRepository: SchedulerRepository,
    private readonly tradingOrderRepository: TradingOrderRepository,
    private readonly tradingWebSocketGateway: TradingWebSocketGateway,
  ) {}

  async execute(request: CreateSchedulerRequest): Promise<CreateSchedulerResponse> {
    this.logger.log(`Creating scheduler for user: ${request.userAddress}, type: ${request.triggerType}`);

    // Validate that trading order exists and belongs to user
    const tradingOrder = await this.tradingOrderRepository.findById(request.tradingOrderId);
    if (!tradingOrder) {
      throw new BadRequestException(`Trading order ${request.tradingOrderId} not found`);
    }

    if (tradingOrder.user_address !== request.userAddress) {
      throw new BadRequestException(`Trading order ${request.tradingOrderId} does not belong to user ${request.userAddress}`);
    }

    // Validate scheduler data
    this.validateSchedulerRequest(request);

    const id = uuidv4();

    const scheduler = await this.schedulerRepository.create({
      id,
      trading_order_id: request.tradingOrderId,
      user_address: request.userAddress,
      trigger_type: request.triggerType,
      scheduled_at: request.scheduledAt || null,
      cron: request.cron || null,
      timezone: request.timezone || 'UTC',
      status: SchedulerStatus.PENDING,
    });

    this.logger.log(`Scheduler created successfully for user: ${request.userAddress}, ID: ${scheduler.id}`);
    this.logger.log(`Scheduler will be processed by execution schedulers for ${request.triggerType}`);

    // Trigger WebSocket update for schedulers
    try {
      await this.tradingWebSocketGateway.refreshSchedulersForAddress(request.userAddress);
    } catch (wsError) {
      this.logger.error('Failed to send WebSocket update:', wsError);
    }

    return {
      id: scheduler.id,
      status: scheduler.status,
      createdAt: scheduler.created_at,
    };
  }

  private validateSchedulerRequest(request: CreateSchedulerRequest): void {
    if (request.triggerType === 'SCHEDULED') {
      if (!request.scheduledAt) {
        throw new BadRequestException('scheduledAt is required for SCHEDULED trigger type');
      }
      if (request.scheduledAt <= new Date()) {
        throw new BadRequestException('scheduledAt must be in the future');
      }
    } else if (request.triggerType === 'CRON') {
      if (!request.cron || request.cron.trim() === '') {
        throw new BadRequestException('cron expression is required for CRON trigger type');
      }
      // Basic cron validation - should have 5 or 6 parts
      const cronParts = request.cron.trim().split(/\s+/);
      if (cronParts.length < 5 || cronParts.length > 6) {
        throw new BadRequestException('Invalid cron expression format');
      }
    } else {
      throw new BadRequestException('triggerType must be either SCHEDULED or CRON');
    }

    if (request.timezone && typeof request.timezone !== 'string') {
      throw new BadRequestException('timezone must be a valid string');
    }
  }
}