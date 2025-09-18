import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '@/entities/api-key.entity';
import { ApiKeyRepositoryInterface } from '@/persistance/interfaces/api-key.repository.interface';
import { BaseRepository } from './base.repository';

@Injectable()
export class ApiKeyRepository extends BaseRepository<ApiKey> implements ApiKeyRepositoryInterface {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {
    super(apiKeyRepository, ApiKey);
  }

  async create(apiKeyData: Partial<ApiKey>): Promise<ApiKey> {
    const apiKey = this.apiKeyRepository.create(apiKeyData);
    return await this.apiKeyRepository.save(apiKey);
  }

  async findByApiKey(apiKey: string): Promise<ApiKey | null> {
    return await this.apiKeyRepository.findOne({
      where: { api_key: apiKey, is_active: true }
    });
  }

  async findByUserAddress(userAddress: string): Promise<ApiKey[]> {
    return await this.apiKeyRepository.find({
      where: { user_address: userAddress },
      order: { created_at: 'DESC' }
    });
  }

  async findById(id: string): Promise<ApiKey | null> {
    return await this.apiKeyRepository.findOne({
      where: { id }
    });
  }

  async update(id: string, updateData: Partial<ApiKey>): Promise<ApiKey> {
    await this.apiKeyRepository.update(id, updateData);
    const result = await this.apiKeyRepository.findOne({ where: { id } });
    return result!;
  }

  async delete(id: string): Promise<void> {
    await this.apiKeyRepository.delete(id);
  }

  async updateLastUsedAt(apiKey: string): Promise<void> {
    await this.apiKeyRepository.update(
      { api_key: apiKey },
      { last_used_at: new Date() }
    );
  }
}