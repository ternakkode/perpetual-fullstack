import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRepository } from '@/persistance/repositories/scheduler.repository';
import { TradingOrderRepository } from '@/persistance/repositories/trading-order.repository';
import { SchedulerStatus } from '@/entities/scheduler.entity';
import { TradingOrderStatus } from '@/entities/trading-order.entity';
import { ExecuteOrderUseCase } from './execute-order.usecase';
import { TradingWebSocketGateway } from '@/websocket/trading-websocket.gateway';
import { ScheduledJobData } from '../scheduler.service';

@Injectable()
export class ScheduledExecutorUseCase {
  private readonly logger = new Logger(ScheduledExecutorUseCase.name);

  constructor(
    private readonly schedulerRepository: SchedulerRepository,
    private readonly tradingOrderRepository: TradingOrderRepository,
    private readonly executeOrderUseCase: ExecuteOrderUseCase,
    private readonly tradingWebSocketGateway: TradingWebSocketGateway,
  ) {}

  async execute(jobData: ScheduledJobData): Promise<void> {
    const { schedulerId, userAddress } = jobData;
    
    this.logger.log(`Processing scheduled execution ${schedulerId} for user ${userAddress}`);

    try {
      // Fetch the scheduler with its trading order from database
      const scheduler = await this.schedulerRepository.findWithTradingOrder(schedulerId);
      
      if (!scheduler) {
        this.logger.error(`Scheduler ${schedulerId} not found`);
        return;
      }

      // Check if the scheduler is still in PENDING status
      if (scheduler.status !== SchedulerStatus.PENDING) {
        this.logger.warn(`Scheduler ${schedulerId} is not in PENDING status (current: ${scheduler.status}). Skipping execution.`);
        return;
      }

      // Verify the user address matches
      if (scheduler.user_address !== userAddress) {
        this.logger.error(`User address mismatch for scheduler ${schedulerId}. Expected: ${userAddress}, Found: ${scheduler.user_address}`);
        return;
      }

      // Get the associated trading order
      const tradingOrder = scheduler.tradingOrder || 
        await this.tradingOrderRepository.findById(scheduler.trading_order_id);

      if (!tradingOrder) {
        this.logger.error(`Trading order ${scheduler.trading_order_id} not found for scheduler ${schedulerId}`);
        await this.schedulerRepository.update(schedulerId, {
          status: SchedulerStatus.FAILED,
        });
        return;
      }

      // Check if trading order is in valid state for execution
      if (tradingOrder.status !== TradingOrderStatus.PENDING) {
        this.logger.warn(`Trading order ${tradingOrder.id} is not in PENDING status (current: ${tradingOrder.status}). Marking scheduler as completed.`);
        await this.schedulerRepository.update(schedulerId, {
          status: SchedulerStatus.COMPLETED,
        });
        return;
      }

      this.logger.log(`Executing scheduled order for scheduler ${schedulerId}`);

      // Execute the order
      const scheduledAt = new Date();
      const result = await this.executeOrderUseCase.execute({ 
        scheduler: scheduler,
        tradingOrder: tradingOrder,
        scheduledAt: scheduledAt
      });

      if (result.success) {
        this.logger.log(`Scheduled execution ${schedulerId} executed successfully with txn hash: ${result.externalTxnHash}`);
        
        // Mark scheduler as completed (one-time execution)
        await this.schedulerRepository.update(schedulerId, {
          status: SchedulerStatus.COMPLETED,
          last_executed_at: scheduledAt,
        });
      } else {
        this.logger.error(`Scheduled execution ${schedulerId} failed: ${result.error}`);
        // The execute order usecase already updates the statuses to FAILED
      }

      // Trigger WebSocket updates
      try {
        await this.tradingWebSocketGateway.refreshSchedulersForAddress(userAddress);
      } catch (wsError) {
        this.logger.error('Failed to send WebSocket update:', wsError);
      }

    } catch (error) {
      this.logger.error(`Failed to process scheduled execution ${schedulerId}:`, error);
      
      // Mark as failed if we can
      try {
        await this.schedulerRepository.update(schedulerId, {
          status: SchedulerStatus.FAILED,
        });
        
        // Trigger WebSocket update
        await this.tradingWebSocketGateway.refreshSchedulersForAddress(userAddress);
      } catch (updateError) {
        this.logger.error(`Failed to update scheduler ${schedulerId} status to FAILED:`, updateError);
      }

      throw error;
    }
  }
}