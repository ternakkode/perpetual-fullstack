import { QueryRunner, ObjectLiteral } from 'typeorm';

export interface BaseRepositoryInterface<T extends ObjectLiteral> {
  save(entity: T, queryRunner?: QueryRunner): Promise<T>;
  saveMany(entities: T[], queryRunner?: QueryRunner): Promise<T[]>;
  findById(id: string, queryRunner?: QueryRunner): Promise<T | null>;
  update(id: string, updates: Partial<T>, queryRunner?: QueryRunner): Promise<T>;
  remove(entity: T, queryRunner?: QueryRunner): Promise<void>;
}