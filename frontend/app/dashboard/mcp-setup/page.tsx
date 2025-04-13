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
} from "lucide-react";

export default function MCPSetupPage() {
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

  return (
    <BaseLayout>
      <div className="p-6 bg-gray-900 text-gray-100 min-h-screen">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 pb-1">
              MCP Integration Setup
            </h1>
            <p className="text-blue-300 mt-2 flex items-center">
              <Terminal className="inline mr-2 h-4 w-4 text-yellow-400" />{" "}
              Connect your Storm tools to Claude and other MCP clients
            </p>
          </div>

          {/* Local Setup Section */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold flex items-center text-cyan-400 mb-4">
              <Download className="mr-2 h-5 w-5 text-blue-400" /> Local Setup Instructions
            </h2>

            <div className="mb-4">
              <p className="text-gray-300 mb-4">
                Currently, Storm needs to be installed locally. Cloud deployment is a work in progress.
              </p>
              
              <div className="flex items-center mb-4 p-3 bg-gray-700 rounded-md">
                <Github className="h-5 w-5 text-gray-300 mr-3" />
                <a 
                  href="https://github.com/gorilli-team/storm" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  https://github.com/gorilli-team/storm
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-900 p-4 rounded-md border border-gray-700">
                <h3 className="font-medium text-cyan-400 mb-2 flex items-center">
                  <Server className="mr-2 h-4 w-4 text-blue-400" /> 1. Install Dependencies
                </h3>
                <div className="bg-gray-800 p-3 rounded font-mono text-sm text-cyan-400">
                  cd storm<br />
                  npm install
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded-md border border-gray-700">
                <h3 className="font-medium text-cyan-400 mb-2 flex items-center">
                  <Key className="mr-2 h-4 w-4 text-blue-400" /> 2. Configure Environment
                </h3>
                <p className="text-gray-300 mb-2 text-sm">
                  Rename <code className="bg-gray-800 px-1 py-0.5 rounded">.env.example</code> to <code className="bg-gray-800 px-1 py-0.5 rounded">.env</code> and fill in all required variables:
                </p>
                <div className="bg-gray-800 p-3 rounded font-mono text-sm text-cyan-400">
                  mv .env.example .env
                </div>
                <p className="text-gray-400 mt-2 text-xs">
                  Note: The MCP server logic is located in the <code className="bg-gray-700 px-1 py-0.5 rounded">recall</code> folder
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-300">
                <strong className="text-cyan-400">Wallet Requirements:</strong> Your wallet must contain RECALL tokens and credits (available on <a href="https://portal.recall.network/" target="_blank" rel="noopener" className="text-cyan-400 hover:underline">Recall Portal</a>).
              </div>
            </div>
          </div>

          {/* MCP Protocol Section */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold flex items-center text-cyan-400 mb-4">
              <FileJson className="mr-2 h-5 w-5 text-blue-400" /> MCP Protocol Configuration
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-cyan-400 mb-2">
                MCP Server Setup
              </h3>
              <div className="bg-gray-900 p-4 rounded-md border border-blue-800 relative">
                <Button
                  onClick={() => handleCopy(mcpSetup)}
                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-gray-800 hover:bg-gray-700"
                  size="sm"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <pre className="text-cyan-400 font-mono text-sm overflow-x-auto whitespace-pre">
                  {mcpSetup}
                </pre>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-md">
                <h4 className="font-medium text-cyan-400 mb-2">Connection Steps:</h4>
                <ol className="list-decimal list-inside text-blue-300 text-sm space-y-2">
                  <li>Open Claude Desktop</li>
                  <li>Go to Claude/Settings...</li>
                  <li>Click on "Developers", then "Change Configuration"</li>
                  <li>Open "claude_desktop_config.json" in your editor</li>
                  <li>Add the MCP server configuration above</li>
                  <li>Save the file and restart Claude Desktop</li>
                </ol>
              </div>

              <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-300">
                  <strong className="text-cyan-400">Path Configuration:</strong> Replace 
                  <code className="bg-blue-900/50 px-1 rounded mx-1">/PATH/storm/recall/mcpServer.js</code> 
                  with the absolute path to your installation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}