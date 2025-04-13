import express from "express";
import {
  trackToolUsage,
  getToolUsage,
} from "../controllers/toolUsageController.js";

const router = express.Router();

router.post("/track", trackToolUsage);
router.get("/usage", getToolUsage);

export default router;
