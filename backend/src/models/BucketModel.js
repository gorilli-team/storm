import mongoose from 'mongoose';

const bucketSchema = new mongoose.Schema({
  bucketId: {
    type: String,
    required: true,
    unique: true,
  },
  walletAddress: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

bucketSchema.index({ walletAddress: 1 });

const Bucket = mongoose.model('Bucket', bucketSchema);

export default Bucket;