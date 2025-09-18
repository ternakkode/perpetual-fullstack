import { Controller, Post, Body, HttpCode, HttpStatus, Logger, Get, Query} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiExtraModels } from '@nestjs/swagger';
import { AuthService } from '@/services/auth.service';
import {
  AuthenticateRequestDto,
  AuthenticateResponseDto,
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  LogoutRequestDto,
  LogoutResponseDto,
  GetEIP712MessageRequestDto,
  GetEIP712MessageResponseDto,
  EIP712AuthDetailsDto,
  ApiKeyAuthDetailsDto,
} from '@/dtos/auth.dto';
import { Public, AuthGuard } from '@/guards/auth.guard';

@ApiTags('Authentication')
@ApiExtraModels(EIP712AuthDetailsDto, ApiKeyAuthDetailsDto)
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticate user',
    description: 'Authenticate a user using EIP712 signature or API key and return access/refresh tokens',
  })
  @ApiBody({
    type: AuthenticateRequestDto,
    description: 'Authentication request with EIP712 signature or API key',
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful',
    type: AuthenticateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication failed',
  })
  async authenticate(
    @Body() authRequest: AuthenticateRequestDto,
  ): Promise<AuthenticateResponseDto> {
    this.logger.log(`Authentication request from address: ${authRequest.address}`);
    return this.authService.authenticate(authRequest);
  }

  @Get('eip712-message')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get EIP712 message to sign',
    description: 'Generate EIP712 structured data for client-side signing',
  })
  @ApiQuery({
    name: 'address',
    required: true,
    description: 'User wallet address',
    example: '0x1234567890123456789012345678901234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'EIP712 message generated successfully',
    type: GetEIP712MessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid parameters',
  })
  async getEIP712Message(
    @Query('address') address: string,
  ): Promise<GetEIP712MessageResponseDto> {
    this.logger.log(`EIP712 message request for address: ${address}`);
    
    const request: GetEIP712MessageRequestDto = { address };
    return this.authService.getEIP712Message(request);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Use a valid refresh token to obtain a new access token and refresh token',
  })
  @ApiBody({
    type: RefreshTokenRequestDto,
    description: 'Refresh token request',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refresh successful',
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or expired refresh token',
  })
  async refreshToken(
    @Body() refreshRequest: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    this.logger.log('Token refresh request received');
    return this.authService.refreshToken(refreshRequest);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout user',
    description: 'Invalidate refresh token and log out the user',
  })
  @ApiBody({
    type: LogoutRequestDto,
    description: 'Logout request with refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    type: LogoutResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid refresh token',
  })
  async logout(@Body() logoutRequest: LogoutRequestDto): Promise<LogoutResponseDto> {
    this.logger.log('Logout request received');
    await this.authService.logout(logoutRequest.refreshToken);
    return {
      message: 'Successfully logged out',
    };
  }
}