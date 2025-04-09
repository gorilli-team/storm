"use client";

import { BaseLayout } from "../../components/layout/base-layout";
import { Button } from "../../components/ui/button";
import { User, Zap, Coins, Code, Clock } from "lucide-react";
import { useState } from "react";

// Mock data for tool calls - replace with actual data in production
const mockToolCalls = [
  {
    id: 1,
    toolName: "getWeather",
    timestamp: "2023-11-15T10:30:00Z",
    cost: 0.5,
    status: "success",
  },
  {
    id: 2,
    toolName: "getCryptoPrice",
    timestamp: "2023-11-15T11:45:00Z",
    cost: 0.3,
    status: "success",
  },
  {
    id: 3,
    toolName: "translateText",
    timestamp: "2023-11-15T14:20:00Z",
    cost: 0.2,
    status: "success",
  },
];

export default function ProfilePage() {
  const [balance, setBalance] = useState("0.00");
  const [isLoading, setIsLoading] = useState(false);
  const [toolCalls, setToolCalls] = useState(mockToolCalls);

  const handleFaucet = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement faucet functionality
      // This is a placeholder for the actual faucet implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setBalance((prev) => (parseFloat(prev) + 10).toFixed(2));
    } catch (error) {
      console.error("Error getting tokens from faucet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Calculate total cost of all tool calls
  const totalCost = toolCalls.reduce((sum, call) => sum + call.cost, 0);

  return (
    <BaseLayout>
      <div className="space-y-8 w-full px-6 text-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 pb-1">
            Profile
          </h1>
          <p className="text-blue-300 mt-2 flex items-center">
            <User className="inline mr-2 h-4 w-4 text-cyan-400" /> Manage your
            account settings
          </p>
        </div>

        <div className="grid gap-6">
          <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-50">
            <h3 className="text-sm font-medium mb-4 text-cyan-400 flex items-center">
              <Coins className="mr-2 h-4 w-4" /> Balance
            </h3>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-cyan-400">
                {balance} <span className="text-lg text-blue-300">STORM</span>
              </div>
              <Button
                onClick={handleFaucet}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500"
              >
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" /> Get Testnet Tokens
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-cyan-400 flex items-center">
                <Code className="mr-2 h-4 w-4" /> Tool Usage History
              </h3>
              <div className="text-sm text-blue-300">
                Total Cost:{" "}
                <span className="font-bold text-cyan-400">
                  {totalCost.toFixed(2)} STORM
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-800/30">
                    <th className="text-left py-2 text-blue-300 font-medium">
                      Tool
                    </th>
                    <th className="text-left py-2 text-blue-300 font-medium">
                      Date
                    </th>
                    <th className="text-right py-2 text-blue-300 font-medium">
                      Cost
                    </th>
                    <th className="text-center py-2 text-blue-300 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {toolCalls.map((call) => (
                    <tr
                      key={call.id}
                      className="border-b border-blue-800/20 hover:bg-gray-700/30"
                    >
                      <td className="py-2 text-cyan-400">{call.toolName}</td>
                      <td className="py-2 text-blue-300 flex items-center">
                        <Clock className="mr-2 h-3 w-3" />{" "}
                        {formatDate(call.timestamp)}
                      </td>
                      <td className="py-2 text-right text-blue-300">
                        {call.cost.toFixed(2)} STORM
                      </td>
                      <td className="py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            call.status === "success"
                              ? "bg-green-900/30 text-green-400"
                              : "bg-red-900/30 text-red-400"
                          }`}
                        >
                          {call.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
