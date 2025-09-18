import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { AppConfigService } from '../config/app-config.service';
import * as crypto from 'crypto';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private readonly encryptionKey: string;

  constructor(private appConfig: AppConfigService) {
    this.client = createClient({
      socket: {
        host: this.appConfig.redisHost,
        port: this.appConfig.redisPort,
      },
      password: this.appConfig.redisPassword,
      database: this.appConfig.redisDb,
    });

    this.encryptionKey = this.appConfig.agentWalletEncryptionKey;
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    if (this.client.isOpen) {
      await this.client.disconnect();
    }
  }

  getClient(): RedisClientType {
    return this.client;
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  private decrypt(encryptedText: string): string {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedData = textParts.join(':');
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async storeAgentWallet(userAddress: string, agentWalletAddress: string, privateKey: string): Promise<void> {
    const encryptedKey = this.encrypt(privateKey);
    const agentWalletData = {
      agentWalletAddress,
      privateKey: encryptedKey
    };
    
    const key = `agent_wallet:${userAddress}`;
    const ttl = 180 * 24 * 60 * 60;

    await this.client.setEx(key, ttl, JSON.stringify(agentWalletData));
  }

  async getAgentWallet(userAddress: string): Promise<{ agentWalletAddress: string; ttl: number; privateKey: string } | null> {
    const key = `agent_wallet:${userAddress}`;
    const data = await this.client.get(key);
     if (!data) {
      return null;
    }
    
    const ttl = await this.client.ttl(key);
    const agentWalletData = JSON.parse(data);
    return {
      agentWalletAddress: agentWalletData.agentWalletAddress,
      ttl: ttl,
      privateKey: this.decrypt(agentWalletData.privateKey)
    };
  }

  async deleteAgentWallet(userAddress: string): Promise<void> {
    const key = `agent_wallet:${userAddress}`;
    await this.client.del(key);
  }

  async getPrivateKey(userAddress: string): Promise<string | null> {
    const agentWallet = await this.getAgentWallet(userAddress);
    return agentWallet?.privateKey || null;
  }

  async storeRefreshToken(tokenHash: string, userAddress: string, expiresAt: Date): Promise<void> {
    const refreshTokenData = {
      userAddress,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString()
    };
    
    const key = `refresh_token:${tokenHash}`;
    const ttlSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
    
    if (ttlSeconds > 0) {
      await this.client.setEx(key, ttlSeconds, JSON.stringify(refreshTokenData));
    }
  }

  async getRefreshToken(tokenHash: string): Promise<{ userAddress: string; expiresAt: string } | null> {
    const key = `refresh_token:${tokenHash}`;
    const data = await this.client.get(key);
    
    if (!data) {
      return null;
    }

    return JSON.parse(data);
  }

  async deleteRefreshToken(tokenHash: string): Promise<void> {
    const key = `refresh_token:${tokenHash}`;
    await this.client.del(key);
  }

  async deleteAllRefreshTokensForUser(userAddress: string): Promise<void> {
    const pattern = `refresh_token:*`;
    const keys = await this.client.keys(pattern);
    
    for (const key of keys) {
      const data = await this.client.get(key);
      if (data) {
        const tokenData = JSON.parse(data);
        if (tokenData.userAddress === userAddress) {
          await this.client.del(key);
        }
      }
    }
  }

  async storeBlacklistedToken(tokenId: string, expiresAt: Date): Promise<void> {
    const key = `blacklisted_token:${tokenId}`;
    const ttlSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
    
    if (ttlSeconds > 0) {
      await this.client.setEx(key, ttlSeconds, 'blacklisted');
    }
  }

  async isTokenBlacklisted(tokenId: string): Promise<boolean> {
    const key = `blacklisted_token:${tokenId}`;
    const result = await this.client.get(key);
    return result !== null;
  }
}