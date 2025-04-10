"use client";

import React, { useState } from "react";
import { BaseLayout } from "@/app/components/layout/base-layout";
import { Button } from "@/app/components/ui/button";
import {
  Terminal,
  Copy,
  Check,
  RefreshCw,
  Code,
  Key,
  FileJson,
  AlertCircle,
} from "lucide-react";

export default function MCPSetupPage() {
  const [copied, setCopied] = useState(false);

  // Mock data - in a real app, this would come from the user's account
  const apiKey = "sk_storm_123456789abcdef";
  const endpoint = "https://api.storm.ai/v1/mcp";
  const clientId = "client_123456789abcdef";

  // Mock tool data - in a real app, this would come from the user's tools
  const tools = [
    {
      id: "tool_1",
      name: "getWeather",
      description: "Get current weather for a location",
      version: "1.0.0",
    },
    {
      id: "tool_2",
      name: "translateText",
      description: "Translate text between languages",
      version: "1.0.0",
    },
    {
      id: "tool_3",
      name: "analyzeSentiment",
      description: "Analyze sentiment of text",
      version: "1.0.0",
    },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateKey = () => {
    // In a real app, this would call an API to regenerate the key
    alert("API key regenerated successfully!");
  };

  // MCP Tool Definition
  const mcpToolDefinition = `{
  "name": "getWeather",
  "description": "Get current weather for a location",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "The city and state, e.g. San Francisco, CA"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "The unit of temperature to use"
      }
    },
    "required": ["location"]
  }
}`;

  // MCP Response Format
  const mcpResponseFormat = `{
  "tool": "getWeather",
  "parameters": {
    "location": "New York, NY",
    "unit": "fahrenheit"
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

          {/* API Key Section */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-blue-700 border-opacity-30">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center text-cyan-400">
                <Key className="mr-2 h-5 w-5 text-blue-400" /> API Credentials
              </h2>
              <Button
                onClick={handleRegenerateKey}
                className="flex items-center gap-2 bg-gray-700 text-blue-300 hover:bg-gray-600"
                size="sm"
              >
                <RefreshCw className="mr-1 h-4 w-4" />
                Regenerate Key
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 p-4 rounded-md border border-blue-800">
                <div className="text-sm text-gray-400 mb-1">API Key</div>
                <div className="flex items-center">
                  <code className="text-cyan-400 flex-1 font-mono text-sm">
                    {apiKey}
                  </code>
                  <Button
                    onClick={() => handleCopy(apiKey)}
                    className="ml-2 h-8 w-8 p-0 bg-gray-800 hover:bg-gray-700"
                    size="sm"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded-md border border-blue-800">
                <div className="text-sm text-gray-400 mb-1">Endpoint URL</div>
                <div className="flex items-center">
                  <code className="text-cyan-400 flex-1 font-mono text-sm">
                    {endpoint}
                  </code>
                  <Button
                    onClick={() => handleCopy(endpoint)}
                    className="ml-2 h-8 w-8 p-0 bg-gray-800 hover:bg-gray-700"
                    size="sm"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded-md border border-blue-800">
                <div className="text-sm text-gray-400 mb-1">Client ID</div>
                <div className="flex items-center">
                  <code className="text-cyan-400 flex-1 font-mono text-sm">
                    {clientId}
                  </code>
                  <Button
                    onClick={() => handleCopy(clientId)}
                    className="ml-2 h-8 w-8 p-0 bg-gray-800 hover:bg-gray-700"
                    size="sm"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-300">
                <strong className="text-cyan-400">Security Note:</strong> Keep
                your API key secure and never share it publicly. If you suspect
                your key has been compromised, regenerate it immediately.
              </div>
            </div>
          </div>

          {/* MCP Protocol Section */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold flex items-center text-cyan-400 mb-4">
              <FileJson className="mr-2 h-5 w-5 text-blue-400" /> MCP Protocol
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-cyan-400 mb-2">
                Tool Definition
              </h3>
              <div className="bg-gray-900 p-4 rounded-md border border-blue-800 relative">
                <Button
                  onClick={() => handleCopy(mcpToolDefinition)}
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
                  {mcpToolDefinition}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-cyan-400 mb-2">
                Response Format
              </h3>
              <div className="bg-gray-900 p-4 rounded-md border border-blue-800 relative">
                <Button
                  onClick={() => handleCopy(mcpResponseFormat)}
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
                  {mcpResponseFormat}
                </pre>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-300">
                <strong className="text-cyan-400">MCP Protocol Note:</strong>{" "}
                The Model Context Protocol (MCP) uses a simple JSON format for
                tool definitions and responses. The model should respond with a
                JSON object containing the tool name and parameters when it
                needs to use a tool.
              </div>
            </div>
          </div>

          {/* Available Tools Section */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold flex items-center text-cyan-400 mb-4">
              <Code className="mr-2 h-5 w-5 text-blue-400" /> Available Tools
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-800">
                    <th className="text-left py-3 px-4 text-blue-300">
                      Tool Name
                    </th>
                    <th className="text-left py-3 px-4 text-blue-300">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 text-blue-300">
                      Version
                    </th>
                    <th className="text-left py-3 px-4 text-blue-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tools.map((tool) => (
                    <tr
                      key={tool.id}
                      className="border-b border-blue-800/50 hover:bg-gray-700/30"
                    >
                      <td className="py-3 px-4 text-cyan-400 font-medium">
                        {tool.name}
                      </td>
                      <td className="py-3 px-4 text-blue-300">
                        {tool.description}
                      </td>
                      <td className="py-3 px-4 text-blue-300">
                        {tool.version}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          onClick={() => handleCopy(`"${tool.name}"`)}
                          className="h-8 px-3 bg-gray-700 text-blue-300 hover:bg-gray-600"
                          size="sm"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy Name
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Documentation Link */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold flex items-center text-cyan-400 mb-4">
              <Code className="mr-2 h-5 w-5 text-blue-400" /> Documentation
            </h2>
            <p className="text-blue-300 mb-4">
              For more detailed information on integrating with MCP clients,
              please refer to our documentation.
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
