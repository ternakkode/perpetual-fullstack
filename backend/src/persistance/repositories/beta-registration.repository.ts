import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { BaseRepository } from './base.repository';
import { BetaRegistration, RegistrationType } from '@/entities/beta-registration.entity';
import { BetaRegistrationRepositoryInterface } from '../interfaces/beta-registration.repository.interface';

@Injectable()
export class BetaRegistrationRepository 
  extends BaseRepository<BetaRegistration> 
  implements BetaRegistrationRepositoryInterface 
{
  constructor(
    @InjectRepository(BetaRegistration)
    repository: Repository<BetaRegistration>,
  ) {
    super(repository, BetaRegistration);
  }

  async findByWalletAddress(
    walletAddress: string, 
    queryRunner?: QueryRunner
  ): Promise<BetaRegistration | null> {
    if (queryRunner) {
      return await queryRunner.manager.findOne(BetaRegistration, {
        where: { walletAddress },
      });
    }
    return await this.repository.findOne({
      where: { walletAddress },
    });
  }

  async countByRegistrationType(
    type: RegistrationType, 
    queryRunner?: QueryRunner
  ): Promise<number> {
    if (queryRunner) {
      return await queryRunner.manager.count(BetaRegistration, {
        where: { registrationType: type },
      });
    }
    return await this.repository.count({
      where: { registrationType: type },
    });
  }

  async countByCommunityCode(
    communityCode: string, 
    queryRunner?: QueryRunner
  ): Promise<number> {
    if (queryRunner) {
      return await queryRunner.manager.count(BetaRegistration, {
        where: { 
          registrationType: RegistrationType.COMMUNITY,
          communityCode 
        },
      });
    }
    return await this.repository.count({
      where: { 
        registrationType: RegistrationType.COMMUNITY,
        communityCode 
      },
    });
  }

  async findByCommunityCode(
    communityCode: string, 
    queryRunner?: QueryRunner
  ): Promise<BetaRegistration[]> {
    if (queryRunner) {
      return await queryRunner.manager.find(BetaRegistration, {
        where: { 
          registrationType: RegistrationType.COMMUNITY,
          communityCode 
        },
        order: { createdAt: 'DESC' }
      });
    }
    return await this.repository.find({
      where: { 
        registrationType: RegistrationType.COMMUNITY,
        communityCode 
      },
      order: { createdAt: 'DESC' }
    });
  }

  async getTotalRegistrationCount(queryRunner?: QueryRunner): Promise<number> {
    if (queryRunner) {
      return await queryRunner.manager.count(BetaRegistration);
    }
    return await this.repository.count();
  }

  async getRegistrationStats(queryRunner?: QueryRunner): Promise<{
    totalRegistrations: number;
    publicRegistrations: number;
    communityRegistrations: number;
  }> {
    const [totalRegistrations, publicRegistrations, communityRegistrations] = await Promise.all([
      this.getTotalRegistrationCount(queryRunner),
      this.countByRegistrationType(RegistrationType.PUBLIC, queryRunner),
      this.countByRegistrationType(RegistrationType.COMMUNITY, queryRunner),
    ]);

    return {
      totalRegistrations,
      publicRegistrations,
      communityRegistrations,
    };
  }
}