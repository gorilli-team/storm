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
  Loader,
} from "lucide-react";
import Link from "next/link";
import Editor from "@monaco-editor/react";

interface User {
  githubUsername?: string;
  description?: string;
}

interface Tool {
  _id: string;
  toolName: string;
  bucketId: string;
  walletAddress: string;
  description?: string;
  hashtags?: string[];
  code?: string;
  params?: string;
  usages?: number;
  totalEarnings?: number;
  lastUsed?: string;
  createdAt: string;
  user?: User;
  votes: {
    walletAddress: string;
    vote: "up" | "down";
    createdAt: string;
  }[];
}

export default function ToolDetailsPage() {
  const params = useParams();
  const [tool, setTool] = useState<Tool | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToolDetails = async () => {
      setIsLoading(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';
        console.log('Calling:', `${API_URL}/tools/${params.id}`);
        const response = await axios.get(`${API_URL}/tools/${params.id}`);
        console.log('Tool details received:', response.data);
        
        // Set the tool data from the API response
        setTool(response.data.data);
      } catch (error) {
        console.error('Error fetching tool details:', error);
        setError('Failed to fetch tool details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      console.log('Tool ID received:', params.id);
      fetchToolDetails();
    }
  }, [params.id]);

  // Format date to a more readable format
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleVote = (isUpvote: boolean): void => {
    console.log(`User ${isUpvote ? 'upvoted' : 'downvoted'} the tool`);
    
    const newVote: {
      walletAddress: string;
      vote: "up" | "down";
      createdAt: string;
    } = {
      walletAddress: "temp-user",
      vote: isUpvote ? "up" : "down",
      createdAt: new Date().toISOString()
    };
    
    if (tool) {
      const updatedTool: Tool = {
        ...tool,
        votes: [...(tool.votes || []), newVote]
      };
      
      setTool(updatedTool);
    }
  };

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Fix the vote filtering logic
  const getUpvotes = (): number => {
    if (!tool || !tool.votes) return 0;
    return tool.votes.filter(vote => vote.vote === "up").length;
  };

  const getDownvotes = (): number => {
    if (!tool || !tool.votes) return 0;
    return tool.votes.filter(vote => vote.vote === "down").length;
  };

  // Calculate rating percentage
  const getRatingPercentage = () => {
    const upvotes = getUpvotes();
    const totalVotes = tool?.votes?.length || 0;
    
    if (totalVotes === 0) return 0;
    return (upvotes / totalVotes) * 100;
  };

  // Shorten wallet address for display
  const shortenAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <BaseLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </BaseLayout>
    );
  }

  // Error state
  if (error || !tool) {
    return (
      <BaseLayout>
        <div className="p-6">
          <Link
            href="/user/tools"
            className="inline-flex items-center text-blue-300 hover:text-cyan-400 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
          </Link>
          <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-md p-4 text-red-400">
            {error || "Tool not found"}
          </div>
        </div>
      </BaseLayout>
    );
  }

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
        
        {/* Tool Header */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-50">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-cyan-400">
                  {tool.toolName}
                </h1>
              </div>
              <p className="text-blue-300 mt-2">{`Tool for ${tool.toolName} function`}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {tool.hashtags && tool.hashtags.length > 0 && tool.hashtags.map((tag) => (
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
                  {getUpvotes() - getDownvotes()}
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
              by <span className="text-cyan-400" title={tool.walletAddress}>
                {(tool.user?.githubUsername) || shortenAddress(tool.walletAddress)}
              </span>
            </span>
          </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300" suppressHydrationWarning>
                {(tool.usages || 0).toLocaleString('en-US')} uses
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300">
                {(tool.totalEarnings || 0).toFixed(2)} STORM earned
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300">
                Created {formatDate(tool.createdAt)}
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
                  <p className="text-blue-300">{tool.description || `Tool for ${tool.toolName} function`}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-900 p-4 rounded-lg border border-blue-800/30">
                    <h4 className="text-sm font-medium text-cyan-400 mb-3">
                      Tool Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-300">RECALL Bucket ID:</span>
                        <span className="text-cyan-400" title={tool.bucketId}>{shortenAddress(tool.bucketId)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Uses:</span>
                        <span className="text-cyan-400" suppressHydrationWarning>{tool.usages || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Total Earnings:</span>
                        <span className="text-cyan-400">
                          {(tool.totalEarnings || 0).toFixed(2)} STORM
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Created:</span>
                        <span className="text-cyan-400">
                          {formatDate(tool.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Last used:</span>
                        <span className="text-cyan-400">
                          {tool.lastUsed ? formatDate(tool.lastUsed) : 'Never'}
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
                        {tool.walletAddress.charAt(2).toUpperCase()}
                      </div>
                      <div>
                        
                        <div className="font-medium text-cyan-400" title={tool.walletAddress}>
                          {shortenAddress(tool.walletAddress)}
                        </div>
                        <div className="text-xs text-blue-300">
                          Tool Creator
                        </div>
                      </div>
                    </div>
                    <p className="text-blue-300 text-sm">
                      {(tool.user?.description)}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg border border-blue-800/30">
                  <h4 className="text-sm font-medium text-cyan-400 mb-3">
                    Usage Statistics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-400" suppressHydrationWarning>
                        {(tool.usages || 0).toLocaleString('en-US')}
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
                        {getRatingPercentage().toFixed(0)}%
                      </div>
                      <div className="text-xs text-blue-300">Rating</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-400">
                        {tool.votes ? tool.votes.length : 0}
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
                    value={tool.code || '// No code available for this tool'}
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
                
                {tool.params && (
                  <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-medium text-cyan-400">
                      Parameters
                    </h3>
                    <div className="border border-blue-800/30 rounded-lg overflow-hidden bg-gray-900 p-4">
                      <pre className="text-blue-300 whitespace-pre-wrap">
                        {tool.params}
                      </pre>
                    </div>
                  </div>
                )}
                
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
                {/* Since reviews aren't in the current data model, show the empty state */}
                <div className="text-center py-8 bg-gray-900 rounded-lg border border-blue-800/30">
                  <MessageSquare className="mx-auto h-12 w-12 text-blue-400 opacity-50 mb-4" />
                  <h3 className="text-xl font-medium text-cyan-400 mb-2">No reviews yet</h3>
                  <p className="text-blue-300">Be the first to review this tool!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}