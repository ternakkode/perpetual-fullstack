import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('beta_communities')
export class BetaCommunity {
  @PrimaryColumn()
  id!: string;

  @Column({ name: 'community_code', length: 50, unique: true })
  communityCode!: string;

  @Column({ name: 'name', length: 200 })
  name!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'registration_limit', type: 'integer', default: 1000 })
  registrationLimit!: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}