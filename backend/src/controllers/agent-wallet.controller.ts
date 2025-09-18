import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  Request,
  Logger,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AgentWalletService } from '../services/agent-wallet.service';
import {
  GetAgentWalletResponseDto,
  CreateAgentWalletResponseDto,
} from '../dtos/agent-wallet.dto';
import { AuthGuard } from '@/guards/auth.guard';
import { Request as ExpressRequest } from 'express';

@ApiTags('Agent Wallet')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('agentWallet')
export class AgentWalletController {
  private readonly logger = new Logger(AgentWalletController.name);

  constructor(private readonly agentWalletService: AgentWalletService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get agent wallet status',
    description: 'Check if an agent wallet exists for the authenticated user and retrieve its status. Agent wallets are used to execute trades on Hyperliquid Exchange on behalf of users and are valid for 180 days with automatic 30-day rotations.'
  })
  @ApiResponse({
    status: 200,
    description: 'Agent wallet found',
    type: GetAgentWalletResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Agent wallet not found',
  })
  async getAgentWallet(@Request() req: ExpressRequest): Promise<GetAgentWalletResponseDto> {
    try {
      // @ts-ignore
      this.logger.log(`Getting agent wallet for user: ${req.user?.address}`);
      // @ts-ignore
      const agentWallet = await this.agentWalletService.getAgentWallet(req.user?.address!);
      return agentWallet;
    } catch (error) {
      // @ts-ignore
      this.logger.error(`Failed to get agent wallet for user ${req.user?.address}:`, error);
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new agent wallet',
    description: 'Create a new agent wallet for the authenticated user. The wallet private key is securely stored and encrypted within Brother Terminal. After creation, the user must approve the wallet through Hyperliquid\'s agent wallet approval process.'
  })
  @ApiResponse({
    status: 201,
    description: 'Agent wallet created successfully',
    type: CreateAgentWalletResponseDto,
  })
  async createAgentWallet(
    @Request() req: ExpressRequest,
  ): Promise<CreateAgentWalletResponseDto> {
    try {
      // Use address from JWT context, not from request body
      // @ts-ignore
      const userAddress = req.user?.address!;
      this.logger.log(`Creating agent wallet for user: ${userAddress}`);
      const agentWallet = await this.agentWalletService.createAgentWallet(userAddress);

      return {
        agentWalletAddress: agentWallet,
        message: 'Please approve this agent wallet on Hyperliquid Exchange to enable trading'
      };
    } catch (error) {
      // @ts-ignore
      this.logger.error(`Failed to create agent wallet for user ${req.user?.address}:`, error);
      throw error;
    }
  }
}