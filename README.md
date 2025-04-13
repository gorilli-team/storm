# Storm MCP Marketplace

> A decentralized marketplace connecting developers and users through MCP tools, enabling monetization via Recall tokens and creating a seamless ecosystem for specialized AI capabilities.

## Overview

Storm is a decentralized marketplace for AI tools where developers can publish and monetize their Model Control Protocol (MCP) tools directly. Consumers access these tools through token-based payments, creating an ecosystem that rewards developers while providing users with diverse AI capabilities.

The platform uses AES encryption for secure tool storage and transmission, and integrates with Recall tokens to enable micropayments between users and developers.

## Key Features

- **Developer Monetization**: Publish your MCP tools and earn tokens when consumers use them
- **Consumer Access**: Use a variety of specialized AI tools through a single unified interface
- **Token Economy**: Powered by Recall tokens and wallet integration with account abstraction
- **Transparent Source Code**: Option to showcase tool source code in the frontend
- **Simple Integration**: Easy to install and use with platforms like Claude Desktop
- **AES Encryption**: Industry-standard security for tool parameters and functions
- **Tool Buckets**: Organized storage system for efficient tool management

## Technical Architecture

### Tool Management Flow

![Recall Integration](/assets/Overview.png)

The Storm platform uses a sophisticated workflow to securely store and retrieve tools:

1. **Create Bucket**: Initialize storage for new tools
2. **Add Tool**: Encrypt tool parameters and functions with AES before storage
3. **Retrieve Tool**: Securely retrieve and decrypt tools when needed
4. **MCP Server Integration**: Seamlessly connect with MCP servers for tool execution

### Tool Bucket Structure

![Tool Bucket](/assets/Tool%20bucket.png)

Tools in Storm are organized in buckets with detailed component information:

- Tool name
- Parameter schemas with validation rules
- Function implementations
- Secure access controls

### Detailed Tool Processing Workflow

![Detailed Workflow](</assets/Detailed%20workflow%20(pt.1).png>)

When a developer adds a new tool to Storm:

1. Parameters and function bodies are separated
2. Each component is serialized to JSON/string format
3. AES encryption is applied to both components
4. The encrypted components are combined into a single object
5. The tool is stored in the appropriate bucket

### Tool Retrieval and Execution

![Tool Retrieval](</assets/Detailed%20workflow%20(pt.2).png>)

When a user requests a tool:

1. The encrypted tool is retrieved from the bucket
2. Decryption is performed using the appropriate keys
3. Parameters and functions are reconstructed
4. Zod schema validation ensures security and correctness
5. The tool is made available to the MCP server for execution

## How It Works

### For Developers

1. **Create Your Tool**: Develop your MCP-compatible tool using the Storm SDK
2. **Configure Parameters**: Define the input parameters and validation rules
3. **Implement Function**: Write the core functionality that your tool provides
4. **Publish to Marketplace**: Submit your tool with pricing information
5. **Monitor Usage**: Track usage statistics and token earnings

### For Consumers

1. **Install Storm**: Set up the Storm MCP server on your system
2. **Fund Your Wallet**: Ensure your wallet has sufficient Recall tokens
3. **Browse Tools**: Explore available tools in the marketplace
4. **Use Tools via AI**: Make queries to your AI assistant that leverage Storm tools
5. **Automatic Payments**: Micropayments are processed automatically to tool developers

## Current Tool Types

Storm currently supports a variety of tools that don't require authentication from consumers:

- **Cryptocurrency Information**: Real-time pricing and market data
- **Weather Information**: Current conditions and forecasts
- **Geographic Data**: Location details and ZIP code information
- **Train Schedules**: Status updates and timetables
- **Financial Tools**: Currency conversion and stock data
- **Research APIs**: Academic and scientific data access

## Security Features

- **AES Encryption**: All tool code and parameters are encrypted at rest and in transit
- **Secure Key Management**: Advanced key rotation and storage
- **Access Controls**: Granular permissions for tool access
- **Audit Logging**: Comprehensive logging of all tool usage
- **Parameter Validation**: Strict schema enforcement using Zod

## 🚀 Next Steps

### Intelligent Tool Selection System

- **Quality-Based Probabilistic Routing**: Implementing a sophisticated selection algorithm where similar tools are chosen based on their quality scores. For example, if Tool A has a score of 60 and Tool B has a score of 40, Tool A will be selected approximately 60% of the time and Tool B about 40% of the time.

```javascript
// Pseudocode for quality-based tool selection
function selectTool(category, parameters) {
  // Get all compatible tools for this category
  const compatibleTools = getToolsByCategory(category);

  // Filter for tools that can handle these parameters
  const eligibleTools = compatibleTools.filter((tool) =>
    canHandleParameters(tool, parameters)
  );

  // If no eligible tools, return error
  if (eligibleTools.length === 0) return null;

  // If only one tool, use it
  if (eligibleTools.length === 1) return eligibleTools[0];

  // Calculate total quality score for normalization
  const totalQualityScore = eligibleTools.reduce(
    (sum, tool) => sum + getQualityScore(tool),
    0
  );

  // Assign selection probability based on normalized score
  const toolsWithProbability = eligibleTools.map((tool) => ({
    tool,
    probability: getQualityScore(tool) / totalQualityScore,
  }));

  // Select tool based on weighted random selection
  const randomValue = Math.random();
  let cumulativeProbability = 0;

  for (const { tool, probability } of toolsWithProbability) {
    cumulativeProbability += probability;
    if (randomValue <= cumulativeProbability) {
      // Log selection for analytics
      logToolSelection(tool, category, parameters);
      return tool;
    }
  }
}
```

Function Wrapping & Execution System

Transparent Function Wrapping: Automatically enhancing developer-provided functions with tracking, monitoring, and monetization capabilities.

```javascript
// Pseudocode for wrapping developer functions with tracking and monetization
function wrapDeveloperFunction(toolId, developerFunction) {
  // Return a wrapped function with the same signature
  return async function wrappedFunction(...args) {
    const executionId = generateExecutionId();
    const startTime = performance.now();
    const tool = getToolById(toolId);
    const userId = getCurrentUserId();

    // Log execution start
    await logExecutionStart({
      executionId,
      toolId,
      userId,
      timestamp: new Date(),
      parameters: args,
    });

    try {
      // Check if user has sufficient tokens (if tool requires payment)
      if (tool.pricePerExecution > 0) {
        const userBalance = await getUserTokenBalance(userId);

        if (userBalance < tool.pricePerExecution) {
          throw new Error("Insufficient tokens for tool execution");
        }

        // Reserve tokens (but don't transfer yet)
        await reserveTokens(userId, tool.pricePerExecution, executionId);
      }

      // Execute the developer's original function
      const result = await developerFunction(...args);

      // Calculate execution time
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Validate result format
      validateResultFormat(result, tool.outputSchema);

      // Process successful execution
      await handleSuccessfulExecution({
        executionId,
        toolId,
        userId,
        result,
        executionTime,
        timestamp: new Date(),
      });

      // Transfer reserved tokens to developer if execution was successful
      if (tool.pricePerExecution > 0) {
        const developerAddress = getDeveloperWalletAddress(tool.developerId);
        await transferReservedTokens(executionId, developerAddress);
      }

      // Return the original result
      return result;
    } catch (error) {
      // Log execution error
      await logExecutionError({
        executionId,
        toolId,
        userId,
        error: error.message,
        timestamp: new Date(),
      });

      // Release reserved tokens back to user
      if (tool.pricePerExecution > 0) {
        await releaseReservedTokens(executionId);
      }

      // Rethrow for proper error handling
      throw error;
    }
  };
}
```

Execution Monitoring: Real-time tracking of tool performance, reliability, and usage patterns.

```javascript
// Pseudocode for execution monitoring system
class ExecutionMonitor {
  constructor() {
    this.activeExecutions = new Map();
    this.executionTimeouts = new Map();
    this.alertThresholds = this.loadAlertThresholds();
  }

  // Register a new execution
  trackExecution(executionId, toolId) {
    const startTime = Date.now();
    this.activeExecutions.set(executionId, {
      toolId,
      startTime,
      status: "running",
    });

    // Set timeout for execution
    const tool = getToolById(toolId);
    const timeoutMs = tool.timeoutMs || 30000; // Default 30s timeout

    const timeoutId = setTimeout(() => {
      this.handleExecutionTimeout(executionId);
    }, timeoutMs);

    this.executionTimeouts.set(executionId, timeoutId);
  }

  // Mark execution as completed
  completeExecution(executionId, status, metrics = {}) {
    if (!this.activeExecutions.has(executionId)) return;

    const execution = this.activeExecutions.get(executionId);
    const endTime = Date.now();
    const duration = endTime - execution.startTime;

    // Clear timeout
    if (this.executionTimeouts.has(executionId)) {
      clearTimeout(this.executionTimeouts.get(executionId));
      this.executionTimeouts.delete(executionId);
    }

    // Update execution status
    execution.status = status;
    execution.duration = duration;
    execution.endTime = endTime;
    Object.assign(execution, metrics);

    // Archive execution data
    this.archiveExecution(executionId, execution);
    this.activeExecutions.delete(executionId);

    // Update tool metrics
    this.updateToolMetrics(execution.toolId, {
      status,
      duration,
      ...metrics,
    });
  }
}
```

Fair Attribution & Monetization

Proportional Revenue Distribution: Allocating Recall tokens based on both usage frequency and quality scores

```javascript
// Pseudocode for token distribution (runs daily)
function distributeTokensToToolDevelopers(period) {
  // Get all tool usage for the period
  const usageRecords = getToolUsageRecords(period);

  // Calculate total token pool to distribute
  const totalTokenPool = calculateTokenPoolForPeriod(period);

  // Group usage by tool
  const usageByTool = groupUsageByTool(usageRecords);

  // Calculate base distribution amount by tool usage
  let distributionByTool = {};
  let totalWeightedUsage = 0;

  for (const [toolId, records] of Object.entries(usageByTool)) {
    const tool = getToolById(toolId);
    const qualityMultiplier = getQualityMultiplier(tool);
    const weightedUsage = records.length * qualityMultiplier;

    distributionByTool[toolId] = {
      usageCount: records.length,
      qualityMultiplier,
      weightedUsage,
    };

    totalWeightedUsage += weightedUsage;
  }

  // Calculate final token amounts and distribute
  for (const [toolId, data] of Object.entries(distributionByTool)) {
    const tokenAmount =
      (data.weightedUsage / totalWeightedUsage) * totalTokenPool;
    const developer = getDeveloperByToolId(toolId);

    // Transfer tokens to developer
    transferTokens(developer.walletAddress, tokenAmount);

    // Log distribution for transparency
    logTokenDistribution(period, toolId, tokenAmount, data);
  }
}
```

Security & Validation Framework

Pre-Selection Validation: Verifying tool integrity before including it in the selection pool
Post-Execution Verification: Confirming output quality and consistency

🔑 Advanced Authentication

Credential Proxy System: Allowing tools to access authenticated services without exposing user credentials

---

<div align="center">
  <p>Powered by <a href="https://gorilli.ai">Gorilli</a></p>
</div>
