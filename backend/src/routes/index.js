import express from "express";
import mongoose from "mongoose";
import {
  createBucket,
  getBucketsByWallet,
  getAllBuckets,
} from "../controllers/BucketController.js";
import {
  createTool,
  getToolsByBucket,
  getAllTools,
  getToolById, 
  getToolReviews,
  addReview,
  submitVote,
  getUserVote,
  getToolVotes
} from "../controllers/ToolController.js";
import {
  createUserIfNotExists,
  getUserByWallet,
  getAllUsers,
  updateUser,
} from "../controllers/UserController.js";
import {
  trackToolUsage,
  getToolUsage,
} from "../controllers/toolUsageController.js";

const router = express.Router();

// Database status route
router.get("/db-status", (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1;
    res.json({
      connected: dbStatus,
      message: dbStatus ? "Database connected" : "Database not connected",
    });
  } catch (error) {
    res.status(500).json({ error: "Error checking database status" });
  }
});

// Test endpoint for connectivity
router.get("/api/test", (req, res) => {
  console.log("[Test] Received test request");
  res.json({
    success: true,
    message: "API is working",
    timestamp: new Date().toISOString(),
  });
});

// Bucket routes
router.post("/api/buckets", createBucket);
router.get("/api/buckets/wallet/:walletAddress", getBucketsByWallet);
router.get("/api/buckets", getAllBuckets);

// Tool routes
router.post("/api/tools", createTool);
router.get("/api/tools/bucket/:bucketId", getToolsByBucket);
router.get("/api/tools", getAllTools);
router.get("/api/tools/:id", getToolById);

// Tool reviews routes
router.post("/api/tools/:toolId/reviews", addReview);
router.get("/api/tools/:toolId/reviews", getToolReviews);

// Tool votes routes
router.post("/api/tools/:toolId/votes", submitVote);
router.get("/api/tools/:toolId/votes/:walletAddress", getUserVote);
router.get("/api/tools/:toolId/votes", getToolVotes);

// User routes
router.post("/api/users", createUserIfNotExists);
router.get("/api/users/wallet/:walletAddress", getUserByWallet);
router.get("/api/users", getAllUsers);
router.patch("/api/users/:walletAddress", updateUser);

// Tool usage tracking routes
router.post("/api/tools/usage/track", trackToolUsage);
router.get("/api/tools/usage", getToolUsage);

export default router;
