import Tool from '../models/ToolModel.js';
import Bucket from '../models/BucketModel.js';

export const createTool = async (req, res) => {
  try {
    const { bucketId, toolName} = req.body;
    
    if (!bucketId || !toolName) {
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

    const newTool = new Tool({
      bucketId,
      toolName,
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