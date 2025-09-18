import { Entity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('api_keys')
export class ApiKey {
  @Column({ type: 'varchar', primary: true })
  id!: string;

  @Column({ type: 'varchar', length: 42 })
  user_address!: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  api_key!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name!: string | null;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  last_used_at!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;
}