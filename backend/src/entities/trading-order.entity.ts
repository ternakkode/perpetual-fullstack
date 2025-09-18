import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ExecutionType } from '@/dtos/executor.dto';
import { Scheduler } from './scheduler.entity';
import { AdvanceTrigger } from './advance-trigger.entity';

export enum TradingOrderStatus {
  PENDING = 'PENDING',
  EXECUTED = 'EXECUTED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED'
}

@Entity('trading_orders')
export class TradingOrder {
  @Column({ type: 'varchar', primary: true })
  id!: string;

  @Column({ type: 'varchar', length: 42 })
  user_address!: string;

  @Column({
    type: 'enum',
    enum: ExecutionType
  })
  execution_type!: ExecutionType;

  @Column({ type: 'varchar', length: 4 })
  perpetual_side!: 'BUY' | 'SELL';

  @Column({ type: 'boolean' })
  is_twap!: boolean;

  @Column({ type: 'varchar', length: 50 })
  asset!: string;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  usdc_size!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  leverage!: number;

  @Column({ type: 'integer', nullable: true })
  twap_running_time!: number | null;

  @Column({ type: 'boolean', nullable: true })
  twap_randomize!: boolean | null;

  @Column({
    type: 'enum',
    enum: TradingOrderStatus,
    default: TradingOrderStatus.PENDING
  })
  status!: TradingOrderStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  external_txn_hash!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  // Relationships
  @OneToMany(() => Scheduler, scheduler => scheduler.tradingOrder)
  schedulers!: Scheduler[];

  @OneToMany(() => AdvanceTrigger, advanceTrigger => advanceTrigger.tradingOrder)
  advanceTriggers!: AdvanceTrigger[];
}