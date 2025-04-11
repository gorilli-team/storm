import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
  bucketId: {
    type: String,
    required: true,
    ref: 'Bucket'
  },
  toolName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

toolSchema.index({ bucketId: 1, toolName: 1 });

const Tool = mongoose.model('Tool', toolSchema);

export default Tool;