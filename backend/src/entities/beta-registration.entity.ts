import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum RegistrationType {
  PUBLIC = 'PUBLIC',
  COMMUNITY = 'COMMUNITY'
}

@Entity('beta_registrations')
export class BetaRegistration {
  @PrimaryColumn()
  id!: string;

  @Column({ name: 'wallet_address', length: 42, unique: true })
  walletAddress!: string;

  @Column({
    name: 'registration_type',
    type: 'enum',
    enum: RegistrationType,
  })
  registrationType!: RegistrationType;

  @Column({ name: 'community_code', length: 50, nullable: true })
  communityCode?: string;

  @Column({ name: 'twitter_handle', length: 100, nullable: true })
  twitterHandle?: string;

  @Column({ name: 'tweet_url', type: 'text', nullable: true })
  tweetUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}