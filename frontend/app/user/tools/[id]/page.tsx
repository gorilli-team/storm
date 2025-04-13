"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BaseLayout } from "../../../components/layout/base-layout";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Code,
  User,
  Zap,
  Star,
  TrendingUp,
  Coins,
  Clock,
  Copy,
  Play,
  MessageSquare,
  Share,
  Bookmark,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Editor from "@monaco-editor/react";

// Mock data for a single tool -
const mockToolDetails = {
  id: "1",
  name: "getWeather",
  description: "Get current weather data for any location",
  longDescription:
    "This tool provides real-time weather data for any location worldwide. It uses multiple weather APIs to ensure accuracy and reliability. The tool returns temperature, humidity, wind speed, precipitation chance, and weather conditions.",
  developer: "alexsmith",
  developerBio:
    "Full-stack developer with 5+ years of experience in web development and API integration. Passionate about creating useful tools for the community.",
  upvotes: 124,
  downvotes: 12,
  totalUsages: 3456,
  totalEarnings: 172.8,
  category: "Data",
  tags: ["weather", "api", "location"],
  isVerified: true,
  lastUpdated: "2023-11-15T10:30:00Z",
  createdAt: "2023-10-01T08:15:00Z",
  version: "1.2.0",
  costPerCall: 0.05,
  code: `/**
 * Get weather data for a specific location
 * @param {string} location - City name or coordinates (e.g., "London" or "51.5074,-0.1278")
 * @param {string} units - Temperature units: "metric" or "imperial" (default: "metric")
 * @returns {Promise<Object>} Weather data object
 */
async function getWeather(location, units = "metric") {
  // Validate input
  if (!location) {
    throw new Error("Location is required");
  }

  // Call weather API
  const response = await fetch(\`https://api.weatherapi.com/v1/current.json?key=\${process.env.WEATHER_API_KEY}&q=\${location}&units=\${units}\`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();
  
  // Format and return the response
  return {
    location: data.location.name,
    country: data.location.country,
    temperature: data.current.temp_c,
    condition: data.current.condition.text,
    humidity: data.current.humidity,
    windSpeed: data.current.wind_kph,
    precipitation: data.current.precip_mm,
    lastUpdated: data.current.last_updated
  };
}`,
  examples: [
    {
      title: "Get weather for a city",
      code: `const weather = await getWeather("London");
console.log(weather);
// Output: { location: "London", temperature: 18.5, ... }`,
    },
    {
      title: "Get weather with imperial units",
      code: `const weather = await getWeather("New York", "imperial");
console.log(weather.temperature); // Temperature in Fahrenheit`,
    },
  ],
  reviews: [
    {
      id: "1",
      user: "weatherfan",
      rating: 5,
      comment:
        "This tool is incredibly accurate and easy to use. I've integrated it into my weather app and it works perfectly.",
      date: "2023-11-10T14:30:00Z",
    },
    {
      id: "2",
      user: "devguru",
      rating: 4,
      comment:
        "Great tool, but could use more error handling for edge cases. Otherwise, very reliable.",
      date: "2023-11-05T09:15:00Z",
    },
  ],
  relatedTools: ["2", "5"],
};

export default function ToolDetailsPage() {
  const params = useParams();
  const [tool, setTool] = useState(mockToolDetails);
  const [activeTab, setActiveTab] = useState("overview");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchToolDetails = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';
        const response = await axios.get(`${API_URL}/tools/${params.id}`);
        
      } catch (error) {
        console.error('Error fetching tool details:', error);
      }
    };

    if (params.id) {
      fetchToolDetails();
    }
  }, [params.id]);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle upvote/downvote
  const handleVote = (isUpvote: boolean) => {
    setTool({
      ...tool,
      upvotes: isUpvote ? tool.upvotes + 1 : tool.upvotes,
      downvotes: isUpvote ? tool.downvotes : tool.downvotes + 1,
    });
  };

  // Copy code to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Calculate rating percentage
  const ratingPercentage =
    (tool.upvotes / (tool.upvotes + tool.downvotes)) * 100;

  return (
    <BaseLayout>
      <div className="space-y-8 w-full px-6 text-gray-100">
        {/* Back button */}
        <Link
          href="/user/tools"
          className="inline-flex items-center text-blue-300 hover:text-cyan-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
        </Link>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-blue-500 border-opacity-50">
          <p className="text-cyan-400">
            Viewing tool details with ID: <span className="font-bold">{params.id}</span>
          </p>
          <p className="text-blue-300 text-sm mt-1">
            Check the browser console to see API data
          </p>
        </div>

        {/* Tool Header */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-50">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-cyan-400">
                  {tool.name}
                </h1>
                {tool.isVerified && (
                  <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-xs rounded-full flex items-center">
                    <Star className="h-3 w-3 mr-1" /> Verified
                  </span>
                )}
              </div>
              <p className="text-blue-300 mt-2">{tool.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {tool.tags && tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-700 text-blue-300 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-blue-300 hover:text-cyan-400 hover:bg-gray-700"
                  onClick={() => handleVote(true)}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <span className="text-cyan-400 font-medium">
                  {tool.upvotes - tool.downvotes}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-blue-300 hover:text-red-400 hover:bg-gray-700"
                  onClick={() => handleVote(false)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-blue-800/30">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300">
                by <span className="text-cyan-400">{tool.developer}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300">
                {tool.totalUsages ? tool.totalUsages.toLocaleString() : '0'} uses
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300">
                {tool.totalEarnings ? tool.totalEarnings.toFixed(2) : '0.00'} STORM earned
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300">
                Updated {formatDate(tool.lastUpdated || tool.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 shadow-lg rounded-lg border border-blue-500 border-opacity-50">
          <div className="flex border-b border-blue-800/30">
            <button
              className={`py-3 px-4 font-medium text-sm ${
                activeTab === "overview"
                  ? "text-cyan-400 border-b-2 border-cyan-500"
                  : "text-gray-400 hover:text-blue-300"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`py-3 px-4 font-medium text-sm ${
                activeTab === "code"
                  ? "text-cyan-400 border-b-2 border-cyan-500"
                  : "text-gray-400 hover:text-blue-300"
              }`}
              onClick={() => setActiveTab("code")}
            >
              Code
            </button>
            <button
              className={`py-3 px-4 font-medium text-sm ${
                activeTab === "reviews"
                  ? "text-cyan-400 border-b-2 border-cyan-500"
                  : "text-gray-400 hover:text-blue-300"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-cyan-400 mb-2">
                    About this tool
                  </h3>
                  <p className="text-blue-300">{tool.longDescription || tool.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-900 p-4 rounded-lg border border-blue-800/30">
                    <h4 className="text-sm font-medium text-cyan-400 mb-3">
                      Tool Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-300">Category:</span>
                        <span className="text-cyan-400">{tool.category || 'Non specificata'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Version:</span>
                        <span className="text-cyan-400">{tool.version || '1.0.0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Cost per call:</span>
                        <span className="text-cyan-400">
                          {tool.costPerCall || '0.00'} STORM
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Created:</span>
                        <span className="text-cyan-400">
                          {formatDate(tool.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Last updated:</span>
                        <span className="text-cyan-400">
                          {formatDate(tool.lastUpdated || tool.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg border border-blue-800/30">
                    <h4 className="text-sm font-medium text-cyan-400 mb-3">
                      Developer
                    </h4>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold">
                        {(tool.developer || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-cyan-400">
                          {tool.developer || 'Unknown Developer'}
                        </div>
                        <div className="text-xs text-blue-300">
                          Tool Creator
                        </div>
                      </div>
                    </div>
                    <p className="text-blue-300 text-sm">{tool.developerBio || 'No developer bio available.'}</p>
                  </div>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg border border-blue-800/30">
                  <h4 className="text-sm font-medium text-cyan-400 mb-3">
                    Usage Statistics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-400">
                        {(tool.totalUsages || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-blue-300">Total Uses</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-400">
                        {(tool.totalEarnings || 0).toFixed(2)}
                      </div>
                      <div className="text-xs text-blue-300">STORM Earned</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-400">
                        {ratingPercentage ? ratingPercentage.toFixed(0) : '0'}%
                      </div>
                      <div className="text-xs text-blue-300">Rating</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-400">
                        {(tool.upvotes || 0) + (tool.downvotes || 0)}
                      </div>
                      <div className="text-xs text-blue-300">Total Votes</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Code Tab */}
            {activeTab === "code" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-cyan-400">
                    Source Code
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-700 text-blue-300 hover:bg-gray-700"
                    onClick={() => copyToClipboard(tool.code || '')}
                  >
                    {isCopied ? "Copied!" : "Copy Code"}
                    <Copy className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="border border-blue-800/30 rounded-lg overflow-hidden">
                  <Editor
                    height="400px"
                    defaultLanguage="javascript"
                    value={tool.code || '// No code available'}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      lineNumbers: "on",
                      wordWrap: "on",
                    }}
                  />
                </div>
                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/30">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-cyan-400 mb-1">
                        Usage Guidelines
                      </h4>
                      <p className="text-blue-300 text-sm">
                      This tool can be used through the Storm Marketplace. 
                      See the documentation for details on the integration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-cyan-400">
                    User Reviews
                  </h3>
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500">
                    <MessageSquare className="mr-2 h-4 w-4" /> Write a Review
                  </Button>
                </div>
                {tool.reviews && tool.reviews.length > 0 ? (
                  tool.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-900 p-4 rounded-lg border border-blue-800/30"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xs">
                            {review.user.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-cyan-400">
                              {review.user}
                            </div>
                            <div className="text-xs text-blue-300">
                              {formatDate(review.date)}
                            </div>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-blue-300">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-900 rounded-lg border border-blue-800/30">
                    <MessageSquare className="mx-auto h-12 w-12 text-blue-400 opacity-50 mb-4" />
                    <h3 className="text-xl font-medium text-cyan-400 mb-2">No reviews yet</h3>
                    <p className="text-blue-300">Be the first to review this tool!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}