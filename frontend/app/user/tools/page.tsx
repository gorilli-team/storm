"use client";

import { useState, useEffect } from "react";
import { BaseLayout } from "../../components/layout/base-layout";
import { Button } from "../../components/ui/button";
import axios from "axios";
import {
  Search,
  ArrowUp,
  ArrowDown,
  Code,
  User,
  Zap,
  Star,
  TrendingUp,
  Filter,
  ExternalLink,
  Coins,
  Loader,
  Database,
} from "lucide-react";
import Link from "next/link";

// Mock data for tools - replace with actual data in production
// const mockTools = [
//   {
//     id: "1",
//     name: "getWeather",
//     description: "Get current weather data for any location",
//     developer: "alexsmith",
//     upvotes: 124,
//     downvotes: 12,
//     totalUsages: 3456,
//     totalEarnings: 172.8,
//     category: "Data",
//     tags: ["weather", "api", "location"],
//     isVerified: true,
//     lastUpdated: "2023-11-15T10:30:00Z",
//   },
// ];

interface Tool {
  toolName: string;
  bucketId: string;
  walletAddress: string;
  createdAt: string;
  _id: string;
}

export default function StormMarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    const fetchAllTools = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';
        const response = await axios.get(`${API_URL}/tools`);
        console.log('Fetched tools:', response.data);
        
        // Set the tools data directly
        setTools(response.data.data);
      } catch (error) {
        console.error('Error fetching tools:', error);
        setError('Failed to fetch tools. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTools();
  }, []);

  // Get unique categories from tools
  const categories = [
    "All",
    ...Array.from(new Set(tools.map((tool) => "API"))),
  ];

  // // Filter tools based on search term and category
  // const filteredTools = tools.filter((tool) => {
  //   const matchesSearch =
  //     tool.toolName.toLowerCase().includes(searchTerm.toLowerCase());

  //   const matchesCategory =
  //     selectedCategory === "All" || "API" === selectedCategory;

  //   return matchesSearch && matchesCategory;
  // });

  // // Sort tools based on selected criteria
  // const sortedTools = [...filteredTools].sort((a, b) => {
  //   switch (sortBy) {
  //     case "popular":
  //       return 0; // No upvotes/downvotes in the API data
  //     case "newest":
  //       return (
  //         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //       );
  //     default:
  //       return 0;
  //   }
  // });

  const handleVote = (id: string, isUpvote: boolean) => {
    // Implement if needed with actual API data
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <BaseLayout>
      <div className="space-y-8 w-full px-6 text-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 pb-1">
            Storm Marketplace
          </h1>
          <p className="text-blue-300 mt-2 flex items-center">
            <Zap className="inline mr-2 h-4 w-4 text-cyan-400" /> Discover and
            use MCP tools from the community
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
              <input
                type="text"
                placeholder="Search tools by name..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-blue-700 rounded-md text-cyan-400 placeholder-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 bg-gray-900 border border-blue-700 rounded-md text-cyan-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                className="px-4 py-2 bg-gray-900 border border-blue-700 rounded-md text-cyan-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center p-8">
            <Loader className="h-8 w-8 animate-spin text-cyan-500" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-md p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && tools.length === 0 && (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-blue-700 border-opacity-30">
            <Zap className="mx-auto h-12 w-12 text-blue-400 opacity-50 mb-4" />
            <h3 className="text-xl font-medium text-cyan-400 mb-2">No tools found</h3>
            <p className="text-blue-300">No tools are available yet. Create your first tool in the Tool Manager.</p>
          </div>
        )}

        {/* Tools List */}
        <div className="grid gap-4">
          {tools.map((tool) => (
            <div
              key={tool._id}
              className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-50 hover:border-blue-400 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-cyan-400">
                      {tool.toolName}
                    </h3>
                  </div>
                  <p className="text-blue-300 mt-1">Tool for {tool.toolName} function</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Link href={`/user/tools/${tool._id}`}>
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500">
                      <ExternalLink className="mr-2 h-4 w-4" /> View Details
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-blue-800/30">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300">
                    by <span className="text-cyan-400" title={tool.walletAddress}>{shortenAddress(tool.walletAddress)}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300" title={tool.bucketId}>
                    Bucket: <span className="text-cyan-400">{shortenAddress(tool.bucketId)}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300" suppressHydrationWarning>
                    Created {formatDate(tool.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseLayout>
  );
}