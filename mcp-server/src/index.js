const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MCP Protocol Endpoints
app.post("/mcp/chat/completions", async (req, res) => {
  try {
    const { messages, model, temperature, max_tokens } = req.body;

    // Here you would integrate with your AI model
    // For now, we'll return a mock response
    const response = {
      id: "chatcmpl-" + Math.random().toString(36).substring(2, 15),
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: model || "gpt-3.5-turbo",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: "This is a mock response from the MCP server.",
          },
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 10,
        total_tokens: 20,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error in chat completions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
});
