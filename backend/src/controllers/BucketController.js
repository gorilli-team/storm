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