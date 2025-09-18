import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ExecutionType {
  PERPETUAL = 'PERPETUAL',
  SPOT = 'SPOT'
}

export enum TradeSide {
  BUY = 'BUY',
  SELL = 'SELL'
}

export class TwapOrderRequestDto {
  @ApiProperty({
    description: 'Type of execution',
    enum: ExecutionType,
    example: ExecutionType.PERPETUAL
  })
  @IsEnum(ExecutionType)
  executionType!: ExecutionType;

  @ApiProperty({
    description: 'Trading asset',
    example: 'ETH'
  })
  @IsString()
  @IsNotEmpty()
  asset!: string;

  @ApiProperty({
    description: 'Trade side',
    enum: TradeSide,
    example: TradeSide.BUY
  })
  @IsEnum(TradeSide)
  side!: TradeSide;

  @ApiProperty({
    description: 'Size in USDC',
    example: 1000,
    type: 'number'
  })
  @IsNumber()
  usdcSize!: number;

  @ApiProperty({
    description: 'Leverage amount (required for perpetual)',
    example: 5,
    type: 'number',
    required: false
  })
  @IsOptional()
  @IsNumber()
  leverage?: number;

  @ApiProperty({
    description: 'TWAP running time in minutes',
    example: 60,
    type: 'number'
  })
  @IsNumber()
  twapRunningTime!: number;

  @ApiProperty({
    description: 'Whether to randomize TWAP',
    example: true,
    type: 'boolean'
  })
  @IsBoolean()
  twapRandomize!: boolean;
}

export class LimitOrderPerpetualRequestDto {
  @ApiProperty({
    description: 'Trading asset',
    example: 'ETH'
  })
  @IsString()
  @IsNotEmpty()
  asset!: string;

  @ApiProperty({
    description: 'Trade side',
    enum: TradeSide,
    example: TradeSide.BUY
  })
  @IsEnum(TradeSide)
  side!: TradeSide;

  @ApiProperty({
    description: 'Size in USDC',
    example: 1000,
    type: 'number'
  })
  @IsNumber()
  usdcSize!: number;

  @ApiProperty({
    description: 'Leverage amount',
    example: 5,
    type: 'number'
  })
  @IsNumber()
  leverage!: number;

  @ApiProperty({
    description: 'Limit price for the order',
    example: 3500.50,
    type: 'number'
  })
  @IsNumber()
  price!: number;
}

export class LimitOrderSpotRequestDto {
  @ApiProperty({
    description: 'Trading asset',
    example: 'ETH'
  })
  @IsString()
  @IsNotEmpty()
  asset!: string;

  @ApiProperty({
    description: 'Trade side',
    enum: TradeSide,
    example: TradeSide.BUY
  })
  @IsEnum(TradeSide)
  side!: TradeSide;

  @ApiProperty({
    description: 'Size in USDC',
    example: 1000,
    type: 'number'
  })
  @IsNumber()
  usdcSize!: number;

  @ApiProperty({
    description: 'Limit price for the order',
    example: 3500.50,
    type: 'number'
  })
  @IsNumber()
  price!: number;
}

export class MarketOrderPerpetualRequestDto {
  @ApiProperty({
    description: 'Trading asset',
    example: 'ETH'
  })
  @IsString()
  @IsNotEmpty()
  asset!: string;

  @ApiProperty({
    description: 'Trade side',
    enum: TradeSide,
    example: TradeSide.BUY
  })
  @IsEnum(TradeSide)
  side!: TradeSide;

  @ApiProperty({
    description: 'Size in USDC',
    example: 1000,
    type: 'number'
  })
  @IsNumber()
  usdcSize!: number;

  @ApiProperty({
    description: 'Leverage amount',
    example: 5,
    type: 'number'
  })
  @IsNumber()
  leverage!: number;
}

export class MarketOrderSpotRequestDto {
  @ApiProperty({
    description: 'Trading asset',
    example: 'ETH'
  })
  @IsString()
  @IsNotEmpty()
  asset!: string;

  @ApiProperty({
    description: 'Trade side',
    enum: TradeSide,
    example: TradeSide.BUY
  })
  @IsEnum(TradeSide)
  side!: TradeSide;

  @ApiProperty({
    description: 'Size in USDC',
    example: 1000,
    type: 'number'
  })
  @IsNumber()
  usdcSize!: number;
}

export class TakeProfitStopLossDto {
  @ApiProperty({
    description: 'Take profit price',
    example: 3800.0,
    type: 'number',
    required: false
  })
  @IsOptional()
  @IsNumber()
  takeProfitPrice?: number;

  @ApiProperty({
    description: 'Stop loss price',
    example: 3200.0,
    type: 'number',
    required: false
  })
  @IsOptional()
  @IsNumber()
  stopLossPrice?: number;
}

export class DirectMarketOrderDto {
  @ApiProperty({
    description: 'Trading asset',
    example: 'ETH'
  })
  @IsString()
  @IsNotEmpty()
  asset!: string;

  @ApiProperty({
    description: 'Trade side',
    enum: TradeSide,
    example: TradeSide.BUY
  })
  @IsEnum(TradeSide)
  side!: TradeSide;

  @ApiProperty({
    description: 'Size in USD',
    example: 1000,
    type: 'number'
  })
  @IsNumber()
  size!: number;

  @ApiProperty({
    description: 'Reduce only flag',
    example: false,
    type: 'boolean'
  })
  @IsBoolean()
  reduceOnly!: boolean;

  @ApiProperty({
    description: 'Take profit and stop loss settings',
    type: TakeProfitStopLossDto,
    required: false
  })
  @IsOptional()
  tpSl?: TakeProfitStopLossDto;

  @ApiProperty({
    description: 'Whether this is a spot order (internal use)',
    example: false,
    type: 'boolean',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isSpot?: boolean;
}

export class DirectLimitOrderDto {
  @ApiProperty({
    description: 'Trading asset',
    example: 'ETH'
  })
  @IsString()
  @IsNotEmpty()
  asset!: string;

  @ApiProperty({
    description: 'Trade side',
    enum: TradeSide,
    example: TradeSide.BUY
  })
  @IsEnum(TradeSide)
  side!: TradeSide;

  @ApiProperty({
    description: 'Size in USD',
    example: 1000,
    type: 'number'
  })
  @IsNumber()
  size!: number;

  @ApiProperty({
    description: 'Limit price',
    example: 3500.0,
    type: 'number'
  })
  @IsNumber()
  limitPrice!: number;

  @ApiProperty({
    description: 'Reduce only flag',
    example: false,
    type: 'boolean'
  })
  @IsBoolean()
  reduceOnly!: boolean;

  @ApiProperty({
    description: 'Take profit and stop loss settings',
    type: TakeProfitStopLossDto,
    required: false
  })
  @IsOptional()
  tpSl?: TakeProfitStopLossDto;
}

export class DirectScaleOrderDto {
  @ApiProperty({
    description: 'Trading asset',
    example: 'ETH'
  })
  @IsString()
  @IsNotEmpty()
  asset!: string;

  @ApiProperty({
    description: 'Trade side',
    enum: TradeSide,
    example: TradeSide.BUY
  })
  @IsEnum(TradeSide)
  side!: TradeSide;

  @ApiProperty({
    description: 'Start USD amount',
    example: 3400.0,
    type: 'number'
  })
  @IsNumber()
  startUsd!: number;

  @ApiProperty({
    description: 'End USD amount',
    example: 3600.0,
    type: 'number'
  })
  @IsNumber()
  endUsd!: number;

  @ApiProperty({
    description: 'Total size in USD to distribute across all orders',
    example: 1000,
    type: 'number'
  })
  @IsNumber()
  totalSize!: number;

  @ApiProperty({
    description: 'Total number of orders',
    example: 5,
    type: 'number'
  })
  @IsNumber()
  totalOrders!: number;

  @ApiProperty({
    description: 'Size skew (-1 to 1, where -1 skews to smaller sizes first, 1 skews to larger sizes first)',
    example: 0.0,
    type: 'number'
  })
  @IsNumber()
  sizeSkew!: number;

  @ApiProperty({
    description: 'Reduce only flag',
    example: false,
    type: 'boolean'
  })
  @IsBoolean()
  reduceOnly!: boolean;

  @ApiProperty({
    description: 'Take profit and stop loss settings',
    type: TakeProfitStopLossDto,
    required: false
  })
  @IsOptional()
  tpSl?: TakeProfitStopLossDto;
}

export class DirectStopLimitOrderDto {
  @ApiProperty({
    description: 'Trading asset',
    example: 'ETH'
  })
  @IsString()
  @IsNotEmpty()
  asset!: string;

  @ApiProperty({
    description: 'Trade side',
    enum: TradeSide,
    example: TradeSide.BUY
  })
  @IsEnum(TradeSide)
  side!: TradeSide;

  @ApiProperty({
    description: 'Size in USD',
    example: 1000,
    type: 'number'
  })
  @IsNumber()
  size!: number;

  @ApiProperty({
    description: 'Stop price (trigger price)',
    example: 3450.0,
    type: 'number'
  })
  @IsNumber()
  stopPrice!: number;

  @ApiProperty({
    description: 'Limit price',
    example: 3500.0,
    type: 'number'
  })
  @IsNumber()
  limitPrice!: number;

  @ApiProperty({
    description: 'Reduce only flag',
    example: false,
    type: 'boolean'
  })
  @IsBoolean()
  reduceOnly!: boolean;

  @ApiProperty({
    description: 'Take profit and stop loss settings',
    type: TakeProfitStopLossDto,
    required: false
  })
  @IsOptional()
  tpSl?: TakeProfitStopLossDto;
}

export class DirectStopMarketOrderDto {
  @ApiProperty({
    description: 'Trading asset',
    example: 'ETH'
  })
  @IsString()
  @IsNotEmpty()
  asset!: string;

  @ApiProperty({
    description: 'Trade side',
    enum: TradeSide,
    example: TradeSide.BUY
  })
  @IsEnum(TradeSide)
  side!: TradeSide;

  @ApiProperty({
    description: 'Size in USD',
    example: 1000,
    type: 'number'
  })
  @IsNumber()
  size!: number;

  @ApiProperty({
    description: 'Stop price (trigger price)',
    example: 3450.0,
    type: 'number'
  })
  @IsNumber()
  stopPrice!: number;

  @ApiProperty({
    description: 'Reduce only flag',
    example: false,
    type: 'boolean'
  })
  @IsBoolean()
  reduceOnly!: boolean;

  @ApiProperty({
    description: 'Take profit and stop loss settings',
    type: TakeProfitStopLossDto,
    required: false
  })
  @IsOptional()
  tpSl?: TakeProfitStopLossDto;
}

export class SetLeverageDto {
  @ApiProperty({
    description: 'Trading asset symbol',
    example: 'ETH'
  })
  @IsString()
  @IsNotEmpty()
  asset!: string;

  @ApiProperty({
    description: 'Leverage amount (1x to 50x depending on asset)',
    example: 10,
    type: 'number'
  })
  @IsNumber()
  leverage!: number;

  @ApiProperty({
    description: 'Whether to use cross margin (true) or isolated margin (false)',
    example: true,
    type: 'boolean'
  })
  @IsBoolean()
  isCross!: boolean;
}

export class SetLeverageResponseDto {
  @ApiProperty({
    description: 'Whether leverage was set successfully',
    example: true,
    type: 'boolean'
  })
  success!: boolean;

  @ApiProperty({
    description: 'Error message if unsuccessful',
    example: 'Invalid leverage for asset',
    required: false
  })
  error?: string;
}

export class DirectTwapOrderDto {
  @ApiProperty({
    description: 'Trading asset',
    example: 'ETH'
  })
  @IsString()
  @IsNotEmpty()
  asset!: string;

  @ApiProperty({
    description: 'Trade side',
    enum: TradeSide,
    example: TradeSide.BUY
  })
  @IsEnum(TradeSide)
  side!: TradeSide;

  @ApiProperty({
    description: 'Size in USD',
    example: 1000,
    type: 'number'
  })
  @IsNumber()
  size!: number;

  @ApiProperty({
    description: 'TWAP running time in minutes',
    example: 60,
    type: 'number'
  })
  @IsNumber()
  twapRunningTime!: number;

  @ApiProperty({
    description: 'Whether to randomize TWAP execution',
    example: true,
    type: 'boolean'
  })
  @IsBoolean()
  twapRandomize!: boolean;

  @ApiProperty({
    description: 'Reduce only flag',
    example: false,
    type: 'boolean'
  })
  @IsBoolean()
  reduceOnly!: boolean;
}

export class OrderExecutionResponseDto {
  @ApiProperty({
    description: 'Whether the order was successful',
    example: true,
    type: 'boolean'
  })
  success!: boolean;

  @ApiProperty({
    description: 'External transaction hash if successful',
    example: '0x1234567890abcdef...',
    required: false
  })
  externalTxnHash?: string;

  @ApiProperty({
    description: 'Error message if unsuccessful',
    example: 'Insufficient balance',
    required: false
  })
  error?: string;
}