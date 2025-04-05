const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// Read the configuration file
const configPath = path.join(__dirname, "mcp-config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

// Get the Slack MCP server configuration
const slackConfig = config.mcpServers["@modelcontextprotocol/slack"];

if (!slackConfig) {
  console.error("Slack MCP server configuration not found");
  process.exit(1);
}

// Set up environment variables
const env = {
  ...process.env,
  ...slackConfig.env,
};

// Execute the command
const command = slackConfig.command;
const args = slackConfig.args;

console.log(`Starting MCP server with command: ${command} ${args.join(" ")}`);
console.log(`Environment variables:`, env);

const child = spawn(command, args, {
  env,
  stdio: "inherit",
  shell: true,
});

child.on("error", (err) => {
  console.error("Failed to start MCP server:", err);
  process.exit(1);
});

child.on("close", (code) => {
  console.log(`MCP server process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on("SIGINT", () => {
  console.log("Shutting down MCP server...");
  child.kill("SIGINT");
});

process.on("SIGTERM", () => {
  console.log("Shutting down MCP server...");
  child.kill("SIGTERM");
});
