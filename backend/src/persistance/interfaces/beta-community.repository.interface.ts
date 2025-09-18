import { QueryRunner } from 'typeorm';
import { BetaCommunity } from '@/entities/beta-community.entity';
import { BaseRepositoryInterface } from './base-repository.interface';

export interface BetaCommunityRepositoryInterface extends BaseRepositoryInterface<BetaCommunity> {
  findByCommunityCode(communityCode: string, queryRunner?: QueryRunner): Promise<BetaCommunity | null>;
  
  findAllActive(queryRunner?: QueryRunner): Promise<BetaCommunity[]>;
  
  updateIsActive(id: string, isActive: boolean, queryRunner?: QueryRunner): Promise<BetaCommunity>;
}