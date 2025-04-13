import ToolUsage from "../models/ToolUsage.js";

export const trackToolUsage = async (req, res) => {
  console.log("[ToolUsage] Received tracking request:", req.body);

  try {
    const { toolName, args, metadata } = req.body;

    if (!toolName) {
      console.error("[ToolUsage] Missing required field: toolName");
      return res.status(400).json({
        success: false,
        error: "Missing required field: toolName",
      });
    }

    console.log(`[ToolUsage] Creating record for tool: ${toolName}`);

    const toolUsage = new ToolUsage({
      toolName,
      args,
      metadata: {
        ...metadata,
        ip: req.ip,
        userAgent: req.get("user-agent"),
      },
    });

    console.log("[ToolUsage] Saving record to database...");
    await toolUsage.save();
    console.log("[ToolUsage] Record saved successfully");

    res.status(201).json({
      success: true,
      data: toolUsage,
    });
  } catch (error) {
    console.error("[ToolUsage] Error tracking tool usage:", error);
    console.error("[ToolUsage] Error details:", error.message);
    if (error.errors) {
      console.error("[ToolUsage] Validation errors:", error.errors);
    }
    res.status(500).json({
      success: false,
      error: "Error tracking tool usage",
      details: error.message,
    });
  }
};

export const getToolUsage = async (req, res) => {
  console.log("[ToolUsage] Received query request:", req.query);

  try {
    const { toolName, startDate, endDate } = req.query;

    const query = {};
    if (toolName) {
      query.toolName = toolName;
    }
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    console.log("[ToolUsage] Executing query:", query);
    const usage = await ToolUsage.find(query)
      .sort({ timestamp: -1 })
      .limit(100);

    console.log(`[ToolUsage] Found ${usage.length} records`);

    res.status(200).json({
      success: true,
      data: usage,
    });
  } catch (error) {
    console.error("[ToolUsage] Error fetching tool usage:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching tool usage",
      details: error.message,
    });
  }
};
