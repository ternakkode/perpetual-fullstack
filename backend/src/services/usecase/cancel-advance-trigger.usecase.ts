import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { AdvanceTriggerRepository } from '@/persistance/repositories/advance-trigger.repository';
import { AdvanceTriggerStatus } from '@/entities/advance-trigger.entity';
import { CancelAdvanceTriggerRequest, CancelAdvanceTriggerResponse } from '@/dtos/advance-trigger.dto';
import { TradingWebSocketGateway } from '@/websocket/trading-websocket.gateway';

@Injectable()
export class CancelAdvanceTriggerUseCase {
  private readonly logger = new Logger(CancelAdvanceTriggerUseCase.name);

  constructor(
    private readonly advanceTriggerRepository: AdvanceTriggerRepository,
    private readonly tradingWebSocketGateway: TradingWebSocketGateway,
  ) {}

  async execute(request: CancelAdvanceTriggerRequest): Promise<CancelAdvanceTriggerResponse> {
    this.logger.log(`Canceling advance trigger: ${request.triggerId} for user: ${request.userAddress}`);

    const advanceTrigger = await this.advanceTriggerRepository.findById(request.triggerId);

    if (!advanceTrigger) {
      throw new NotFoundException(`Advance trigger with ID ${request.triggerId} not found`);
    }

    if (advanceTrigger.user_address !== request.userAddress) {
      throw new NotFoundException(`Advance trigger with ID ${request.triggerId} not found`);
    }

    if (advanceTrigger.status !== AdvanceTriggerStatus.PENDING && 
        advanceTrigger.status !== AdvanceTriggerStatus.ACTIVE) {
      throw new BadRequestException(
        `Cannot cancel advance trigger with status ${advanceTrigger.status}. Only PENDING or ACTIVE triggers can be canceled.`
      );
    }

    const updatedAdvanceTrigger = await this.advanceTriggerRepository.update(
      request.triggerId,
      { status: AdvanceTriggerStatus.CANCELED }
    );

    this.logger.log(`Advance trigger canceled successfully: ${request.triggerId}`);

    // Trigger WebSocket update
    try {
      await this.tradingWebSocketGateway.refreshAdvanceTriggersForAddress(request.userAddress);
    } catch (wsError) {
      this.logger.error('Failed to send WebSocket update:', wsError);
    }

    return {
      id: updatedAdvanceTrigger.id,
      status: updatedAdvanceTrigger.status,
      updatedAt: updatedAdvanceTrigger.updated_at,
    };
  }
}