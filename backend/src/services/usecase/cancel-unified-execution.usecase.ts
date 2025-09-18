import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TradingOrderRepository } from '@/persistance/repositories/trading-order.repository';
import { CancelSchedulerUseCase } from './cancel-scheduler.usecase';
import { CancelAdvanceTriggerUseCase } from './cancel-advance-trigger.usecase';
import { SchedulerRepository } from '@/persistance/repositories/scheduler.repository';
import { AdvanceTriggerRepository } from '@/persistance/repositories/advance-trigger.repository';
import { TradingOrderStatus } from '@/entities/trading-order.entity';
import { 
  CancelUnifiedExecutionRequest, 
  CancelUnifiedExecutionResponse 
} from '@/dtos/execution.dto';
import { TradingWebSocketGateway } from '@/websocket/trading-websocket.gateway';

@Injectable()
export class CancelUnifiedExecutionUseCase {
  private readonly logger = new Logger(CancelUnifiedExecutionUseCase.name);

  constructor(
    private readonly tradingOrderRepository: TradingOrderRepository,
    private readonly cancelSchedulerUseCase: CancelSchedulerUseCase,
    private readonly cancelAdvanceTriggerUseCase: CancelAdvanceTriggerUseCase,
    private readonly schedulerRepository: SchedulerRepository,
    private readonly advanceTriggerRepository: AdvanceTriggerRepository,
    private readonly tradingWebSocketGateway: TradingWebSocketGateway,
  ) {}

  async execute(request: CancelUnifiedExecutionRequest): Promise<CancelUnifiedExecutionResponse> {
    this.logger.log(`Canceling unified execution: ${request.tradingOrderId} for user: ${request.userAddress}`);

    try {
      // Find associated schedulers and advance triggers
      const [schedulers, advanceTriggers] = await Promise.all([
        this.schedulerRepository.findByTradingOrderId(request.tradingOrderId),
        this.advanceTriggerRepository.findByTradingOrderId(request.tradingOrderId)
      ]);

      const results = {
        tradingOrderId: request.tradingOrderId,
        cancelledScheduler: undefined as string | undefined,
        cancelledAdvanceTrigger: undefined as string | undefined,
        message: ''
      };

      const cancelledItems: string[] = [];

      // Cancel associated schedulers
      for (const scheduler of schedulers) {
        if (scheduler.user_address === request.userAddress) {
          try {
            await this.cancelSchedulerUseCase.execute({
              schedulerId: scheduler.id,
              userAddress: request.userAddress,
            });
            results.cancelledScheduler = scheduler.id;
            cancelledItems.push(`scheduler ${scheduler.id}`);
            this.logger.log(`Cancelled scheduler ${scheduler.id} for trading order ${request.tradingOrderId}`);
          } catch (error) {
            this.logger.error(`Failed to cancel scheduler ${scheduler.id}:`, error);
            // Continue with other cancellations
          }
        }
      }

      // Cancel associated advance triggers
      for (const advanceTrigger of advanceTriggers) {
        if (advanceTrigger.user_address === request.userAddress) {
          try {
            await this.cancelAdvanceTriggerUseCase.execute({
              triggerId: advanceTrigger.id,
              userAddress: request.userAddress,
            });
            results.cancelledAdvanceTrigger = advanceTrigger.id;
            cancelledItems.push(`advance trigger ${advanceTrigger.id}`);
            this.logger.log(`Cancelled advance trigger ${advanceTrigger.id} for trading order ${request.tradingOrderId}`);
          } catch (error) {
            this.logger.error(`Failed to cancel advance trigger ${advanceTrigger.id}:`, error);
            // Continue with other cancellations
          }
        }
      }

      // Cancel the trading order last (parent cancellation)
      try {
        // Verify the trading order exists and belongs to the user
        const tradingOrder = await this.tradingOrderRepository.findById(request.tradingOrderId);
        
        if (!tradingOrder) {
          throw new NotFoundException(`Trading order with ID ${request.tradingOrderId} not found`);
        }

        if (tradingOrder.user_address !== request.userAddress) {
          throw new NotFoundException(`Trading order with ID ${request.tradingOrderId} not found`);
        }

        // Update trading order status to canceled
        await this.tradingOrderRepository.update(request.tradingOrderId, {
          status: TradingOrderStatus.CANCELED,
        });

        cancelledItems.push(`trading order ${request.tradingOrderId}`);
        this.logger.log(`Cancelled trading order ${request.tradingOrderId}`);
      } catch (error) {
        this.logger.error(`Failed to cancel trading order ${request.tradingOrderId}:`, error);
        throw error; // This is critical, so we throw
      }

      // Build success message
      if (cancelledItems.length > 0) {
        results.message = `Successfully cancelled: ${cancelledItems.join(', ')}`;
      } else {
        results.message = `Cancelled trading order ${request.tradingOrderId}`;
      }

      this.logger.log(`Unified execution cancellation completed: ${results.message}`);

      // Trigger WebSocket update
      try {
        await this.tradingWebSocketGateway.refreshAllForAddress(request.userAddress);
      } catch (wsError) {
        this.logger.error('Failed to send WebSocket update:', wsError);
      }

      return results;

    } catch (error) {
      this.logger.error(`Failed to cancel unified execution ${request.tradingOrderId} for user ${request.userAddress}:`, error);
      throw error;
    }
  }
}