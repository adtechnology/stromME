import type { LocationData, SunTimes } from '../types/tibber';
import { LOCATION } from '../utils/constants';

/**
 * Location Service for sunrise/sunset calculations and theme management
 */
export class LocationService {
  private location: LocationData;

  constructor(location: LocationData = LOCATION) {
    this.location = location;
  }

  /**
   * Calculate sunrise and sunset times for a given date
   * Using simplified astronomical calculations
   */
  calculateSunTimes(date: Date = new Date()): SunTimes {
    const { latitude, longitude } = this.location;
    
    // Convert to radians
    const lat = latitude * Math.PI / 180;
    const lng = longitude * Math.PI / 180;
    
    // Day of year
    const dayOfYear = this.getDayOfYear(date);
    
    // Solar declination
    const declination = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180) * Math.PI / 180;
    
    // Hour angle
    const hourAngle = Math.acos(-Math.tan(lat) * Math.tan(declination));
    
    // Time corrections
    const timeCorrection = 4 * (longitude - 15 * this.getTimezoneOffset(date)) + this.getEquationOfTime(dayOfYear);
    
    // Calculate sunrise and sunset in minutes from midnight
    const sunriseMinutes = 720 - 4 * (hourAngle * 180 / Math.PI) - timeCorrection;
    const sunsetMinutes = 720 + 4 * (hourAngle * 180 / Math.PI) - timeCorrection;
    
    // Convert to Date objects
    const sunrise = new Date(date);
    sunrise.setHours(0, 0, 0, 0);
    sunrise.setMinutes(sunriseMinutes);
    
    const sunset = new Date(date);
    sunset.setHours(0, 0, 0, 0);
    sunset.setMinutes(sunsetMinutes);
    
    return { sunrise, sunset };
  }

  /**
   * Get current theme based on time of day
   */
  getCurrentTheme(): 'light' | 'dark' {
    const now = new Date();
    const { sunrise, sunset } = this.calculateSunTimes(now);
    
    return (now >= sunrise && now < sunset) ? 'light' : 'dark';
  }

  /**
   * Check if it's currently daytime
   */
  isDaytime(): boolean {
    return this.getCurrentTheme() === 'light';
  }

  /**
   * Get time until next theme change
   */
  getTimeUntilThemeChange(): { minutes: number; nextTheme: 'light' | 'dark' } {
    const now = new Date();
    const { sunrise, sunset } = this.calculateSunTimes(now);
    
    let nextChangeTime: Date;
    let nextTheme: 'light' | 'dark';
    
    if (now < sunrise) {
      // Before sunrise - next change is sunrise (to light)
      nextChangeTime = sunrise;
      nextTheme = 'light';
    } else if (now < sunset) {
      // Between sunrise and sunset - next change is sunset (to dark)
      nextChangeTime = sunset;
      nextTheme = 'dark';
    } else {
      // After sunset - next change is tomorrow's sunrise (to light)
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowSunTimes = this.calculateSunTimes(tomorrow);
      nextChangeTime = tomorrowSunTimes.sunrise;
      nextTheme = 'light';
    }
    
    const diffMs = nextChangeTime.getTime() - now.getTime();
    const minutes = Math.floor(diffMs / (1000 * 60));
    
    return { minutes, nextTheme };
  }

  /**
   * Get sunrise and sunset times formatted for display
   */
  getFormattedSunTimes(date: Date = new Date()): {
    sunrise: string;
    sunset: string;
    sunriseTime: Date;
    sunsetTime: Date;
  } {
    const { sunrise, sunset } = this.calculateSunTimes(date);
    
    return {
      sunrise: sunrise.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      sunset: sunset.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      sunriseTime: sunrise,
      sunsetTime: sunset
    };
  }

  /**
   * Get day length in hours
   */
  getDayLength(date: Date = new Date()): number {
    const { sunrise, sunset } = this.calculateSunTimes(date);
    const diffMs = sunset.getTime() - sunrise.getTime();
    return diffMs / (1000 * 60 * 60); // Convert to hours
  }

  /**
   * Helper: Get day of year (1-365/366)
   */
  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Helper: Get timezone offset in hours
   */
  private getTimezoneOffset(date: Date): number {
    return -date.getTimezoneOffset() / 60;
  }

  /**
   * Helper: Calculate equation of time (solar time correction)
   */
  private getEquationOfTime(dayOfYear: number): number {
    const b = 2 * Math.PI * (dayOfYear - 81) / 365;
    return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  }

  /**
   * Update location coordinates
   */
  updateLocation(latitude: number, longitude: number, timezone?: string): void {
    this.location = {
      latitude,
      longitude,
      timezone: timezone || this.location.timezone
    };
  }

  /**
   * Get current location data
   */
  getLocation(): LocationData {
    return { ...this.location };
  }

  /**
   * Get location name (city) - simplified for Berlin
   */
  getLocationName(): string {
    // For Berlin coordinates, return Berlin
    if (Math.abs(this.location.latitude - 52.52) < 0.1 && 
        Math.abs(this.location.longitude - 13.405) < 0.1) {
      return 'Berlin, Germany';
    }
    
    return `${this.location.latitude.toFixed(2)}, ${this.location.longitude.toFixed(2)}`;
  }

  /**
   * Check if location is in northern hemisphere
   */
  isNorthernHemisphere(): boolean {
    return this.location.latitude > 0;
  }

  /**
   * Get season based on date and hemisphere
   */
  getSeason(date: Date = new Date()): 'spring' | 'summer' | 'autumn' | 'winter' {
    const month = date.getMonth() + 1; // 1-12
    const isNorthern = this.isNorthernHemisphere();
    
    if (isNorthern) {
      if (month >= 3 && month <= 5) return 'spring';
      if (month >= 6 && month <= 8) return 'summer';
      if (month >= 9 && month <= 11) return 'autumn';
      return 'winter';
    } else {
      // Southern hemisphere - seasons are reversed
      if (month >= 3 && month <= 5) return 'autumn';
      if (month >= 6 && month <= 8) return 'winter';
      if (month >= 9 && month <= 11) return 'spring';
      return 'summer';
    }
  }
}

/**
 * Singleton instance of the location service
 */
export const locationService = new LocationService();

/**
 * Theme Manager using location service
 */
export class ThemeManager {
  private currentTheme: 'light' | 'dark' | 'auto' = 'auto';
  private autoThemeEnabled = true;
  private themeChangeCallbacks: Array<(theme: 'light' | 'dark') => void> = [];

  constructor() {
    this.loadThemePreference();
    this.initializeTheme();
  }

  /**
   * Set theme mode
   */
  setTheme(theme: 'light' | 'dark' | 'auto'): void {
    this.currentTheme = theme;
    this.autoThemeEnabled = theme === 'auto';
    this.saveThemePreference();
    this.applyTheme();
  }

  /**
   * Get current theme mode
   */
  getTheme(): 'light' | 'dark' | 'auto' {
    return this.currentTheme;
  }

  /**
   * Get effective theme (resolved from auto)
   */
  getEffectiveTheme(): 'light' | 'dark' {
    if (this.currentTheme === 'auto') {
      return locationService.getCurrentTheme();
    }
    return this.currentTheme;
  }

  /**
   * Toggle between light and dark (disables auto mode)
   */
  toggleTheme(): void {
    const current = this.getEffectiveTheme();
    this.setTheme(current === 'light' ? 'dark' : 'light');
  }

  /**
   * Add callback for theme changes
   */
  onThemeChange(callback: (theme: 'light' | 'dark') => void): void {
    this.themeChangeCallbacks.push(callback);
  }

  /**
   * Remove theme change callback
   */
  removeThemeChangeCallback(callback: (theme: 'light' | 'dark') => void): void {
    const index = this.themeChangeCallbacks.indexOf(callback);
    if (index > -1) {
      this.themeChangeCallbacks.splice(index, 1);
    }
  }

  /**
   * Start automatic theme checking
   */
  startAutoThemeCheck(): void {
    if (!this.autoThemeEnabled) return;

    // Check every minute for theme changes
    setInterval(() => {
      if (this.autoThemeEnabled) {
        this.applyTheme();
      }
    }, 60000);
  }

  /**
   * Apply current theme to DOM
   */
  private applyTheme(): void {
    const effectiveTheme = this.getEffectiveTheme();
    const html = document.documentElement;
    
    // Remove existing theme classes
    html.classList.remove('light', 'dark');
    
    // Add current theme class
    html.classList.add(effectiveTheme);
    
    // Notify callbacks
    this.themeChangeCallbacks.forEach(callback => {
      try {
        callback(effectiveTheme);
      } catch (error) {
        console.error('Error in theme change callback:', error);
      }
    });
  }

  /**
   * Initialize theme on startup
   */
  private initializeTheme(): void {
    this.applyTheme();
    if (this.autoThemeEnabled) {
      this.startAutoThemeCheck();
    }
  }

  /**
   * Load theme preference from localStorage
   */
  private loadThemePreference(): void {
    try {
      const saved = localStorage.getItem('stromme-theme');
      if (saved && ['light', 'dark', 'auto'].includes(saved)) {
        this.currentTheme = saved as 'light' | 'dark' | 'auto';
        this.autoThemeEnabled = saved === 'auto';
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  }

  /**
   * Save theme preference to localStorage
   */
  private saveThemePreference(): void {
    try {
      localStorage.setItem('stromme-theme', this.currentTheme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }
}

/**
 * Singleton instance of the theme manager
 */
export const themeManager = new ThemeManager();