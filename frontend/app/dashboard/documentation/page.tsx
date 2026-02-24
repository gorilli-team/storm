"use client";

import React, { useState } from "react";
import { BaseLayout } from "@/app/components/layout/base-layout";
import { Button } from "@/app/components/ui/button";
import {
  Terminal,
  Copy,
  Check,
  FileJson,
  AlertCircle,
  Github,
  Download,
  Server,
  Key,
  Lock,
  Code,
  Zap,
  Shield,
  Cpu,
  Database,
  Wallet,
  Clock,
  Layers,
  BarChart2,
  Settings,
  Users,
  Box,
  KeyRound,
  FileLock2,
  Workflow,
  FileSearch,
  Rocket
} from "lucide-react";

// Import your images (adjust paths as needed)
import ToolManagementFlowImage from "../../../../assets/Overview.png";
import ToolBucketImage from "../../../../assets/Tool bucket.png";
import ToolProcessingImage from "../../../../assets/Detailed workflow (pt.1).png";
import ToolRetrievalImage from "../../../../assets/Detailed workflow (pt.2).png";
import Image from "next/image";

export default function MCPDocumentationPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mcpSetup = `{
    "mcpServers": {
        "demo": {
            "command": "node",
            "args": [
                "/PATH/storm/recall/mcpServer.js"
            ],
            "env": {
                "PRIVATE_KEY": "RECALL_WALLET_PRIVATE_KEY",
                "ENCRYPTION_SECRET_KEY": "AES_ENCRYPTION_SECRET_KEY"
            }
        }
    }
}`;

  const toolExample = `import { StormSDK } from "storm-sdk";

const storm = new StormSDK({ apiKey: "your-api-key" });

const myTool = {
  name: "get_crypto_price",
  params: {
    coinName: z.string().min(1).max(50),
  },
  function: async ({ coinName }) => {
    const price = await fetchCryptoPrice(coinName);
    return { price, currency: "USD" };
  },
};

await storm.publishTool(myTool);`;

  return (
    <BaseLayout>
      <div className="px-4 py-4 sm:px-6 sm:py-6 bg-gray-900 text-gray-100 min-h-screen">
        <div className="max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 pb-1">
              Documentation
            </h1>
            <p className="text-blue-300 mt-2 flex items-center text-sm sm:text-base">
              <Terminal className="inline mr-2 h-4 w-4 text-yellow-400 flex-shrink-0" />
              <span>A decentralized marketplace connecting developers and users through MCP tools, enabling monetization via Recall tokens and creating a seamless ecosystem for specialized AI capabilities.</span>
            </p>
          </div>

          {/* Overview Section */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold flex items-center text-cyan-400 mb-4">
              <Zap className="mr-2 h-5 w-5 text-blue-400" /> Overview
            </h2>
            <p className="text-gray-300 mb-4">
              Storm is a decentralized marketplace for AI tools where developers can publish and monetize their Model Control Protocol (MCP) tools directly. Consumers access these tools through token-based payments, creating an ecosystem that rewards developers while providing users with diverse AI capabilities.
            </p>
            <p className="text-gray-300">
              The platform uses AES encryption for secure tool storage and transmission, and integrates with Recall tokens to enable micropayments between users and developers.
            </p>
          </div>

          {/* Key Features */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold flex items-center text-cyan-400 mb-4">
              <Cpu className="mr-2 h-5 w-5 text-blue-400" /> Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: <BarChart2 className="h-5 w-5 text-blue-400" />, title: "Developer Monetization", text: "Publish your MCP tools and earn tokens when consumers use them" },
                { icon: <Users className="h-5 w-5 text-blue-400" />, title: "Consumer Access", text: "Use a variety of specialized AI tools through a single unified interface" },
                { icon: <Wallet className="h-5 w-5 text-blue-400" />, title: "Token Economy", text: "Powered by Recall tokens and wallet integration with account abstraction" },
                { icon: <Code className="h-5 w-5 text-blue-400" />, title: "Transparent Source Code", text: "Option to showcase tool source code in the frontend" },
                { icon: <Settings className="h-5 w-5 text-blue-400" />, title: "Simple Integration", text: "Easy to install and use with platforms like Claude Desktop" },
                { icon: <FileLock2 className="h-5 w-5 text-blue-400" />, title: "AES Encryption", text: "Industry-standard security for tool parameters and functions" },
                { icon: <Database className="h-5 w-5 text-blue-400" />, title: "Tool Buckets", text: "Organized storage system for efficient tool management" },
                { icon: <Workflow className="h-5 w-5 text-blue-400" />, title: "Decentralized Architecture", text: "Built on Recall Network for censorship-resistant tool distribution" }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center mb-2">
                    {feature.icon}
                    <h3 className="font-medium text-cyan-400 ml-2">{feature.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Architecture */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold flex items-center text-cyan-400 mb-4">
              <Layers className="mr-2 h-5 w-5 text-blue-400" /> Technical Architecture
            </h2>
            
            {/* Tool Management Flow */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg font-medium text-cyan-400 mb-2 flex items-center">
                <Workflow className="mr-2 h-5 w-5 text-blue-400" /> Tool Management Flow
              </h3>
              <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-blue-800">
                <div className="text-gray-400 text-sm mb-2">
                  The Storm platform uses a sophisticated workflow to securely store and retrieve tools:
                </div>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4 mb-4">
                  <li><strong>Create Bucket</strong>: Initialize storage for new tools</li>
                  <li><strong>Add Tool</strong>: Encrypt tool parameters and functions with AES before storage</li>
                  <li><strong>Retrieve Tool</strong>: Securely retrieve and decrypt tools when needed</li>
                  <li><strong>MCP Server Integration</strong>: Seamlessly connect with MCP servers for tool execution</li>
                </ul>
                <div className="mt-4 rounded-lg overflow-hidden border border-gray-700">
                  <Image
                    src={ToolManagementFlowImage}
                    alt="Tool Management Flow Diagram"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Tool Bucket Structure */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg font-medium text-cyan-400 mb-2 flex items-center">
                <Box className="mr-2 h-5 w-5 text-blue-400" /> Tool Bucket Structure
              </h3>
              <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-blue-800">
                <div className="text-gray-400 text-sm mb-2">
                  Tools in Storm are organized in buckets with detailed component information:
                </div>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4 mb-4">
                  <li>Tool name</li>
                  <li>Parameter schemas with validation rules</li>
                  <li>Function implementations</li>
                  <li>Secure access controls</li>
                  <li>Version history</li>
                  <li>Usage statistics</li>
                </ul>
                <div className="mt-4 rounded-lg overflow-hidden border border-gray-700">
                  <Image
                    src={ToolBucketImage}
                    alt="Tool Bucket Structure Diagram"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Detailed Tool Processing Workflow */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg font-medium text-cyan-400 mb-2 flex items-center">
                <Workflow className="mr-2 h-5 w-5 text-blue-400" /> Detailed Tool Processing Workflow
              </h3>
              <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-blue-800">
                <div className="text-gray-400 text-sm mb-2">
                  When a developer adds a new tool to Storm:
                </div>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4 mb-4">
                  <li>Parameters and function bodies are separated</li>
                  <li>Each component is serialized to JSON/string format</li>
                  <li>AES encryption is applied to both components</li>
                  <li>The encrypted components are combined into a single object</li>
                  <li>The tool is stored in the appropriate bucket</li>
                </ul>
                <div className="mt-4 rounded-lg overflow-hidden border border-gray-700">
                  <Image
                    src={ToolProcessingImage}
                    alt="Detailed Tool Processing Workflow Diagram"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Tool Retrieval and Execution */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg font-medium text-cyan-400 mb-2 flex items-center">
                <Workflow className="mr-2 h-5 w-5 text-blue-400" /> Tool Retrieval and Execution
              </h3>
              <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-blue-800">
                <div className="text-gray-400 text-sm mb-2">
                  When a user requests a tool:
                </div>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4 mb-4">
                  <li>The encrypted tool is retrieved from the bucket</li>
                  <li>Decryption is performed using the appropriate keys</li>
                  <li>Parameters and functions are reconstructed</li>
                  <li>Zod schema validation ensures security and correctness</li>
                  <li>The tool is made available to the MCP server for execution</li>
                </ul>
                <div className="mt-4 rounded-lg overflow-hidden border border-gray-700">
                  <Image
                    src={ToolRetrievalImage}
                    alt="Tool Retrieval and Execution Diagram"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold flex items-center text-cyan-400 mb-4">
              <Rocket className="mr-2 h-5 w-5 text-blue-400" /> How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* For Developers */}
              <div className="bg-gray-900 p-5 rounded-lg border border-gray-700">
                <h3 className="font-medium text-cyan-400 mb-3 flex items-center">
                  <Code className="mr-2 h-5 w-5 text-blue-400" /> For Developers
                </h3>
                <ol className="space-y-3">
                  {[
                    "Create Your Tool: Develop your MCP-compatible tool using the Storm SDK",
                    "Configure Parameters: Define the input parameters and validation rules",
                    "Implement Function: Write the core functionality that your tool provides",
                    "Publish to Marketplace: Submit your tool with pricing information",
                    "Monitor Usage: Track usage statistics and token earnings"
                  ].map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex items-center justify-center bg-blue-900/30 text-blue-400 text-xs font-bold rounded-full h-5 w-5 mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-300 text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* For Consumers */}
              <div className="bg-gray-900 p-5 rounded-lg border border-gray-700">
                <h3 className="font-medium text-cyan-400 mb-3 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-400" /> For Consumers
                </h3>
                <ol className="space-y-3">
                  {[
                    "Install Storm: Set up the Storm MCP server on your system",
                    "Fund Your Wallet: Ensure your wallet has sufficient Recall tokens",
                    "Browse Tools: Explore available tools in the marketplace",
                    "Use Tools via AI: Make queries to your AI assistant that leverage Storm tools",
                    "Automatic Payments: Micropayments are processed automatically to tool developers"
                  ].map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex items-center justify-center bg-blue-900/30 text-blue-400 text-xs font-bold rounded-full h-5 w-5 mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-300 text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Current Tool Types */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold flex items-center text-cyan-400 mb-4">
              <FileSearch className="mr-2 h-5 w-5 text-blue-400" /> Current Tool Types
            </h2>
            <div className="text-gray-300 mb-4">
              Storm currently supports a variety of tools that don't require authentication from consumers:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                "Cryptocurrency Information",
                "Weather Information",
                "Geographic Data",
                "Train Schedules",
                "Financial Tools",
                "Research APIs",
                "Language Translation",
                "Sentiment Analysis",
                "Unit Conversion",
                "Nutrition Data",
                "Sports Statistics",
                "Public Transportation"
              ].map((tool, index) => (
                <div key={index} className="bg-gray-900/50 px-3 py-2 rounded border border-gray-700 text-sm text-gray-300">
                  {tool}
                </div>
              ))}
            </div>
          </div>

          {/* Security Features */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold flex items-center text-cyan-400 mb-4">
              <Shield className="mr-2 h-5 w-5 text-blue-400" /> Security Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: <FileLock2 className="h-5 w-5 text-blue-400" />, title: "AES Encryption", text: "All tool code and parameters are encrypted at rest and in transit" },
                { icon: <KeyRound className="h-5 w-5 text-blue-400" />, title: "Secure Key Management", text: "Advanced key rotation and storage" },
                { icon: <Users className="h-5 w-5 text-blue-400" />, title: "Access Controls", text: "Granular permissions for tool access" },
                { icon: <Database className="h-5 w-5 text-blue-400" />, title: "Audit Logging", text: "Comprehensive logging of all tool usage" },
                { icon: <Code className="h-5 w-5 text-blue-400" />, title: "Parameter Validation", text: "Strict schema enforcement using Zod" },
                { icon: <Shield className="h-5 w-5 text-blue-400" />, title: "Smart Contract Security", text: "Audited contracts for token transactions" }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center mb-2">
                    {feature.icon}
                    <h3 className="font-medium text-cyan-400 ml-2">{feature.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Getting Started
          <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold flex items-center text-cyan-400 mb-4">
              <Download className="mr-2 h-5 w-5 text-blue-400" /> Getting Started
            </h2>
            <div className="bg-gray-900 p-4 rounded-lg border border-blue-800 relative">
              <Button
                onClick={() => handleCopy(`git clone https://github.com/gorilli-team/storm.git\ncd storm\nnpm install\ncp .env.example .env\nnpm start`)}
                className="absolute top-3 right-3 h-9 w-9 p-0 bg-gray-800 hover:bg-gray-700"
                size="sm"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <pre className="text-cyan-400 font-mono text-sm overflow-x-auto">
                git clone https://github.com/gorilli-team/storm.git<br />
                cd storm<br />
                npm install<br />
                cp .env.example .env<br />
                npm start
              </pre>
            </div>
          </div> */}

          {/* API Example */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold flex items-center text-cyan-400 mb-4">
              <Code className="mr-2 h-5 w-5 text-blue-400" /> API Example
            </h2>
            <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-blue-800 relative overflow-x-auto">
              <Button
                onClick={() => handleCopy(toolExample)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 h-8 w-8 sm:h-9 sm:w-9 p-0 bg-gray-800 hover:bg-gray-700"
                size="sm"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <pre className="text-cyan-400 font-mono text-xs sm:text-sm overflow-x-auto pr-12 sm:pr-14">
                {toolExample}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}