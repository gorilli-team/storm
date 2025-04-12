import User from '../models/UserModel.js';

// UserController.js
export const createUserIfNotExists = async (req, res) => {
    try {
      const { walletAddress } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ 
          success: false, 
          message: 'Wallet address is required' 
        });
      }
  
      // Check if user exists
      const existingUser = await User.findOne({ walletAddress });
      
      // If user already exists, just return it
      if (existingUser) {
        return res.status(200).json({
          success: true,
          message: 'User already exists',
          data: existingUser
        });
      }
      
      // If user doesn't exist, create a new one with default values
      const newUser = new User({
        walletAddress,
        githubUsername: "",
        description: ""
      });
      
      await newUser.save();
      
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
      });
      
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error while creating user',
        error: error.message
      });
    }
  };

// Get user by wallet address
export const getUserByWallet = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Wallet address is required' 
      });
    }
    
    const user = await User.findOne({ walletAddress });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: user
    });
    
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error while fetching user',
      error: error.message
    });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
    
  } catch (error) {
    console.error('Error fetching all users:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error while fetching all users',
      error: error.message
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { githubUsername, description } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Wallet address is required' 
      });
    }
    
    const user = await User.findOne({ walletAddress });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (githubUsername !== undefined) user.githubUsername = githubUsername;
    if (description !== undefined) user.description = description;
    
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
    
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error while updating user',
      error: error.message
    });
  }
};