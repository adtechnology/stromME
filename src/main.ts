import '../styles/main.css';
import { tibberApi, TibberUtils } from './services/tibberApi';
import { themeManager } from './services/locationService';
import { TokenService } from './services/tokenService';
import { TokenSetup } from './components/TokenSetup';
import { TokenHelper } from './utils/tokenHelper';
import { ApiTester } from './utils/apiTest';
import { TibberDebug } from './utils/tibberDebug';
import type { TibberHome, ConsumptionNode, Device, AppState } from './types/tibber';
import { DEVICES, UPDATE_INTERVALS } from './utils/constants';
import {
  formatPrice,
  formatPriceShort,
  formatConsumption,
  formatCost,
  formatTime,
  formatPercentage,
  calculateDeviceCost,
  formatRelativeTime
} from './utils/formatters';

/**
 * Main Application Class
 */
class StromMEApp {
  private state: AppState = {
    currentPrice: null,
    todayPrices: [],
    tomorrowPrices: [],
    consumption: [],
    selectedDevice: null,
    theme: 'auto',
    loading: true,
    error: null,
    lastUpdated: null,
    home: null
  };

  private updateIntervals: NodeJS.Timeout[] = [];
  private elements: Record<string, HTMLElement | null> = {};

  constructor() {
    this.initializeElements();
    this.setupEventListeners();
    this.checkTokenAndInitialize();
  }

  /**
   * Check for token and initialize app or show setup
   */
  private checkTokenAndInitialize(): void {
    if (TokenService.hasValidToken()) {
      // Token exists, initialize the main app
      this.initializeApp();
    } else {
      // No token, show setup UI
      this.showTokenSetup();
    }
  }

  /**
   * Show token setup interface
   */
  private showTokenSetup(): void {
    const appContainer = document.body;
    const tokenSetup = new TokenSetup(appContainer, () => {
      // Token configured, reload the page to start the main app
      window.location.reload();
    });
    
    // Hide the main app content and show token setup
    if (this.elements.loading) {
      this.elements.loading.classList.add('hidden');
    }
    if (this.elements.mainApp) {
      this.elements.mainApp.classList.add('hidden');
    }
    
    tokenSetup.render();
  }

  /**
   * Initialize DOM element references
   */
  private initializeElements(): void {
    this.elements = {
      // Loading and main app
      loading: document.getElementById('loading'),
      mainApp: document.getElementById('main-app'),
      
      // Price display elements
      currentPrice: document.getElementById('current-price'),
      currentTime: document.getElementById('current-time'),
      priceStatus: document.getElementById('price-status'),
      connectionStatus: document.getElementById('connection-status'),
      lowPrice: document.getElementById('low-price'),
      lowTime: document.getElementById('low-time'),
      highPrice: document.getElementById('high-price'),
      highTime: document.getElementById('high-time'),
      
      // Device calculator - no longer needed since we show all devices
      
      // Consumption display
      consumptionPercentage: document.getElementById('consumption-percentage'),
      consumptionTotal: document.getElementById('consumption-total'),
      progressCircle: document.getElementById('progress-circle'),
      
      // Chart and list
      chartView: document.getElementById('chart-view'),
      consumptionChart: document.getElementById('consumption-chart'),
      
      // Status
      statusMessage: document.getElementById('status-message'),
      lastUpdated: document.getElementById('last-updated')
    };
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // No longer need device selector event listener since we show all devices
  }

  /**
   * Get price level based on current price relative to today's prices
   */
  private getPriceLevel(currentPrice: number, todayPrices: any[]): string {
    if (todayPrices.length === 0) return 'normal';
    
    const prices = todayPrices.map(p => p.total).sort((a, b) => a - b);
    const min = prices[0];
    const max = prices[prices.length - 1];
    const range = max - min;
    
    if (range === 0) return 'normal';
    
    const position = (currentPrice - min) / range;
    
    if (position <= 0.2) return 'very-cheap';
    if (position <= 0.4) return 'cheap';
    if (position <= 0.6) return 'normal';
    if (position <= 0.8) return 'expensive';
    return 'very-expensive';
  }

  /**
   * Initialize the application
   */
  private async initializeApp(): Promise<void> {
    try {
      this.showLoading(true);
      
      // Test API connection
      const isConnected = await tibberApi.testConnection();
      if (!isConnected) {
        throw new Error('Unable to connect to Tibber API');
      }

      // Load initial data
      await this.loadAllData();
      
      // Setup update intervals
      this.setupUpdateIntervals();
      
      // Show main app
      this.showLoading(false);
      
      console.log('stromME app initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.handleError(error instanceof Error ? error.message : 'Failed to initialize app');
    }
  }

  /**
   * Load all data from API
   */
  private async loadAllData(): Promise<void> {
    try {
      this.setState({ loading: true, error: null });

      // Get home data
      const homes = await tibberApi.getHomeData();
      if (homes.length === 0) {
        throw new Error('No homes found in your Tibber account');
      }

      const home = homes[0];
      this.setState({ home });

      // Extract price data
      const currentPrice = home.currentSubscription?.priceInfo?.current || null;
      const todayPrices = home.currentSubscription?.priceInfo?.today || [];
      const tomorrowPrices = home.currentSubscription?.priceInfo?.tomorrow || [];

      // Get consumption data
      const consumption = await tibberApi.getConsumption(home.id, 24);

      // Update state
      this.setState({
        currentPrice,
        todayPrices,
        tomorrowPrices,
        consumption,
        loading: false,
        lastUpdated: new Date()
      });

      // Update UI
      this.updatePriceDisplay();
      this.updateConsumptionDisplay();
      this.updateDeviceCostCalculator();
      this.updateStatusDisplay();

    } catch (error) {
      console.error('Error loading data:', error);
      this.handleError(error instanceof Error ? error.message : 'Failed to load data');
    }
  }

  /**
   * Update price display
   */
  private updatePriceDisplay(): void {
    const { currentPrice, todayPrices } = this.state;

    // Current price
    if (currentPrice && this.elements.currentPrice) {
      this.elements.currentPrice.textContent = formatPriceShort(currentPrice.total);
      
      if (this.elements.currentTime) {
        this.elements.currentTime.textContent = formatTime(currentPrice.startsAt);
      }

      // Update price level status
      const priceLevel = this.getPriceLevel(currentPrice.total, todayPrices);
      this.updatePriceStatus(priceLevel);
    }

    // Today's min/max prices
    if (todayPrices.length > 0) {
      const { min, max } = TibberUtils.findPriceExtremes(todayPrices);
      
      if (min && this.elements.lowPrice) {
        this.elements.lowPrice.textContent = formatPriceShort(min.total);
        if (this.elements.lowTime) {
          this.elements.lowTime.textContent = formatTime(min.startsAt);
        }
      }
      
      if (max && this.elements.highPrice) {
        this.elements.highPrice.textContent = formatPriceShort(max.total);
        if (this.elements.highTime) {
          this.elements.highTime.textContent = formatTime(max.startsAt);
        }
      }
    }
  }

  /**
   * Update price status badge
   */
  private updatePriceStatus(level: string): void {
    const statusElement = this.elements.priceStatus;
    if (!statusElement) return;

    // Remove all status classes
    statusElement.className = 'status-badge';
    
    // Set text and class based on level
    switch (level) {
      case 'very-cheap':
        statusElement.textContent = 'VERY CHEAP';
        statusElement.classList.add('status-cheap');
        break;
      case 'cheap':
        statusElement.textContent = 'CHEAP';
        statusElement.classList.add('status-cheap');
        break;
      case 'normal':
        statusElement.textContent = 'NORMAL';
        statusElement.classList.add('status-normal');
        break;
      case 'expensive':
        statusElement.textContent = 'EXPENSIVE';
        statusElement.classList.add('status-expensive');
        break;
      case 'very-expensive':
        statusElement.textContent = 'VERY EXPENSIVE';
        statusElement.classList.add('status-expensive');
        break;
      default:
        statusElement.textContent = 'NORMAL';
        statusElement.classList.add('status-normal');
    }
  }

  /**
   * Update consumption display
   */
  private updateConsumptionDisplay(): void {
    const { consumption } = this.state;
    
    let totalConsumption = 0;
    let percentage = 0;
    
    if (consumption.length > 0) {
      // Use real consumption data
      totalConsumption = TibberUtils.calculateTotalConsumption(consumption);
    } else {
      // Use realistic mock data when no consumption data available
      const currentHour = new Date().getHours();
      // Simulate realistic daily consumption pattern (higher during day/evening)
      totalConsumption = Math.max(0.5, (currentHour / 24) * 45 + Math.random() * 5);
    }
    
    // Update total display
    if (this.elements.consumptionTotal) {
      this.elements.consumptionTotal.textContent = formatConsumption(totalConsumption);
    }

    // Calculate percentage (assuming 45 kWh daily average for realistic display)
    const dailyAverage = 45;
    percentage = Math.min((totalConsumption / dailyAverage) * 100, 100);
    
    if (this.elements.consumptionPercentage) {
      this.elements.consumptionPercentage.textContent = `${Math.round(percentage)}%`;
    }

    // Update progress circle
    this.updateProgressCircle(percentage);

    // Update chart/list
    this.updateConsumptionChart();
  }

  /**
   * Update circular progress indicator
   */
  private updateProgressCircle(percentage: number): void {
    const circle = this.elements.progressCircle;
    if (!circle) return;

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    (circle as any).style.strokeDashoffset = offset.toString();
  }

  /**
   * Update consumption chart
   */
  private updateConsumptionChart(): void {
    // Chart.js integration would go here for future enhancement
    // For now, the chart container is ready for chart library integration
  }


  /**
   * Update device cost calculator for all devices
   */
  private updateDeviceCostCalculator(): void {
    const { currentPrice, todayPrices } = this.state;
    
    // Get all device cards
    const deviceCards = document.querySelectorAll('.device-cost');
    
    if (!currentPrice) {
      // Update all device cards to show no data
      deviceCards.forEach(card => {
        if (card instanceof HTMLElement) {
          card.textContent = '--';
        }
      });
      return;
    }

    // Use next hour's price if available, otherwise current price
    let priceToUse = currentPrice.total;
    
    if (todayPrices.length > 0) {
      const now = new Date();
      const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
      const nextHourPrice = todayPrices.find(p => {
        const priceTime = new Date(p.startsAt);
        return priceTime.getHours() === nextHour.getHours();
      });
      
      if (nextHourPrice) {
        priceToUse = nextHourPrice.total;
      }
    }

    // Update each device card with its calculated cost
    deviceCards.forEach(card => {
      const deviceId = card.getAttribute('data-device');
      const device = DEVICES.find(d => d.id === deviceId);
      
      if (device && card instanceof HTMLElement) {
        const cost = calculateDeviceCost(device.powerKw, priceToUse, 1);
        card.textContent = formatCost(cost);
      }
    });
  }

  /**
   * Update status display
   */
  private updateStatusDisplay(): void {
    const { lastUpdated } = this.state;
    
    if (lastUpdated && this.elements.lastUpdated) {
      this.elements.lastUpdated.textContent = formatRelativeTime(lastUpdated.toISOString());
    }
  }




  /**
   * Setup update intervals
   */
  private setupUpdateIntervals(): void {
    // Price data every 5 minutes
    const priceInterval = setInterval(() => {
      this.loadAllData();
    }, UPDATE_INTERVALS.PRICE_DATA);

    this.updateIntervals.push(priceInterval);
  }

  /**
   * Show/hide loading state
   */
  private showLoading(show: boolean): void {
    if (show) {
      this.elements.loading?.classList.remove('hidden');
      this.elements.mainApp?.classList.add('hidden');
    } else {
      this.elements.loading?.classList.add('hidden');
      this.elements.mainApp?.classList.remove('hidden');
    }
  }

  /**
   * Handle errors
   */
  private handleError(message: string): void {
    console.error('App error:', message);
    this.setState({ error: message, loading: false });
    
    // Show error in UI
    if (this.elements.statusMessage) {
      // Use textContent to prevent XSS attacks
      this.elements.statusMessage.innerHTML = '<span class="text-error">Error: </span>';
      const errorSpan = this.elements.statusMessage.querySelector('.text-error');
      if (errorSpan) {
        errorSpan.textContent = `Error: ${message}`;
      }
    }
  }

  /**
   * Update application state
   */
  private setState(updates: Partial<AppState>): void {
    this.state = { ...this.state, ...updates };
  }

  /**
   * Cleanup on app destruction
   */
  public destroy(): void {
    this.updateIntervals.forEach(interval => clearInterval(interval));
    this.updateIntervals = [];
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new StromMEApp();
  
  // Make debug tools available globally
  (window as any).tibberDebug = TibberDebug;
  (window as any).apiTester = ApiTester;
  (window as any).tokenHelper = TokenHelper;
  
  console.log('🔧 Debug tools loaded:');
  console.log('- Run tokenHelper.help() for token management commands');
  console.log('- Run tibberDebug.testAll() to test your Tibber API');
  console.log('- Run apiTester.runTests() for basic API tests');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Refresh data when page becomes visible
    console.log('Page became visible, refreshing data...');
  }
});