import { IsString, IsNotEmpty, IsObject, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EIP712AuthDetailsDto {
  @ApiProperty({
    description: 'EIP712 signature',
    example: '0x1234567890abcdef...',
  })
  @IsString()
  @IsNotEmpty()
  signature!: string;

  @ApiProperty({
    description: 'Unix timestamp used in the signed message',
    example: 1703872800,
  })
  @IsNotEmpty()
  timestamp!: number;
}

export class ApiKeyAuthDetailsDto {
  @ApiProperty({
    description: 'API key for authentication',
    example: 'abc123def456...',
  })
  @IsString()
  @IsNotEmpty()
  apiKey!: string;
}

export class AuthenticateRequestDto {
  @ApiProperty({
    description: 'Authentication method',
    example: 'eip712',
    enum: ['eip712', 'api_key'],
  })
  @IsString()
  @IsNotEmpty()
  method!: string;

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
  address!: string;

  @ApiProperty({
    description: 'Authentication method specific details',
    oneOf: [
      { $ref: '#/components/schemas/EIP712AuthDetailsDto' },
      { $ref: '#/components/schemas/ApiKeyAuthDetailsDto' }
    ],
  })
  @IsObject()
  @IsNotEmpty()
  details!: EIP712AuthDetailsDto | ApiKeyAuthDetailsDto;
}

export class AuthenticateResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'Refresh token for obtaining new access tokens',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken!: string;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
  })
  tokenType!: string;

  @ApiProperty({
    description: 'Token expiration time in seconds',
    example: 900,
  })
  expiresIn!: number;

  @ApiProperty({
    description: 'User wallet address',
    example: '0x1234567890123456789012345678901234567890',
  })
  address!: string;
}

export class RefreshTokenRequestDto {
  @ApiProperty({
    description: 'Refresh token',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class RefreshTokenResponseDto {
  @ApiProperty({
    description: 'New JWT access token',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'New refresh token',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken!: string;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
  })
  tokenType!: string;

  @ApiProperty({
    description: 'Token expiration time in seconds',
    example: 900,
  })
  expiresIn!: number;
}

export class LogoutRequestDto {
  @ApiProperty({
    description: 'Refresh token to invalidate',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Logout status message',
    example: 'Successfully logged out',
  })
  message!: string;
}

export class GetEIP712MessageRequestDto {
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
  address!: string;
}

export class GetEIP712MessageResponseDto {
  @ApiProperty({
    description: 'EIP712 domain',
    example: {
      name: 'Brother Terminal',
      version: '1',
      chainId: 1,
      verifyingContract: '0x0000000000000000000000000000000000000000'
    }
  })
  domain!: object;

  @ApiProperty({
    description: 'EIP712 types',
    example: {
      Authentication: [
        { name: 'address', type: 'address' },
        { name: 'timestamp', type: 'uint256' },
        { name: 'action', type: 'string' }
      ]
    }
  })
  types!: object;

  @ApiProperty({
    description: 'Primary type for EIP712 signing',
    example: 'Authentication'
  })
  primaryType!: string;

  @ApiProperty({
    description: 'Message to sign',
    example: {
      address: '0x1234567890123456789012345678901234567890',
      timestamp: 1703872800,
      action: 'authenticate'
    }
  })
  message!: object;

  @ApiProperty({
    description: 'Unix timestamp used in message',
    example: 1703872800
  })
  timestamp!: number;
}