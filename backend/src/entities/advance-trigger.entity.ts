import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TriggerDirection } from '@/dtos/executor.dto';
import { TradingOrder } from './trading-order.entity';

export enum AdvanceTriggerType {
  ASSET_PRICE = 'ASSET_PRICE',
  VOLUME = 'VOLUME',
  OPEN_INTEREST = 'OPEN_INTEREST',
  DAY_CHANGE_PERCENTAGE = 'DAY_CHANGE_PERCENTAGE'
}

export enum AdvanceTriggerStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  TRIGGERED = 'TRIGGERED',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED'
}

@Entity('advance_triggers')
export class AdvanceTrigger {
  @Column({ type: 'varchar', primary: true })
  id!: string;

  @Column({ type: 'varchar' })
  trading_order_id!: string;

  @Column({ type: 'varchar', length: 42 })
  user_address!: string;

  @Column({
    type: 'enum',
    enum: AdvanceTriggerType
  })
  trigger_type!: AdvanceTriggerType;

  @Column({ type: 'varchar', length: 50 })
  trigger_asset!: string;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  trigger_value!: number;

  @Column({
    type: 'enum',
    enum: TriggerDirection
  })
  trigger_direction!: TriggerDirection;

  @Column({
    type: 'enum',
    enum: AdvanceTriggerStatus,
    default: AdvanceTriggerStatus.PENDING
  })
  status!: AdvanceTriggerStatus;

  @Column({ type: 'timestamptz', nullable: true })
  triggered_at!: Date | null;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  triggered_value!: number | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  // Relationships
  @ManyToOne(() => TradingOrder, tradingOrder => tradingOrder.advanceTriggers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trading_order_id' })
  tradingOrder!: TradingOrder;
}