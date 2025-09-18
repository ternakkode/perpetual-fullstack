import { Repository, QueryRunner, EntityTarget, ObjectLiteral } from 'typeorm';
import { BaseRepositoryInterface } from '../interfaces/base-repository.interface';

export abstract class BaseRepository<T extends ObjectLiteral> implements BaseRepositoryInterface<T> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly entityTarget: EntityTarget<T>
  ) {}

  async save(entity: T, queryRunner?: QueryRunner): Promise<T> {
    if (queryRunner) {
      return await queryRunner.manager.save(this.entityTarget, entity);
    }
    return await this.repository.save(entity);
  }

  async saveMany(entities: T[], queryRunner?: QueryRunner): Promise<T[]> {
    if (queryRunner) {
      return await queryRunner.manager.save(this.entityTarget, entities);
    }
    return await this.repository.save(entities);
  }

  async findById(id: string, queryRunner?: QueryRunner): Promise<T | null> {
    if (queryRunner) {
      return await queryRunner.manager.findOne(this.entityTarget, { where: { id } as any });
    }
    return await this.repository.findOne({ where: { id } as any });
  }

  async update(id: string, updates: Partial<T>, queryRunner?: QueryRunner): Promise<T> {
    if (queryRunner) {
      await queryRunner.manager.update(this.entityTarget, id, updates as any);
      const result = await queryRunner.manager.findOne(this.entityTarget, { where: { id } as any });
      return result!;
    }
    await this.repository.update(id, updates as any);
    const result = await this.repository.findOne({ where: { id } as any });
    return result!;
  }

  async remove(entity: T, queryRunner?: QueryRunner): Promise<void> {
    if (queryRunner) {
      await queryRunner.manager.remove(this.entityTarget, entity);
    } else {
      await this.repository.remove(entity);
    }
  }
}