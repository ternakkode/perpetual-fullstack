import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Public } from '@/guards/auth.guard';
import { CreatePublicRegistrationUseCase } from '@/services/usecase/create-public-registration.usecase';
import { CreateCommunityRegistrationUseCase } from '@/services/usecase/create-community-registration.usecase';
import { GetRegistrationStatsUseCase } from '@/services/usecase/get-registration-stats.usecase';
import { CreateCommunityUseCase } from '@/services/usecase/create-community.usecase';
import {
  CreatePublicRegistrationDto,
  CreateCommunityRegistrationDto,
  BetaRegistrationResponseDto,
  RegistrationStatsDto,
  CommunityStatsDto,
  CreateCommunityDto,
  CommunityResponseDto,
} from '@/dtos/beta-registration.dto';

@ApiTags('Beta Registration')
@Controller('beta-registration')
export class BetaRegistrationController {
  private readonly logger = new Logger(BetaRegistrationController.name);

  constructor(
    private readonly createPublicRegistrationUseCase: CreatePublicRegistrationUseCase,
    private readonly createCommunityRegistrationUseCase: CreateCommunityRegistrationUseCase,
    private readonly getRegistrationStatsUseCase: GetRegistrationStatsUseCase,
    private readonly createCommunityUseCase: CreateCommunityUseCase,
  ) {}

  @Post('public')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register for public beta',
    description: 'Register a wallet address for public beta with Twitter verification',
  })
  @ApiBody({
    type: CreatePublicRegistrationDto,
    description: 'Public registration request with Twitter details',
  })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    type: BetaRegistrationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - wallet already registered',
  })
  async registerPublic(
    @Body() dto: CreatePublicRegistrationDto,
  ): Promise<BetaRegistrationResponseDto> {
    this.logger.log(`Public registration request for wallet: ${dto.walletAddress}`);
    
    const registration = await this.createPublicRegistrationUseCase.execute(dto);
    
    return {
      id: registration.id,
      walletAddress: registration.walletAddress,
      registrationType: registration.registrationType,
      twitterHandle: registration.twitterHandle,
      createdAt: registration.createdAt,
    };
  }

  @Post('community')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register for community beta',
    description: 'Register a wallet address for community beta',
  })
  @ApiBody({
    type: CreateCommunityRegistrationDto,
    description: 'Community registration request',
  })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    type: BetaRegistrationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data or community limit reached',
  })
  @ApiResponse({
    status: 404,
    description: 'Community not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - wallet already registered',
  })
  async registerCommunity(
    @Body() dto: CreateCommunityRegistrationDto,
  ): Promise<BetaRegistrationResponseDto> {
    this.logger.log(`Community registration request for wallet: ${dto.walletAddress}, community: ${dto.communityCode}`);
    
    const registration = await this.createCommunityRegistrationUseCase.execute(dto);
    
    return {
      id: registration.id,
      walletAddress: registration.walletAddress,
      registrationType: registration.registrationType,
      communityCode: registration.communityCode,
      createdAt: registration.createdAt,
    };
  }

  @Get('stats')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get overall registration statistics',
    description: 'Get overall beta registration statistics including public and community counts',
  })
  @ApiResponse({
    status: 200,
    description: 'Registration statistics retrieved successfully',
    type: RegistrationStatsDto,
  })
  async getOverallStats(): Promise<RegistrationStatsDto> {
    this.logger.log('Overall registration stats request');
    return await this.getRegistrationStatsUseCase.getOverallStats();
  }

  @Get('community/:communityCode/stats')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get community registration statistics',
    description: 'Get registration statistics for a specific community',
  })
  @ApiParam({
    name: 'communityCode',
    description: 'Community code',
    example: 'CRYPTO_BROS',
  })
  @ApiResponse({
    status: 200,
    description: 'Community statistics retrieved successfully',
    type: CommunityStatsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Community not found',
  })
  async getCommunityStats(
    @Param('communityCode') communityCode: string,
  ): Promise<CommunityStatsDto> {
    this.logger.log(`Community stats request for: ${communityCode}`);
    
    const stats = await this.getRegistrationStatsUseCase.getCommunityStats(communityCode);
    
    if (!stats) {
      throw new Error('Community not found');
    }
    
    return stats;
  }

  @Post('community/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new community',
    description: 'Create a new beta community with registration limits',
  })
  @ApiBody({
    type: CreateCommunityDto,
    description: 'Community creation request',
  })
  @ApiResponse({
    status: 201,
    description: 'Community created successfully',
    type: CommunityResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - community code already exists',
  })
  async createCommunity(
    @Body() dto: CreateCommunityDto,
  ): Promise<CommunityResponseDto> {
    this.logger.log(`Create community request: ${dto.communityCode}`);
    
    const community = await this.createCommunityUseCase.execute(dto);
    
    return {
      id: community.id,
      communityCode: community.communityCode,
      name: community.name,
      description: community.description,
      registrationLimit: community.registrationLimit,
      isActive: community.isActive,
      createdAt: community.createdAt,
    };
  }
}