import type {
  TibberApiResponse,
  ViewerResponse,
  HomeConsumptionResponse,
  TibberHome,
  ConsumptionNode,
  ApiError,
  PriceLevel
} from '../types/tibber';
import { API_CONFIG, GRAPHQL_QUERIES, ERROR_MESSAGES, DEV_CONFIG } from '../utils/constants';
import { TokenService } from './tokenService';

/**
 * Tibber API Service Class
 */
export class TibberApiService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.timeout = API_CONFIG.timeout;
  }

  /**
   * Check if API key is configured
   */
  private isApiKeyConfigured(): boolean {
    return TokenService.hasValidToken();
  }

  /**
   * Generate mock home data
   */
  private generateMockHomeData(): TibberHome[] {
    const now = new Date();
    const currentPrice = 0.25 + Math.random() * 0.15; // Random price between 0.25-0.40
    
    return [{
      id: 'mock-home-1',
      appNickname: 'Demo Home',
      address: {
        address1: 'Musterstraße 123',
        address2: '',
        address3: '',
        postalCode: '13407',
        city: 'Berlin',
        country: 'DE'
      },
      owner: {
        firstName: 'Demo',
        lastName: 'User'
      },
      timeZone: 'Europe/Berlin',
      currentSubscription: {
        id: 'mock-subscription-1',
        status: 'running',
        priceInfo: {
          current: {
            total: currentPrice,
            energy: currentPrice * 0.8,
            tax: currentPrice * 0.2,
            currency: 'EUR',
            startsAt: now.toISOString(),
            level: (currentPrice > 0.35 ? 'EXPENSIVE' : currentPrice > 0.30 ? 'NORMAL' : 'CHEAP') as PriceLevel
          },
          today: this.generateMockPriceArray(24),
          tomorrow: this.generateMockPriceArray(24)
        }
      }
    }];
  }

  /**
   * Generate mock price array
   */
  private generateMockPriceArray(hours: number): Array<{
    total: number;
    energy: number;
    tax: number;
    currency: string;
    startsAt: string;
    level: PriceLevel;
  }> {
    const prices = [];
    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < hours; i++) {
      const hour = new Date(baseDate);
      hour.setHours(i);
      
      // Simulate price variation throughout the day
      let basePrice = 0.25;
      if (i >= 6 && i <= 9) basePrice = 0.35; // Morning peak
      if (i >= 17 && i <= 20) basePrice = 0.40; // Evening peak
      if (i >= 22 || i <= 5) basePrice = 0.20; // Night low
      
      const total = basePrice + (Math.random() - 0.5) * 0.1;
      
      prices.push({
        total,
        energy: total * 0.8,
        tax: total * 0.2,
        currency: 'EUR',
        startsAt: hour.toISOString(),
        level: (total > 0.35 ? 'EXPENSIVE' : total > 0.30 ? 'NORMAL' : 'CHEAP') as PriceLevel
      });
    }

    return prices;
  }

  /**
   * Generate mock consumption data
   */
  private generateMockConsumptionData(hours: number): ConsumptionNode[] {
    const nodes = [];
    const baseDate = new Date();
    baseDate.setHours(baseDate.getHours() - hours, 0, 0, 0);

    for (let i = 0; i < hours; i++) {
      const from = new Date(baseDate);
      from.setHours(from.getHours() + i);
      
      const to = new Date(from);
      to.setHours(to.getHours() + 1);

      // Simulate consumption variation throughout the day
      let baseConsumption = 1.5; // kWh
      if (from.getHours() >= 6 && from.getHours() <= 9) baseConsumption = 2.5; // Morning
      if (from.getHours() >= 17 && from.getHours() <= 22) baseConsumption = 3.0; // Evening
      if (from.getHours() >= 23 || from.getHours() <= 5) baseConsumption = 0.8; // Night

      const consumption = baseConsumption + (Math.random() - 0.5) * 0.5;
      const unitPrice = 0.25 + Math.random() * 0.15;
      const cost = consumption * unitPrice;

      nodes.push({
        from: from.toISOString(),
        to: to.toISOString(),
        cost,
        unitPrice,
        unitPriceVAT: unitPrice * 1.19,
        consumption,
        consumptionUnit: 'kWh'
      });
    }

    return nodes;
  }

  /**
   * Make GraphQL request to Tibber API
   */
  private async makeRequest<T>(query: string, variables?: any): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      // Get token dynamically from TokenService
      const token = TokenService.getTokenForApi();
      
      const requestBody = {
        query: query.trim(),
        variables: variables || {}
      };

      if (DEV_CONFIG.DEBUG_MODE) {
        console.log('Making API request:', {
          url: this.baseUrl,
          query: query.trim(),
          variables: variables || {},
          hasToken: !!token && token.length > 10
        });
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const responseText = await response.text();
      
      if (DEV_CONFIG.DEBUG_MODE) {
        console.log('API response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: responseText.substring(0, 500) + (responseText.length > 500 ? '...' : '')
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${responseText}`);
      }

      const data: TibberApiResponse<T> = JSON.parse(responseText);

      if (data.errors && data.errors.length > 0) {
        const errorMessage = data.errors.map(err => err.message).join(', ');
        throw new Error(`GraphQL Error: ${errorMessage}`);
      }

      if (!data.data) {
        throw new Error('No data received from API');
      }

      return data.data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      
      throw new Error(ERROR_MESSAGES.API_ERROR);
    }
  }

  /**
   * Get home data including current prices
   */
  async getHomeData(): Promise<TibberHome[]> {
    if (DEV_CONFIG.MOCK_DATA || !this.isApiKeyConfigured()) {
      console.log('Using mock home data');
      return this.generateMockHomeData();
    }

    try {
      const response = await this.makeRequest<ViewerResponse>(
        GRAPHQL_QUERIES.GET_HOME_DATA
      );
      
      return response.viewer.homes;
    } catch (error) {
      console.error('Error fetching home data:', error);
      throw this.createApiError(error, 'Failed to fetch home data');
    }
  }

  /**
   * Get consumption data for a specific home
   */
  async getConsumption(homeId: string, hours: number = 24): Promise<ConsumptionNode[]> {
    if (DEV_CONFIG.MOCK_DATA || !this.isApiKeyConfigured()) {
      console.log('Using mock consumption data');
      return this.generateMockConsumptionData(hours);
    }

    try {
      const variables = {
        homeId,
        last: hours
      };

      const response = await this.makeRequest<HomeConsumptionResponse>(
        GRAPHQL_QUERIES.GET_CONSUMPTION,
        variables
      );
      
      // Check if consumption data exists
      if (response?.viewer?.home?.consumption?.nodes) {
        return response.viewer.home.consumption.nodes;
      }

      // If consumption is null, this is normal for accounts without Pulse/smart meter
      console.info('ℹ️ No consumption data available - this is normal if you don\'t have a Tibber Pulse device');
      console.info('📊 Using mock consumption data for demonstration');
      
      // Generate realistic mock consumption data for demonstration
      return this.generateMockConsumptionData(hours);
    } catch (error) {
      console.error('Error fetching consumption data:', error);
      console.info('📊 Falling back to mock consumption data');
      // Fallback to mock data instead of throwing error
      return this.generateMockConsumptionData(hours);
    }
  }

  /**
   * Get the first available home (convenience method)
   */
  async getFirstHome(): Promise<TibberHome | null> {
    try {
      const homes = await this.getHomeData();
      return homes.length > 0 ? homes[0] : null;
    } catch (error) {
      console.error('Error fetching first home:', error);
      throw error;
    }
  }

  /**
   * Get current price for the first home
   */
  async getCurrentPrice(): Promise<number | null> {
    try {
      const home = await this.getFirstHome();
      return home?.currentSubscription?.priceInfo?.current?.total || null;
    } catch (error) {
      console.error('Error fetching current price:', error);
      throw error;
    }
  }

  /**
   * Test API connection with simple query
   */
  async testConnection(): Promise<boolean> {
    if (DEV_CONFIG.MOCK_DATA || !this.isApiKeyConfigured()) {
      console.log('Using mock data - skipping real API test');
      return true;
    }

    try {
      const response = await this.makeRequest<{ viewer: { login: string; name: string } }>(
        GRAPHQL_QUERIES.TEST_CONNECTION
      );
      console.log('API connection successful:', response.viewer);
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  /**
   * Test API connection (legacy method)
   */
  async testConnectionLegacy(): Promise<boolean> {
    try {
      const homes = await this.getHomeData();
      return homes.length > 0;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  /**
   * Create standardized API error
   */
  private createApiError(originalError: any, message: string): ApiError {
    const error = new Error(message) as ApiError;
    
    if (originalError instanceof Error) {
      error.code = 'API_ERROR';
      // Store original error message instead of cause
      error.message = `${message}: ${originalError.message}`;
    }
    
    return error;
  }

  /**
   * Get health status of the API
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'unhealthy';
    responseTime: number;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      await this.testConnection();
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'unhealthy',
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

/**
 * Singleton instance of the Tibber API service
 */
export const tibberApi = new TibberApiService();

/**
 * Utility functions for working with Tibber data
 */
export const TibberUtils = {
  /**
   * Find min and max prices from price array
   */
  findPriceExtremes(prices: Array<{ total: number; startsAt: string }>) {
    if (!prices || prices.length === 0) {
      return { min: null, max: null };
    }

    let min = prices[0];
    let max = prices[0];

    for (const price of prices) {
      if (price.total < min.total) {
        min = price;
      }
      if (price.total > max.total) {
        max = price;
      }
    }

    return { min, max };
  },

  /**
   * Calculate total consumption from consumption nodes
   */
  calculateTotalConsumption(nodes: ConsumptionNode[]): number {
    return nodes.reduce((total, node) => {
      return total + (node.consumption || 0);
    }, 0);
  },

  /**
   * Calculate total cost from consumption nodes
   */
  calculateTotalCost(nodes: ConsumptionNode[]): number {
    return nodes.reduce((total, node) => {
      return total + (node.cost || 0);
    }, 0);
  },

  /**
   * Get consumption for a specific hour
   */
  getConsumptionForHour(nodes: ConsumptionNode[], hour: number): ConsumptionNode | null {
    const targetHour = new Date();
    targetHour.setHours(hour, 0, 0, 0);

    return nodes.find(node => {
      const nodeTime = new Date(node.from);
      return nodeTime.getHours() === hour;
    }) || null;
  },

  /**
   * Filter consumption nodes by date range
   */
  filterConsumptionByDateRange(
    nodes: ConsumptionNode[], 
    startDate: Date, 
    endDate: Date
  ): ConsumptionNode[] {
    return nodes.filter(node => {
      const nodeDate = new Date(node.from);
      return nodeDate >= startDate && nodeDate <= endDate;
    });
  },

  /**
   * Group consumption nodes by day
   */
  groupConsumptionByDay(nodes: ConsumptionNode[]): Record<string, ConsumptionNode[]> {
    const grouped: Record<string, ConsumptionNode[]> = {};

    for (const node of nodes) {
      const date = new Date(node.from);
      const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!grouped[dayKey]) {
        grouped[dayKey] = [];
      }
      grouped[dayKey].push(node);
    }

    return grouped;
  }
};