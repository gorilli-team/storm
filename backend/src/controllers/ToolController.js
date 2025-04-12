import Tool from '../models/ToolModel.js';
import Bucket from '../models/BucketModel.js';
import { testnet } from "@recallnet/chains";
import { RecallClient } from "@recallnet/sdk/client";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import CryptoJS from "crypto-js";
import dotenv from 'dotenv';

dotenv.config();

let recallClient = null;

const initializeRecallClient = async () => {
  if (recallClient) return recallClient;
  
  try {
    const privateKey = process.env.RECALL_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Missing Recall private key in environment variables");
    }
    
    const walletClient = createWalletClient({
      account: privateKeyToAccount(privateKey),
      chain: testnet,
      transport: http(),
    });
    
    recallClient = new RecallClient({ walletClient });
    console.log("Recall client initialized successfully");
    return recallClient;
  } catch (error) {
    console.error("Failed to initialize Recall client:", error);
    throw error;
  }
};

export const createTool = async (req, res) => {
  try {
    const { bucketId, toolName, code, params } = req.body;
    
    if (!bucketId || !toolName || !code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bucket ID, tool name, and tool code are required' 
      });
    }

    const bucketExists = await Bucket.findOne({ bucketId });
    if (!bucketExists) {
      return res.status(404).json({ 
        success: false, 
        message: 'Bucket not found' 
      });
    }

    const client = await initializeRecallClient();
    const bucketManager = client.bucketManager();
    
    const key = `tool/${toolName.replace(/\s+/g, '_')}`;
    const encryptionKey = process.env.ENCRYPTION_SECRET_KEY || "temp-encryption-key";

    let paramsObject = {};
    let hasParams = false;
    
    if (params && typeof params === 'string' && params.trim() && params !== "// Define your parameters schema using Zod\n// Example:\n// {\n//   coinName: z.string().describe(\"The name of the cryptocurrency in lowercase\")\n// }") {
      hasParams = true;
      try {
        paramsObject = JSON.parse(params);
      } catch(e) {
        paramsObject = { paramSchema: params };
      }
    }
    
    const paramsString = JSON.stringify(paramsObject);
    const encryptedParamsString = CryptoJS.AES.encrypt(
      paramsString,
      encryptionKey
    ).toString();
    
    const functionString = code.toString();
    const encryptedFunctionString = CryptoJS.AES.encrypt(
      functionString,
      encryptionKey
    ).toString();
    
    const encryptedData = JSON.stringify({
      params: encryptedParamsString,
      function: encryptedFunctionString,
    });
    
    const file = new Blob([encryptedData], { type: 'application/json' });
    file.name = `${toolName.replace(/\s+/g, '_')}.json`;
    
    const { meta } = await bucketManager.add(bucketId, key, file);
    
    const newTool = new Tool({
      bucketId,
      toolName,
      hasParams
    });
    
    await newTool.save();
    
    return res.status(201).json({
      success: true,
      message: 'Tool created successfully',
      data: {
        tool: newTool,
        txHash: meta?.tx?.transactionHash
      }
    });
    
  } catch (error) {
    console.error('Error creating tool:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error while creating tool',
      error: error.message
    });
  }
};

// Get all tools for a specific bucket
export const getToolsByBucket = async (req, res) => {
  try {
    const { bucketId } = req.params;
    
    if (!bucketId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bucket ID is required' 
      });
    }
    
    const tools = await Tool.find({ bucketId }).sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: tools.length,
      data: tools
    });
    
  } catch (error) {
    console.error('Error fetching tools:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error while fetching tools',
      error: error.message
    });
  }
};