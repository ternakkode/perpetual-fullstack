import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RedisService } from '../libs/redis.libs';
import { Wallet } from 'ethers';
import { AgentWalletStatus, GetAgentWalletResponseDto } from '@/dtos/agent-wallet.dto';
import { HyperliquidService } from '@/libs/hyperliquid.libs';

@Injectable()
export class AgentWalletService {
  private readonly logger = new Logger(AgentWalletService.name);

  constructor(
    private redisService: RedisService,
    private hyperliquidService: HyperliquidService,
  ) { }

  async getAgentWallet(userAddress: string): Promise<GetAgentWalletResponseDto> {
    try {
      const agentWallet = await this.redisService.getAgentWallet(userAddress);

      if (!agentWallet) {
        return {
          agentName: "Brother Terminal",
          status: AgentWalletStatus.NOT_FOUND,
        }
      }

      const userAgentWallets = await this.hyperliquidService.getInfoClient().extraAgents({ user: userAddress as `0x${string}` });
      if (userAgentWallets.length === 0) {
        return {
          agentName: "Brother Terminal",
          agentWalletAddress: agentWallet.agentWalletAddress,
          status: AgentWalletStatus.EXPIRED,
        }
      }

      const userAgentWalletFound = userAgentWallets.find(wallet => wallet.address.toLowerCase() === agentWallet.agentWalletAddress.toLowerCase());
      if (!userAgentWalletFound) {
        return {
          agentName: "Brother Terminal",
          agentWalletAddress: agentWallet.agentWalletAddress,
          status: AgentWalletStatus.EXPIRED,
        };
      }

      const ttlIsLessThanAMonth = agentWallet.ttl < 30 * 24 * 60 * 60;
      if (ttlIsLessThanAMonth) {
        return {
          agentName: "Brother Terminal",
          agentWalletAddress: agentWallet.agentWalletAddress,
          status: AgentWalletStatus.EXPIRED,
        };
      }

      return {
        agentName: "Brother Terminal API",
        status: AgentWalletStatus.ACTIVE,
        agentWalletAddress: agentWallet.agentWalletAddress
      };
    } catch (error) {
      this.logger.error(`Failed to get agent wallet for user ${userAddress}:`, error);
      throw error;
    }
  }

  async createAgentWallet(userAddress: string): Promise<string> {

    try {
      const existingWallet = await this.getAgentWallet(userAddress);
      if (existingWallet.status === AgentWalletStatus.ACTIVE) {
        throw new Error(`Agent wallet already exists for user ${userAddress}`);
      }

      // Generate a new wallet
      const wallet = Wallet.createRandom();
      const agentWalletAddress = wallet.address;
      const privateKey = wallet.privateKey;

      // Store agent wallet data in Redis
      await this.redisService.storeAgentWallet(userAddress, agentWalletAddress, privateKey);

      this.logger.log(`Agent wallet created for user ${userAddress}: ${agentWalletAddress}`);

      return agentWalletAddress;

    } catch (error) {
      this.logger.error(`Failed to create agent wallet for user ${userAddress}:`, error);
      throw error;
    }
  }

  async getPrivateKey(userAddress: string): Promise<string | null> {
    try {
      const agentWallet = await this.getAgentWallet(userAddress);
      if (!agentWallet) {
        return null;
      }

      // Get private key from Redis
      const privateKey = await this.redisService.getPrivateKey(userAddress);
      return privateKey;

    } catch (error) {
      this.logger.error(`Failed to get private key for user ${userAddress}:`, error);
      throw error;
    }
  }

  async deleteAgentWallet(userAddress: string): Promise<void> {
    try {
      // Delete from Redis
      await this.redisService.deleteAgentWallet(userAddress);

      this.logger.log(`Agent wallet deleted for user ${userAddress}`);

    } catch (error) {
      this.logger.error(`Failed to delete agent wallet for user ${userAddress}:`, error);
      throw error;
    }
  }

  async derivePrivateKeyFromAddress(address: string): Promise<string> {
    try {
      // Try to get the private key from the agent wallet service
      const privateKey = await this.getPrivateKey(address);

      if (privateKey) {
        this.logger.log(`Using agent wallet private key for address: ${address}`);
        return privateKey;
      }

      throw new Error(`No private key found for address: ${address}`);
    } catch (error) {
      this.logger.error(`Failed to derive private key for address ${address}:`, error);
      throw error;
    }
  }
}