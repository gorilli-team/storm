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
      <div className="px-4 py-4 sm:px-6 sm:py-6 bg-gray-900 text-gray-100 min-h-screen">
        <div className="max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 pb-1">
              MCP Integration Setup
            </h1>
            <p className="text-blue-300 mt-2 flex items-center text-sm sm:text-base">
              <Terminal className="inline mr-2 h-4 w-4 text-yellow-400 flex-shrink-0" />{" "}
              Connect your Storm tools to Claude and other MCP clients
            </p>
          </div>

          {/* Local Setup Section */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold flex items-center text-cyan-400 mb-4">
              <Download className="mr-2 h-5 w-5 text-blue-400" /> Local Setup Instructions
            </h2>

            <div className="mb-6">
              <p className="text-gray-300 mb-6">
                Currently, Storm needs to be installed locally. Cloud deployment is a work in progress.
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors">
                <div className="flex items-center">
                  <Github className="h-6 w-6 text-gray-300 mr-3" />
                  <span className="text-gray-200">GitHub Repository:</span>
                </div>
                <a 
                  href="https://github.com/gorilli-team/storm" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-medium underline flex items-center"
                >
                  gorilli-team/storm
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-900 p-3 sm:p-5 rounded-lg border border-gray-700">
                <h3 className="font-medium text-cyan-400 mb-3 flex items-center">
                  <Server className="mr-2 h-5 w-5 text-blue-400" /> Install Dependencies
                </h3>
                <div className="bg-gray-800 p-4 rounded-lg font-mono text-sm text-cyan-400">
                  cd storm<br />
                  npm install
                </div>
                <p className="text-gray-400 mt-3 text-sm flex items-start">
                  <span className="bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded mr-2">Note</span>
                  The MCP server logic is located in the <code className="bg-gray-700 px-1.5 py-0.5 rounded mx-1">recall</code> folder
                </p>
              </div>
            </div>
          </div>

          {/* MCP Protocol Section */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold flex items-center text-cyan-400 mb-6">
              <FileJson className="mr-2 h-5 w-5 text-blue-400" /> MCP Protocol Configuration
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-cyan-400 mb-3">
                MCP Server Setup
              </h3>
              <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-blue-800 relative overflow-x-auto">
                <Button
                  onClick={() => handleCopy(mcpSetup)}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 h-8 w-8 sm:h-9 sm:w-9 p-0 bg-gray-800 hover:bg-gray-700"
                  size="sm"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <pre className="text-cyan-400 font-mono text-xs sm:text-sm overflow-x-auto whitespace-pre pr-12 sm:pr-14">
                  {mcpSetup}
                </pre>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-900/50 p-3 sm:p-5 rounded-lg border border-blue-800/50">
                <h4 className="font-medium text-cyan-400 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Connection Steps
                </h4>
                <ol className="space-y-3">
                  {[
                    "Open Claude Desktop",
                    "Go to Claude/Settings...",
                    "Click on 'Developers', then 'Change Configuration'",
                    "Open 'claude_desktop_config.json' in your editor",
                    "Add the MCP server configuration above",
                    "Save the file and restart Claude Desktop"
                  ].map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex items-center justify-center bg-blue-900/30 text-blue-400 text-xs font-bold rounded-full h-5 w-5 mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-blue-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-300">
                  <strong className="text-cyan-400">Path Configuration:</strong> Replace 
                  <code className="bg-blue-900/50 px-1.5 py-0.5 rounded mx-1">/PATH/storm/recall/mcpServer.js</code> 
                  with the absolute path to your installation.
                </div>
              </div>
              <div className="mt-6 space-y-4">
              <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-300">
                  <strong className="text-cyan-400">Wallet Requirements:</strong> Your wallet must have RECALL tokens and credits (available on <a href="https://portal.recall.network/" target="_blank" rel="noopener" className="text-cyan-400 hover:text-cyan-300 underline">Recall Portal</a>).
                </div>
              </div>

              <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg flex items-start">
                <Lock className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-300">
                  <strong className="text-cyan-400">Encryption Key Sync:</strong> The <code className="bg-blue-900/50 px-1.5 py-0.5 rounded">ENCRYPTION_SECRET_KEY</code> must be identical in:
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>Frontend environment (for encrypting tools when uploaded)</li>
                    <li>MCP server configuration (for decrypting tools when used)</li>
                  </ul>
                  <p className="mt-2">This key secures all tool functions and parameters in transit between Claude Desktop and Recall Network.</p>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}