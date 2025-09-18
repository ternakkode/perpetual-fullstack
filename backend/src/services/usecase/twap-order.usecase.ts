import { Injectable, Logger } from '@nestjs/common';
import { HyperliquidService } from '@/libs/hyperliquid.libs';
import { AgentWalletService } from '../agent-wallet.service';
import { TwapOrderParameters } from '@nktkas/hyperliquid';
import { DirectTwapOrderDto, TradeSide, OrderExecutionResponseDto } from '@/dtos/order.dto';

@Injectable()
export class TwapOrderUseCase {
  private readonly logger = new Logger(TwapOrderUseCase.name);

  constructor(
    private readonly hyperliquidService: HyperliquidService,
    private readonly agentWalletService: AgentWalletService,
  ) {}

  async execute(userAddress: string, orderData: DirectTwapOrderDto): Promise<OrderExecutionResponseDto> {
    try {
      this.logger.log(`Executing TWAP order for user: ${userAddress}`);
      
      const userPrivateKey = await this.agentWalletService.derivePrivateKeyFromAddress(userAddress);
      const exchangeClient = this.hyperliquidService.getExchangeClient(userPrivateKey);

      const assetPrice = this.hyperliquidService.getMarketPrice(orderData.asset);
      const size = orderData.size / assetPrice;
      const assetOptimalDecimal = this.hyperliquidService.getOptimalDecimal(orderData.asset);
      const assetIndex = this.hyperliquidService.getAssetIndex(orderData.asset);

      const twapParameters = {
        a: assetIndex!,
        b: orderData.side === TradeSide.BUY,
        s: size.toFixed(assetOptimalDecimal),
        r: orderData.reduceOnly,
        m: orderData.twapRunningTime,
        t: orderData.twapRandomize
      } as TwapOrderParameters;

      const twapResult = await exchangeClient.twapOrder(twapParameters);
      const twapId = twapResult.response.data.status.running.twapId.toString();

      return { success: true, externalTxnHash: twapId };
    } catch (error) {
      this.logger.error(`Failed to execute TWAP order:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}