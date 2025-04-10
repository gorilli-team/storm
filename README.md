# Storm MCP Marketplace

> A decentralized marketplace connecting developers and users through MCP tools, enabling monetization via Recall tokens and creating a seamless ecosystem for specialized AI capabilities.

## Overview

Storm is a decentralized marketplace for AI tools where developers can publish and monetize their Model Control Protocol (MCP) tools directly. Consumers access these tools through token-based payments, creating an ecosystem that rewards developers while providing users with diverse AI capabilities.

## Key Features

- **Developer Monetization**: Publish your MCP tools and earn tokens when consumers use them
- **Consumer Access**: Use a variety of specialized AI tools through a single unified interface
- **Token Economy**: Powered by Recall tokens and wallet integration with account abstraction
- **Transparent Source Code**: Option to showcase tool source code in the frontend
- **Simple Integration**: Easy to install and use with platforms like Claude Desktop

## How It Works

### For Developers

1. Develop your MCP-compatible tool
2. Publish it to the Storm marketplace
3. Get paid automatically when users access your tool
4. Monitor usage and earnings through your developer dashboard

### For Consumers

1. Install the Storm MCP server
2. Ensure your wallet has sufficient Recall tokens
3. Make queries to your AI assistant that leverage Storm tools
4. Micropayments are automatically processed to tool developers

## Current Tool Types

Storm initially supports tools that don't require authentication from consumers:

- Weather information
- Train schedules and status
- Token pricing data
- And more...

## Technical Architecture

- **EOA Wallets**: Both developers and consumers have Externally Owned Accounts with token balances
- **Account Abstraction**: Simplifies the user experience for tool usage and payments
- **MCP Integration**: Follows the Model Control Protocol standards for tool development

## Roadmap

- Initial release with non-authenticated tools
- Advanced authentication integration (SSO, credential passing)
- Expanded tool categories and capabilities
- Enhanced developer analytics and payment options

## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-org/storm-mcp.git

# Install dependencies
cd storm-mcp
npm install

# Start the Storm MCP server
npm start
```
