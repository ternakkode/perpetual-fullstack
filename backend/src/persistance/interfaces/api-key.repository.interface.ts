import { ApiKey } from '@/entities/api-key.entity';

export interface ApiKeyRepositoryInterface {
  create(apiKeyData: Partial<ApiKey>): Promise<ApiKey>;
  findByApiKey(apiKey: string): Promise<ApiKey | null>;
  findByUserAddress(userAddress: string): Promise<ApiKey[]>;
  findById(id: string): Promise<ApiKey | null>;
  update(id: string, updateData: Partial<ApiKey>): Promise<ApiKey>;
  delete(id: string): Promise<void>;
  updateLastUsedAt(apiKey: string): Promise<void>;
}