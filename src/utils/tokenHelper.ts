/**
 * Token Helper - Browser console utilities for token management
 * This file provides console utilities for testing and managing tokens
 */

import { TokenService } from '../services/tokenService';

export const TokenHelper = {
  /**
   * Set token via browser console
   */
  setToken(token: string): void {
    try {
      TokenService.setToken(token);
      console.log('✅ Token set successfully! Reload the page to use the dashboard.');
    } catch (error) {
      console.error('❌ Failed to set token:', error instanceof Error ? error.message : error);
    }
  },

  /**
   * Check if token exists
   */
  hasToken(): boolean {
    const hasToken = TokenService.hasValidToken();
    console.log(hasToken ? '✅ Valid token found' : '❌ No valid token found');
    return hasToken;
  },

  /**
   * Clear stored token
   */
  clearToken(): void {
    TokenService.clearToken();
    console.log('🗑️ Token cleared. Reload the page to show setup screen.');
  },

  /**
   * Validate token format
   */
  validateToken(token: string): void {
    const result = TokenService.validateToken(token);
    if (result.isValid) {
      console.log('✅ Token format is valid');
    } else {
      console.error('❌ Token validation failed:', result.error);
    }
  },

  /**
   * Show help
   */
  help(): void {
    console.log(`
🔧 Token Helper Commands:
- tokenHelper.setToken('YOUR_TOKEN_HERE') - Set your Tibber API token
- tokenHelper.hasToken() - Check if token exists
- tokenHelper.clearToken() - Clear stored token
- tokenHelper.validateToken('TOKEN') - Validate token format
- tokenHelper.help() - Show this help

Example usage:
tokenHelper.setToken('DB2730D2CC924F026F7392EC8548B099338A0996A806A77B0F213B2CC08B39FB-1');
    `);
  }
};

// Make available globally for console access
(window as any).tokenHelper = TokenHelper;