import type { Device, ApiConfig, LocationData } from '../types/tibber';

// API Configuration
export const API_CONFIG: ApiConfig = {
  baseUrl: 'https://api.tibber.com/v1-beta/gql',
  token: 'DB2730D2CC924F026F7392EC8548B099338A0996A806A77B0F213B2CC08B39FB-1',
  timeout: 10000
};

// Location Configuration (Berlin, Germany)
export const LOCATION: LocationData = {
  latitude: 52.5200,
  longitude: 13.4050,
  timezone: 'Europe/Berlin'
};

// Device Definitions
export const DEVICES: Device[] = [
  {
    id: 'washing-machine',
    name: 'Washing Machine',
    powerKw: 2.0,
    icon: '🧺'
  },
  {
    id: 'tumble-dryer',
    name: 'Tumble Dryer',
    powerKw: 3.0,
    icon: '🌪️'
  },
  {
    id: 'induction-cooker',
    name: 'Induction Cooker',
    powerKw: 2.5,
    icon: '🍳'
  },
  {
    id: 'baking-oven',
    name: 'Baking Oven',
    powerKw: 3.5,
    icon: '🔥'
  },
  {
    id: 'tv',
    name: 'TV',
    powerKw: 0.1,
    icon: '📺'
  }
];

// Update Intervals (in milliseconds)
export const UPDATE_INTERVALS = {
  PRICE_DATA: 5 * 60 * 1000,      // 5 minutes
  CONSUMPTION_DATA: 15 * 60 * 1000, // 15 minutes
  THEME_CHECK: 60 * 60 * 1000,     // 1 hour
  SUNRISE_SUNSET: 24 * 60 * 60 * 1000 // 24 hours
};

// GraphQL Queries
export const GRAPHQL_QUERIES = {
  // Simple test query first
  TEST_CONNECTION: `
    query TestConnection {
      viewer {
        login
        name
      }
    }
  `,

  GET_HOME_DATA: `
    query GetHomeData {
      viewer {
        homes {
          id
          appNickname
          address {
            address1
            address2
            address3
            postalCode
            city
            country
          }
          owner {
            firstName
            lastName
          }
          timeZone
          currentSubscription {
            id
            status
            priceInfo {
              current {
                total
                energy
                tax
                currency
                startsAt
                level
              }
              today {
                total
                energy
                tax
                currency
                startsAt
                level
              }
              tomorrow {
                total
                energy
                tax
                currency
                startsAt
                level
              }
            }
          }
        }
      }
    }
  `,

  GET_CONSUMPTION: `
    query GetConsumption($homeId: ID!, $last: Int!) {
      viewer {
        home(id: $homeId) {
          consumption(resolution: HOURLY, last: $last) {
            nodes {
              from
              to
              cost
              unitPrice
              unitPriceVAT
              consumption
              consumptionUnit
            }
          }
        }
      }
    }
  `,

  GET_PRICE_FORECAST: `
    query GetPriceForecast($homeId: ID!) {
      viewer {
        home(id: $homeId) {
          currentSubscription {
            priceInfo {
              tomorrow {
                total
                energy
                tax
                currency
                startsAt
                level
              }
            }
          }
        }
      }
    }
  `
};

// Price Level Colors
export const PRICE_LEVEL_COLORS = {
  VERY_CHEAP: '#10B981',   // Green
  CHEAP: '#059669',        // Dark Green
  NORMAL: '#6B7280',       // Gray
  EXPENSIVE: '#F59E0B',    // Amber
  VERY_EXPENSIVE: '#EF4444' // Red
};

// Price Level Labels
export const PRICE_LEVEL_LABELS = {
  VERY_CHEAP: 'Very Cheap',
  CHEAP: 'Cheap',
  NORMAL: 'Normal',
  EXPENSIVE: 'Expensive',
  VERY_EXPENSIVE: 'Very Expensive'
};

// Chart Configuration
export const CHART_CONFIG = {
  COLORS: {
    PRIMARY: '#14B8A6',
    SECONDARY: '#F59E0B',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    GRID: '#374151',
    TEXT: '#9CA3AF'
  },
  ANIMATION: {
    DURATION: 750,
    EASING: 'easeInOutQuart'
  }
};

// Theme Configuration
export const THEME_CONFIG = {
  AUTO_SWITCH_ENABLED: true,
  TRANSITION_DURATION: 300, // milliseconds
  STORAGE_KEY: 'stromme-theme'
};

// Error Messages
export const ERROR_MESSAGES = {
  API_ERROR: 'Failed to fetch data from Tibber API',
  NETWORK_ERROR: 'Network connection error',
  INVALID_RESPONSE: 'Invalid response from server',
  NO_DATA: 'No data available',
  LOCATION_ERROR: 'Failed to get location data',
  THEME_ERROR: 'Failed to update theme'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  DATA_UPDATED: 'Data updated successfully',
  THEME_CHANGED: 'Theme changed successfully'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'stromme-theme',
  LAST_UPDATE: 'stromme-last-update',
  CACHED_DATA: 'stromme-cached-data',
  SELECTED_DEVICE: 'stromme-selected-device'
};

// Default Values
export const DEFAULTS = {
  CONSUMPTION_HOURS: 24,
  PRICE_DECIMAL_PLACES: 4,
  CONSUMPTION_DECIMAL_PLACES: 2,
  COST_DECIMAL_PLACES: 2,
  CHART_HEIGHT: 300,
  PROGRESS_CIRCLE_SIZE: 120,
  PROGRESS_STROKE_WIDTH: 8
};

// Responsive Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// Animation Durations
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000
};

// Validation Rules
export const VALIDATION = {
  MIN_PRICE: 0,
  MAX_PRICE: 1,
  MIN_CONSUMPTION: 0,
  MAX_CONSUMPTION: 100,
  MIN_POWER: 0.01,
  MAX_POWER: 10
};

// Feature Flags
export const FEATURES = {
  ENABLE_NOTIFICATIONS: false,
  ENABLE_PRICE_ALERTS: false,
  ENABLE_EXPORT: false,
  ENABLE_COMPARISON: false,
  ENABLE_FORECASTING: true
};

// Development Configuration
export const DEV_CONFIG = {
  ENABLE_LOGGING: true,
  MOCK_DATA: false, // Using real Tibber API data
  DEBUG_MODE: true
};