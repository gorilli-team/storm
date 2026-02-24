"use client";

import React, { useState } from "react";
import { BaseLayout } from "@/app/components/layout/base-layout";
import { Button } from "@/app/components/ui/button";
import {
  BarChart,
  LineChart,
  PieChart,
  Activity,
  TrendingUp,
  Users,
  Clock,
  Download,
  Filter,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedTool, setSelectedTool] = useState("all");

  // Mock data - in a real app, this would come from an API
  const tools = [
    { id: "all", name: "All Tools" },
    { id: "getWeather", name: "getWeather" },
    { id: "translateText", name: "translateText" },
    { id: "analyzeSentiment", name: "analyzeSentiment" },
  ];

  const timeRanges = [
    { id: "24h", name: "Last 24 Hours" },
    { id: "7d", name: "Last 7 Days" },
    { id: "30d", name: "Last 30 Days" },
    { id: "90d", name: "Last 90 Days" },
  ];

  // Mock usage data
  const usageData = {
    totalCalls: 12458,
    totalUsers: 342,
    averageLatency: 245, // ms
    successRate: 98.7,
    callsByTool: [
      { name: "getWeather", calls: 5234, percentage: 42 },
      { name: "translateText", calls: 4123, percentage: 33 },
      { name: "analyzeSentiment", calls: 3101, percentage: 25 },
    ],
    callsOverTime: [
      { date: "2023-05-01", calls: 120 },
      { date: "2023-05-02", calls: 145 },
      { date: "2023-05-03", calls: 132 },
      { date: "2023-05-04", calls: 168 },
      { date: "2023-05-05", calls: 189 },
      { date: "2023-05-06", calls: 210 },
      { date: "2023-05-07", calls: 195 },
    ],
    errorsByType: [
      { type: "Rate Limit", count: 45, percentage: 35 },
      { type: "Invalid Parameters", count: 32, percentage: 25 },
      { type: "Server Error", count: 28, percentage: 22 },
      { type: "Authentication", count: 15, percentage: 12 },
      { type: "Other", count: 10, percentage: 6 },
    ],
  };

  const handleExportData = () => {
    // In a real app, this would generate and download a CSV or JSON file
    alert("Data exported successfully!");
  };

  return (
    <BaseLayout>
      <div className="px-4 py-4 sm:px-6 sm:py-6 bg-gray-900 text-gray-100 min-h-screen">
        <div className="max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 pb-1">
              Analytics Dashboard
            </h1>
            <p className="text-blue-300 mt-2 flex items-center text-sm sm:text-base">
              <Activity className="inline mr-2 h-4 w-4 text-yellow-400 flex-shrink-0" />{" "}
              Monitor your tool usage and performance
            </p>
          </div>

          {/* Filters */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-blue-700 border-opacity-30 flex flex-wrap gap-3 sm:gap-4 items-center">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-blue-300 mr-2">Filter by:</span>
              <select
                value={selectedTool}
                onChange={(e) => setSelectedTool(e.target.value)}
                className="bg-gray-900 text-cyan-400 border border-blue-800 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {tools.map((tool) => (
                  <option key={tool.id} value={tool.id}>
                    {tool.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-blue-300 mr-2">Time range:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-900 text-cyan-400 border border-blue-800 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {timeRanges.map((range) => (
                  <option key={range.id} value={range.id}>
                    {range.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="ml-auto">
              <Button
                onClick={handleExportData}
                className="bg-gray-700 text-blue-300 hover:bg-gray-600 flex items-center"
                size="sm"
              >
                <Download className="h-4 w-4 mr-1" />
                Export Data
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-gray-800 shadow-lg rounded-lg p-3 sm:p-4 border border-blue-700 border-opacity-30">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Total API Calls</p>
                  <h3 className="text-2xl font-bold text-cyan-400 mt-1">
                    {usageData.totalCalls.toLocaleString()}
                  </h3>
                </div>
                <div className="bg-blue-900/30 p-2 rounded-full">
                  <BarChart className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-green-400 text-sm">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>12.5% from last period</span>
              </div>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg p-3 sm:p-4 border border-blue-700 border-opacity-30">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Active Users</p>
                  <h3 className="text-2xl font-bold text-cyan-400 mt-1">
                    {usageData.totalUsers.toLocaleString()}
                  </h3>
                </div>
                <div className="bg-blue-900/30 p-2 rounded-full">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-green-400 text-sm">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>8.3% from last period</span>
              </div>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg p-3 sm:p-4 border border-blue-700 border-opacity-30">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Avg. Latency</p>
                  <h3 className="text-2xl font-bold text-cyan-400 mt-1">
                    {usageData.averageLatency}ms
                  </h3>
                </div>
                <div className="bg-blue-900/30 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-red-400 text-sm">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span>3.2% from last period</span>
              </div>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg p-3 sm:p-4 border border-blue-700 border-opacity-30">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Success Rate</p>
                  <h3 className="text-2xl font-bold text-cyan-400 mt-1">
                    {usageData.successRate}%
                  </h3>
                </div>
                <div className="bg-blue-900/30 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-green-400 text-sm">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>0.5% from last period</span>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Usage Over Time */}
            <div className="bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 border border-blue-700 border-opacity-30">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">
                Usage Over Time
              </h2>
              <div className="h-64 flex items-end justify-between">
                {usageData.callsOverTime.map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-8 bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-md"
                      style={{ height: `${(day.calls / 210) * 100}%` }}
                    ></div>
                    <div className="text-xs text-blue-300 mt-2">
                      {day.date.split("-")[2]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tool Usage Distribution */}
            <div className="bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 border border-blue-700 border-opacity-30">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">
                Tool Usage Distribution
              </h2>
              <div className="h-64 flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {/* Pie chart segments */}
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 w-full h-full bg-blue-600"
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0%, ${
                          50 + 42 * Math.cos(0)
                        }% ${50 + 42 * Math.sin(0)}%, 50% 50%)`,
                        transform: "rotate(0deg)",
                      }}
                    ></div>
                    <div
                      className="absolute top-0 left-0 w-full h-full bg-cyan-500"
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0%, ${
                          50 + 42 * Math.cos(2 * Math.PI * 0.42)
                        }% ${
                          50 + 42 * Math.sin(2 * Math.PI * 0.42)
                        }%, 50% 50%)`,
                        transform: "rotate(151.2deg)",
                      }}
                    ></div>
                    <div
                      className="absolute top-0 left-0 w-full h-full bg-blue-400"
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0%, ${
                          50 + 42 * Math.cos(2 * Math.PI * 0.75)
                        }% ${
                          50 + 42 * Math.sin(2 * Math.PI * 0.75)
                        }%, 50% 50%)`,
                        transform: "rotate(270deg)",
                      }}
                    ></div>
                  </div>

                  {/* Legend - desktop */}
                  <div className="absolute -right-32 top-0 w-28 hidden lg:block">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                      <span className="text-sm text-blue-300">
                        getWeather (42%)
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                      <span className="text-sm text-blue-300">
                        translateText (33%)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                      <span className="text-sm text-blue-300">
                        analyzeSentiment (25%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Legend - mobile */}
              <div className="flex flex-col gap-2 mt-4 lg:hidden">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                  <span className="text-sm text-blue-300">getWeather (42%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                  <span className="text-sm text-blue-300">translateText (33%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                  <span className="text-sm text-blue-300">analyzeSentiment (25%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Analysis */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Error Analysis
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-800">
                    <th className="text-left py-3 px-4 text-blue-300">
                      Error Type
                    </th>
                    <th className="text-left py-3 px-4 text-blue-300">Count</th>
                    <th className="text-left py-3 px-4 text-blue-300">
                      Percentage
                    </th>
                    <th className="text-left py-3 px-4 text-blue-300">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {usageData.errorsByType.map((error, index) => (
                    <tr
                      key={index}
                      className="border-b border-blue-800/50 hover:bg-gray-700/30"
                    >
                      <td className="py-3 px-4 text-cyan-400 font-medium">
                        {error.type}
                      </td>
                      <td className="py-3 px-4 text-blue-300">{error.count}</td>
                      <td className="py-3 px-4 text-blue-300">
                        {error.percentage}%
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {index % 2 === 0 ? (
                            <ArrowDownRight className="h-4 w-4 text-green-400 mr-1" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-red-400 mr-1" />
                          )}
                          <span
                            className={
                              index % 2 === 0
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          >
                            {index % 2 === 0 ? "Decreasing" : "Increasing"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Recommendations
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-md">
                <h3 className="text-lg font-medium text-cyan-400 mb-2">
                  Optimize getWeather Tool
                </h3>
                <p className="text-blue-300 mb-2">
                  Your getWeather tool is experiencing higher latency than other
                  tools. Consider implementing caching to improve response
                  times.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 mt-2">
                  View Details
                </Button>
              </div>

              <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-md">
                <h3 className="text-lg font-medium text-cyan-400 mb-2">
                  Scale Your Infrastructure
                </h3>
                <p className="text-blue-300 mb-2">
                  Usage has increased by 12.5% this period. Consider scaling
                  your infrastructure to handle the growing demand.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 mt-2">
                  View Details
                </Button>
              </div>

              <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-md">
                <h3 className="text-lg font-medium text-cyan-400 mb-2">
                  Improve Error Handling
                </h3>
                <p className="text-blue-300 mb-2">
                  Rate limit errors have increased by 15% this period. Consider
                  implementing better rate limiting strategies.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 mt-2">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
