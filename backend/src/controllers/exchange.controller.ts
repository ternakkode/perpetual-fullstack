import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  Logger, 
  Request, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from '@/guards/auth.guard';
import { MarketOrderUseCase } from '@/services/usecase/market-order.usecase';
import { LimitOrderUseCase } from '@/services/usecase/limit-order.usecase';
import { ScaleOrderUseCase } from '@/services/usecase/scale-order.usecase';
import { StopLimitOrderUseCase } from '@/services/usecase/stop-limit-order.usecase';
import { StopMarketOrderUseCase } from '@/services/usecase/stop-market-order.usecase';
import { TwapOrderUseCase } from '@/services/usecase/twap-order.usecase';
import { SetLeverageUseCase } from '@/services/usecase/set-leverage.usecase';
import { 
  DirectMarketOrderDto,
  DirectLimitOrderDto,
  DirectScaleOrderDto,
  DirectStopLimitOrderDto,
  DirectStopMarketOrderDto,
  DirectTwapOrderDto,
  OrderExecutionResponseDto,
  SetLeverageDto,
  SetLeverageResponseDto
} from '@/dtos/order.dto';

@ApiTags('Exchange')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('exchange')
export class ExchangeController {
  private readonly logger = new Logger(ExchangeController.name);

  constructor(
    private readonly marketOrderUseCase: MarketOrderUseCase,
    private readonly limitOrderUseCase: LimitOrderUseCase,
    private readonly scaleOrderUseCase: ScaleOrderUseCase,
    private readonly stopLimitOrderUseCase: StopLimitOrderUseCase,
    private readonly stopMarketOrderUseCase: StopMarketOrderUseCase,
    private readonly twapOrderUseCase: TwapOrderUseCase,
    private readonly setLeverageUseCase: SetLeverageUseCase,
  ) {}

  @Post('market')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Execute direct market order',
    description: 'Execute a market order directly to Hyperliquid without executor system. Supports reduce-only and TP/SL.',
  })
  @ApiBody({ type: DirectMarketOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Market order executed successfully',
    type: OrderExecutionResponseDto
  })
  async executeMarketOrder(
    @Request() req: ExpressRequest & { user: { address: string } },
    @Body() orderRequest: DirectMarketOrderDto,
  ): Promise<OrderExecutionResponseDto> {
    this.logger.log(`Executing market order for user: ${req.user.address}`);
    return await this.marketOrderUseCase.execute(req.user.address, orderRequest);
  }

  @Post('limit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Execute direct limit order',
    description: 'Execute a limit order directly to Hyperliquid without executor system. Supports reduce-only and TP/SL.',
  })
  @ApiBody({ type: DirectLimitOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Limit order executed successfully',
    type: OrderExecutionResponseDto
  })
  async executeLimitOrder(
    @Request() req: ExpressRequest & { user: { address: string } },
    @Body() orderRequest: DirectLimitOrderDto,
  ): Promise<OrderExecutionResponseDto> {
    this.logger.log(`Executing limit order for user: ${req.user.address}`);
    return await this.limitOrderUseCase.execute(req.user.address, orderRequest);
  }

  @Post('scale')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Execute direct scale order',
    description: 'Execute multiple limit orders in a price range with configurable size skew. Supports reduce-only and TP/SL.',
  })
  @ApiBody({ type: DirectScaleOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Scale order executed successfully',
    type: OrderExecutionResponseDto
  })
  async executeScaleOrder(
    @Request() req: ExpressRequest & { user: { address: string } },
    @Body() orderRequest: DirectScaleOrderDto,
  ): Promise<OrderExecutionResponseDto> {
    this.logger.log(`Executing scale order for user: ${req.user.address}`);
    return await this.scaleOrderUseCase.execute(req.user.address, orderRequest);
  }

  @Post('stop-limit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Execute direct stop limit order',
    description: 'Execute a stop limit order with trigger price and limit price. Supports reduce-only and TP/SL.',
  })
  @ApiBody({ type: DirectStopLimitOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Stop limit order executed successfully',
    type: OrderExecutionResponseDto
  })
  async executeStopLimitOrder(
    @Request() req: ExpressRequest & { user: { address: string } },
    @Body() orderRequest: DirectStopLimitOrderDto,
  ): Promise<OrderExecutionResponseDto> {
    this.logger.log(`Executing stop limit order for user: ${req.user.address}`);
    return await this.stopLimitOrderUseCase.execute(req.user.address, orderRequest);
  }

  @Post('stop-market')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Execute direct stop market order',
    description: 'Execute a stop market order with trigger price only. Supports reduce-only and TP/SL.',
  })
  @ApiBody({ type: DirectStopMarketOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Stop market order executed successfully',
    type: OrderExecutionResponseDto
  })
  async executeStopMarketOrder(
    @Request() req: ExpressRequest & { user: { address: string } },
    @Body() orderRequest: DirectStopMarketOrderDto,
  ): Promise<OrderExecutionResponseDto> {
    this.logger.log(`Executing stop market order for user: ${req.user.address}`);
    return await this.stopMarketOrderUseCase.execute(req.user.address, orderRequest);
  }

  @Post('twap')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Execute TWAP order',
    description: 'Execute a Time-Weighted Average Price order with specified running time and randomization.',
  })
  @ApiBody({ type: DirectTwapOrderDto })
  @ApiResponse({
    status: 200,
    description: 'TWAP order executed successfully',
    type: OrderExecutionResponseDto
  })
  async executeTwapOrder(
    @Request() req: ExpressRequest & { user: { address: string } },
    @Body() orderRequest: DirectTwapOrderDto,
  ): Promise<OrderExecutionResponseDto> {
    this.logger.log(`Executing TWAP order for user: ${req.user.address}`);
    return await this.twapOrderUseCase.execute(req.user.address, orderRequest);
  }

  @Post('leverage')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set leverage for an asset',
    description: 'Set the leverage amount and margin type (cross or isolated) for a specific trading asset.',
  })
  @ApiBody({ type: SetLeverageDto })
  @ApiResponse({
    status: 200,
    description: 'Leverage set successfully',
    type: SetLeverageResponseDto
  })
  async setLeverage(
    @Request() req: ExpressRequest & { user: { address: string } },
    @Body() leverageRequest: SetLeverageDto,
  ): Promise<SetLeverageResponseDto> {
    this.logger.log(`Setting leverage for user: ${req.user.address}, asset: ${leverageRequest.asset}`);
    return await this.setLeverageUseCase.execute(req.user.address, leverageRequest);
  }
}