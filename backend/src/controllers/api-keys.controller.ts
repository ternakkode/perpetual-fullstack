import { Controller, Post, Get, Body, HttpCode, HttpStatus, Logger, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from '@/guards/auth.guard';
import { CreateApiKeyUseCase, CreateApiKeyRequest, CreateApiKeyResponse } from '@/services/usecase/create-api-key.usecase';
import { GetUserApiKeysUseCase, GetUserApiKeysRequest, GetUserApiKeysResponse } from '@/services/usecase/get-user-api-keys.usecase';

interface CreateApiKeyRequestDto {
  name?: string;
}

interface CreateApiKeyResponseDto {
  id: string;
  apiKey: string;
  name: string | null;
  createdAt: string;
}

interface GetUserApiKeysResponseDto {
  apiKeys: Array<{
    id: string;
    name: string | null;
    isActive: boolean;
    lastUsedAt: string | null;
    createdAt: string;
  }>;
}

@ApiTags('API Keys')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api-keys')
export class ApiKeysController {
  private readonly logger = new Logger(ApiKeysController.name);

  constructor(
    private readonly createApiKeyUseCase: CreateApiKeyUseCase,
    private readonly getUserApiKeysUseCase: GetUserApiKeysUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create API key',
    description: 'Create a new API key for the authenticated user',
  })
  @ApiBody({
    type: Object,
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Optional name for the API key',
          example: 'Trading Bot Key'
        }
      }
    },
    description: 'API key creation request',
  })
  @ApiResponse({
    status: 201,
    description: 'API key created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        apiKey: { type: 'string' },
        name: { type: 'string', nullable: true },
        createdAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  async createApiKey(
    @Request() req: ExpressRequest & { user: { address: string } },
    @Body() createRequest: CreateApiKeyRequestDto,
  ): Promise<CreateApiKeyResponseDto> {
    this.logger.log(`Creating API key for user: ${req.user.address}`);
    
    const request: CreateApiKeyRequest = {
      userAddress: req.user.address,
      name: createRequest.name,
    };

    const result = await this.createApiKeyUseCase.execute(request);
    
    return {
      id: result.id,
      apiKey: result.apiKey,
      name: result.name,
      createdAt: result.createdAt.toISOString(),
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user API keys',
    description: 'Get all API keys for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'API keys retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        apiKeys: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string', nullable: true },
              isActive: { type: 'boolean' },
              lastUsedAt: { type: 'string', format: 'date-time', nullable: true },
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  async getUserApiKeys(
    @Request() req: ExpressRequest & { user: { address: string } },
  ): Promise<GetUserApiKeysResponseDto> {
    this.logger.log(`Getting API keys for user: ${req.user.address}`);
    
    const request: GetUserApiKeysRequest = {
      userAddress: req.user.address,
    };

    const result = await this.getUserApiKeysUseCase.execute(request);
    
    return {
      apiKeys: result.apiKeys.map(apiKey => ({
        id: apiKey.id,
        name: apiKey.name,
        isActive: apiKey.isActive,
        lastUsedAt: apiKey.lastUsedAt?.toISOString() || null,
        createdAt: apiKey.createdAt.toISOString(),
      })),
    };
  }
}