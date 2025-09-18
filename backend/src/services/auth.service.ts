import { Injectable, Logger, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@/libs/jwt.service';
import { RedisService } from '@/libs/redis.libs';
import { EIP712Service } from '@/libs/eip712.service';
import { ApiKeyRepository } from '@/persistance/repositories/api-key.repository';
import { AuthenticateRequestDto, AuthenticateResponseDto, RefreshTokenRequestDto, RefreshTokenResponseDto, EIP712AuthDetailsDto, ApiKeyAuthDetailsDto, GetEIP712MessageRequestDto, GetEIP712MessageResponseDto } from '@/dtos/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
    private eip712Service: EIP712Service,
    private apiKeyRepository: ApiKeyRepository,
  ) {}

  async authenticate(authRequest: AuthenticateRequestDto): Promise<AuthenticateResponseDto> {
    this.logger.log(`Authentication attempt for address: ${authRequest.address}, method: ${authRequest.method}`);

  if (authRequest.method === 'eip712') {
      return this.authenticateEIP712(authRequest);
    } else if (authRequest.method === 'api_key') {
      return this.authenticateApiKey(authRequest);
    } else {
      throw new BadRequestException('Unsupported authentication method');
    }
  }

  private async authenticateEIP712(authRequest: AuthenticateRequestDto): Promise<AuthenticateResponseDto> {
    const details = authRequest.details as EIP712AuthDetailsDto;
    
    try {

      // 2. Verify EIP712 signature with timestamp
      const isValid = await this.eip712Service.verifyTimestampSignature(
        authRequest.address,
        details.timestamp,
        details.signature
      );

      if (!isValid) {
        throw new UnauthorizedException('Invalid EIP712 signature');
      }

      // 3. Generate JWT tokens (EIP712 is standalone, no need for client configuration)
      const tokenPair = this.jwtService.generateTokenPair({
        userId: authRequest.address,
        address: authRequest.address,
        appId: 'eip712', // Static identifier for EIP712 authentication
      });

      // 4. Store refresh token in Redis only (EIP712 doesn't use database client tracking)
      const refreshTokenHash = this.jwtService.generateRefreshTokenHash(tokenPair.refreshToken);
      const refreshTokenExpiry = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)); // 7 days
      await this.redisService.storeRefreshToken(
        refreshTokenHash,
        authRequest.address,
        refreshTokenExpiry
      );

      this.logger.log(`EIP712 authentication successful for address: ${authRequest.address}`);

      return {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
        tokenType: 'Bearer',
        expiresIn: 15 * 60, // 15 minutes
        address: authRequest.address,
      };

    } catch (error) {
      this.logger.error(`EIP712 authentication failed for address: ${authRequest.address}`, error);
      
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException('EIP712 authentication failed');
    }
  }

  private async authenticateApiKey(authRequest: AuthenticateRequestDto): Promise<AuthenticateResponseDto> {
    const apiKey = authRequest.details as ApiKeyAuthDetailsDto;
    
    try {
      // 1. Validate API key exists and is active
      const apiKeyEntity = await this.apiKeyRepository.findByApiKey(apiKey.apiKey);
      if (!apiKeyEntity) {
        throw new UnauthorizedException('Invalid API key');
      }
      // 3. Update last used timestamp
      await this.apiKeyRepository.updateLastUsedAt(apiKey.apiKey);

      // 4. Generate JWT tokens
      const tokenPair = this.jwtService.generateTokenPair({
        userId: apiKeyEntity.user_address,
        address: apiKeyEntity.user_address,
        appId: 'api_key',
      });

      // 5. Store refresh token in Redis
      const refreshTokenHash = this.jwtService.generateRefreshTokenHash(tokenPair.refreshToken);
      const refreshTokenExpiry = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)); // 7 days
      await this.redisService.storeRefreshToken(
        refreshTokenHash,
        apiKeyEntity.user_address,
        refreshTokenExpiry
      );

      this.logger.log(`API key authentication successful for address: ${apiKeyEntity.user_address}`);

      return {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
        tokenType: 'Bearer',
        expiresIn: 15 * 60, // 15 minutes
        address: apiKeyEntity.user_address,
      };

    } catch (error) {
      this.logger.error(`API key authentication failed`, error);
      
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException('API key authentication failed');
    }
  }

  async refreshToken(refreshRequest: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    try {
      // 1. Verify refresh token
      const refreshTokenClaims = this.jwtService.verifyRefreshToken(refreshRequest.refreshToken);
      
      // 2. Check if token is blacklisted
      const isBlacklisted = await this.redisService.isTokenBlacklisted(refreshTokenClaims.jti);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked');
      }

      // 3. Verify refresh token exists in Redis
      const refreshTokenHash = this.jwtService.generateRefreshTokenHash(refreshRequest.refreshToken);
      const storedToken = await this.redisService.getRefreshToken(refreshTokenHash);
      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // 4. Use the same appId from the existing token
      const appId = refreshTokenClaims.appId || 'privy'; // Default to 'privy' for backwards compatibility

      // 5. Generate new token pair
      const newTokenPair = this.jwtService.generateTokenPair({
        userId: refreshTokenClaims.userId,
        address: refreshTokenClaims.address,
        appId: appId,
      });

      // 6. Invalidate old refresh token
      await this.redisService.deleteRefreshToken(refreshTokenHash);
      
      // 7. Store new refresh token
      const newRefreshTokenHash = this.jwtService.generateRefreshTokenHash(newTokenPair.refreshToken);
      const refreshTokenExpiry = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)); // 7 days
      await this.redisService.storeRefreshToken(
        newRefreshTokenHash,
        refreshTokenClaims.address,
        refreshTokenExpiry
      );


      this.logger.log(`Token refreshed successfully for address: ${refreshTokenClaims.address}`);

      return {
        accessToken: newTokenPair.accessToken,
        refreshToken: newTokenPair.refreshToken,
        tokenType: 'Bearer',
        expiresIn: 15 * 60, // 15 minutes
      };

    } catch (error) {
      this.logger.error('Token refresh failed', error);
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token refresh failed');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      // 1. Verify refresh token
      const refreshTokenClaims = this.jwtService.verifyRefreshToken(refreshToken);
      
      // 2. Remove refresh token from Redis
      const refreshTokenHash = this.jwtService.generateRefreshTokenHash(refreshToken);
      await this.redisService.deleteRefreshToken(refreshTokenHash);


      // 4. Blacklist the refresh token
      const expirationDate = new Date(refreshTokenClaims.exp * 1000);
      await this.redisService.storeBlacklistedToken(refreshTokenClaims.jti, expirationDate);

      this.logger.log(`Logout successful for address: ${refreshTokenClaims.address}`);

    } catch (error) {
      this.logger.error('Logout failed', error);
      
      throw new UnauthorizedException('Logout failed');
    }
  }

  async getEIP712Message(request: GetEIP712MessageRequestDto): Promise<GetEIP712MessageResponseDto> {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const messageData = this.eip712Service.getMessageToSign(
        request.address,
        timestamp
      );

      this.logger.log(`Generated EIP712 message for address: ${request.address}`);

      return {
        primaryType: messageData.primaryType,
        domain: messageData.domain,
        types: messageData.types,
        message: messageData.message,
        timestamp: timestamp,
      };

    } catch (error) {
      this.logger.error(`Failed to generate EIP712 message for address: ${request.address}`, error);
      
      throw new UnauthorizedException('Failed to generate EIP712 message');
    }
  }

  async validateToken(token: string): Promise<{ userId: string; address: string; appId: string }> {
    try {
      const claims = this.jwtService.verifyAccessToken(token);
      
      // Check if token is blacklisted
      const isBlacklisted = await this.redisService.isTokenBlacklisted(claims.jti);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked');
      }

      return {
        userId: claims.userId,
        address: claims.address,
        appId: claims.appId,
      };
    } catch (error) {
      this.logger.error('Token validation failed', error);
      
      throw new UnauthorizedException('Invalid token');
    }
  }
}