/**
 * Token Service - Secure token management for Tibber API
 * Handles storage and retrieval of API tokens in browser localStorage
 */

const TOKEN_STORAGE_KEY = 'tibber_api_token';
const TOKEN_VALIDATION_REGEX = /^[A-F0-9]{64}-\d+$/;

export interface TokenValidationResult {
  isValid: boolean;
  error?: string;
}

export class TokenService {
  /**
   * Store the API token securely in localStorage
   */
  static setToken(token: string): void {
    if (!token || token.trim().length === 0) {
      throw new Error('Token cannot be empty');
    }
    
    const trimmedToken = token.trim();
    const validation = this.validateToken(trimmedToken);
    
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid token format');
    }
    
    localStorage.setItem(TOKEN_STORAGE_KEY, trimmedToken);
  }

  /**
   * Retrieve the API token from localStorage
   */
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  /**
   * Check if a valid token exists
   */
  static hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    return this.validateToken(token).isValid;
  }

  /**
   * Remove the stored token
   */
  static clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  /**
   * Validate token format
   */
  static validateToken(token: string): TokenValidationResult {
    if (!token || token.trim().length === 0) {
      return {
        isValid: false,
        error: 'Token is required'
      };
    }

    const trimmedToken = token.trim();

    // Check basic length (Tibber tokens are typically 67 characters)
    if (trimmedToken.length < 60 || trimmedToken.length > 80) {
      return {
        isValid: false,
        error: 'Token length appears incorrect (should be around 67 characters)'
      };
    }

    // Check format: hexadecimal characters followed by dash and numbers
    if (!TOKEN_VALIDATION_REGEX.test(trimmedToken)) {
      return {
        isValid: false,
        error: 'Token format is invalid (should be hexadecimal characters followed by dash and numbers)'
      };
    }

    return { isValid: true };
  }

  /**
   * Get token for API usage with fallback handling
   */
  static getTokenForApi(): string {
    const token = this.getToken();
    if (!token) {
      throw new Error('No API token found. Please configure your Tibber API token.');
    }
    
    const validation = this.validateToken(token);
    if (!validation.isValid) {
      throw new Error(`Invalid token: ${validation.error}`);
    }
    
    return token;
  }
}