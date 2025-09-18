import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TradingOrder } from './trading-order.entity';

export enum SchedulerTriggerType {
  SCHEDULED = 'SCHEDULED',
  CRON = 'CRON'
}

export enum SchedulerStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED'
}

@Entity('schedulers')
export class Scheduler {
  @Column({ type: 'varchar', primary: true })
  id!: string;

  @Column({ type: 'varchar' })
  trading_order_id!: string;

  @Column({ type: 'varchar', length: 42 })
  user_address!: string;

  @Column({
    type: 'enum',
    enum: SchedulerTriggerType
  })
  trigger_type!: SchedulerTriggerType;

  @Column({ type: 'timestamptz', nullable: true })
  scheduled_at!: Date | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cron!: string | null;

  @Column({ type: 'varchar', length: 50, default: 'UTC' })
  timezone!: string;

  @Column({
    type: 'enum',
    enum: SchedulerStatus,
    default: SchedulerStatus.PENDING
  })
  status!: SchedulerStatus;

  @Column({ type: 'timestamptz', nullable: true })
  last_executed_at!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  next_execution_at!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  // Relationships
  @ManyToOne(() => TradingOrder, tradingOrder => tradingOrder.schedulers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trading_order_id' })
  tradingOrder!: TradingOrder;
}