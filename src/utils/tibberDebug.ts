import { API_CONFIG } from './constants';

/**
 * Tibber API Debug Utility
 * Run in browser console: tibberDebug.testAll()
 */
export class TibberDebug {
  private static async makeRequest(query: string, variables?: any) {
    try {
      const response = await fetch(API_CONFIG.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.token}`,
          'User-Agent': 'stromME/1.0.0'
        },
        body: JSON.stringify({
          query: query.trim(),
          variables: variables || {}
        })
      });

      const responseText = await response.text();
      console.log(`Response Status: ${response.status}`);
      console.log(`Response Body:`, responseText);

      if (response.ok) {
        return JSON.parse(responseText);
      } else {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  static async test1_BasicConnection() {
    console.log('🧪 Test 1: Basic Connection');
    const query = `
      query {
        viewer {
          login
          name
        }
      }
    `;
    
    try {
      const result = await this.makeRequest(query);
      console.log('✅ Basic connection successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Basic connection failed:', error);
      throw error;
    }
  }

  static async test2_GetHomes() {
    console.log('🧪 Test 2: Get Homes');
    const query = `
      query {
        viewer {
          homes {
            id
            appNickname
            address {
              address1
              city
              country
            }
          }
        }
      }
    `;
    
    try {
      const result = await this.makeRequest(query);
      console.log('✅ Homes query successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Homes query failed:', error);
      throw error;
    }
  }

  static async test3_GetPrices() {
    console.log('🧪 Test 3: Get Current Prices');
    const query = `
      query {
        viewer {
          homes {
            id
            currentSubscription {
              priceInfo {
                current {
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
    `;
    
    try {
      const result = await this.makeRequest(query);
      console.log('✅ Prices query successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Prices query failed:', error);
      throw error;
    }
  }

  static async test4_GetConsumption(homeId: string) {
    console.log('🧪 Test 4: Get Consumption Data');
    const query = `
      query GetConsumption($homeId: ID!) {
        viewer {
          home(id: $homeId) {
            consumption(resolution: HOURLY, last: 24) {
              nodes {
                from
                to
                cost
                unitPrice
                consumption
                consumptionUnit
              }
            }
          }
        }
      }
    `;
    
    try {
      const result = await this.makeRequest(query, { homeId });
      console.log('✅ Consumption query successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Consumption query failed:', error);
      throw error;
    }
  }

  static async testAll() {
    console.log('🚀 Starting comprehensive Tibber API tests...');
    
    try {
      // Test 1: Basic connection
      await this.test1_BasicConnection();
      
      // Test 2: Get homes
      const homesResult = await this.test2_GetHomes();
      
      // Test 3: Get prices
      await this.test3_GetPrices();
      
      // Test 4: Get consumption (if we have homes)
      if (homesResult?.data?.viewer?.homes?.length > 0) {
        const homeId = homesResult.data.viewer.homes[0].id;
        console.log(`Using home ID: ${homeId}`);
        await this.test4_GetConsumption(homeId);
      } else {
        console.log('⚠️ No homes found, skipping consumption test');
      }
      
      console.log('🎉 All tests completed successfully!');
      
    } catch (error) {
      console.error('💥 Test suite failed:', error);
    }
  }
}

// Make available globally
(window as any).tibberDebug = TibberDebug;