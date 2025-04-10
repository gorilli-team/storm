"use client";

import { useState } from "react";
import { BaseLayout } from "../../components/layout/base-layout";
import { Button } from "../../components/ui/button";
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
} from "lucide-react";
import Link from "next/link";

// Mock data for tools - replace with actual data in production
const mockTools = [
  {
    id: "1",
    name: "getWeather",
    description: "Get current weather data for any location",
    developer: "alexsmith",
    upvotes: 124,
    downvotes: 12,
    totalUsages: 3456,
    totalEarnings: 172.8,
    category: "Data",
    tags: ["weather", "api", "location"],
    isVerified: true,
    lastUpdated: "2023-11-15T10:30:00Z",
  },
  {
    id: "2",
    name: "getCryptoPrice",
    description:
      "Fetch real-time cryptocurrency prices from multiple exchanges",
    developer: "cryptofan",
    upvotes: 89,
    downvotes: 5,
    totalUsages: 2789,
    totalEarnings: 139.45,
    category: "Finance",
    tags: ["crypto", "price", "exchange"],
    isVerified: true,
    lastUpdated: "2023-11-14T15:45:00Z",
  },
  {
    id: "3",
    name: "translateText",
    description: "Translate text between multiple languages using AI",
    developer: "linguist",
    upvotes: 67,
    downvotes: 8,
    totalUsages: 1890,
    totalEarnings: 94.5,
    category: "Language",
    tags: ["translation", "ai", "language"],
    isVerified: false,
    lastUpdated: "2023-11-13T09:20:00Z",
  },
  {
    id: "4",
    name: "imageGenerator",
    description: "Generate images from text descriptions using AI",
    developer: "artcreator",
    upvotes: 156,
    downvotes: 15,
    totalUsages: 4230,
    totalEarnings: 211.5,
    category: "Media",
    tags: ["image", "ai", "generation"],
    isVerified: true,
    lastUpdated: "2023-11-12T14:10:00Z",
  },
  {
    id: "5",
    name: "sentimentAnalyzer",
    description: "Analyze sentiment of text (positive, negative, neutral)",
    developer: "nlpexpert",
    upvotes: 92,
    downvotes: 7,
    totalUsages: 3120,
    totalEarnings: 156,
    category: "Analysis",
    tags: ["sentiment", "nlp", "analysis"],
    isVerified: true,
    lastUpdated: "2023-11-11T11:30:00Z",
  },
];

export default function StormMarketplacePage() {
  const [tools, setTools] = useState(mockTools);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  // Get unique categories from tools
  const categories = [
    "All",
    ...Array.from(new Set(tools.map((tool) => tool.category))),
  ];

  // Filter tools based on search term and category
  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All" || tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort tools based on selected criteria
  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
      case "newest":
        return (
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
      case "mostUsed":
        return b.totalUsages - a.totalUsages;
      case "highestEarnings":
        return b.totalEarnings - a.totalEarnings;
      default:
        return 0;
    }
  });

  // Handle upvote/downvote
  const handleVote = (id: string, isUpvote: boolean) => {
    setTools(
      tools.map((tool) => {
        if (tool.id === id) {
          return {
            ...tool,
            upvotes: isUpvote ? tool.upvotes + 1 : tool.upvotes,
            downvotes: isUpvote ? tool.downvotes : tool.downvotes + 1,
          };
        }
        return tool;
      })
    );
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
                placeholder="Search tools by name, description, or tags..."
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
                <option value="mostUsed">Most Used</option>
                <option value="highestEarnings">Highest Earnings</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tools List */}
        <div className="grid gap-4">
          {sortedTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-50 hover:border-blue-400 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-cyan-400">
                      {tool.name}
                    </h3>
                    {tool.isVerified && (
                      <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-xs rounded-full flex items-center">
                        <Star className="h-3 w-3 mr-1" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-blue-300 mt-1">{tool.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tool.tags.map((tag) => (
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
                      onClick={() => handleVote(tool.id, true)}
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
                      onClick={() => handleVote(tool.id, false)}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <Link href={`/user/tools/${tool.id}`}>
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500">
                      <ExternalLink className="mr-2 h-4 w-4" /> View Details
                    </Button>
                  </Link>
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
                    {tool.totalUsages.toLocaleString()} uses
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300">
                    {tool.totalEarnings.toFixed(2)} STORM earned
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300">
                    Updated {formatDate(tool.lastUpdated)}
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
