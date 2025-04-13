import Tool from '../models/ToolModel.js';
import Bucket from '../models/BucketModel.js';

export const createTool = async (req, res) => {
  try {
    const { 
      bucketId, 
      toolName, 
      walletAddress,
      description = "",
      hashtags = [],
      code = "",
      params = ""
    } = req.body;
    
    if (!bucketId || !toolName || !walletAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bucket ID, tool name, and wallet address are required' 
      });
    }

    const bucketExists = await Bucket.findOne({ bucketId });
    if (!bucketExists) {
      return res.status(404).json({ 
        success: false, 
        message: 'Bucket not found' 
      });
    }


    let normalizedHashtags = [];
    if (Array.isArray(hashtags)) {
      normalizedHashtags = hashtags.map(tag => String(tag).trim()).filter(tag => tag.length > 0);
    } else if (typeof hashtags === 'string') {
      normalizedHashtags = hashtags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    }

    const newTool = new Tool({
      bucketId,
      toolName,
      walletAddress,
      description,
      hashtags: normalizedHashtags,
      code,
      params,
      usages: 0,
      totalEarnings: 0
    });
    
    await newTool.save();
    
    return res.status(201).json({
      success: true,
      message: 'Tool created successfully',
      data: newTool
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

// Get all tools
export const getAllTools = async (req, res) => {
    try {
      const tools = await Tool.find().sort({ createdAt: -1 });
      
      return res.status(200).json({
        success: true,
        count: tools.length,
        data: tools
      });
      
    } catch (error) {
      console.error('Error fetching all tools:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error while fetching all tools',
        error: error.message
      });
    }
};