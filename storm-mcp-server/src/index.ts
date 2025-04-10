import { WorkerEntrypoint } from 'cloudflare:workers';
import { ProxyToSelf } from 'workers-mcp';
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

interface RetrieveRequest {
  toolKey: string;
}

export default class MyWorker extends WorkerEntrypoint<Env> {
  async retrieveObject(toolKey: string): Promise<string> {
    const privateKey = this.env.RECALL_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Missing RECALL_PRIVATE_KEY in environment variables");
    }

    const walletClient = createWalletClient({
      account: privateKeyToAccount(privateKey as `0x${string}`),
      chain: testnet,
      transport: http(),
    });

    const client = new RecallClient({ walletClient });
    const bucketManager = client.bucketManager();
    const bucketAddress = "0xFf0000000000000000000000000000000000626B";

    const { result: object } = await bucketManager.get(bucketAddress, toolKey);
    const decodedObject = new TextDecoder().decode(object);

    const encryptionKey = this.env.ENCRYPTION_SECRET_KEY || "temp-encryption-key";
    const decryptedBytes = CryptoJS.AES.decrypt(decodedObject, encryptionKey);
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
  }

  private handleError(error: unknown): Response {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/retrieve' && request.method === 'POST') {
      try {
        const requestBody = await request.json() as Partial<RetrieveRequest>;
        
        if (!requestBody.toolKey) {
          return new Response(JSON.stringify({ success: false, error: "Missing toolKey in request body" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const decryptedContent = await this.retrieveObject(requestBody.toolKey);
        return new Response(JSON.stringify({ 
          success: true, 
          content: decryptedContent
        }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        return this.handleError(error);
      }
    }
    
    return new ProxyToSelf(this).fetch(request);
  }
}