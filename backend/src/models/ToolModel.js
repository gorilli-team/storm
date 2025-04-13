import mongoose from "mongoose";

const toolSchema = new mongoose.Schema({
  bucketId: {
    type: String,
    required: true,
    ref: "Bucket",
  },
  toolName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  hashtags: {
    type: [String],
    default: [],
  },
  usages: {
    type: Number,
    default: 0,
  },
  lastUsed: {
    type: Date,
    default: null,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  votes: [
    {
      walletAddress: {
        type: String,
        required: true,
      },
      vote: {
        type: String,
        enum: ["up", "down"],
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  reviews: [
    {
      walletAddress: {
        type: String,
        required: true,
      },
      githubUsername: {
        type: String,
        default: ""
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      }
    }
  ],
  code: {
    type: String,
    default: "",
  },
  params: {
    type: String,
    default: "",
  },
  walletAddress: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

toolSchema.index({ bucketId: 1, toolName: 1 });
toolSchema.index({ walletAddress: 1 });

const Tool = mongoose.model("Tool", toolSchema);

export default Tool;