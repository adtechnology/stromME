import type { PriceLevel } from '../types/tibber';
import { PRICE_LEVEL_COLORS, PRICE_LEVEL_LABELS } from './constants';

/**
 * Format price value to display with proper decimal places and currency
 */
export function formatPrice(price: number, currency: string = '¢', decimals: number = 1): string {
  if (typeof price !== 'number' || isNaN(price)) {
    return '--.-¢';
  }
  
  // Convert euros to cents
  const cents = price * 100;
  return `${cents.toFixed(decimals)}${currency}`;
}

/**
 * Format price for display in cards (shorter format)
 */
export function formatPriceShort(price: number, currency: string = '¢'): string {
  if (typeof price !== 'number' || isNaN(price)) {
    return '--.-¢';
  }
  
  // Convert euros to cents
  const cents = price * 100;
  return `${cents.toFixed(1)}${currency}`;
}

/**
 * Format consumption value with unit
 */
export function formatConsumption(consumption: number, unit: string = 'kWh', decimals: number = 2): string {
  if (typeof consumption !== 'number' || isNaN(consumption)) {
    return '--';
  }
  
  return `${consumption.toFixed(decimals)} ${unit}`;
}

/**
 * Format cost value - convert to cents for wall display consistency
 */
export function formatCost(cost: number, currency: string = '¢', decimals: number = 1): string {
  if (typeof cost !== 'number' || isNaN(cost)) {
    return '--';
  }
  
  // Convert euros to cents for consistency with price display
  const cents = cost * 100;
  return `${cents.toFixed(decimals)}${currency}`;
}

/**
 * Format percentage value
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '--';
  }
  
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format time from ISO string
 */
export function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return '--';
    }
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '--';
  }
}

/**
 * Format date from ISO string
 */
export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return '--';
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '--';
  }
}

/**
 * Format date and time from ISO string
 */
export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return '--';
    }
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '--';
  }
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return '--';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '--';
  }
}

/**
 * Get color for price level
 */
export function getPriceLevelColor(level: PriceLevel): string {
  return PRICE_LEVEL_COLORS[level] || PRICE_LEVEL_COLORS.NORMAL;
}

/**
 * Get label for price level
 */
export function getPriceLevelLabel(level: PriceLevel): string {
  return PRICE_LEVEL_LABELS[level] || 'Normal';
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (typeof current !== 'number' || typeof previous !== 'number' || previous === 0) {
    return 0;
  }
  
  return ((current - previous) / previous) * 100;
}

/**
 * Format device power rating
 */
export function formatPower(powerKw: number): string {
  if (typeof powerKw !== 'number' || isNaN(powerKw)) {
    return '--';
  }
  
  if (powerKw < 1) {
    return `${(powerKw * 1000).toFixed(0)} W`;
  }
  
  return `${powerKw.toFixed(1)} kW`;
}

/**
 * Calculate device cost for given duration
 */
export function calculateDeviceCost(powerKw: number, pricePerKwh: number, hours: number = 1): number {
  if (typeof powerKw !== 'number' || typeof pricePerKwh !== 'number' || typeof hours !== 'number') {
    return 0;
  }
  
  return powerKw * pricePerKwh * hours;
}

/**
 * Format large numbers with appropriate units
 */
export function formatLargeNumber(value: number, decimals: number = 1): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '--';
  }
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(decimals)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(decimals)}k`;
  }
  
  return value.toFixed(decimals);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (typeof text !== 'string') {
    return '';
  }
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Format duration in milliseconds to human readable format
 */
export function formatDuration(ms: number): string {
  if (typeof ms !== 'number' || isNaN(ms)) {
    return '--';
  }
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Validate and sanitize numeric input
 */
export function sanitizeNumber(value: any, fallback: number = 0): number {
  const num = parseFloat(value);
  return isNaN(num) ? fallback : num;
}

/**
 * Format chart label for time axis
 */
export function formatChartTimeLabel(isoString: string, showDate: boolean = false): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return '--';
    }
    
    if (showDate) {
      return date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
    
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Error formatting chart time label:', error);
    return '--';
  }
}

/**
 * Get appropriate decimal places based on value magnitude
 */
export function getOptimalDecimals(value: number): number {
  if (typeof value !== 'number' || isNaN(value)) {
    return 2;
  }
  
  if (value >= 100) {
    return 0;
  } else if (value >= 10) {
    return 1;
  } else if (value >= 1) {
    return 2;
  } else if (value >= 0.1) {
    return 3;
  } else {
    return 4;
  }
}