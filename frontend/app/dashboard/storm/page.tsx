"use client"
import React, { useState, FormEvent } from 'react';

const BasicMCPGenerator: React.FC = () => {
  const [serverName, setServerName] = useState('');
  const [apiBase, setApiBase] = useState('');
  const [toolName, setToolName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Generate Claude Desktop configuration
    const config = {
      mcpServers: {
        [serverName]: {
          command: "node",
          args: [`/path/to/${serverName}/build/index.js`]
        }
      }
    };
    
    // Display success message and configuration
    setGeneratedConfig(JSON.stringify(config, null, 2));
    setIsSuccess(true);
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Create MCP Server</h1>
          <p className="text-gray-600">Enter the essential details for your MCP server</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="serverName" className="block text-sm font-medium text-gray-700 mb-1">
              Server Name
            </label>
            <input 
              id="serverName"
              type="text"
              value={serverName} 
              onChange={(e) => setServerName(e.target.value)}
              placeholder="crypto, weather, etc."
              required
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              A short name for your MCP server
            </p>
          </div>
          
          <div>
            <label htmlFor="apiBase" className="block text-sm font-medium text-gray-700 mb-1">
              API Base URL
            </label>
            <input 
              id="apiBase"
              type="text"
              value={apiBase} 
              onChange={(e) => setApiBase(e.target.value)}
              placeholder="https://api.example.com"
              required
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              The base URL of the API your tool will access
            </p>
          </div>
          
          <div>
            <label htmlFor="toolName" className="block text-sm font-medium text-gray-700 mb-1">
              Tool Name
            </label>
            <input 
              id="toolName"
              type="text"
              value={toolName} 
              onChange={(e) => setToolName(e.target.value)}
              placeholder="get-data, fetch-prices, etc."
              required
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              The name Claude will use to call your tool
            </p>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-6"
          >
            Create MCP Server
          </button>
        </form>
        
        {isSuccess && (
          <div className="mt-6">
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">MCP Server Created</h3>
                  <div className="mt-2 text-sm text-green-700">
                    Your server has been created successfully!
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="configJson" className="block text-sm font-medium text-gray-700 mb-1">
                Claude Desktop Configuration
              </label>
              <textarea 
                id="configJson" 
                value={generatedConfig} 
                readOnly
                rows={6}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm font-mono text-sm mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add this to your Claude Desktop config.json
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div>
            <h3 className="text-sm font-medium text-blue-800">What's happening?</h3>
            <p className="text-sm text-blue-700 mt-1">
              We'll generate an MCP server with your specifications. 
              The server will be stored on Recall and will be available 
              through Storm MCP Server for Claude Desktop.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicMCPGenerator;