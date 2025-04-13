import mongoose from "mongoose";

const toolUsageSchema = new mongoose.Schema(
  {
    toolName: {
      type: String,
      required: true,
    },
    args: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    // Add any additional fields you want to track
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const ToolUsage = mongoose.model("ToolUsage", toolUsageSchema);

export default ToolUsage;
