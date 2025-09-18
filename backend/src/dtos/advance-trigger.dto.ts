import { AdvanceTriggerType, AdvanceTriggerStatus } from '@/entities/advance-trigger.entity';
import { TriggerDirection } from './executor.dto';

export interface CreateAdvanceTriggerRequest {
  tradingOrderId: string;
  userAddress: string;
  triggerType: AdvanceTriggerType;
  triggerAsset: string;
  triggerValue: number;
  triggerDirection: TriggerDirection;
}

export interface CreateAdvanceTriggerResponse {
  id: string;
  status: AdvanceTriggerStatus;
  createdAt: Date;
}

export interface UpdateAdvanceTriggerRequest {
  status?: AdvanceTriggerStatus;
  triggeredAt?: Date;
  triggeredValue?: number;
}

export interface GetAdvanceTriggerResponse {
  id: string;
  tradingOrderId: string;
  userAddress: string;
  triggerType: AdvanceTriggerType;
  triggerAsset: string;
  triggerValue: number;
  triggerDirection: TriggerDirection;
  status: AdvanceTriggerStatus;
  triggeredAt: Date | null;
  triggeredValue: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CancelAdvanceTriggerRequest {
  userAddress: string;
  triggerId: string;
}

export interface CancelAdvanceTriggerResponse {
  id: string;
  status: AdvanceTriggerStatus;
  updatedAt: Date;
}