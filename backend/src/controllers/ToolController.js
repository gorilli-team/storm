import Tool from '../models/ToolModel.js';
import Bucket from '../models/BucketModel.js';
import User from '../models/UserModel.js';

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
      
      const enrichedTools = [];
      
      for (const tool of tools) {

        const user = await User.findOne({ walletAddress: tool.walletAddress });

        enrichedTools.push({
          ...tool.toObject(),
          user: user ? {
            githubUsername: user.githubUsername,
            description: user.description
          } : null
        });
      }
      
      return res.status(200).json({
        success: true,
        count: tools.length,
        data: enrichedTools
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

export const getToolById = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Tool ID is required' 
        });
      }
      
      const tool = await Tool.findById(id);
      
      if (!tool) {
        return res.status(404).json({
          success: false,
          message: 'Tool not found'
        });
      }
      
      // Fetch the user information
      const user = await User.findOne({ walletAddress: tool.walletAddress });
      
      // Create response with user data
      const response = {
        ...tool.toObject(),
        user: user ? {
          githubUsername: user.githubUsername,
          description: user.description
        } : null
      };
      
      return res.status(200).json({
        success: true,
        data: response
      });
      
    } catch (error) {
      console.error('Error fetching tool:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error while fetching tool details',
        error: error.message
      });
    }
};

export const addReview = async (req, res) => {
    try {
      const { toolId } = req.params;
      const { 
        walletAddress, 
        githubUsername = '', 
        text 
      } = req.body;
  
      if (!toolId || !walletAddress || !text) {
        return res.status(400).json({ 
          success: false, 
          message: 'Tool ID, wallet address, and review text are required' 
        });
      }
  
      const tool = await Tool.findById(toolId);
      if (!tool) {
        return res.status(404).json({ 
          success: false, 
          message: 'Tool not found' 
        });
      }
  
      const newReview = {
        walletAddress,
        githubUsername,
        text,
        createdAt: new Date()
      };
  
      tool.reviews.push(newReview);
      await tool.save();
  
      const user = await User.findOne({ walletAddress });
      
      const enrichedReview = {
        ...newReview,
        user: user ? {
          githubUsername: user.githubUsername || githubUsername,
          description: user.description
        } : null
      };
  
      return res.status(201).json({
        success: true,
        message: 'Review added successfully',
        data: enrichedReview
      });
      
    } catch (error) {
      console.error('Error adding review:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error while adding review',
        error: error.message
      });
    }
  };
  
export const getToolReviews = async (req, res) => {
try {
    const { toolId } = req.params;

    if (!toolId) {
    return res.status(400).json({ 
        success: false, 
        message: 'Tool ID is required' 
    });
    }

    const tool = await Tool.findById(toolId);
    if (!tool) {
    return res.status(404).json({ 
        success: false, 
        message: 'Tool not found' 
    });
    }

    const enrichedReviews = [];
    
    for (const review of tool.reviews) {
    const user = await User.findOne({ walletAddress: review.walletAddress });
    
    enrichedReviews.push({
        ...(typeof review.toObject === 'function' ? review.toObject() : review),
        user: user ? {
        githubUsername: user.githubUsername,
        description: user.description
        } : null
    });
    }

    return res.status(200).json({
    success: true,
    count: enrichedReviews.length,
    data: enrichedReviews
    });
    
} catch (error) {
    console.error('Error fetching tool reviews:', error);
    return res.status(500).json({ 
    success: false, 
    message: 'Error while fetching tool reviews',
    error: error.message
    });
}
};

// Submit a vote (up or down)
export const submitVote = async (req, res) => {
    try {
        const { toolId } = req.params;
        const { walletAddress, vote } = req.body;

        const tool = await Tool.findById(toolId);
        if (!tool) return res.status(404).json({ success: false, message: 'Tool not found' });

        const alreadyVoted = tool.votes.some(
        v => v.walletAddress.toLowerCase() === walletAddress.toLowerCase()
        );

        if (alreadyVoted) {
        return res.status(400).json({
            success: false,
            message: 'You have already voted and cannot change your vote',
        });
        }

        tool.votes.push({ walletAddress, vote, createdAt: new Date() });
        await tool.save();

        return res.status(200).json({
        success: true,
        message: 'Vote submitted successfully',
        data: {
            upvotes: tool.votes.filter(v => v.vote === 'up').length,
            downvotes: tool.votes.filter(v => v.vote === 'down').length,
            userVote: vote
        }
        });
    } catch (error) {
        console.error('Error submitting vote:', error);
        return res.status(500).json({ success: false, message: 'Error while submitting vote' });
    }
};
  
// Get user's vote for a tool (if any)
export const getUserVote = async (req, res) => {
try {
    const { toolId, walletAddress } = req.params;

    if (!toolId || !walletAddress) {
    return res.status(400).json({ 
        success: false, 
        message: 'Tool ID and wallet address are required' 
    });
    }

    const tool = await Tool.findById(toolId);
    if (!tool) {
    return res.status(404).json({ 
        success: false, 
        message: 'Tool not found' 
    });
    }

    const userVote = tool.votes.find(
    v => v.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );

    return res.status(200).json({
    success: true,
    data: {
        vote: userVote ? userVote.vote : null,
        upvotes: tool.votes.filter(v => v.vote === 'up').length,
        downvotes: tool.votes.filter(v => v.vote === 'down').length
    }
    });

} catch (error) {
    console.error('Error fetching user vote:', error);
    return res.status(500).json({ 
    success: false, 
    message: 'Error while fetching user vote',
    error: error.message
    });
}
};

// Get vote statistics for a tool
export const getToolVotes = async (req, res) => {
    try {
      const { toolId } = req.params;
  
      if (!toolId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Tool ID is required' 
        });
      }
  
      const tool = await Tool.findById(toolId);
      if (!tool) {
        return res.status(404).json({ 
          success: false, 
          message: 'Tool not found' 
        });
      }
  
      const upvotes = tool.votes.filter(v => v.vote === 'up').length;
      const downvotes = tool.votes.filter(v => v.vote === 'down').length;
      const totalVotes = tool.votes.length;
      const ratingPercentage = totalVotes > 0 ? (upvotes / totalVotes) * 100 : 0;
  
      return res.status(200).json({
        success: true,
        data: {
          upvotes,
          downvotes,
          totalVotes,
          ratingPercentage
        }
      });
    } catch (error) {
      console.error('Error fetching tool votes:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error while fetching tool votes',
        error: error.message
      });
    }
};