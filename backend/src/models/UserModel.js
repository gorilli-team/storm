import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true
  },
  githubUsername: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.index({ walletAddress: 1 });

const User = mongoose.model('User', userSchema);

export default User;