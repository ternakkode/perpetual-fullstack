import { QueryRunner } from 'typeorm';
import { BetaRegistration, RegistrationType } from '@/entities/beta-registration.entity';
import { BaseRepositoryInterface } from './base-repository.interface';

export interface BetaRegistrationRepositoryInterface extends BaseRepositoryInterface<BetaRegistration> {
  findByWalletAddress(walletAddress: string, queryRunner?: QueryRunner): Promise<BetaRegistration | null>;
  
  countByRegistrationType(type: RegistrationType, queryRunner?: QueryRunner): Promise<number>;
  
  countByCommunityCode(communityCode: string, queryRunner?: QueryRunner): Promise<number>;
  
  findByCommunityCode(communityCode: string, queryRunner?: QueryRunner): Promise<BetaRegistration[]>;
  
  getTotalRegistrationCount(queryRunner?: QueryRunner): Promise<number>;
  
  getRegistrationStats(queryRunner?: QueryRunner): Promise<{
    totalRegistrations: number;
    publicRegistrations: number;
    communityRegistrations: number;
  }>;
}