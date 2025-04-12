import Bucket from '../models/BucketModel.js';
import { testnet } from "@recallnet/chains";
import { RecallClient } from "@recallnet/sdk/client";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
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

export const createBucket = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Wallet address is required' 
      });
    }

    const client = await initializeRecallClient();
    const bucketManager = client.bucketManager();
    
    const { result: { bucket: bucketId } } = await bucketManager.create();
    
    const newBucket = new Bucket({
      bucketId,
      walletAddress
    });
    
    await newBucket.save();
    
    return res.status(201).json({
      success: true,
      message: 'Bucket created successfully',
      data: newBucket
    });
    
  } catch (error) {
    console.error('Error creating bucket:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error while creating bucket',
      error: error.message
    });
  }
};

// Get all buckets for a specific wallet address
export const getBucketsByWallet = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Wallet address is required' 
      });
    }
    
    const buckets = await Bucket.find({ walletAddress });
    
    return res.status(200).json({
      success: true,
      count: buckets.length,
      data: buckets
    });
    
  } catch (error) {
    console.error('Error fetching buckets:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error while fetching buckets',
      error: error.message
    });
  }
};