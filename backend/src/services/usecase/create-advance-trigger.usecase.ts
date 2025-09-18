import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { AdvanceTriggerRepository } from '@/persistance/repositories/advance-trigger.repository';
import { TradingOrderRepository } from '@/persistance/repositories/trading-order.repository';
import { AdvanceTriggerStatus } from '@/entities/advance-trigger.entity';
import { CreateAdvanceTriggerRequest, CreateAdvanceTriggerResponse } from '@/dtos/advance-trigger.dto';
import { TradingWebSocketGateway } from '@/websocket/trading-websocket.gateway';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateAdvanceTriggerUseCase {
  private readonly logger = new Logger(CreateAdvanceTriggerUseCase.name);

  constructor(
    private readonly advanceTriggerRepository: AdvanceTriggerRepository,
    private readonly tradingOrderRepository: TradingOrderRepository,
    private readonly tradingWebSocketGateway: TradingWebSocketGateway,
  ) {}

  async execute(request: CreateAdvanceTriggerRequest): Promise<CreateAdvanceTriggerResponse> {
    this.logger.log(`Creating advance trigger for user: ${request.userAddress}, type: ${request.triggerType}`);

    // Validate that trading order exists and belongs to user
    const tradingOrder = await this.tradingOrderRepository.findById(request.tradingOrderId);
    if (!tradingOrder) {
      throw new BadRequestException(`Trading order ${request.tradingOrderId} not found`);
    }

    if (tradingOrder.user_address !== request.userAddress) {
      throw new BadRequestException(`Trading order ${request.tradingOrderId} does not belong to user ${request.userAddress}`);
    }

    // Validate advance trigger data
    this.validateAdvanceTriggerRequest(request);

    const id = uuidv4();

    const advanceTrigger = await this.advanceTriggerRepository.create({
      id,
      trading_order_id: request.tradingOrderId,
      user_address: request.userAddress,
      trigger_type: request.triggerType,
      trigger_asset: request.triggerAsset,
      trigger_value: request.triggerValue,
      trigger_direction: request.triggerDirection,
      status: AdvanceTriggerStatus.PENDING,
    });

    this.logger.log(`Advance trigger created successfully for user: ${request.userAddress}, ID: ${advanceTrigger.id}`);
    this.logger.log(`Advance trigger will be processed by market data schedulers for ${request.triggerType}`);

    // Trigger WebSocket update for advance triggers
    try {
      await this.tradingWebSocketGateway.refreshAdvanceTriggersForAddress(request.userAddress);
    } catch (wsError) {
      this.logger.error('Failed to send WebSocket update:', wsError);
    }

    return {
      id: advanceTrigger.id,
      status: advanceTrigger.status,
      createdAt: advanceTrigger.created_at,
    };
  }

  private validateAdvanceTriggerRequest(request: CreateAdvanceTriggerRequest): void {
    if (!request.triggerAsset || request.triggerAsset.trim() === '') {
      throw new BadRequestException('triggerAsset is required for advance triggers');
    }

    if (request.triggerValue <= 0) {
      throw new BadRequestException('triggerValue must be greater than 0');
    }

    if (!request.triggerDirection) {
      throw new BadRequestException('triggerDirection is required');
    }

    // Validate trigger type specific requirements
    if (!['ASSET_PRICE', 'VOLUME', 'OPEN_INTEREST', 'DAY_CHANGE_PERCENTAGE'].includes(request.triggerType)) {
      throw new BadRequestException('Invalid triggerType. Must be ASSET_PRICE, VOLUME, OPEN_INTEREST, or DAY_CHANGE_PERCENTAGE');
    }
  }
}