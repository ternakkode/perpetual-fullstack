import { IsString, IsNotEmpty, IsOptional, IsEnum, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum RegistrationType {
  PUBLIC = 'PUBLIC',
  COMMUNITY = 'COMMUNITY'
}

export class CreatePublicRegistrationDto {
  @ApiProperty({
    description: 'User wallet address',
    example: '0x1234567890123456789012345678901234567890',
    pattern: '^0x[a-fA-F0-9]{40}$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'Address must be a valid Ethereum address',
  })
  walletAddress!: string;

  @ApiProperty({
    description: 'Twitter handle of the user',
    example: '@john_doe',
  })
  @IsString()
  @IsNotEmpty()
  twitterHandle!: string;

  @ApiProperty({
    description: 'URL of the tweet',
    example: 'https://twitter.com/user/status/123456789',
  })
  @IsString()
  @IsNotEmpty()
  tweetUrl!: string;
}

export class CreateCommunityRegistrationDto {
  @ApiProperty({
    description: 'User wallet address',
    example: '0x1234567890123456789012345678901234567890',
    pattern: '^0x[a-fA-F0-9]{40}$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'Address must be a valid Ethereum address',
  })
  walletAddress!: string;

  @ApiProperty({
    description: 'Community code',
    example: 'CRYPTO_BROS',
  })
  @IsString()
  @IsNotEmpty()
  communityCode!: string;
}

export class BetaRegistrationResponseDto {
  @ApiProperty({
    description: 'Registration ID',
    example: 'reg_123456789',
  })
  id!: string;

  @ApiProperty({
    description: 'Wallet address',
    example: '0x1234567890123456789012345678901234567890',
  })
  walletAddress!: string;

  @ApiProperty({
    description: 'Registration type',
    enum: RegistrationType,
    example: RegistrationType.PUBLIC,
  })
  registrationType!: RegistrationType;

  @ApiProperty({
    description: 'Community code (only for community registrations)',
    example: 'CRYPTO_BROS',
    required: false,
  })
  communityCode?: string;

  @ApiProperty({
    description: 'Twitter handle (only for public registrations)',
    example: '@john_doe',
    required: false,
  })
  twitterHandle?: string;

  @ApiProperty({
    description: 'Registration creation date',
    example: '2025-01-15T10:30:00Z',
  })
  createdAt!: Date;
}

export class RegistrationStatsDto {
  @ApiProperty({
    description: 'Total registrations count',
    example: 1250,
  })
  totalRegistrations!: number;

  @ApiProperty({
    description: 'Public registrations count',
    example: 850,
  })
  publicRegistrations!: number;

  @ApiProperty({
    description: 'Community registrations count',
    example: 400,
  })
  communityRegistrations!: number;

}

export class CommunityStatsDto {
  @ApiProperty({
    description: 'Community code',
    example: 'CRYPTO_BROS',
  })
  communityCode!: string;

  @ApiProperty({
    description: 'Community name',
    example: 'Crypto Brothers Community',
  })
  name!: string;

  @ApiProperty({
    description: 'Community registration count',
    example: 45,
  })
  registrationCount!: number;

  @ApiProperty({
    description: 'Community registration limit',
    example: 100,
  })
  registrationLimit!: number;

  @ApiProperty({
    description: 'Whether community is active',
    example: true,
  })
  isActive!: boolean;
}

export class CreateCommunityDto {
  @ApiProperty({
    description: 'Community code (unique identifier)',
    example: 'CRYPTO_BROS',
  })
  @IsString()
  @IsNotEmpty()
  communityCode!: string;

  @ApiProperty({
    description: 'Community name',
    example: 'Crypto Brothers Community',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Community description',
    example: 'A community of crypto enthusiasts',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Registration limit for this community',
    example: 100,
    default: 1000,
  })
  @IsOptional()
  registrationLimit?: number;
}

export class CommunityResponseDto {
  @ApiProperty({
    description: 'Community ID',
    example: 'com_123456789',
  })
  id!: string;

  @ApiProperty({
    description: 'Community code',
    example: 'CRYPTO_BROS',
  })
  communityCode!: string;

  @ApiProperty({
    description: 'Community name',
    example: 'Crypto Brothers Community',
  })
  name!: string;

  @ApiProperty({
    description: 'Community description',
    example: 'A community of crypto enthusiasts',
  })
  description?: string;

  @ApiProperty({
    description: 'Registration limit',
    example: 100,
  })
  registrationLimit!: number;

  @ApiProperty({
    description: 'Whether community is active',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Community creation date',
    example: '2025-01-15T10:30:00Z',
  })
  createdAt!: Date;
}