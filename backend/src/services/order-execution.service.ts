import { Injectable, Logger } from '@nestjs/common';
import { HyperliquidService } from '@/libs/hyperliquid.libs';
import { AgentWalletService } from './agent-wallet.service';
import { AppConfigService } from '@/config/app-config.service';
import { getSlippagePrice } from '@/utils/price';
import { OrderParameters, TwapOrderParameters } from '@nktkas/hyperliquid';
import { OrderParams } from '@nktkas/hyperliquid/script/src/types/exchange/requests';
import { 
  TwapOrderRequestDto, 
  LimitOrderPerpetualRequestDto, 
  LimitOrderSpotRequestDto, 
  MarketOrderPerpetualRequestDto, 
  MarketOrderSpotRequestDto, 
  OrderExecutionResponseDto,
  ExecutionType,
  TradeSide
} from '@/dtos/order.dto';

@Injectable()
export class OrderExecutionService {
  private readonly logger = new Logger(OrderExecutionService.name);

  constructor(
    private readonly hyperliquidService: HyperliquidService,
    private readonly agentWalletService: AgentWalletService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async executeTwapOrder(userAddress: string, request: TwapOrderRequestDto): Promise<OrderExecutionResponseDto> {
    try {
      this.logger.log(`Executing TWAP order for user: ${userAddress}, type: ${request.executionType}`);
      
      const userPrivateKey = await this.agentWalletService.derivePrivateKeyFromAddress(userAddress);
      const exchangeClient = this.hyperliquidService.getExchangeClient(userPrivateKey);

      const assetPrice = this.hyperliquidService.getMarketPrice(request.asset);
      const size = request.usdcSize / assetPrice;
      const assetOptimalDecimal = this.hyperliquidService.getOptimalDecimal(request.asset);
      const assetIndex = this.hyperliquidService.getAssetIndex(request.asset);

      if (request.executionType === ExecutionType.PERPETUAL && request.leverage) {
        const leveragePayload = {
          asset: assetIndex!,
          isCross: true,
          leverage: request.leverage,
        };
        await exchangeClient.updateLeverage(leveragePayload);
      }

      const adjustedAssetIndex = request.executionType === ExecutionType.SPOT ? assetIndex! + 10000 : assetIndex!;
      const twapParameters = {
        a: adjustedAssetIndex,
        b: request.side === TradeSide.BUY,
        s: size.toFixed(assetOptimalDecimal),
        r: false,
        m: request.twapRunningTime,
        t: request.twapRandomize
      } as TwapOrderParameters;

      const twapResult = await exchangeClient.twapOrder(twapParameters);
      const twapId = twapResult.response.data.status.running.twapId.toString();

      return { success: true, externalTxnHash: twapId };
    } catch (error) {
      this.logger.error(`Failed to execute TWAP order for user ${userAddress}:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async executePerpetualLimitOrder(userAddress: string, request: LimitOrderPerpetualRequestDto): Promise<OrderExecutionResponseDto> {
    try {
      this.logger.log(`Executing perpetual limit order for user: ${userAddress}`);
      
      const userPrivateKey = await this.agentWalletService.derivePrivateKeyFromAddress(userAddress);
      const exchangeClient = this.hyperliquidService.getExchangeClient(userPrivateKey);

      const size = request.usdcSize / request.price;
      const assetOptimalDecimal = this.hyperliquidService.getOptimalDecimal(request.asset);
      const assetIndex = this.hyperliquidService.getAssetIndex(request.asset);

      // Update leverage
      const leveragePayload = {
        asset: assetIndex!,
        isCross: true,
        leverage: request.leverage,
      };
      await exchangeClient.updateLeverage(leveragePayload);

      const orderDetail = {
        a: assetIndex!,
        b: request.side === TradeSide.BUY,
        p: request.price.toString(),
        r: false,
        s: size.toFixed(assetOptimalDecimal),
        t: {
          limit: {
            tif: "Gtc",
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
      return this.processOrderResult(result);
    } catch (error) {
      this.logger.error(`Failed to execute perpetual limit order for user ${userAddress}:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async executeSpotLimitOrder(userAddress: string, request: LimitOrderSpotRequestDto): Promise<OrderExecutionResponseDto> {
    try {
      this.logger.log(`Executing spot limit order for user: ${userAddress}`);
      
      const userPrivateKey = await this.agentWalletService.derivePrivateKeyFromAddress(userAddress);
      const exchangeClient = this.hyperliquidService.getExchangeClient(userPrivateKey);

      const size = request.usdcSize / request.price;
      const assetOptimalDecimal = this.hyperliquidService.getOptimalDecimal(request.asset);
      const assetIndex = this.hyperliquidService.getAssetIndex(request.asset);

      const orderDetail = {
        a: assetIndex! + 10000,
        b: request.side === TradeSide.BUY,
        p: request.price.toString(),
        r: false,
        s: size.toFixed(assetOptimalDecimal),
        t: {
          limit: {
            tif: "Gtc",
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
      return this.processOrderResult(result);
    } catch (error) {
      this.logger.error(`Failed to execute spot limit order for user ${userAddress}:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async executePerpetualMarketOrder(userAddress: string, request: MarketOrderPerpetualRequestDto): Promise<OrderExecutionResponseDto> {
    try {
      this.logger.log(`Executing perpetual market order for user: ${userAddress}`);
      
      const userPrivateKey = await this.agentWalletService.derivePrivateKeyFromAddress(userAddress);
      const exchangeClient = this.hyperliquidService.getExchangeClient(userPrivateKey);

      const assetPrice = this.hyperliquidService.getMarketPrice(request.asset);
      const size = request.usdcSize / assetPrice;
      const assetOptimalDecimal = this.hyperliquidService.getOptimalDecimal(request.asset);
      const assetIndex = this.hyperliquidService.getAssetIndex(request.asset);
      const priceAfterSlippage = getSlippagePrice(assetOptimalDecimal, request.side === "BUY", 0.08, assetPrice);

      // Update leverage
      const leveragePayload = {
        asset: assetIndex!,
        isCross: true,
        leverage: request.leverage,
      };
      await exchangeClient.updateLeverage(leveragePayload);

      const orderDetail = {
        a: assetIndex!,
        b: request.side === TradeSide.BUY,
        p: priceAfterSlippage.toString(),
        r: false,
        s: size.toFixed(assetOptimalDecimal),
        t: {
          limit: {
            tif: "Ioc",
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
      return this.processOrderResult(result);
    } catch (error) {
      this.logger.error(`Failed to execute perpetual market order for user ${userAddress}:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async executeSpotMarketOrder(userAddress: string, request: MarketOrderSpotRequestDto): Promise<OrderExecutionResponseDto> {
    try {
      this.logger.log(`Executing spot market order for user: ${userAddress}`);
      
      const userPrivateKey = await this.agentWalletService.derivePrivateKeyFromAddress(userAddress);
      const exchangeClient = this.hyperliquidService.getExchangeClient(userPrivateKey);

      const assetPrice = this.hyperliquidService.getMarketPrice(request.asset);
      const size = request.usdcSize / assetPrice;
      const assetOptimalDecimal = this.hyperliquidService.getOptimalDecimal(request.asset);
      const assetIndex = this.hyperliquidService.getAssetIndex(request.asset);
      const priceAfterSlippage = getSlippagePrice(assetOptimalDecimal, request.side === "BUY", 0.08, assetPrice);

      const orderDetail = {
        a: assetIndex! + 10000,
        b: request.side === TradeSide.BUY,
        p: priceAfterSlippage.toString(),
        r: false,
        s: size.toFixed(assetOptimalDecimal),
        t: {
          limit: {
            tif: "Ioc",
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
      return this.processOrderResult(result);
    } catch (error) {
      this.logger.error(`Failed to execute spot market order for user ${userAddress}:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private processOrderResult(result: any): OrderExecutionResponseDto {
    const statuses = result.response.data.statuses;

    let oid = "";
    for (let i = 0; i < statuses.length; i++) {
      const status = statuses[i];
      if ('filled' in status && status.filled) {
        oid = status.filled.oid.toString();
        break;
      }
    }

    if (oid !== "") {
      return { success: true, externalTxnHash: oid };
    } else {
      return { success: false, error: 'Order not filled' };
    }
  }
}