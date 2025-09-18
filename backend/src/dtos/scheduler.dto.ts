import { SchedulerTriggerType, SchedulerStatus } from '@/entities/scheduler.entity';

export interface CreateSchedulerRequest {
  tradingOrderId: string;
  userAddress: string;
  triggerType: SchedulerTriggerType;
  scheduledAt?: Date;
  cron?: string;
  timezone?: string;
}

export interface CreateSchedulerResponse {
  id: string;
  status: SchedulerStatus;
  createdAt: Date;
}

export interface UpdateSchedulerRequest {
  status?: SchedulerStatus;
  lastExecutedAt?: Date;
  nextExecutionAt?: Date;
}

export interface GetSchedulerResponse {
  id: string;
  tradingOrderId: string;
  userAddress: string;
  triggerType: SchedulerTriggerType;
  scheduledAt: Date | null;
  cron: string | null;
  timezone: string;
  status: SchedulerStatus;
  lastExecutedAt: Date | null;
  nextExecutionAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CancelSchedulerRequest {
  userAddress: string;
  schedulerId: string;
}

export interface CancelSchedulerResponse {
  id: string;
  status: SchedulerStatus;
  updatedAt: Date;
}