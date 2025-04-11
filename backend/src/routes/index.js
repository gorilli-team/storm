import express from 'express';
import mongoose from 'mongoose';
import { createBucket, getBucketsByWallet } from '../controllers/BucketController.js';
import { createTool, getToolsByBucket } from '../controllers/ToolController.js';

const router = express.Router();

// Database status route
router.get('/db-status', (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState === 1;
        res.json({
            connected: dbStatus,
            message: dbStatus ? 'Database connected' : 'Database not connected'
        });
    } catch (error) {
        res.status(500).json({ error: 'Error checking database status' });
    }
});

// Bucket routes
router.post('/api/buckets', createBucket);
router.get('/api/buckets/wallet/:walletAddress', getBucketsByWallet);

// Tool routes
router.post('/api/tools', createTool);
router.get('/api/tools/bucket/:bucketId', getToolsByBucket);

export default router;