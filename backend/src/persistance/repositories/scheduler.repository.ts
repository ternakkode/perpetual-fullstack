import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Scheduler, SchedulerStatus, SchedulerTriggerType } from '@/entities/scheduler.entity';

export interface CreateSchedulerData {
  id: string;
  trading_order_id: string;
  user_address: string;
  trigger_type: SchedulerTriggerType;
  scheduled_at?: Date | null;
  cron?: string | null;
  timezone?: string;
  status?: SchedulerStatus;
  last_executed_at?: Date | null;
  next_execution_at?: Date | null;
}

export interface UpdateSchedulerData {
  status?: SchedulerStatus;
  last_executed_at?: Date | null;
  next_execution_at?: Date | null;
  scheduled_at?: Date | null;
  cron?: string | null;
  timezone?: string;
}

@Injectable()
export class SchedulerRepository {
  private repository: Repository<Scheduler>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Scheduler);
  }

  async create(data: CreateSchedulerData): Promise<Scheduler> {
    const scheduler = this.repository.create(data);
    return await this.repository.save(scheduler);
  }

  async findById(id: string): Promise<Scheduler | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByTradingOrderId(tradingOrderId: string): Promise<Scheduler[]> {
    return await this.repository.find({
      where: { trading_order_id: tradingOrderId },
      order: { created_at: 'DESC' }
    });
  }

  async findByUserAddress(userAddress: string, limit?: number, offset?: number): Promise<Scheduler[]> {
    const query = this.repository
      .createQueryBuilder('scheduler')
      .where('scheduler.user_address = :userAddress', { userAddress })
      .orderBy('scheduler.created_at', 'DESC');

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
    status: SchedulerStatus, 
    limit?: number, 
    offset?: number
  ): Promise<Scheduler[]> {
    const query = this.repository
      .createQueryBuilder('scheduler')
      .where('scheduler.user_address = :userAddress', { userAddress })
      .andWhere('scheduler.status = :status', { status })
      .orderBy('scheduler.created_at', 'DESC');

    if (limit) {
      query.limit(limit);
    }
    
    if (offset) {
      query.offset(offset);
    }

    return await query.getMany();
  }

  async findByStatus(status: SchedulerStatus): Promise<Scheduler[]> {
    return await this.repository.find({
      where: { status },
      order: { created_at: 'DESC' }
    });
  }

  async findByTriggerType(triggerType: SchedulerTriggerType): Promise<Scheduler[]> {
    return await this.repository.find({
      where: { trigger_type: triggerType },
      order: { created_at: 'DESC' }
    });
  }

  async findByStatusAndTriggerType(status: SchedulerStatus, triggerType: SchedulerTriggerType): Promise<Scheduler[]> {
    return await this.repository.find({
      where: { 
        status,
        trigger_type: triggerType 
      },
      order: { created_at: 'DESC' }
    });
  }

  async findScheduledJobs(): Promise<Scheduler[]> {
    return await this.repository.find({
      where: {
        trigger_type: SchedulerTriggerType.SCHEDULED,
        status: SchedulerStatus.PENDING
      },
      order: { scheduled_at: 'ASC' }
    });
  }

  async findActiveCronJobs(): Promise<Scheduler[]> {
    return await this.repository.find({
      where: {
        trigger_type: SchedulerTriggerType.CRON,
        status: SchedulerStatus.ACTIVE
      },
      order: { created_at: 'DESC' }
    });
  }

  async findDueScheduledJobs(currentTime: Date): Promise<Scheduler[]> {
    return await this.repository
      .createQueryBuilder('scheduler')
      .where('scheduler.trigger_type = :triggerType', { triggerType: SchedulerTriggerType.SCHEDULED })
      .andWhere('scheduler.status = :status', { status: SchedulerStatus.PENDING })
      .andWhere('scheduler.scheduled_at <= :currentTime', { currentTime })
      .orderBy('scheduler.scheduled_at', 'ASC')
      .getMany();
  }

  async countByUserAddress(userAddress: string): Promise<number> {
    return await this.repository.count({
      where: { user_address: userAddress }
    });
  }

  async countByUserAddressAndStatus(userAddress: string, status: SchedulerStatus): Promise<number> {
    return await this.repository.count({
      where: { 
        user_address: userAddress,
        status 
      }
    });
  }

  async update(id: string, data: UpdateSchedulerData): Promise<Scheduler> {
    await this.repository.update(id, data);
    const updatedScheduler = await this.findById(id);
    if (!updatedScheduler) {
      throw new Error(`Scheduler with id ${id} not found after update`);
    }
    return updatedScheduler;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByIds(ids: string[]): Promise<Scheduler[]> {
    return await this.repository.findByIds(ids);
  }

  async findWithTradingOrder(id: string): Promise<Scheduler | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['tradingOrder']
    });
  }
}