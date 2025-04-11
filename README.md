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

- Tool name and icon
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

## Roadmap

### Q2 2025

- Enhanced developer dashboard with advanced analytics
- Multi-chain support for token payments
- Tool versioning and dependency management

### Q3 2025

- Advanced authentication integration (SSO, credential passing)
- Tool composition framework for creating workflows
- Expanded tool categories and capabilities

### Q4 2025

- AI-powered tool recommendations
- Developer collaboration features
- Enterprise deployment options

## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-org/storm-mcp.git

# Install dependencies
cd storm-mcp
npm install

# Configure your wallet
cp .env.example .env
# Edit .env with your wallet information

# Start the Storm MCP server
npm start
```

## API Reference

### Tool Creation

```javascript
// Example of creating a new tool
import { StormSDK } from "storm-sdk";

const storm = new StormSDK({ apiKey: "your-api-key" });

const myTool = {
  name: "get_crypto_price",
  params: {
    coinName: z.string().min(1).max(50),
  },
  function: async ({ coinName }) => {
    // Tool implementation
    const price = await fetchCryptoPrice(coinName);
    return { price, currency: "USD" };
  },
};

await storm.publishTool(myTool);
```



## Contributing

We welcome contributions from the community! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on how to get involved.

## License

[MIT](./LICENSE)

---

<div align="center">
  <p>Powered by <a href="https://gorilli.ai">Gorilli</a></p>
</div>
