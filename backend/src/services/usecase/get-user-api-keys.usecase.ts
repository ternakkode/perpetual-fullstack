import { Injectable, Logger } from '@nestjs/common';
import { ApiKeyRepository } from '@/persistance/repositories/api-key.repository';

export interface GetUserApiKeysRequest {
  userAddress: string;
}

export interface ApiKeyInfo {
  id: string;
  name: string | null;
  isActive: boolean;
  lastUsedAt: Date | null;
  createdAt: Date;
}

export interface GetUserApiKeysResponse {
  apiKeys: ApiKeyInfo[];
}

@Injectable()
export class GetUserApiKeysUseCase {
  private readonly logger = new Logger(GetUserApiKeysUseCase.name);

  constructor(
    private readonly apiKeyRepository: ApiKeyRepository,
  ) {}

  async execute(request: GetUserApiKeysRequest): Promise<GetUserApiKeysResponse> {
    this.logger.log(`Getting API keys for user: ${request.userAddress}`);

    const apiKeys = await this.apiKeyRepository.findByUserAddress(request.userAddress);

    const apiKeyInfos: ApiKeyInfo[] = apiKeys.map(apiKey => ({
      id: apiKey.id,
      name: apiKey.name,
      isActive: apiKey.is_active,
      lastUsedAt: apiKey.last_used_at,
      createdAt: apiKey.created_at,
    }));

    this.logger.log(`Found ${apiKeyInfos.length} API keys for user: ${request.userAddress}`);

    return {
      apiKeys: apiKeyInfos,
    };
  }
}