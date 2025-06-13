// Tibber API Types
export interface TibberHome {
  id: string;
  appNickname: string;
  address: {
    address1: string;
    address2?: string;
    address3?: string;
    postalCode: string;
    city: string;
    country: string;
  };
  owner: {
    firstName: string;
    lastName: string;
  };
  timeZone: string;
  currentSubscription: {
    id: string;
    status: string;
    priceInfo: {
      current: PriceInfo;
      today: PriceInfo[];
      tomorrow: PriceInfo[];
    };
  };
}

export interface PriceInfo {
  total: number;
  energy: number;
  tax: number;
  currency: string;
  startsAt: string;
  level: PriceLevel;
}

export type PriceLevel = 'VERY_CHEAP' | 'CHEAP' | 'NORMAL' | 'EXPENSIVE' | 'VERY_EXPENSIVE';

export interface ConsumptionNode {
  from: string;
  to: string;
  cost?: number;
  unitPrice?: number;
  unitPriceVAT?: number;
  consumption?: number;
  consumptionUnit: string;
}

export interface Consumption {
  nodes: ConsumptionNode[];
}

// API Response Types
export interface TibberApiResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

export interface ViewerResponse {
  viewer: {
    homes: TibberHome[];
  };
}

export interface HomeConsumptionResponse {
  viewer: {
    home: {
      consumption: Consumption;
    };
  };
}

// Application State Types
export interface AppState {
  currentPrice: PriceInfo | null;
  todayPrices: PriceInfo[];
  tomorrowPrices: PriceInfo[];
  consumption: ConsumptionNode[];
  selectedDevice: Device | null;
  theme: ThemeMode;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  home: TibberHome | null;
}

export interface Device {
  id: string;
  name: string;
  powerKw: number;
  icon: string;
}

export type ThemeMode = 'light' | 'dark' | 'auto';

// Chart Data Types
export interface ChartDataPoint {
  time: string;
  value: number;
  label: string;
}

export interface ConsumptionChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }>;
}

// Location and Theme Types
export interface LocationData {
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
}

// API Configuration
export interface ApiConfig {
  baseUrl: string;
  token: string;
  timeout: number;
}

// Error Types
export interface ApiError extends Error {
  code?: string;
  status?: number;
  response?: any;
}

// Utility Types
export interface PriceStats {
  current: number;
  min: number;
  max: number;
  average: number;
  minTime: string;
  maxTime: string;
}

export interface ConsumptionStats {
  total: number;
  average: number;
  peak: number;
  peakTime: string;
  cost: number;
}

// Component Props Types
export interface PriceDisplayProps {
  current: PriceInfo | null;
  todayPrices: PriceInfo[];
  loading: boolean;
}

export interface ConsumptionChartProps {
  data: ConsumptionNode[];
  loading: boolean;
  viewMode: 'chart' | 'list';
}

export interface DeviceCostCalculatorProps {
  currentPrice: PriceInfo | null;
  devices: Device[];
  selectedDevice: Device | null;
  onDeviceSelect: (device: Device | null) => void;
}

export interface CircularProgressProps {
  percentage: number;
  size: number;
  strokeWidth: number;
  color: string;
  backgroundColor: string;
  label: string;
  value: string;
}

// GraphQL Query Variables
export interface GetHomeDataVariables {
  // No variables needed for basic home query
}

export interface GetConsumptionVariables {
  homeId: string;
  resolution: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL';
  last: number;
}

export interface GetPriceForecastVariables {
  homeId: string;
}