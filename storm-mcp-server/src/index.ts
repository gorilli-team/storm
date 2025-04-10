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

export default class MyWorker extends WorkerEntrypoint<Env> {
  /**
   * Retrieves a tool function from a Recall bucket
   * @param toolKey {string} The key of the tool to retrieve (e.g., 'tool/getGetGet')
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
   * Tests retrieving and executing a tool from Recall bucket
   * @param toolKey {string} The key of the tool to retrieve
   * @param param {string} Parameter to pass to the tool function
   * @returns {Promise<string>} The result from executing the tool
   */
  async testRecallTool(toolKey: string, param: string): Promise<string> {
    try {
      // Retrieve the function from Recall
      const toolFunction = await this.retrieveObject(toolKey);
      
      // Execute the retrieved function with the provided parameter
      const result = await toolFunction(param);
      
      return result;
    } catch (error) {
      return `Error using tool: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  /**
   * @ignore
   **/
  async fetch(request: Request): Promise<Response> {
    return new ProxyToSelf(this).fetch(request)
  }
}