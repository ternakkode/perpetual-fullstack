import { Injectable } from '@nestjs/common';
import { DataSource, Repository, In } from 'typeorm';
import { AdvanceTrigger, AdvanceTriggerStatus, AdvanceTriggerType } from '@/entities/advance-trigger.entity';
import { TriggerDirection } from '@/dtos/executor.dto';

export interface CreateAdvanceTriggerData {
  id: string;
  trading_order_id: string;
  user_address: string;
  trigger_type: AdvanceTriggerType;
  trigger_asset: string;
  trigger_value: number;
  trigger_direction: TriggerDirection;
  status?: AdvanceTriggerStatus;
}

export interface UpdateAdvanceTriggerData {
  status?: AdvanceTriggerStatus;
  triggered_at?: Date | null;
  triggered_value?: number | null;
}

@Injectable()
export class AdvanceTriggerRepository {
  private repository: Repository<AdvanceTrigger>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(AdvanceTrigger);
  }

  async create(data: CreateAdvanceTriggerData): Promise<AdvanceTrigger> {
    const advanceTrigger = this.repository.create(data);
    return await this.repository.save(advanceTrigger);
  }

  async findById(id: string): Promise<AdvanceTrigger | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByTradingOrderId(tradingOrderId: string): Promise<AdvanceTrigger[]> {
    return await this.repository.find({
      where: { trading_order_id: tradingOrderId },
      order: { created_at: 'DESC' }
    });
  }

  async findByUserAddress(userAddress: string, limit?: number, offset?: number): Promise<AdvanceTrigger[]> {
    const query = this.repository
      .createQueryBuilder('advance_trigger')
      .where('advance_trigger.user_address = :userAddress', { userAddress })
      .orderBy('advance_trigger.created_at', 'DESC');

    if (limit) {
      query.limit(limit);
    }
    
    if (offset) {
      query.offset(offset);
    }

    return await query.getMany();
  }

  async findByUserAddressAndStatus(
    userAddress: string, 
    status: AdvanceTriggerStatus, 
    limit?: number, 
    offset?: number
  ): Promise<AdvanceTrigger[]> {
    const query = this.repository
      .createQueryBuilder('advance_trigger')
      .where('advance_trigger.user_address = :userAddress', { userAddress })
      .andWhere('advance_trigger.status = :status', { status })
      .orderBy('advance_trigger.created_at', 'DESC');

    if (limit) {
      query.limit(limit);
    }
    
    if (offset) {
      query.offset(offset);
    }

    return await query.getMany();
  }

  async findByStatus(status: AdvanceTriggerStatus): Promise<AdvanceTrigger[]> {
    return await this.repository.find({
      where: { status },
      order: { created_at: 'DESC' }
    });
  }

  async findByTriggerType(triggerType: AdvanceTriggerType): Promise<AdvanceTrigger[]> {
    return await this.repository.find({
      where: { trigger_type: triggerType },
      order: { created_at: 'DESC' }
    });
  }

  async findByStatusAndTriggerType(status: AdvanceTriggerStatus, triggerType: AdvanceTriggerType): Promise<AdvanceTrigger[]> {
    return await this.repository.find({
      where: { 
        status,
        trigger_type: triggerType 
      },
      order: { created_at: 'DESC' }
    });
  }

  async findActiveAssetPriceTriggers(): Promise<AdvanceTrigger[]> {
    return await this.repository.find({
      where: {
        trigger_type: AdvanceTriggerType.ASSET_PRICE,
        status: AdvanceTriggerStatus.PENDING
      },
      order: { created_at: 'DESC' }
    });
  }

  async findActiveMarketDataTriggers(): Promise<AdvanceTrigger[]> {
    return await this.repository.find({
      where: {
        trigger_type: In([
          AdvanceTriggerType.VOLUME,
          AdvanceTriggerType.OPEN_INTEREST,
          AdvanceTriggerType.DAY_CHANGE_PERCENTAGE
        ]),
        status: AdvanceTriggerStatus.PENDING
      },
      order: { created_at: 'DESC' }
    });
  }

  async countByUserAddress(userAddress: string): Promise<number> {
    return await this.repository.count({
      where: { user_address: userAddress }
    });
  }

  async countByUserAddressAndStatus(userAddress: string, status: AdvanceTriggerStatus): Promise<number> {
    return await this.repository.count({
      where: { 
        user_address: userAddress,
        status 
      }
    });
  }

  async update(id: string, data: UpdateAdvanceTriggerData): Promise<AdvanceTrigger> {
    await this.repository.update(id, data);
    const updatedAdvanceTrigger = await this.findById(id);
    if (!updatedAdvanceTrigger) {
      throw new Error(`AdvanceTrigger with id ${id} not found after update`);
    }
    return updatedAdvanceTrigger;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByIds(ids: string[]): Promise<AdvanceTrigger[]> {
    return await this.repository.findByIds(ids);
  }

  async findWithTradingOrder(id: string): Promise<AdvanceTrigger | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['tradingOrder']
    });
  }
}