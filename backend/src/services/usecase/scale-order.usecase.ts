import { Injectable, Logger } from '@nestjs/common';
import { HyperliquidService } from '@/libs/hyperliquid.libs';
import { AgentWalletService } from '../agent-wallet.service';
import { AppConfigService } from '@/config/app-config.service';
import { OrderParameters } from '@nktkas/hyperliquid';
import { OrderParams } from '@nktkas/hyperliquid/script/src/types/exchange/requests';
import { DirectScaleOrderDto, TradeSide, OrderExecutionResponseDto } from '@/dtos/order.dto';

@Injectable()
export class ScaleOrderUseCase {
  private readonly logger = new Logger(ScaleOrderUseCase.name);

  constructor(
    private readonly hyperliquidService: HyperliquidService,
    private readonly agentWalletService: AgentWalletService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async execute(userAddress: string, orderData: DirectScaleOrderDto): Promise<OrderExecutionResponseDto> {
    try {
      this.logger.log(`Executing scale order for user: ${userAddress}`);
      
      const userPrivateKey = await this.agentWalletService.derivePrivateKeyFromAddress(userAddress);
      const exchangeClient = this.hyperliquidService.getExchangeClient(userPrivateKey);

      const assetPrice = this.hyperliquidService.getMarketPrice(orderData.asset);
      const assetOptimalDecimal = this.hyperliquidService.getOptimalDecimal(orderData.asset);
      const assetIndex = this.hyperliquidService.getAssetIndex(orderData.asset);

      const orders: OrderParams[] = [];
      const priceRange = orderData.endUsd - orderData.startUsd;
      const priceStep = priceRange / (orderData.totalOrders - 1);

      for (let i = 0; i < orderData.totalOrders; i++) {
        const price = orderData.startUsd + (priceStep * i);
        
        let orderSize: number;
        if (orderData.sizeSkew === 0) {
          orderSize = orderData.totalSize / orderData.totalOrders;
        } else {
          const skewFactor = 1 + (orderData.sizeSkew * (i / (orderData.totalOrders - 1) - 0.5) * 2);
          orderSize = (orderData.totalSize / orderData.totalOrders) * skewFactor;
        }

        const sizeInAsset = orderSize / assetPrice;

        const orderDetail = {
          a: assetIndex!,
          b: orderData.side === TradeSide.BUY,
          p: price.toString(),
          r: orderData.reduceOnly,
          s: sizeInAsset.toFixed(assetOptimalDecimal),
          t: {
            limit: {
              tif: "Alo",
            }
          }
        } as OrderParams;

        orders.push(orderDetail);
      }

      const orderPayload = {
        orders: orders,
        grouping: "na",
        builder: {
          b: this.appConfigService.hyperliquidBuilderCodeAddress.toLowerCase() as `0x${string}`,
          f: Number(this.appConfigService.hyperliquidBuilderCodeFee),
        }
      } as OrderParameters;

      const result = await exchangeClient.order(orderPayload);
      const statuses = result.response.data.statuses;

      const successfulOids: string[] = [];
      for (let i = 0; i < statuses.length; i++) {
        const status = statuses[i];
        if ('resting' in status && status.resting) {
          successfulOids.push(status.resting.oid.toString());
        }
      }

      if (successfulOids.length > 0) {
        if (orderData.tpSl) {
          const totalSizeInAsset = orderData.totalSize / assetPrice;
          await this.setTakeProfitStopLoss(
            exchangeClient, 
            assetIndex!, 
            orderData.tpSl.takeProfitPrice, 
            orderData.tpSl.stopLossPrice,
            orderData.side,
            totalSizeInAsset,
            assetOptimalDecimal
          );
        }
        return { success: true, externalTxnHash: successfulOids.join(',') };
      } else {
        return { success: false, error: 'No orders placed successfully' };
      }
    } catch (error) {
      this.logger.error(`Failed to execute scale order:`, error);
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