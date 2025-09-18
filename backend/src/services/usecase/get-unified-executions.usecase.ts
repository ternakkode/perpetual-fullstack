import { Injectable, Logger } from '@nestjs/common';
import { TradingOrderRepository } from '@/persistance/repositories/trading-order.repository';
import { SchedulerRepository } from '@/persistance/repositories/scheduler.repository';
import { AdvanceTriggerRepository } from '@/persistance/repositories/advance-trigger.repository';
import { 
  GetUnifiedExecutionsRequest, 
  GetUnifiedExecutionsResponse,
  UnifiedExecutionItem 
} from '@/dtos/execution.dto';

@Injectable()
export class GetUnifiedExecutionsUseCase {
  private readonly logger = new Logger(GetUnifiedExecutionsUseCase.name);

  constructor(
    private readonly tradingOrderRepository: TradingOrderRepository,
    private readonly schedulerRepository: SchedulerRepository,
    private readonly advanceTriggerRepository: AdvanceTriggerRepository,
  ) {}

  async execute(request: GetUnifiedExecutionsRequest): Promise<GetUnifiedExecutionsResponse> {
    this.logger.log(`Getting unified executions for user: ${request.userAddress}, triggerType: ${request.triggerType || 'all'}`);

    // Get all trading orders for the user
    const tradingOrders = await this.tradingOrderRepository.findByUserAddress(
      request.userAddress,
      request.limit,
      request.offset
    );

    const total = await this.tradingOrderRepository.countByUserAddress(request.userAddress);

    if (tradingOrders.length === 0) {
      return { executions: [], total: 0 };
    }

    const tradingOrderIds = tradingOrders.map(order => order.id);

    // Get all schedulers and advance triggers for these trading orders in parallel
    const [schedulers, advanceTriggers] = await Promise.all([
      this.getSchedulersForTradingOrders(tradingOrderIds),
      this.getAdvanceTriggersForTradingOrders(tradingOrderIds)
    ]);

    // Create lookup maps for efficient joining
    const schedulersByTradingOrderId = new Map();
    schedulers.forEach(scheduler => {
      schedulersByTradingOrderId.set(scheduler.trading_order_id, scheduler);
    });

    const advanceTriggersByTradingOrderId = new Map();
    advanceTriggers.forEach(trigger => {
      advanceTriggersByTradingOrderId.set(trigger.trading_order_id, trigger);
    });

    // Build unified execution items
    const executions: UnifiedExecutionItem[] = [];

    for (const tradingOrder of tradingOrders) {
      const scheduler = schedulersByTradingOrderId.get(tradingOrder.id);
      const advanceTrigger = advanceTriggersByTradingOrderId.get(tradingOrder.id);

      // Apply filter if specified
      if (request.triggerType) {
        if (request.triggerType === 'SCHEDULER' && !scheduler) continue;
        if (request.triggerType === 'ADVANCE_TRIGGER' && !advanceTrigger) continue;
      }

      const unifiedItem: UnifiedExecutionItem = {
        tradingOrder: {
          id: tradingOrder.id,
          executionType: tradingOrder.execution_type,
          perpetualSide: tradingOrder.perpetual_side,
          isTwap: tradingOrder.is_twap,
          asset: tradingOrder.asset,
          usdcSize: tradingOrder.usdc_size,
          leverage: tradingOrder.leverage,
          twapRunningTime: tradingOrder.twap_running_time,
          twapRandomize: tradingOrder.twap_randomize,
          status: tradingOrder.status,
          externalTxnHash: tradingOrder.external_txn_hash,
          createdAt: tradingOrder.created_at,
          updatedAt: tradingOrder.updated_at,
        }
      };

      // Add scheduler if exists
      if (scheduler) {
        unifiedItem.scheduler = {
          id: scheduler.id,
          triggerType: scheduler.trigger_type,
          scheduledAt: scheduler.scheduled_at,
          cron: scheduler.cron,
          timezone: scheduler.timezone,
          status: scheduler.status,
          lastExecutedAt: scheduler.last_executed_at,
          nextExecutionAt: scheduler.next_execution_at,
          createdAt: scheduler.created_at,
          updatedAt: scheduler.updated_at,
        };
      }

      // Add advance trigger if exists
      if (advanceTrigger) {
        unifiedItem.advanceTrigger = {
          id: advanceTrigger.id,
          triggerType: advanceTrigger.trigger_type,
          triggerAsset: advanceTrigger.trigger_asset,
          triggerValue: advanceTrigger.trigger_value,
          triggerDirection: advanceTrigger.trigger_direction,
          status: advanceTrigger.status,
          triggeredAt: advanceTrigger.triggered_at,
          triggeredValue: advanceTrigger.triggered_value,
          createdAt: advanceTrigger.created_at,
          updatedAt: advanceTrigger.updated_at,
        };
      }

      executions.push(unifiedItem);
    }

    this.logger.log(`Found ${executions.length} unified executions for user: ${request.userAddress}`);

    return {
      executions,
      total: executions.length, // Use actual filtered count
    };
  }

  private async getSchedulersForTradingOrders(tradingOrderIds: string[]) {
    if (tradingOrderIds.length === 0) return [];

    // Get schedulers for multiple trading orders
    const schedulers = [];
    for (const tradingOrderId of tradingOrderIds) {
      const orderSchedulers = await this.schedulerRepository.findByTradingOrderId(tradingOrderId);
      schedulers.push(...orderSchedulers);
    }
    return schedulers;
  }

  private async getAdvanceTriggersForTradingOrders(tradingOrderIds: string[]) {
    if (tradingOrderIds.length === 0) return [];

    // Get advance triggers for multiple trading orders
    const triggers = [];
    for (const tradingOrderId of tradingOrderIds) {
      const orderTriggers = await this.advanceTriggerRepository.findByTradingOrderId(tradingOrderId);
      triggers.push(...orderTriggers);
    }
    return triggers;
  }
}