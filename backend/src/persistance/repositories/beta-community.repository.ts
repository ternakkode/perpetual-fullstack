import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { BaseRepository } from './base.repository';
import { BetaCommunity } from '@/entities/beta-community.entity';
import { BetaCommunityRepositoryInterface } from '../interfaces/beta-community.repository.interface';

@Injectable()
export class BetaCommunityRepository 
  extends BaseRepository<BetaCommunity> 
  implements BetaCommunityRepositoryInterface 
{
  constructor(
    @InjectRepository(BetaCommunity)
    repository: Repository<BetaCommunity>,
  ) {
    super(repository, BetaCommunity);
  }

  async findByCommunityCode(
    communityCode: string, 
    queryRunner?: QueryRunner
  ): Promise<BetaCommunity | null> {
    if (queryRunner) {
      return await queryRunner.manager.findOne(BetaCommunity, {
        where: { communityCode },
      });
    }
    return await this.repository.findOne({
      where: { communityCode },
    });
  }

  async findAllActive(queryRunner?: QueryRunner): Promise<BetaCommunity[]> {
    if (queryRunner) {
      return await queryRunner.manager.find(BetaCommunity, {
        where: { isActive: true },
        order: { createdAt: 'DESC' }
      });
    }
    return await this.repository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });
  }

  async updateIsActive(
    id: string, 
    isActive: boolean, 
    queryRunner?: QueryRunner
  ): Promise<BetaCommunity> {
    if (queryRunner) {
      await queryRunner.manager.update(BetaCommunity, id, { isActive });
      const result = await queryRunner.manager.findOne(BetaCommunity, { where: { id } });
      return result!;
    }
    await this.repository.update(id, { isActive });
    const result = await this.repository.findOne({ where: { id } });
    return result!;
  }
}