import { API_CONFIG } from './constants';

/**
 * Simple API test utility to debug Tibber API issues
 */
export class ApiTester {
  private static async testSimpleQuery(): Promise<void> {
    const simpleQuery = `
      query TestConnection {
        viewer {
          login
          name
        }
      }
    `;

    try {
      console.log('Testing Tibber API with simple query...');
      console.log('API URL:', API_CONFIG.baseUrl);
      console.log('Token length:', API_CONFIG.token.length);
      console.log('Token starts with:', API_CONFIG.token.substring(0, 10) + '...');

      const response = await fetch(API_CONFIG.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.token}`,
          'User-Agent': 'stromME/1.0.0'
        },
        body: JSON.stringify({
          query: simpleQuery.trim()
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Response body:', responseText);

      if (response.ok) {
        const data = JSON.parse(responseText);
        console.log('✅ API test successful:', data);
      } else {
        console.error('❌ API test failed:', response.status, responseText);
      }
    } catch (error) {
      console.error('❌ API test error:', error);
    }
  }

  private static async testHomeQuery(): Promise<void> {
    const homeQuery = `
      query GetHomes {
        viewer {
          homes {
            id
            appNickname
          }
        }
      }
    `;

    try {
      console.log('Testing Tibber API with home query...');

      const response = await fetch(API_CONFIG.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.token}`,
          'User-Agent': 'stromME/1.0.0'
        },
        body: JSON.stringify({
          query: homeQuery.trim()
        })
      });

      const responseText = await response.text();
      console.log('Home query response:', response.status, responseText);

      if (response.ok) {
        const data = JSON.parse(responseText);
        console.log('✅ Home query successful:', data);
      } else {
        console.error('❌ Home query failed:', response.status, responseText);
      }
    } catch (error) {
      console.error('❌ Home query error:', error);
    }
  }

  /**
   * Run all API tests
   */
  public static async runTests(): Promise<void> {
    console.log('🧪 Starting Tibber API tests...');
    
    await this.testSimpleQuery();
    await this.testHomeQuery();
    
    console.log('🧪 API tests completed');
  }
}

// Export for console testing
(window as any).apiTester = ApiTester;