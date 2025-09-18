import { 
  Controller, 
  Post, 
  Body, 
  Param,
  HttpCode, 
  HttpStatus, 
  Logger, 
  Request, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from '@/guards/auth.guard';
import { OrderExecutionService } from '@/services/order-execution.service';
import { 
  TwapOrderRequestDto, 
  LimitOrderPerpetualRequestDto, 
  LimitOrderSpotRequestDto, 
  MarketOrderPerpetualRequestDto, 
  MarketOrderSpotRequestDto, 
  OrderExecutionResponseDto,
  ExecutionType
} from '@/dtos/order.dto';

@ApiTags('Trading')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('trade')
export class TradeController {
  private readonly logger = new Logger(TradeController.name);

  constructor(
    private readonly orderExecutionService: OrderExecutionService,
  ) {}

  // SPOT TRADING ENDPOINTS

  @Post('spot/limit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Execute spot limit order',
    description: 'Execute a limit order for spot trading',
  })
  @ApiBody({ type: LimitOrderSpotRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Spot limit order executed successfully',
    type: OrderExecutionResponseDto
  })
  async executeSpotLimitOrder(
    @Request() req: ExpressRequest & { user: { address: string } },
    @Body() orderRequest: LimitOrderSpotRequestDto,
  ): Promise<OrderExecutionResponseDto> {
    this.logger.log(`Executing spot limit order for user: ${req.user.address}`);
    return await this.orderExecutionService.executeSpotLimitOrder(req.user.address, orderRequest);
  }

  @Post('spot/market')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Execute spot market order',
    description: 'Execute a market order for spot trading',
  })
  @ApiBody({ type: MarketOrderSpotRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Spot market order executed successfully',
    type: OrderExecutionResponseDto
  })
  async executeSpotMarketOrder(
    @Request() req: ExpressRequest & { user: { address: string } },
    @Body() orderRequest: MarketOrderSpotRequestDto,
  ): Promise<OrderExecutionResponseDto> {
    this.logger.log(`Executing spot market order for user: ${req.user.address}`);
    return await this.orderExecutionService.executeSpotMarketOrder(req.user.address, orderRequest);
  }

  @Post('spot/twap')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Execute spot TWAP order',
    description: 'Execute a TWAP order for spot trading',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['asset', 'side', 'usdcSize', 'twapRunningTime', 'twapRandomize'],
      properties: {
        asset: {
          type: 'string',
          description: 'Trading asset',
          example: 'ETH'
        },
        side: {
          type: 'string',
          enum: ['BUY', 'SELL'],
          description: 'Trade side',
          example: 'BUY'
        },
        usdcSize: {
          type: 'number',
          description: 'Size in USDC',
          example: 1000
        },
        twapRunningTime: {
          type: 'number',
          description: 'TWAP running time in minutes',
          example: 60
        },
        twapRandomize: {
          type: 'boolean',
          description: 'Whether to randomize TWAP',
          example: true
        }
      }
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Spot TWAP order executed successfully',
    type: OrderExecutionResponseDto
  })
  async executeSpotTwapOrder(
    @Request() req: ExpressRequest & { user: { address: string } },
    @Body() orderRequest: Omit<TwapOrderRequestDto, 'executionType' | 'leverage'>,
  ): Promise<OrderExecutionResponseDto> {
    this.logger.log(`Executing spot TWAP order for user: ${req.user.address}`);
    const twapRequest: TwapOrderRequestDto = { ...orderRequest, executionType: ExecutionType.SPOT };
    return await this.orderExecutionService.executeTwapOrder(req.user.address, twapRequest);
  }

  // PERPETUAL TRADING ENDPOINTS

  @Post('perpetual/limit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Execute perpetual limit order',
    description: 'Execute a limit order for perpetual trading',
  })
  @ApiBody({ type: LimitOrderPerpetualRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Perpetual limit order executed successfully',
    type: OrderExecutionResponseDto
  })
  async executePerpetualLimitOrder(
    @Request() req: ExpressRequest & { user: { address: string } },
    @Body() orderRequest: LimitOrderPerpetualRequestDto,
  ): Promise<OrderExecutionResponseDto> {
    this.logger.log(`Executing perpetual limit order for user: ${req.user.address}`);
    return await this.orderExecutionService.executePerpetualLimitOrder(req.user.address, orderRequest);
  }

  @Post('perpetual/market')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Execute perpetual market order',
    description: 'Execute a market order for perpetual trading',
  })
  @ApiBody({ type: MarketOrderPerpetualRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Perpetual market order executed successfully',
    type: OrderExecutionResponseDto
  })
  async executePerpetualMarketOrder(
    @Request() req: ExpressRequest & { user: { address: string } },
    @Body() orderRequest: MarketOrderPerpetualRequestDto,
  ): Promise<OrderExecutionResponseDto> {
    this.logger.log(`Executing perpetual market order for user: ${req.user.address}`);
    return await this.orderExecutionService.executePerpetualMarketOrder(req.user.address, orderRequest);
  }

  @Post('perpetual/twap')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Execute perpetual TWAP order',
    description: 'Execute a TWAP order for perpetual trading',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['asset', 'side', 'usdcSize', 'leverage', 'twapRunningTime', 'twapRandomize'],
      properties: {
        asset: {
          type: 'string',
          description: 'Trading asset',
          example: 'ETH'
        },
        side: {
          type: 'string',
          enum: ['BUY', 'SELL'],
          description: 'Trade side',
          example: 'BUY'
        },
        usdcSize: {
          type: 'number',
          description: 'Size in USDC',
          example: 1000
        },
        leverage: {
          type: 'number',
          description: 'Leverage amount',
          example: 5
        },
        twapRunningTime: {
          type: 'number',
          description: 'TWAP running time in minutes',
          example: 60
        },
        twapRandomize: {
          type: 'boolean',
          description: 'Whether to randomize TWAP',
          example: true
        }
      }
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Perpetual TWAP order executed successfully',
    type: OrderExecutionResponseDto
  })
  async executePerpetualTwapOrder(
    @Request() req: ExpressRequest & { user: { address: string } },
    @Body() orderRequest: Omit<TwapOrderRequestDto, 'executionType'>,
  ): Promise<OrderExecutionResponseDto> {
    this.logger.log(`Executing perpetual TWAP order for user: ${req.user.address}`);
    const twapRequest: TwapOrderRequestDto = { ...orderRequest, executionType: ExecutionType.PERPETUAL };
    return await this.orderExecutionService.executeTwapOrder(req.user.address, twapRequest);
  }
}