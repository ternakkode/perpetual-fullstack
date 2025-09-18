import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRepository } from '@/persistance/repositories/scheduler.repository';
import { TradingOrderRepository } from '@/persistance/repositories/trading-order.repository';
import { SchedulerStatus } from '@/entities/scheduler.entity';
import { TradingOrderStatus } from '@/entities/trading-order.entity';
import { ExecuteOrderUseCase } from './execute-order.usecase';
import { TradingWebSocketGateway } from '@/websocket/trading-websocket.gateway';
import { CronJobData, SchedulerService } from '../scheduler.service';

@Injectable()
export class CronExecutionUseCase {
  private readonly logger = new Logger(CronExecutionUseCase.name);

  constructor(
    private readonly schedulerRepository: SchedulerRepository,
    private readonly tradingOrderRepository: TradingOrderRepository,
    private readonly executeOrderUseCase: ExecuteOrderUseCase,
    private readonly schedulerService: SchedulerService,
    private readonly tradingWebSocketGateway: TradingWebSocketGateway,
  ) {}

  async execute(jobData: CronJobData): Promise<void> {
    const { schedulerId, userAddress, cronExpression } = jobData;
    
    this.logger.log(`Processing cron execution ${schedulerId} for user ${userAddress} with pattern: ${cronExpression}`);

    try {
      // Fetch the scheduler from database
      const scheduler = await this.schedulerRepository.findWithTradingOrder(schedulerId);
      
      if (!scheduler) {
        this.logger.error(`Scheduler ${schedulerId} not found`);
        // Stop the cron job since scheduler doesn't exist
        await this.schedulerService.stopCronJob(schedulerId);
        return;
      }

      // Check if the scheduler status allows execution
      if (scheduler.status === SchedulerStatus.CANCELED) {
        this.logger.warn(`Scheduler ${schedulerId} is CANCELED. Stopping cron job.`);
        await this.schedulerService.stopCronJob(schedulerId);
        return;
      }

      if (scheduler.status === SchedulerStatus.FAILED) {
        this.logger.warn(`Scheduler ${schedulerId} is FAILED. Stopping cron job.`);
        await this.schedulerService.stopCronJob(schedulerId);
        return;
      }

      // Verify the user address matches
      if (scheduler.user_address !== userAddress) {
        this.logger.error(`User address mismatch for scheduler ${schedulerId}. Expected: ${userAddress}, Found: ${scheduler.user_address}`);
        await this.schedulerService.stopCronJob(schedulerId);
        return;
      }

      // Get the associated trading order
      const tradingOrder = scheduler.tradingOrder || 
        await this.tradingOrderRepository.findById(scheduler.trading_order_id);

      if (!tradingOrder) {
        this.logger.error(`Trading order ${scheduler.trading_order_id} not found for scheduler ${schedulerId}`);
        await this.schedulerService.stopCronJob(schedulerId);
        await this.schedulerRepository.update(schedulerId, {
          status: SchedulerStatus.FAILED,
        });
        return;
      }

      // For cron jobs, we check if trading order is still pending or if it's executed but cron should continue
      // The business logic determines whether cron jobs should create new executions or reuse the same trading order
      if (tradingOrder.status === TradingOrderStatus.FAILED || 
          tradingOrder.status === TradingOrderStatus.CANCELED) {
        this.logger.warn(`Trading order ${tradingOrder.id} is in terminal state (${tradingOrder.status}). Stopping cron job.`);
        await this.schedulerService.stopCronJob(schedulerId);
        await this.schedulerRepository.update(schedulerId, {
          status: SchedulerStatus.COMPLETED,
        });
        return;
      }

      // Update last execution time
      const currentTime = new Date();
      await this.schedulerRepository.update(schedulerId, {
        last_executed_at: currentTime,
      });

      this.logger.log(`Executing cron order for scheduler ${schedulerId}`);

      try {
        // Execute the order using the new scheduler-based approach
        const result = await this.executeOrderUseCase.execute({ 
          scheduler: scheduler,
          tradingOrder: tradingOrder,
          scheduledAt: currentTime
        });

        if (result.success) {
          this.logger.log(`Cron execution ${schedulerId} executed successfully with txn hash: ${result.externalTxnHash}`);
          
          // For cron jobs, keep the scheduler active for next execution
          // The trading order might be executed, but the cron should continue
          
        } else {
          this.logger.error(`Cron execution ${schedulerId} failed: ${result.error}`);
          
          // On failure, you might want to stop the cron or keep it running based on business logic
          // For now, we'll stop it on failure
          await this.schedulerService.stopCronJob(schedulerId);
          
          await this.schedulerRepository.update(schedulerId, {
            status: SchedulerStatus.FAILED,
          });
          
          this.logger.log(`Stopped cron job for scheduler ${schedulerId} due to execution failure`);
        }

      } catch (executionError) {
        // If order execution fails, stop the cron job
        this.logger.error(`Order execution failed for cron scheduler ${schedulerId}:`, executionError);
        
        await this.schedulerService.stopCronJob(schedulerId);
        
        await this.schedulerRepository.update(schedulerId, {
          status: SchedulerStatus.FAILED,
        });

        this.logger.log(`Stopped cron job for scheduler ${schedulerId} due to execution error`);
        throw executionError;
      }

      // Trigger WebSocket updates
      try {
        await this.tradingWebSocketGateway.refreshAllForAddress(userAddress);
      } catch (wsError) {
        this.logger.error('Failed to send WebSocket update:', wsError);
      }

    } catch (error) {
      this.logger.error(`Failed to process cron execution ${schedulerId}:`, error);
      
      // Mark as failed and stop cron job on any unexpected error
      try {
        await this.schedulerService.stopCronJob(schedulerId);
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