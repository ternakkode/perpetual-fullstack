import { Injectable, Logger } from '@nestjs/common';
import { HyperliquidService } from '@/libs/hyperliquid.libs';
import { AgentWalletService } from '../agent-wallet.service';
import { SetLeverageDto, SetLeverageResponseDto } from '@/dtos/order.dto';

@Injectable()
export class SetLeverageUseCase {
  private readonly logger = new Logger(SetLeverageUseCase.name);

  constructor(
    private readonly hyperliquidService: HyperliquidService,
    private readonly agentWalletService: AgentWalletService,
  ) {}

  async execute(userAddress: string, leverageData: SetLeverageDto): Promise<SetLeverageResponseDto> {
    try {
      this.logger.log(`Setting leverage for user: ${userAddress}, asset: ${leverageData.asset}, leverage: ${leverageData.leverage}x, cross: ${leverageData.isCross}`);
      
      const userPrivateKey = await this.agentWalletService.derivePrivateKeyFromAddress(userAddress);
      const exchangeClient = this.hyperliquidService.getExchangeClient(userPrivateKey);

      const assetIndex = this.hyperliquidService.getAssetIndex(leverageData.asset);
      
      if (assetIndex === null || assetIndex === undefined) {
        return { success: false, error: `Asset ${leverageData.asset} not found` };
      }

      const leveragePayload = {
        asset: assetIndex,
        isCross: leverageData.isCross,
        leverage: leverageData.leverage,
      };

      await exchangeClient.updateLeverage(leveragePayload);
      
      this.logger.log(`Successfully set leverage for ${leverageData.asset} to ${leverageData.leverage}x (${leverageData.isCross ? 'cross' : 'isolated'})`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to set leverage for user ${userAddress}:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}