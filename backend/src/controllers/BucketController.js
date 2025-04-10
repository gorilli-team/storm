import Bucket from '../models/BucketModel.js';

export const createBucket = async (req, res) => {
  try {
    const { bucketId, walletAddress } = req.body;
    
    if (!bucketId || !walletAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bucket ID and wallet address are required' 
      });
    }

    const existingBucket = await Bucket.findOne({ bucketId });
    if (existingBucket) {
      return res.status(400).json({ 
        success: false, 
        message: 'A bucket with this ID already exists' 
      });
    }

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