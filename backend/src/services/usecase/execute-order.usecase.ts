import { Injectable, Logger } from '@nestjs/common';
import { AdvanceTriggerRepository } from '@/persistance/repositories/advance-trigger.repository';
import { SchedulerRepository } from '@/persistance/repositories/scheduler.repository';
import { TradingOrderRepository } from '@/persistance/repositories/trading-order.repository';
import { AdvanceTrigger, AdvanceTriggerStatus } from '@/entities/advance-trigger.entity';
import { Scheduler, SchedulerStatus } from '@/entities/scheduler.entity';
import { TradingOrder, TradingOrderStatus } from '@/entities/trading-order.entity';
import { ExecutionType } from '@/dtos/executor.dto';
import { MarketOrderUseCase } from './market-order.usecase';
import { TwapOrderUseCase } from './twap-order.usecase';
import { SetLeverageUseCase } from './set-leverage.usecase';
import { TradingWebSocketGateway } from '@/websocket/trading-websocket.gateway';
import { TradeSide } from '@/dtos/order.dto';

export interface ExecuteOrderFromAdvanceTriggerRequest {
  advanceTrigger: AdvanceTrigger;
  tradingOrder: TradingOrder;
  triggeredValue: number;
}

export interface ExecuteOrderFromSchedulerRequest {
  scheduler: Scheduler;
  tradingOrder: TradingOrder;
  scheduledAt: Date;
}

export type ExecuteOrderRequest = ExecuteOrderFromAdvanceTriggerRequest | ExecuteOrderFromSchedulerRequest;

export interface ExecuteOrderResponse {
  success: boolean;
  externalTxnHash?: string;
  error?: string;
}

@Injectable()
export class ExecuteOrderUseCase {
  private readonly logger = new Logger(ExecuteOrderUseCase.name);

  constructor(
    private readonly advanceTriggerRepository: AdvanceTriggerRepository,
    private readonly schedulerRepository: SchedulerRepository,
    private readonly tradingOrderRepository: TradingOrderRepository,
    private readonly marketOrderUseCase: MarketOrderUseCase,
    private readonly twapOrderUseCase: TwapOrderUseCase,
    private readonly setLeverageUseCase: SetLeverageUseCase,
    private readonly tradingWebSocketGateway: TradingWebSocketGateway,
  ) {}

  async execute(request: ExecuteOrderRequest): Promise<ExecuteOrderResponse> {
    // Type guard to determine if this is an advance trigger or scheduler request
    const isAdvanceTriggerRequest = (req: ExecuteOrderRequest): req is ExecuteOrderFromAdvanceTriggerRequest => {
      return 'advanceTrigger' in req;
    };

    const isSchedulerRequest = (req: ExecuteOrderRequest): req is ExecuteOrderFromSchedulerRequest => {
      return 'scheduler' in req;
    };

    let tradingOrder: TradingOrder;
    
    if (isAdvanceTriggerRequest(request)) {
      tradingOrder = request.tradingOrder;
      this.logger.log(`Executing order for advance trigger ${request.advanceTrigger.id} with trading order ${tradingOrder.id}`);
    } else if (isSchedulerRequest(request)) {
      tradingOrder = request.tradingOrder;
      this.logger.log(`Executing order for scheduler ${request.scheduler.id} with trading order ${tradingOrder.id}`);
    } else {
      throw new Error('Invalid request type');
    }
    
    try {
      // Set leverage for perpetual orders
      if (tradingOrder.execution_type === ExecutionType.PERPETUAL) {
        await this.setLeverageUseCase.execute(tradingOrder.user_address, {
          asset: tradingOrder.asset,
          leverage: tradingOrder.leverage,
          isCross: true
        });
      }

      let result: any;

      // Handle TWAP orders
      if (tradingOrder.is_twap === true) {
        result = await this.twapOrderUseCase.execute(tradingOrder.user_address, {
          asset: tradingOrder.asset,
          side: tradingOrder.perpetual_side === "BUY" ? TradeSide.BUY : TradeSide.SELL,
          size: tradingOrder.usdc_size,
          twapRunningTime: tradingOrder.twap_running_time!,
          twapRandomize: tradingOrder.twap_randomize!,
          reduceOnly: false
        });
      } else {
        // Regular market order (for both perpetual and spot)
        result = await this.marketOrderUseCase.execute(tradingOrder.user_address, {
          asset: tradingOrder.asset,
          side: tradingOrder.perpetual_side === "BUY" ? TradeSide.BUY : TradeSide.SELL,
          size: tradingOrder.usdc_size,
          reduceOnly: false,
          tpSl: undefined,
          isSpot: tradingOrder.execution_type === ExecutionType.SPOT
        });
      }

      if (result.success) {
        // Handle success for different trigger types
        if (isAdvanceTriggerRequest(request)) {
          // Update advance trigger as triggered
          await this.advanceTriggerRepository.update(request.advanceTrigger.id, {
            status: AdvanceTriggerStatus.TRIGGERED,
            triggered_at: new Date(),
            triggered_value: request.triggeredValue,
          });
        } else if (isSchedulerRequest(request)) {
          // Update scheduler as executed (keep active for cron jobs)
          await this.schedulerRepository.update(request.scheduler.id, {
            last_executed_at: request.scheduledAt,
          });
        }

        // Update trading order as executed
        await this.tradingOrderRepository.update(tradingOrder.id, {
          status: TradingOrderStatus.EXECUTED,
          external_txn_hash: result.externalTxnHash
        });

        // Trigger WebSocket update based on trigger type
        try {
          if (isAdvanceTriggerRequest(request)) {
            await this.tradingWebSocketGateway.refreshAdvanceTriggersForAddress(tradingOrder.user_address);
          } else if (isSchedulerRequest(request)) {
            await this.tradingWebSocketGateway.refreshSchedulersForAddress(tradingOrder.user_address);
          }
        } catch (wsError) {
          this.logger.error('Failed to send WebSocket update:', wsError);
        }

        return { success: true, externalTxnHash: result.externalTxnHash };
      } else {
        // Handle failure for different trigger types
        if (isAdvanceTriggerRequest(request)) {
          // Update advance trigger as failed
          await this.advanceTriggerRepository.update(request.advanceTrigger.id, {
            status: AdvanceTriggerStatus.FAILED,
          });
        } else if (isSchedulerRequest(request)) {
          // Update scheduler as failed
          await this.schedulerRepository.update(request.scheduler.id, {
            status: SchedulerStatus.FAILED,
          });
        }

        // Update trading order as failed
        await this.tradingOrderRepository.update(tradingOrder.id, {
          status: TradingOrderStatus.FAILED,
        });

        // Trigger WebSocket update based on trigger type
        try {
          if (isAdvanceTriggerRequest(request)) {
            await this.tradingWebSocketGateway.refreshAdvanceTriggersForAddress(tradingOrder.user_address);
          } else if (isSchedulerRequest(request)) {
            await this.tradingWebSocketGateway.refreshSchedulersForAddress(tradingOrder.user_address);
          }
        } catch (wsError) {
          this.logger.error('Failed to send WebSocket update:', wsError);
        }

        return { success: false, error: result.error || 'Order execution failed' };
      }
    } catch (error) {
      const errorMessage = isAdvanceTriggerRequest(request) 
        ? `Failed to execute order for advance trigger ${request.advanceTrigger.id}:`
        : `Failed to execute order for scheduler ${(request as ExecuteOrderFromSchedulerRequest).scheduler.id}:`;
      
      this.logger.error(errorMessage, error);
      
      // Handle failure for different trigger types
      if (isAdvanceTriggerRequest(request)) {
        await this.advanceTriggerRepository.update(request.advanceTrigger.id, {
          status: AdvanceTriggerStatus.FAILED,
        });
      } else if (isSchedulerRequest(request)) {
        await this.schedulerRepository.update(request.scheduler.id, {
          status: SchedulerStatus.FAILED,
        });
      }

      // Update trading order as failed
      await this.tradingOrderRepository.update(tradingOrder.id, {
        status: TradingOrderStatus.FAILED,
      });

      // Trigger WebSocket update based on trigger type
      try {
        if (isAdvanceTriggerRequest(request)) {
          await this.tradingWebSocketGateway.refreshAdvanceTriggersForAddress(tradingOrder.user_address);
        } else if (isSchedulerRequest(request)) {
          await this.tradingWebSocketGateway.refreshSchedulersForAddress(tradingOrder.user_address);
        }
      } catch (wsError) {
        this.logger.error('Failed to send WebSocket update:', wsError);
      }

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}