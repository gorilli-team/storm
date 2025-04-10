import { WorkerEntrypoint } from 'cloudflare:workers'
import { ProxyToSelf } from 'workers-mcp'
// Recall imports
import { testnet } from "@recallnet/chains";
import { RecallClient } from "@recallnet/sdk/client";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { http } from "viem";
import CryptoJS from "crypto-js";

interface Env {
  SHARED_SECRET: string;
  RECALL_PRIVATE_KEY: string;
  ENCRYPTION_SECRET_KEY: string;
}

interface NWSWeatherResponse {
  properties: {
    forecast: string;
    periods: Array<{
      temperature: number;
      temperatureUnit: string;
      shortForecast: string;
    }>;
  };
}

export default class MyWorker extends WorkerEntrypoint<Env> {
  /**
   * A warm, friendly greeting from your new Workers MCP server.
   * @param name {string} the name of the person we are greeting.
   * @returns {string} the contents of our greeting.
   */
  sayHello(name: string): string {
    return `Hello from an MCP Worker, ${name}!`
  }

  /**
   * Retrieves a tool function from a Recall bucket
   * @param toolKey {string} The key of the tool to retrieve (e.g., 'tool/GetCryptoPrice')
   * @returns {Promise<Function>} The retrieved function
   */
  async retrieveObject(toolKey: string): Promise<Function> {
    // Set up the wallet client
    const privateKey = this.env.RECALL_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Missing RECALL_PRIVATE_KEY in environment variables");
    }

    const walletClient = createWalletClient({
      account: privateKeyToAccount(privateKey as `0x${string}`),
      chain: testnet,
      transport: http(),
    });

    // Create the RecallClient
    const client = new RecallClient({ walletClient });

    // Create the bucket manager
    const bucketManager = client.bucketManager();

    // Fixed bucket address
    const bucketAddress = "0xFf0000000000000000000000000000000000626B";

    // Retrieve the object from the bucket
    const { result: object } = await bucketManager.get(bucketAddress, toolKey);
    const decodedObject = new TextDecoder().decode(object);

    // Decrypt the function string
    const encryptionKey = this.env.ENCRYPTION_SECRET_KEY || "temp-encryption-key";
    const decryptedBytes = CryptoJS.AES.decrypt(decodedObject, encryptionKey);
    const decryptedFunctionString = decryptedBytes.toString(CryptoJS.enc.Utf8);

    // Convert the function string back to a function
    const recoveredFunction = new Function("return " + decryptedFunctionString)();

    return recoveredFunction;
  }

  /**
   * Executes a tool by its name
   * @param toolName {string} The name of the tool to execute
   * @param params {any[]} Parameters to pass to the tool function
   * @returns {Promise<any>} The result of the tool execution
   */
  async executeTool(toolName: string, ...params: any[]): Promise<any> {
    const toolKey = `tool/${toolName}`;
    
    try {
      const toolFunction = await this.retrieveObject(toolKey);
      return await toolFunction(...params);
    } catch (error) {
      return `Error executing tool ${toolName}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  /**
   * Get the current price of a cryptocurrency
   * @param coinName {string} The name of the cryptocurrency (e.g., 'bitcoin', 'ethereum')
   * @returns {Promise<string>} The current price of the cryptocurrency
   */
  async getCryptoPrice(coinName: string): Promise<string> {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=usd`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'crypto-price-app/1.0',
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        return `Failed to fetch price for ${coinName}. Status: ${response.status}`;
      }
      const data: any = await response.json();
      if (!data[coinName] || !data[coinName].usd) {
        return `Price data not found for ${coinName}`;
      }
      const price = data[coinName].usd;
      return `Current price of ${coinName}: ${price.toLocaleString()} USD`;
    } catch (error) {
      return `Error fetching price: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  /**
   * Get the current weather for a specific location
   * @param latitude {number} Latitude of the location
   * @param longitude {number} Longitude of the location
   * @returns {Promise<string>} Current temperature and weather condition
   */
  async getWeather(latitude: number, longitude: number): Promise<string> {
    const NWS_API_BASE = "https://api.weather.gov";
    const USER_AGENT = "weather-app/1.0";

    try {
      // First, get the forecast URL for the specific coordinates
      const pointsUrl = `${NWS_API_BASE}/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`;
      const pointsResponse = await fetch(pointsUrl, {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'application/geo+json'
        }
      });

      if (!pointsResponse.ok) {
        return `Failed to retrieve grid point data. Status: ${pointsResponse.status}`;
      }

      const pointsData: NWSWeatherResponse = await pointsResponse.json();
      const forecastUrl = pointsData.properties?.forecast;

      if (!forecastUrl) {
        return 'Failed to get forecast URL';
      }

      // Now get the forecast data
      const forecastResponse = await fetch(forecastUrl, {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'application/geo+json'
        }
      });

      if (!forecastResponse.ok) {
        return `Failed to retrieve forecast data. Status: ${forecastResponse.status}`;
      }

      const forecastData: NWSWeatherResponse = await forecastResponse.json();
      const currentPeriod = forecastData.properties?.periods?.[0];

      if (!currentPeriod) {
        return 'No forecast data available';
      }

      // Return just temperature and condition
      return `Temperature: ${currentPeriod.temperature}°${currentPeriod.temperatureUnit}, Condition: ${currentPeriod.shortForecast}`;

    } catch (error) {
      return `Error fetching weather: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  /**
   * @ignore
   **/
  async fetch(request: Request): Promise<Response> {
    return new ProxyToSelf(this).fetch(request)
  }
}