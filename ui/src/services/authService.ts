import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export interface EIP712AuthDetails {
  primaryType: string;
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
  };
  types: {
    [key: string]: Array<{
      name: string;
      type: string;
    }>;
  };
  message: Record<string, unknown>;
  timestamp: number;
}

export type GetEIP712MessageResponse = EIP712AuthDetails;

export interface AuthenticateRequest {
  method: "eip712";
  address: string;
  details: {
    signature: string;
    timestamp: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface AuthenticateResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  address: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface UserProfile {
  userId: string;
  address: string;
  appId: string;
}

// Agent Wallet interfaces
export interface GetAgentWalletResponse {
  agentWalletAddress: string;
  agentName: string;
  status: 'ACTIVE' | 'EXPIRED' | 'NOT_FOUND';
}

export interface CreateAgentWalletResponse {
  agentWalletAddress: string;
  message: string;
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getEIP712Message(address: string): Promise<GetEIP712MessageResponse> {
    try {
      const response: AxiosResponse<GetEIP712MessageResponse> = await this.axiosInstance.get(
        `/auth/eip712-message?address=${encodeURIComponent(address)}`
      );

      console.log('EIP712 API response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get EIP712 message: ${error.response?.statusText || error.message}`);
      }
      throw error;
    }
  }

  async authenticate(request: AuthenticateRequest): Promise<AuthenticateResponse> {
    try {
      const response: AxiosResponse<AuthenticateResponse> = await this.axiosInstance.post(
        '/auth/login',
        request
      );
      
      // Store tokens
      this.accessToken = response.data.accessToken;
      this.refreshToken = response.data.refreshToken;
      
      // Store in localStorage for persistence
      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Authentication failed: ${error.response?.statusText || error.message}`);
      }
      throw error;
    }
  }

  async refreshTokens(): Promise<RefreshTokenResponse> {
    const refreshToken = this.refreshToken || localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response: AxiosResponse<RefreshTokenResponse> = await this.axiosInstance.post(
        '/auth/refresh',
        { refreshToken }
      );
      
      // Update stored tokens
      this.accessToken = response.data.accessToken;
      this.refreshToken = response.data.refreshToken;
      
      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);

      return response.data;
    } catch (error) {
      // If refresh fails, clear stored tokens
      this.clearTokens();
      if (axios.isAxiosError(error)) {
        throw new Error(`Token refresh failed: ${error.response?.statusText || error.message}`);
      }
      throw error;
    }
  }


  async logout(): Promise<void> {
    const refreshToken = this.refreshToken || localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      try {
        await this.axiosInstance.post('/auth/logout', { refreshToken });
        console.log('Logout API call successful');
      } catch (error) {
        console.error('Logout API call failed:', error);
        // Don't throw error - still proceed with local cleanup
      }
    }

    this.clearTokens();
  }

  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  getAccessToken(): string | null {
    return this.accessToken || localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    
    // Check if token is expired (basic JWT expiration check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // If token has expired, clear it and return false
      if (payload.exp && payload.exp < currentTime) {
        console.log('JWT token expired, clearing tokens');
        this.clearTokens();
        return false;
      }
      
      return true;
    } catch (error) {
      // If token parsing fails, consider it invalid
      console.error('Invalid JWT token format:', error);
      this.clearTokens();
      return false;
    }
  }

  // Initialize tokens from localStorage on service creation
  initializeFromStorage(): void {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  // Helper method to make authenticated API calls with automatic token refresh
  async authenticatedRequest<T = any>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any
  ): Promise<AxiosResponse<T>> {
    const token = this.getAccessToken();
    
    if (!token) {
      throw new Error('No access token available');
    }

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };

      switch (method) {
        case 'get':
          return await this.axiosInstance.get<T>(url, config);
        case 'post':
          return await this.axiosInstance.post<T>(url, data, config);
        case 'put':
          return await this.axiosInstance.put<T>(url, data, config);
        case 'delete':
          return await this.axiosInstance.delete<T>(url, config);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Token might be expired, try to refresh
        try {
          await this.refreshTokens();
          // Retry the original request with new token
          const newToken = this.getAccessToken();
          const config = {
            headers: {
              'Authorization': `Bearer ${newToken}`,
            },
          };

          switch (method) {
            case 'get':
              return await this.axiosInstance.get<T>(url, config);
            case 'post':
              return await this.axiosInstance.post<T>(url, data, config);
            case 'put':
              return await this.axiosInstance.put<T>(url, data, config);
            case 'delete':
              return await this.axiosInstance.delete<T>(url, config);
            default:
              throw new Error(`Unsupported method: ${method}`);
          }
        } catch {
          throw new Error('Session expired. Please log in again.');
        }
      }
      throw error;
    }
  }

  async getAgentWallet(): Promise<GetAgentWalletResponse> {
    try {
      const response = await this.authenticatedRequest<GetAgentWalletResponse>('get', '/agentWallet');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // Agent wallet not found - return NOT_FOUND status
        return {
          agentWalletAddress: '',
          agentName: '',
          status: 'NOT_FOUND'
        };
      }
      
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get agent wallet: ${error.response?.statusText || error.message}`);
      }
      throw error;
    }
  }

  async createAgentWallet(): Promise<CreateAgentWalletResponse> {
    try {
      const response = await this.authenticatedRequest<CreateAgentWalletResponse>('post', '/agentWallet');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to create agent wallet: ${error.response?.statusText || error.message}`);
      }
      throw error;
    }
  }
}

export const authService = new AuthService();