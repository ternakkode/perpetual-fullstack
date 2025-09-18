import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { SchedulerRepository } from '@/persistance/repositories/scheduler.repository';
import { SchedulerStatus } from '@/entities/scheduler.entity';
import { CancelSchedulerRequest, CancelSchedulerResponse } from '@/dtos/scheduler.dto';
import { TradingWebSocketGateway } from '@/websocket/trading-websocket.gateway';

@Injectable()
export class CancelSchedulerUseCase {
  private readonly logger = new Logger(CancelSchedulerUseCase.name);

  constructor(
    private readonly schedulerRepository: SchedulerRepository,
    private readonly tradingWebSocketGateway: TradingWebSocketGateway,
  ) {}

  async execute(request: CancelSchedulerRequest): Promise<CancelSchedulerResponse> {
    this.logger.log(`Canceling scheduler: ${request.schedulerId} for user: ${request.userAddress}`);

    const scheduler = await this.schedulerRepository.findById(request.schedulerId);

    if (!scheduler) {
      throw new NotFoundException(`Scheduler with ID ${request.schedulerId} not found`);
    }

    if (scheduler.user_address !== request.userAddress) {
      throw new NotFoundException(`Scheduler with ID ${request.schedulerId} not found`);
    }

    if (scheduler.status !== SchedulerStatus.PENDING && 
        scheduler.status !== SchedulerStatus.ACTIVE) {
      throw new BadRequestException(
        `Cannot cancel scheduler with status ${scheduler.status}. Only PENDING or ACTIVE schedulers can be canceled.`
      );
    }

    const updatedScheduler = await this.schedulerRepository.update(
      request.schedulerId,
      { status: SchedulerStatus.CANCELED }
    );

    this.logger.log(`Scheduler canceled successfully: ${request.schedulerId}`);

    // Trigger WebSocket update
    try {
      await this.tradingWebSocketGateway.refreshSchedulersForAddress(request.userAddress);
    } catch (wsError) {
      this.logger.error('Failed to send WebSocket update:', wsError);
    }

    return {
      id: updatedScheduler.id,
      status: updatedScheduler.status,
      updatedAt: updatedScheduler.updated_at,
    };
  }
}