import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AppConfigService } from '../config/app-config.service';
import { RedisService } from './redis.libs';
import * as ethers from 'ethers';

export interface EIP712Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract?: string;
}

export interface AuthenticationMessage {
  address: string;
  timestamp: number;
  action: string;
}

export interface EIP712Types {
  [key: string]: Array<{ name: string; type: string }>;
  Authentication: Array<{ name: string; type: string }>;
}

@Injectable()
export class EIP712Service {
  private readonly logger = new Logger(EIP712Service.name);
  private readonly domain: EIP712Domain;
  private readonly types: EIP712Types;

  constructor(
    private appConfig: AppConfigService,
    private redisService: RedisService,
  ) {
    this.domain = {
      name: 'Brother Terminal',
      version: '1',
      chainId: this.appConfig.eip712ChainId,
      verifyingContract: this.appConfig.eip712VerifyingContract
    };

    this.types = {
      Authentication: [
        { name: 'address', type: 'address' },
        { name: 'timestamp', type: 'uint256' },
        { name: 'action', type: 'string' }
      ]
    };
  }

  getDomain(): EIP712Domain {
    return this.domain;
  }

  getTypes(): EIP712Types {
    return this.types;
  }

  createAuthMessage(address: string, timestamp?: number): AuthenticationMessage {
    return {
      address: address.toLowerCase(),
      timestamp: timestamp || Math.floor(Date.now() / 1000),
      action: 'authenticate'
    };
  }

  async verifyTimestampSignature(
    address: string,
    timestamp: number,
    signature: string
  ): Promise<boolean> {
    try {
      // 1. Validate timestamp window
      if (!this.validateTimestamp(timestamp)) {
        this.logger.warn(`Invalid timestamp: ${timestamp} for address: ${address}`);
        throw new UnauthorizedException('Invalid timestamp');
      }

      // 2. Check rate limiting
      if (!await this.checkRateLimit(address)) {
        this.logger.warn(`Rate limit exceeded for address: ${address}`);
        throw new UnauthorizedException('Rate limit exceeded');
      }

      // 3. Prevent timestamp reuse
      if (!await this.validateAndConsumeTimestamp(timestamp, address, signature)) {
        this.logger.warn(`Timestamp reuse detected for address: ${address}, timestamp: ${timestamp}`);
        throw new UnauthorizedException('Timestamp already used');
      }

      // 4. Verify EIP712 signature
      const message = this.createAuthMessage(address, timestamp);
      const isValid = await this.verifyEIP712Signature(message, signature, address);

      if (isValid) {
        this.logger.log(`EIP712 authentication successful for address: ${address}`);
      } else {
        this.logger.warn(`Invalid EIP712 signature for address: ${address}`);
      }

      return isValid;

    } catch (error) {
      this.logger.error(`EIP712 verification failed for address: ${address}`, error);
      throw error;
    }
  }

  private validateTimestamp(timestamp: number): boolean {
    const now = Math.floor(Date.now() / 1000);
    const maxAge = 300; // 5 minutes
    const skew = 60;    // 1 minute clock skew tolerance

    return (
      timestamp <= now + skew &&           // Not too far in future
      timestamp >= now - maxAge            // Not too old
    );
  }

  private async checkRateLimit(address: string): Promise<boolean> {
    const key = `eip712_rate_limit:${address.toLowerCase()}`;
    const client = this.redisService.getClient();
    const attempts = await client.incr(key);

    if (attempts === 1) {
      await client.expire(key, 60); // 1 minute window
    }

    return attempts <= 10; // Max 10 attempts per minute
  }

  private async validateAndConsumeTimestamp(
    timestamp: number,
    address: string,
    signature: string
  ): Promise<boolean> {
    const key = `eip712_timestamp:${address.toLowerCase()}:${timestamp}`;
    const client = this.redisService.getClient();
    const exists = await client.exists(key);

    if (exists) {
      return false; // Already used
    }

    // Store with TTL equal to max allowed age (5 minutes)
    await client.setEx(key, 300, signature);
    return true;
  }

  private async verifyEIP712Signature(
    message: AuthenticationMessage,
    signature: string,
    expectedAddress: string
  ): Promise<boolean> {
    try {
      // Create the typed data hash
      const typedDataHash = ethers.TypedDataEncoder.hash(this.domain, this.types, message);
      
      // Recover the address from the signature
      const recoveredAddress = ethers.recoverAddress(typedDataHash, signature);
      
      // Compare addresses (case-insensitive)
      const isValid = recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
      
      if (!isValid) {
        this.logger.warn(
          `Address mismatch - Expected: ${expectedAddress}, Recovered: ${recoveredAddress}`
        );
      }

      return isValid;

    } catch (error) {
      this.logger.error('EIP712 signature verification error:', error);
      return false;
    }
  }

  async validateUniqueSignature(signature: string): Promise<boolean> {
    const key = `eip712_signature:${signature}`;
    const client = this.redisService.getClient();
    const exists = await client.exists(key);

    if (!exists) {
      await client.setEx(key, 300, '1'); // 5 min TTL
      return true;
    }

    return false;
  }

  // Helper method to get message for client-side signing
  getMessageToSign(address: string, timestamp?: number): {
    domain: EIP712Domain;
    types: EIP712Types;
    primaryType: string;
    message: AuthenticationMessage;
  } {
    return {
      domain: this.domain,
      types: this.types,
      primaryType: 'Authentication',
      message: this.createAuthMessage(address, timestamp)
    };
  }
}