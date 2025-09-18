import { IsString, IsNotEmpty, IsOptional, IsBoolean, Matches, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AgentWalletStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  NOT_FOUND = 'NOT_FOUND'
}

export class CreateAgentWalletResponseDto {
  @ApiProperty({
    description: 'Newly created agent wallet address - user must approve this on Hyperliquid',
    example: '0xabcdef1234567890abcdef1234567890abcdef12'
  })
  agentWalletAddress!: string;

  @ApiProperty({
    description: 'Next steps instruction for user',
    example: 'Please approve this agent wallet on Hyperliquid Exchange to enable trading'
  })
  message!: string;
}

export class GetAgentWalletResponseDto {
  @ApiProperty({
    description: 'Agent wallet address for Hyperliquid operations',
    example: '0xabcdef1234567890abcdef1234567890abcdef12'
  })
  agentWalletAddress?: string;

  @ApiProperty({
    description: 'Agent identifier for this wallet',
    example: 'Brother Terminal API'
  })
  agentName!: string;

  @ApiProperty({
    description: 'Wallet status - ACTIVE (ready), EXPIRED (needs renewal), or NOT_FOUND (needs creation)',
    enum: AgentWalletStatus,
    example: AgentWalletStatus.ACTIVE
  })
  @IsEnum(AgentWalletStatus)
  status!: AgentWalletStatus;
}