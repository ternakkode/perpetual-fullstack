import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TradingOrder, TradingOrderStatus } from '@/entities/trading-order.entity';
import { ExecutionType } from '@/dtos/executor.dto';

export interface CreateTradingOrderData {
  id: string;
  user_address: string;
  execution_type: ExecutionType;
  perpetual_side: 'BUY' | 'SELL';
  is_twap: boolean;
  asset: string;
  usdc_size: number;
  leverage: number;
  twap_running_time?: number | null;
  twap_randomize?: boolean | null;
  status?: TradingOrderStatus;
  external_txn_hash?: string | null;
}

export interface UpdateTradingOrderData {
  status?: TradingOrderStatus;
  external_txn_hash?: string | null;
}

@Injectable()
export class TradingOrderRepository {
  private repository: Repository<TradingOrder>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(TradingOrder);
  }

  async create(data: CreateTradingOrderData): Promise<TradingOrder> {
    const tradingOrder = this.repository.create(data);
    return await this.repository.save(tradingOrder);
  }

  async findById(id: string): Promise<TradingOrder | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByUserAddress(userAddress: string, limit?: number, offset?: number): Promise<TradingOrder[]> {
    const query = this.repository
      .createQueryBuilder('trading_order')
      .where('trading_order.user_address = :userAddress', { userAddress })
      .orderBy('trading_order.created_at', 'DESC');

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
    status: TradingOrderStatus, 
    limit?: number, 
    offset?: number
  ): Promise<TradingOrder[]> {
    const query = this.repository
      .createQueryBuilder('trading_order')
      .where('trading_order.user_address = :userAddress', { userAddress })
      .andWhere('trading_order.status = :status', { status })
      .orderBy('trading_order.created_at', 'DESC');

    if (limit) {
      query.limit(limit);
    }
    
    if (offset) {
      query.offset(offset);
    }

    return await query.getMany();
  }

  async findByStatus(status: TradingOrderStatus): Promise<TradingOrder[]> {
    return await this.repository.find({
      where: { status },
      order: { created_at: 'DESC' }
    });
  }

  async countByUserAddress(userAddress: string): Promise<number> {
    return await this.repository.count({
      where: { user_address: userAddress }
    });
  }

  async countByUserAddressAndStatus(userAddress: string, status: TradingOrderStatus): Promise<number> {
    return await this.repository.count({
      where: { 
        user_address: userAddress,
        status 
      }
    });
  }

  async update(id: string, data: UpdateTradingOrderData): Promise<TradingOrder> {
    await this.repository.update(id, data);
    const updatedTradingOrder = await this.findById(id);
    if (!updatedTradingOrder) {
      throw new Error(`TradingOrder with id ${id} not found after update`);
    }
    return updatedTradingOrder;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByIds(ids: string[]): Promise<TradingOrder[]> {
    return await this.repository.findByIds(ids);
  }

  async findWithRelations(id: string): Promise<TradingOrder | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['schedulers', 'advanceTriggers']
    });
  }
}