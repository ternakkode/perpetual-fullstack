import { SchedulerTriggerType } from '@/entities/scheduler.entity';
import { AdvanceTriggerType } from '@/entities/advance-trigger.entity';
import { ExecutionType, TriggerDirection } from './executor.dto';

// Base trading order details (required for all executions)
export interface TradingOrderDetails {
  executionType: ExecutionType;
  perpetualSide: 'BUY' | 'SELL';
  isTwap: boolean;
  asset: string;
  usdcSize: number;
  leverage: number;
  twapRunningTime?: number;
  twapRandomize?: boolean;
}

// Scheduler trigger configuration
export interface SchedulerTriggerConfig {
  type: 'SCHEDULER';
  triggerType: SchedulerTriggerType;
  scheduledAt?: Date; // Required for SCHEDULED
  cron?: string; // Required for CRON
  timezone?: string;
}

// Advance trigger configuration
export interface AdvanceTriggerConfig {
  type: 'ADVANCE_TRIGGER';
  triggerType: AdvanceTriggerType;
  triggerAsset: string;
  triggerValue: number;
  triggerDirection: TriggerDirection;
}

// Union type for all trigger configurations
export type TriggerConfig = SchedulerTriggerConfig | AdvanceTriggerConfig;

// Main unified request (single API call)
export interface CreateUnifiedExecutionRequest {
  userAddress: string;
  tradingOrder: TradingOrderDetails;
  trigger: TriggerConfig;
}

// Response with all created resources
export interface CreateUnifiedExecutionResponse {
  tradingOrder: {
    id: string;
    status: string;
    createdAt: Date;
  };
  scheduler?: {
    id: string;
    status: string;
    createdAt: Date;
  };
  advanceTrigger?: {
    id: string;
    status: string;
    createdAt: Date;
  };
  message: string;
}

// Get unified executions (parent-child view)
export interface GetUnifiedExecutionsRequest {
  userAddress: string;
  limit?: number;
  offset?: number;
  triggerType?: 'SCHEDULER' | 'ADVANCE_TRIGGER';
}

export interface UnifiedExecutionItem {
  tradingOrder: {
    id: string;
    executionType: ExecutionType;
    perpetualSide: 'BUY' | 'SELL';
    isTwap: boolean;
    asset: string;
    usdcSize: number;
    leverage: number;
    twapRunningTime: number | null;
    twapRandomize: boolean | null;
    status: string;
    externalTxnHash: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  scheduler?: {
    id: string;
    triggerType: SchedulerTriggerType;
    scheduledAt: Date | null;
    cron: string | null;
    timezone: string;
    status: string;
    lastExecutedAt: Date | null;
    nextExecutionAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  advanceTrigger?: {
    id: string;
    triggerType: AdvanceTriggerType;
    triggerAsset: string;
    triggerValue: number;
    triggerDirection: TriggerDirection;
    status: string;
    triggeredAt: Date | null;
    triggeredValue: number | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface GetUnifiedExecutionsResponse {
  executions: UnifiedExecutionItem[];
  total: number;
}

// Cancel unified execution (cancels both parent and child)
export interface CancelUnifiedExecutionRequest {
  userAddress: string;
  tradingOrderId: string; // Parent ID
}

export interface CancelUnifiedExecutionResponse {
  tradingOrderId: string;
  cancelledScheduler?: string;
  cancelledAdvanceTrigger?: string;
  message: string;
}