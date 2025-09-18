import axios, { AxiosResponse } from 'axios';
import { authService } from './authService';

// Trading API Types
export interface SetLeverageRequest {
  asset: string;
  leverage: number;
  isCross: boolean;
}

export interface SetLeverageResponse {
  success: boolean;
  error?: string;
}

export interface OrderExecutionResponse {
  success: boolean;
  externalTxnHash?: string;
  error?: string;
}

export interface DirectMarketOrderRequest {
  asset: string;
  side: 'BUY' | 'SELL';
  size: number;
  reduceOnly: boolean;
  tpSl?: {
    takeProfitPrice?: number;
    stopLossPrice?: number;
  };
  isSpot?: boolean;
}

export interface DirectLimitOrderRequest {
  asset: string;
  side: 'BUY' | 'SELL';
  size: number;
  limitPrice: number;
  reduceOnly: boolean;
  tpSl?: {
    takeProfitPrice?: number;
    stopLossPrice?: number;
  };
}

export interface DirectTwapOrderRequest {
  asset: string;
  side: 'BUY' | 'SELL';
  size: number;
  twapRunningTime: number;
  twapRandomize: boolean;
  reduceOnly: boolean;
}

export interface DirectScaleOrderRequest {
  asset: string;
  side: 'BUY' | 'SELL';
  startUsd: number;
  endUsd: number;
  totalSize: number;
  totalOrders: number;
  sizeSkew: number;
  reduceOnly: boolean;
  tpSl?: {
    takeProfitPrice?: number;
    stopLossPrice?: number;
  };
}

export interface DirectStopLimitOrderRequest {
  asset: string;
  side: 'BUY' | 'SELL';
  size: number;
  stopPrice: number;
  limitPrice: number;
  reduceOnly: boolean;
  tpSl?: {
    takeProfitPrice?: number;
    stopLossPrice?: number;
  };
}

export interface DirectStopMarketOrderRequest {
  asset: string;
  side: 'BUY' | 'SELL';
  size: number;
  stopPrice: number;
  reduceOnly: boolean;
  tpSl?: {
    takeProfitPrice?: number;
    stopLossPrice?: number;
  };
}

class TradingService {

  async setLeverage(request: SetLeverageRequest): Promise<SetLeverageResponse> {
    try {
      const response: AxiosResponse<SetLeverageResponse> = await authService.authenticatedRequest(
        'post',
        '/exchange/leverage',
        request
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to set leverage: ${error.response?.statusText || error.message}`);
      }
      throw error;
    }
  }

  async executeMarketOrder(request: DirectMarketOrderRequest): Promise<OrderExecutionResponse> {
    try {
      const response: AxiosResponse<OrderExecutionResponse> = await authService.authenticatedRequest(
        'post',
        '/exchange/market',
        request
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to execute market order: ${error.response?.statusText || error.message}`);
      }
      throw error;
    }
  }

  async executeLimitOrder(request: DirectLimitOrderRequest): Promise<OrderExecutionResponse> {
    try {
      const response: AxiosResponse<OrderExecutionResponse> = await authService.authenticatedRequest(
        'post',
        '/exchange/limit',
        request
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to execute limit order: ${error.response?.statusText || error.message}`);
      }
      throw error;
    }
  }

  async executeTwapOrder(request: DirectTwapOrderRequest): Promise<OrderExecutionResponse> {
    try {
      const response: AxiosResponse<OrderExecutionResponse> = await authService.authenticatedRequest(
        'post',
        '/exchange/twap',
        request
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to execute TWAP order: ${error.response?.statusText || error.message}`);
      }
      throw error;
    }
  }

  async executeScaleOrder(request: DirectScaleOrderRequest): Promise<OrderExecutionResponse> {
    try {
      const response: AxiosResponse<OrderExecutionResponse> = await authService.authenticatedRequest(
        'post',
        '/exchange/scale',
        request
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to execute scale order: ${error.response?.statusText || error.message}`);
      }
      throw error;
    }
  }

  async executeStopLimitOrder(request: DirectStopLimitOrderRequest): Promise<OrderExecutionResponse> {
    try {
      const response: AxiosResponse<OrderExecutionResponse> = await authService.authenticatedRequest(
        'post',
        '/exchange/stop-limit',
        request
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to execute stop limit order: ${error.response?.statusText || error.message}`);
      }
      throw error;
    }
  }

  async executeStopMarketOrder(request: DirectStopMarketOrderRequest): Promise<OrderExecutionResponse> {
    try {
      const response: AxiosResponse<OrderExecutionResponse> = await authService.authenticatedRequest(
        'post',
        '/exchange/stop-market',
        request
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to execute stop market order: ${error.response?.statusText || error.message}`);
      }
      throw error;
    }
  }
}

export const tradingService = new TradingService();