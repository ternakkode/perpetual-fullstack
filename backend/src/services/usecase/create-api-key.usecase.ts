import { Injectable, Logger } from '@nestjs/common';
import { ApiKeyRepository } from '@/persistance/repositories/api-key.repository';
import { ApiKey } from '@/entities/api-key.entity';
import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export interface CreateApiKeyRequest {
  userAddress: string;
  name?: string;
}

export interface CreateApiKeyResponse {
  id: string;
  apiKey: string;
  name: string | null;
  createdAt: Date;
}

@Injectable()
export class CreateApiKeyUseCase {
  private readonly logger = new Logger(CreateApiKeyUseCase.name);

  constructor(
    private readonly apiKeyRepository: ApiKeyRepository,
  ) {}

  async execute(request: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
    this.logger.log(`Creating API key for user: ${request.userAddress}`);

    const apiKey = this.generateApiKey();
    const id = uuidv4();

    const newApiKey = await this.apiKeyRepository.create({
      id,
      user_address: request.userAddress,
      api_key: apiKey,
      name: request.name || null,
      is_active: true,
    });

    this.logger.log(`API key created successfully for user: ${request.userAddress}`);

    return {
      id: newApiKey.id,
      apiKey: newApiKey.api_key,
      name: newApiKey.name,
      createdAt: newApiKey.created_at,
    };
  }

  private generateApiKey(): string {
    return randomBytes(32).toString('hex');
  }
}