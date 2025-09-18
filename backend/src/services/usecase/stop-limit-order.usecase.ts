import { Injectable, Logger } from '@nestjs/common';
import { HyperliquidService } from '@/libs/hyperliquid.libs';
import { AgentWalletService } from '../agent-wallet.service';
import { AppConfigService } from '@/config/app-config.service';
import { OrderParameters } from '@nktkas/hyperliquid';
import { OrderParams } from '@nktkas/hyperliquid/script/src/types/exchange/requests';
import { DirectStopLimitOrderDto, TradeSide, OrderExecutionResponseDto } from '@/dtos/order.dto';

@Injectable()
export class StopLimitOrderUseCase {
  private readonly logger = new Logger(StopLimitOrderUseCase.name);

  constructor(
    private readonly hyperliquidService: HyperliquidService,
    private readonly agentWalletService: AgentWalletService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async execute(userAddress: string, orderData: DirectStopLimitOrderDto): Promise<OrderExecutionResponseDto> {
    try {
      this.logger.log(`Executing stop limit order for user: ${userAddress}`);
      
      const userPrivateKey = await this.agentWalletService.derivePrivateKeyFromAddress(userAddress);
      const exchangeClient = this.hyperliquidService.getExchangeClient(userPrivateKey);

      const assetPrice = this.hyperliquidService.getMarketPrice(orderData.asset);
      const size = orderData.size / assetPrice;
      const assetOptimalDecimal = this.hyperliquidService.getOptimalDecimal(orderData.asset);
      const assetIndex = this.hyperliquidService.getAssetIndex(orderData.asset);

      const orderDetail = {
        a: assetIndex!,
        b: orderData.side === TradeSide.BUY,
        p: orderData.limitPrice.toString(),
        r: orderData.reduceOnly,
        s: size.toFixed(assetOptimalDecimal),
        t: {
          trigger: {
            triggerPx: orderData.stopPrice.toString(),
            isMarket: false,
            tpsl: "tp"
          }
        }
      } as OrderParams;

      const orderPayload = {
        orders: [orderDetail],
        grouping: "na",
        builder: {
          b: this.appConfigService.hyperliquidBuilderCodeAddress.toLowerCase() as `0x${string}`,
          f: Number(this.appConfigService.hyperliquidBuilderCodeFee),
        }
      } as OrderParameters;

      const result = await exchangeClient.order(orderPayload);
      const statuses = result.response.data.statuses;

      let oid = "";
      for (let i = 0; i < statuses.length; i++) {
        const status = statuses[i];
        if ('resting' in status && status.resting) {
          oid = status.resting.oid.toString();
          break;
        }
      }

      if (oid !== "") {
        if (orderData.tpSl) {
          await this.setTakeProfitStopLoss(
            exchangeClient, 
            assetIndex!, 
            orderData.tpSl.takeProfitPrice, 
            orderData.tpSl.stopLossPrice,
            orderData.side,
            size,
            assetOptimalDecimal
          );
        }
        return { success: true, externalTxnHash: oid };
      } else {
        return { success: false, error: 'Order not placed' };
      }
    } catch (error) {
      this.logger.error(`Failed to execute stop limit order:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private async setTakeProfitStopLoss(
    exchangeClient: any, 
    assetIndex: number, 
    takeProfitPrice?: number, 
    stopLossPrice?: number,
    side?: TradeSide,
    size?: number,
    assetOptimalDecimal?: number
  ): Promise<void> {
    try {
      const orders: OrderParams[] = [];
      
      if (takeProfitPrice && side && size !== undefined && assetOptimalDecimal !== undefined) {
        const tpOrder = {
          a: assetIndex,
          b: side === TradeSide.SELL,
          p: takeProfitPrice.toString(),
          r: true,
          s: size.toFixed(assetOptimalDecimal),
          t: {
            trigger: {
              triggerPx: takeProfitPrice.toString(),
              isMarket: false,
              tpsl: "tp"
            }
          }
        } as OrderParams;
        orders.push(tpOrder);
        this.logger.log(`Setting take profit at ${takeProfitPrice} for asset ${assetIndex}`);
      }
      
      if (stopLossPrice && side && size !== undefined && assetOptimalDecimal !== undefined) {
        const slOrder = {
          a: assetIndex,
          b: side === TradeSide.SELL,
          p: stopLossPrice.toString(),
          r: true,
          s: size.toFixed(assetOptimalDecimal),
          t: {
            trigger: {
              triggerPx: stopLossPrice.toString(),
              isMarket: false,
              tpsl: "sl"
            }
          }
        } as OrderParams;
        orders.push(slOrder);
        this.logger.log(`Setting stop loss at ${stopLossPrice} for asset ${assetIndex}`);
      }

      if (orders.length > 0) {
        const orderPayload = {
          orders: orders,
          grouping: "na",
          builder: {
            b: this.appConfigService.hyperliquidBuilderCodeAddress.toLowerCase() as `0x${string}`,
            f: Number(this.appConfigService.hyperliquidBuilderCodeFee),
          }
        } as OrderParameters;

        await exchangeClient.order(orderPayload);
      }
    } catch (error) {
      this.logger.error('Failed to set TP/SL:', error);
    }
  }
}