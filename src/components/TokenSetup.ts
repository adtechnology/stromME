/**
 * Token Setup Component - Secure token input interface
 * Optimized for wall-mounted displays with high contrast and large text
 */

import { TokenService } from '../services/tokenService';

export class TokenSetup {
  private container: HTMLElement;
  private onTokenConfigured: () => void;

  constructor(container: HTMLElement, onTokenConfigured: () => void) {
    this.container = container;
    this.onTokenConfigured = onTokenConfigured;
  }

  /**
   * Render the token setup interface
   */
  render(): void {
    this.container.innerHTML = `
      <div class="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <div class="bg-gray-800 rounded-2xl p-12 max-w-4xl w-full border border-gray-700 shadow-2xl">
          <!-- Header -->
          <div class="text-center mb-12">
            <h1 class="text-6xl font-bold text-white mb-6">⚡ stromME</h1>
            <h2 class="text-4xl font-semibold text-blue-400 mb-4">API Token Setup</h2>
            <p class="text-2xl text-gray-300 leading-relaxed">
              Enter your Tibber API token to start monitoring electricity prices
            </p>
          </div>

          <!-- Token Input Form -->
          <div class="space-y-8">
            <div>
              <label for="token-input" class="block text-2xl font-medium text-white mb-4">
                Tibber API Token
              </label>
              <input
                type="password"
                id="token-input"
                class="w-full px-6 py-4 text-2xl bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter your Tibber API token..."
                autocomplete="off"
                spellcheck="false"
              />
              <div id="token-error" class="mt-3 text-xl text-red-400 hidden"></div>
              <div id="token-success" class="mt-3 text-xl text-green-400 hidden"></div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-6 pt-4">
              <button
                id="save-token-btn"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-2xl font-semibold py-4 px-8 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500"
              >
                Save Token
              </button>
              <button
                id="show-token-btn"
                class="bg-gray-600 hover:bg-gray-700 text-white text-2xl font-semibold py-4 px-8 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-500"
              >
                👁️ Show
              </button>
            </div>
          </div>

          <!-- Instructions -->
          <div class="mt-12 p-8 bg-gray-700 rounded-xl border border-gray-600">
            <h3 class="text-2xl font-semibold text-white mb-4">📋 How to get your Tibber API token:</h3>
            <ol class="text-xl text-gray-300 space-y-3 list-decimal list-inside">
              <li>Go to <a href="https://developer.tibber.com/" target="_blank" class="text-blue-400 hover:text-blue-300 underline">developer.tibber.com</a></li>
              <li>Sign in with your Tibber account</li>
              <li>Create a new API token</li>
              <li>Copy the token and paste it above</li>
            </ol>
            <div class="mt-6 p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
              <p class="text-xl text-yellow-200">
                🔒 <strong>Security:</strong> Your token is stored securely in your browser only and never sent to any server except Tibber's API.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  /**
   * Attach event listeners to the form elements
   */
  private attachEventListeners(): void {
    const tokenInput = document.getElementById('token-input') as HTMLInputElement;
    const saveBtn = document.getElementById('save-token-btn') as HTMLButtonElement;
    const showBtn = document.getElementById('show-token-btn') as HTMLButtonElement;
    const errorDiv = document.getElementById('token-error') as HTMLDivElement;
    const successDiv = document.getElementById('token-success') as HTMLDivElement;

    // Save token button
    saveBtn.addEventListener('click', () => {
      this.handleSaveToken(tokenInput, errorDiv, successDiv);
    });

    // Show/hide token button
    showBtn.addEventListener('click', () => {
      this.toggleTokenVisibility(tokenInput, showBtn);
    });

    // Enter key to save
    tokenInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSaveToken(tokenInput, errorDiv, successDiv);
      }
    });

    // Clear messages on input
    tokenInput.addEventListener('input', () => {
      this.hideMessages(errorDiv, successDiv);
    });

    // Focus on input
    tokenInput.focus();
  }

  /**
   * Handle token save
   */
  private handleSaveToken(
    tokenInput: HTMLInputElement,
    errorDiv: HTMLDivElement,
    successDiv: HTMLDivElement
  ): void {
    const token = tokenInput.value.trim();

    this.hideMessages(errorDiv, successDiv);

    if (!token) {
      this.showError(errorDiv, 'Please enter your API token');
      return;
    }

    try {
      // Validate and save token
      TokenService.setToken(token);
      
      // Show success message
      this.showSuccess(successDiv, 'Token saved successfully! Loading dashboard...');
      
      // Clear the input for security
      tokenInput.value = '';
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        this.onTokenConfigured();
      }, 1500);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid token format';
      this.showError(errorDiv, errorMessage);
    }
  }

  /**
   * Toggle token visibility
   */
  private toggleTokenVisibility(tokenInput: HTMLInputElement, showBtn: HTMLButtonElement): void {
    if (tokenInput.type === 'password') {
      tokenInput.type = 'text';
      showBtn.innerHTML = '🙈 Hide';
    } else {
      tokenInput.type = 'password';
      showBtn.innerHTML = '👁️ Show';
    }
  }

  /**
   * Show error message
   */
  private showError(errorDiv: HTMLDivElement, message: string): void {
    errorDiv.textContent = `❌ ${message}`;
    errorDiv.classList.remove('hidden');
  }

  /**
   * Show success message
   */
  private showSuccess(successDiv: HTMLDivElement, message: string): void {
    successDiv.textContent = `✅ ${message}`;
    successDiv.classList.remove('hidden');
  }

  /**
   * Hide all messages
   */
  private hideMessages(errorDiv: HTMLDivElement, successDiv: HTMLDivElement): void {
    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');
  }
}