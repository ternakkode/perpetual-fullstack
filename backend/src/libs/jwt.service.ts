import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../config/app-config.service';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export interface JwtPayload {
  userId: string;
  address: string;
  appId: string;
  iat: number;
  exp: number;
  jti: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class JwtService {
  private readonly logger = new Logger(JwtService.name);
  private privateKey!: string;
  private publicKey!: string;

  constructor(private appConfig: AppConfigService) {
    this.initializeKeys();
  }

  private initializeKeys(): void {
    const rawPrivateKey = this.appConfig.jwtPrivateKey;
    const rawPublicKey = this.appConfig.jwtPublicKey;

    if (!rawPrivateKey || !rawPublicKey) {
      this.logger.error('JWT keys are not properly configured. Please check your environment variables.');
      throw new Error('JWT keys are not properly configured.');
    }

    // Convert escaped newlines to actual newlines
    this.privateKey = rawPrivateKey.replace(/\\n/g, '\n');
    this.publicKey = rawPublicKey.replace(/\\n/g, '\n');

    // Validate keys can be used with crypto
    try {
      crypto.createPrivateKey(this.privateKey);
      crypto.createPublicKey(this.publicKey);
      this.logger.log('JWT keys validated successfully');
    } catch (error) {
      this.logger.error(`JWT key validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error('Invalid JWT keys format');
    }
  }


  generateTokenPair(payload: Omit<JwtPayload, 'iat' | 'exp' | 'jti'>): TokenPair {
    const jti = crypto.randomUUID();
    const accessTokenPayload: JwtPayload = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.parseDurationToSeconds(this.appConfig.jwtAccessTokenDuration),
      jti
    };

    const refreshTokenPayload = {
      userId: payload.userId,
      address: payload.address,
      appId: payload.appId,
      jti,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.parseDurationToSeconds(this.appConfig.jwtRefreshTokenDuration),
      type: 'refresh'
    };

    const accessToken = jwt.sign(accessTokenPayload, this.privateKey, {
      algorithm: 'RS256',
      issuer: 'brother-terminal-api',
      audience: 'brother-terminal-client'
    });

    const refreshToken = jwt.sign(refreshTokenPayload, this.privateKey, {
      algorithm: 'RS256',
      issuer: 'brother-terminal-api',
      audience: 'brother-terminal-client'
    });

    return {
      accessToken,
      refreshToken
    };
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.publicKey, {
        algorithms: ['RS256'],
        issuer: 'brother-terminal-api',
        audience: 'brother-terminal-client'
      }) as JwtPayload;

      return decoded;
    } catch (error) {
      this.logger.error(`Access token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error('Invalid access token');
    }
  }

  verifyRefreshToken(token: string): any {
    try {
      const decoded = jwt.verify(token, this.publicKey, {
        algorithms: ['RS256'],
        issuer: 'brother-terminal-api',
        audience: 'brother-terminal-client'
      });

      if (typeof decoded === 'object' && decoded !== null && 'type' in decoded && decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      this.logger.error(`Refresh token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error('Invalid refresh token');
    }
  }

  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  generateRefreshTokenHash(refreshToken: string): string {
    return crypto.createHash('sha256').update(refreshToken).digest('hex');
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  private parseDurationToSeconds(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid duration format: ${duration}. Expected format: Ns, Nm, Nh, or Nd`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 24 * 60 * 60;
      default: throw new Error(`Unsupported duration unit: ${unit}`);
    }
  }
}