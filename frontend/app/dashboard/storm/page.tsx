"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  PlusCircle,
  Save,
  Trash2,
  FolderPlus,
  Database,
  Code,
  Zap,
  Cloud,
  Server,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Settings,
  Info,
  Key
} from "lucide-react";
import { Button } from "../../components/ui/button";
import Editor from "@monaco-editor/react";
import { testnet } from "@recallnet/chains";
import { RecallClient } from "@recallnet/sdk/client";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { BaseLayout } from "../../components/layout/base-layout";
import CryptoJS from "crypto-js";
import axios from "axios";
import { usePrivy } from "@privy-io/react-auth";
import { z } from "zod";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  language?: string;
}

const MonacoEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  placeholder = "// Write your code here",
  language = "javascript",
}) => {
  const editorRef = useRef<any>(null);
  const [isEmpty, setIsEmpty] = useState(value === placeholder || value === "");

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    editor.onDidFocusEditorText(() => {
      if (isEmpty) {
        onChange("");
        setIsEmpty(false);
      }
    });

    editor.onDidBlurEditorText(() => {
      if (!editor.getValue().trim()) {
        editor.setValue(placeholder);
        setIsEmpty(true);
      }
    });
  };

  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (
        currentValue !== value &&
        !(isEmpty && value === placeholder) &&
        !(currentValue === "" && value === placeholder)
      ) {
        editorRef.current.setValue(value);
        setIsEmpty(value === placeholder || value === "");
      }
    }
  }, [value, placeholder, isEmpty]);

  return (
    <div className="relative h-80 border border-gray-500 rounded-md overflow-hidden bg-gray-900">
      <div className="absolute top-0 right-0 bg-gray-800 text-xs text-blue-400 px-2 py-1 rounded-bl z-10 flex items-center">
        <Server className="w-3 h-3 mr-1" /> {language}
      </div>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        language={language}
        value={isEmpty ? placeholder : value}
        theme="vs-dark"
        onChange={(newValue) => {
          if (isEmpty) setIsEmpty(false);
          onChange(newValue || "");
        }}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
          fontSize: 14,
          lineNumbers: "on",
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
          },
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          contextmenu: true,
          formatOnType: true,
          formatOnPaste: true,
        }}
      />
    </div>
  );
};

const defaultCodePlaceholder = `/**
 * Function description
 * @param paramName {type} Parameter description
 * @returns {Promise<type>} Return value description
 */

// async functionName(paramName: string): Promise<string> {
//   // Your code here
//   return "Result";
// }`;

const defaultParamsPlaceholder = `// Define your parameters schema using Zod
// Example:
// {
//   coinName: z.string().describe("The name of the cryptocurrency in lowercase")
// }`;

const StormToolManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"create" | "tools">("create");
  const [code, setCode] = useState<string>("");
  const [params, setParams] = useState<string>("");
  const [toolName, setToolName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [hashtags, setHashtags] = useState<string>("");
  const [recallClient, setRecallClient] = useState<RecallClient | null>(null);
  const [bucket, setBucket] = useState<any>(null);
  const [isCreatingBucket, setIsCreatingBucket] = useState<boolean>(false);
  const [bucketCreationError, setBucketCreationError] = useState<string | null>(null);
  const [isAddingTool, setIsAddingTool] = useState<boolean>(false);
  const [addToolError, setAddToolError] = useState<string | null>(null);
  const [toolAdded, setToolAdded] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [backendSaveSuccess, setBackendSaveSuccess] = useState<boolean>(false);
  const [backendSaveError, setBackendSaveError] = useState<string | null>(null);
  const [isSavingToBackend, setIsSavingToBackend] = useState<boolean>(false);
  const [buckets, setBuckets] = useState<any[]>([]);
  const [isLoadingBuckets, setIsLoadingBuckets] = useState<boolean>(false);
  const [bucketsError, setBucketsError] = useState<string | null>(null);
  const [selectedBucket, setSelectedBucket] = useState<any>(null);
  const [bucketTools, setBucketTools] = useState<any[]>([]);
  const [isLoadingTools, setIsLoadingTools] = useState<boolean>(false);
  const [toolSaveSuccess, setToolSaveSuccess] = useState<boolean>(false);
  const [toolSaveError, setToolSaveError] = useState<string | null>(null);
  const [activeEditorTab, setActiveEditorTab] = useState<"function" | "params" | "info">("function");
  const [apiKey, setApiKey] = useState<string>("");
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  const { ready, authenticated, login, logout, user } = usePrivy();

  const initializeRecallClient = async (privateKey: string) => {
    try {
      if (!privateKey || privateKey === "0x") {
        console.error("Missing private key for Recall");
        setApiKeyError("Please enter a valid API key");
        return;
      }

      const formattedPrivateKey: `0x${string}` = privateKey.startsWith("0x") 
        ? privateKey as `0x${string}` 
        : `0x${privateKey}`;
      
      const walletClient = createWalletClient({
        account: privateKeyToAccount(formattedPrivateKey),
        chain: testnet,
        transport: http(),
      });

      const client = new RecallClient({ walletClient });
      setRecallClient(client);
      setApiKeyError(null);
      console.log("Recall client initialized successfully", client);
    } catch (error) {
      console.error("Failed to initialize Recall client:", error);
      setApiKeyError("Invalid API key. Please check and try again.");
    }
  };

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      setApiKeyError("Please enter your Wallet API key");
      return;
    }
    initializeRecallClient(apiKey);
  };

  // Sync user with backend when authentication state changes
  useEffect(() => {
    const syncUser = async (address: string) => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';
        const res = await fetch(`${API_URL}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ walletAddress: address }),
        });
    
        const data = await res.json();
        if (!res.ok) {
          console.error("Failed to create or fetch user:", data.message);
        } else {
          console.log("User synced:", data);
        }
      } catch (err) {
        console.error("Error during user sync:", err);
      }
    };    
  
    if (authenticated && user?.wallet?.address) {
      const address = user.wallet.address;
      setWalletAddress(address);
      syncUser(address);
    } else {
      setWalletAddress(null);
    }
  }, [authenticated, user]);

  useEffect(() => {
    if (!authenticated) {
      setBuckets([]);
      setWalletAddress(null);
      setBucket(null);
      setBackendSaveSuccess(false);
      setBackendSaveError(null);
      setBucketCreationError(null);
      setSelectedBucket(null);
      setBucketTools([]);
    }
  }, [authenticated]);

  const fetchBucketsByWallet = async (address: string) => {
    if (!address) {
      console.error("Wallet address is required");
      return [];
    }
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';
      const response = await axios.get(`${API_URL}/buckets/wallet/${address}`);
      console.log('Buckets fetched:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching buckets:', error);
      throw error;
    }
  };

  const fetchToolsForBucket = async (bucketId: string) => {
    if (!bucketId) return [];
    
    try {
      setIsLoadingTools(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';
      const response = await axios.get(`${API_URL}/tools/bucket/${bucketId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tools:', error);
      return [];
    } finally {
      setIsLoadingTools(false);
    }
  };

  useEffect(() => {
    const loadBuckets = async () => {
      if (walletAddress && authenticated) {
        setIsLoadingBuckets(true);
        setBucketsError(null);
        
        try {
          const fetchedBuckets = await fetchBucketsByWallet(walletAddress);
          console.log('Buckets loaded:', fetchedBuckets);
          setBuckets(fetchedBuckets);
        } catch (error: any) {
          console.error("Failed to load buckets:", error);
          setBucketsError(error.message || 'Failed to load buckets');
        } finally {
          setIsLoadingBuckets(false);
        }
      }
    };
    
    loadBuckets();
  }, [walletAddress, authenticated]);

  useEffect(() => {
    if (selectedBucket) {
      const loadTools = async () => {
        const tools = await fetchToolsForBucket(selectedBucket.bucketId);
        setBucketTools(tools);
      };
      loadTools();
    } else {
      setBucketTools([]);
    }
  }, [selectedBucket]);

  const validateZodSchema = (schemaCode: string) => {
    if (!schemaCode.trim() || schemaCode === defaultParamsPlaceholder) {
      return { valid: true };
    }
  
    try {
      const tempFunc = new Function(`
        return ${schemaCode};
      `);
      
      const schema = tempFunc();
      
      if (typeof schema === 'object' || schema === null) {
        return { valid: true };
      }
      
      return { valid: false, error: "Invalid schema structure" };
    } catch (error: any) {
      return { valid: true };
    }
  };
  
  const addTool = async () => {
    if (!recallClient) {
      console.error("RecallClient not initialized");
      setAddToolError("RecallClient not initialized. Please enter your API key.");
      return false;
    }
  
    if (!toolName.trim()) {
      setAddToolError("Tool name is required");
      return false;
    }
  
    if (!code.trim() || code === defaultCodePlaceholder) {
      setAddToolError("Tool code is required");
      return false;
    }
  
    if (!selectedBucket) {
      setAddToolError("Please select a bucket first");
      return false;
    }
  
    // Validate params if provided
    if (params.trim() && params !== defaultParamsPlaceholder) {
      const validation = validateZodSchema(params);
      if (!validation.valid) {
        setAddToolError(`Invalid Zod schema: ${validation.error}`);
        return false;
      }
    }
  
    setIsAddingTool(true);
    setAddToolError(null);
    setToolAdded(false);
    setToolSaveSuccess(false);
    setToolSaveError(null);
  
    try {
      const bucketManager = recallClient.bucketManager();
      const bucketAddress = selectedBucket.bucketId;
      const key = `tool/${toolName.replace(/\s+/g, '_')}`;
      
      const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY || "temp-encryption-key";
      
      const paramsObject = params.trim() && params !== defaultParamsPlaceholder 
        ? { 
            coinName: z
              .string()
              .describe("The name of the token, all in lower case letters.")
          }
        : {};
  
      const paramsString = JSON.stringify(paramsObject);
      const encryptedParamsString = CryptoJS.AES.encrypt(
        paramsString,
        encryptionKey
      ).toString();
  
      const functionString = code.toString();
      const encryptedFunctionString = CryptoJS.AES.encrypt(
        functionString,
        encryptionKey
      ).toString();
  
      const encryptedData = JSON.stringify({
        params: encryptedParamsString,
        function: encryptedFunctionString,
      });
      
      const file = new File([encryptedData], `${toolName.replace(/\s+/g, '_')}.json`, {
        type: "application/json",
      });
      
      const { meta: addMeta } = await bucketManager.add(bucketAddress, key, file);
      
      console.log("Tool added successfully to Recall:", addMeta?.tx?.transactionHash);
      
      // Save tool to backend database
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';
        await axios.post(`${API_URL}/tools`, {
          bucketId: selectedBucket.bucketId,
          toolName: toolName,
          description: description,
          hashtags: hashtags.split(',').map(tag => tag.trim()).filter(tag => tag),
          walletAddress: walletAddress,
          code: code,
          params: params
        });
        
        console.log("Tool saved to backend database");
        setToolAdded(true);
        setToolSaveSuccess(true);
        
        // Refresh tools list
        const tools = await fetchToolsForBucket(selectedBucket.bucketId);
        setBucketTools(tools);
  
        // Reset form
        setToolName("");
        setDescription("");
        setHashtags("");
        setCode("");
        setParams("");
        
        return true;
      } catch (error: any) {
        console.error("Error saving tool to backend:", error);
        setToolSaveError(`Tool added to Recall but failed to save to backend: ${error.response?.data?.message || error.message || "Unknown error"}`);
        return false;
      }
    } catch (error: any) {
      console.error("Error adding tool:", error);
      setAddToolError(`Failed to add tool: ${error.message || "Unknown error"}`);
      return false;
    } finally {
      setIsAddingTool(false);
    }
  };

  const createBucket = async () => {
    if (!recallClient) {
      console.error("RecallClient not initialized");
      setBucketCreationError("RecallClient not initialized. Please enter your API key.");
      return null;
    }

    setIsCreatingBucket(true);
    setBucketCreationError(null);
    setBackendSaveSuccess(false);
    setBackendSaveError(null);

    try {
      const bucketManager = recallClient.bucketManager();
      const { result: { bucket: newBucket } } = await bucketManager.create();
      
      console.log("Bucket created:", newBucket);
      setBucket(newBucket);
      
      if (walletAddress && newBucket) {
        try {
          setIsSavingToBackend(true);
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';
          await axios.post(`${API_URL}/buckets`, {
            bucketId: newBucket,
            walletAddress: walletAddress
          });
          setBackendSaveSuccess(true);
          const updatedBuckets = await fetchBucketsByWallet(walletAddress);
          setBuckets(updatedBuckets);
        } catch (error: any) {
          console.error('Error saving to backend:', error);
          setBackendSaveError(
            error.response?.data?.message || 
            error.message ||
            'Error saving bucket to backend'
          );
        } finally {
          setIsSavingToBackend(false);
        }
      }
      
      return newBucket;
    } catch (error) {
      console.error("Error creating bucket:", error);
      setBucketCreationError("Failed to create bucket. Please try again.");
      return null;
    } finally {
      setIsCreatingBucket(false);
    }
  };

  return (
    <BaseLayout>
      <div className="p-6 bg-gray-900 text-gray-100 min-h-screen">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 pb-1">
              Storm Tool Manager
            </h1>
            <p className="text-blue-300 mt-2 flex items-center">
              <Zap className="inline mr-2 h-4 w-4 text-yellow-400" /> Welcome to
              your Storm dashboard. Create and manage your function tools
            </p>
          </div>

          {authenticated && walletAddress && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-50">
                <h2 className="text-xl font-bold text-cyan-400 mb-4">
                  Quick Stats
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-300">Total Buckets</span>
                    <span className="text-cyan-400 font-medium">{buckets.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-300">Total Tools</span>
                    <span className="text-cyan-400 font-medium">{bucketTools.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-50">
                  <h3 className="text-sm font-medium text-cyan-400 mb-2">Connected Wallet</h3>
                  <div className="bg-gray-800 p-2 rounded text-xs font-mono overflow-auto text-blue-300 border border-gray-700">
                    {walletAddress}
                  </div>
              </div>

              <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-50">
                <h2 className="text-xl font-bold text-cyan-400 mb-4">
                  Getting Started
                </h2>
                <ul className="space-y-2 text-blue-300">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                      Create a new bucket to store your tools
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                      Add tools to your bucket
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="bg-gray-800 border border-blue-700 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-cyan-400 mb-2 flex items-center">
              <Key className="w-4 h-4 mr-2 text-yellow-400" /> Wallet Private Key for RECALL
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Wallet Private Key for RECALL"
                className="flex-1 p-2 border border-blue-700 rounded-md shadow-md bg-gray-900 text-cyan-400 placeholder-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none password-mask"
              />
              <Button
                onClick={handleApiKeySubmit}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500"
                size="sm"
              >
                {recallClient ? "Update Key" : "Submit"}
              </Button>
            </div>
            {apiKeyError && (
              <div className="text-red-400 text-sm mt-1 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" /> {apiKeyError}
              </div>
            )}
            {recallClient && (
              <div className="text-green-400 text-sm mt-1 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" /> API key successfully configured
              </div>
            )}
            <p className="text-xs text-blue-400 mt-2">
              Your API key is the private key of the wallet that has Recall tokens and credits.
              It will be prefixed with "0x" automatically if not included.
            </p>
          </div>

          {/* Bucket Selection */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-blue-500 border-opacity-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center text-cyan-400">
                <Database className="mr-2 h-5 w-5 text-blue-400" /> Buckets
              </h2>
              {authenticated ? (
                <Button
                  onClick={!isCreatingBucket ? createBucket : undefined}
                  disabled={isCreatingBucket || !recallClient}
                  className={`flex items-center gap-2 mt-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 ${
                    isCreatingBucket || !recallClient ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  size="sm"
                >
                  {isCreatingBucket ? (
                    <>
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    <>
                      <FolderPlus className="mr-1 h-4 w-4 text-blue-300" />
                      Create Bucket
                    </>
                  )}
                </Button>
              ) : null}
            </div>

            {bucketCreationError && (
              <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-md p-3 mb-4 flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-400 mr-2" />
                <p className="text-red-400 text-sm">{bucketCreationError}</p>
              </div>
            )}
            
            {backendSaveError && (
              <div className="bg-yellow-900 bg-opacity-20 border border-yellow-800 rounded-md p-3 mb-4 flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-400 mr-2" />
                <p className="text-yellow-400 text-sm">
                  Bucket created but error saving to backend: {backendSaveError}
                </p>
              </div>
            )}

            {authenticated && bucket && (
              <div className="bg-gray-900 p-4 rounded-md border border-blue-600 border-opacity-30 mb-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="text-green-400 mr-2 h-5 w-5" />
                  <h3 className="text-lg font-medium text-green-400">Bucket Created Successfully</h3>
                </div>
                <div className="bg-gray-800 p-2 rounded text-xs font-mono overflow-auto text-blue-300 border border-gray-700">
                  {JSON.stringify(bucket, null, 2)}
                </div>
                
                {backendSaveSuccess && (
                  <div className="mt-2 bg-green-900 bg-opacity-20 border border-green-800 rounded-md p-2 flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    <p className="text-green-400 text-xs">Bucket saved to database</p>
                  </div>
                )}
              </div>
            )}

            {/* Bucket Cards Display */}
            <div className="mt-4">
              {!authenticated ? (
                <div className="text-center py-8 text-blue-300">
                  <p>Please login to view and manage your buckets.</p>
                  <Button
                    onClick={() => login()}
                    className="mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500"
                  >
                    Login
                  </Button>
                </div>
              ) : isLoadingBuckets ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                </div>
              ) : buckets.length === 0 ? (
                <div className="text-center py-8 text-blue-300">
                  <p>No buckets created yet. Create a bucket to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {buckets.map((bucket) => (
                    <div 
                      key={bucket._id} 
                      className={`bg-gray-900 p-4 rounded-md border transition-colors duration-200 cursor-pointer ${
                        selectedBucket?._id === bucket._id 
                          ? "border-blue-500" 
                          : "border-blue-600 border-opacity-30 hover:border-blue-500"
                      }`}
                      onClick={() => setSelectedBucket(bucket)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-blue-400 truncate">{bucket.bucketId}</h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {new Date(bucket.createdAt).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false
                          })}
                        </span>
                      </div>
                      <div className="bg-gray-800 p-2 rounded text-xs font-mono overflow-auto text-blue-300 border border-gray-700">
                        <div>
                          <span className="text-blue-400">Bucket ID:</span> {bucket.bucketId}
                        </div>
                        <div>
                          <span className="text-blue-400">Wallet Address:</span> {bucket.walletAddress}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedBucket && (
            <>
              {/* Tabs */}
              <div className="flex border-b border-blue-800 mb-6">
                <button
                  className={`py-2 px-4 font-medium text-sm ${
                    activeTab === "create"
                      ? "text-cyan-400 border-b-2 border-cyan-500 bg-gray-800"
                      : "text-blue-300 hover:text-cyan-400"
                  }`}
                  onClick={() => setActiveTab("create")}
                >
                  <div className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Tool
                  </div>
                </button>
                <button
                  className={`py-2 px-4 font-medium text-sm ${
                    activeTab === "tools"
                      ? "text-cyan-400 border-b-2 border-cyan-500 bg-gray-800"
                      : "text-blue-300 hover:text-cyan-400"
                  }`}
                  onClick={() => setActiveTab("tools")}
                >
                  <div className="flex items-center">
                    <Code className="mr-2 h-4 w-4" /> Bucket Tools
                  </div>
                </button>
              </div>

              {/* Content based on active tab */}
              {activeTab === "create" ? (
                <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-blue-700 border-opacity-30">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-cyan-400">
                      Create Tool for Bucket
                    </h2>
                    <button 
                      onClick={() => setSelectedBucket(null)}
                      className="text-sm text-gray-400 hover:text-blue-300"
                    >
                      Close
                    </button>
                  </div>
                  
                  <div className="bg-gray-900 p-3 rounded-md border border-blue-600 border-opacity-30 mb-4">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-blue-400">Selected Bucket:</span>
                      <span className="text-xs font-mono text-blue-300">{selectedBucket.bucketId}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-4">
                    <div>
                      <label
                        htmlFor="toolName"
                        className="block text-sm font-medium text-blue-300 mb-1"
                      >
                        Tool Name
                      </label>
                      <input
                        id="toolName"
                        type="text"
                        value={toolName}
                        onChange={(e) => setToolName(e.target.value)}
                        placeholder="getCryptoPrice, getWeather, etc."
                        className="w-full p-2 border border-blue-700 rounded-md shadow-md bg-gray-900 text-cyan-400 placeholder-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                      <p className="text-xs text-blue-400 mt-1">
                        The name that will be used to call your function
                      </p>
                    </div>
                    
                    {/* Editor Tabs */}
                    <div className="flex border-b border-blue-800">
                      <button
                        className={`py-2 px-4 font-medium text-sm flex items-center ${
                          activeEditorTab === "function"
                            ? "text-cyan-400 border-b-2 border-cyan-500"
                            : "text-blue-300 hover:text-cyan-400"
                        }`}
                        onClick={() => setActiveEditorTab("function")}
                      >
                        <Code className="mr-2 h-4 w-4" /> Function
                      </button>
                      <button
                        className={`py-2 px-4 font-medium text-sm flex items-center ${
                          activeEditorTab === "params"
                            ? "text-cyan-400 border-b-2 border-cyan-500"
                            : "text-blue-300 hover:text-cyan-400"
                        }`}
                        onClick={() => setActiveEditorTab("params")}
                      >
                        <Settings className="mr-2 h-4 w-4" /> Parameters
                      </button>
                      <button
                        className={`py-2 px-4 font-medium text-sm flex items-center ${
                          activeEditorTab === "info"
                            ? "text-cyan-400 border-b-2 border-cyan-500"
                            : "text-blue-300 hover:text-cyan-400"
                        }`}
                        onClick={() => setActiveEditorTab("info")}
                      >
                        <Info className="mr-2 h-4 w-4" /> Other Info
                      </button>
                    </div>
                    
                    {/* Function Editor */}
                    {activeEditorTab === "function" && (
                      <div>
                        <label
                          htmlFor="codeEditor"
                          className="block text-sm font-medium text-blue-300 mb-1 flex items-center"
                        >
                          <Server className="mr-2 h-4 w-4 text-cyan-500" />
                          Tool Function
                        </label>
                        <MonacoEditor
                          value={code}
                          onChange={(newCode) => setCode(newCode)}
                          placeholder={defaultCodePlaceholder}
                          language="javascript"
                        />
                        <p className="text-xs text-blue-400 mt-1">
                          Write your Javascript function with JSDoc comments
                        </p>
                      </div>
                    )}
                    
                    {/* Parameters Editor */}
                    {activeEditorTab === "params" && (
                      <div>
                        <label
                          htmlFor="paramsEditor"
                          className="block text-sm font-medium text-blue-300 mb-1 flex items-center"
                        >
                          <Settings className="mr-2 h-4 w-4 text-cyan-500" />
                          Tool parameters (Zod)
                        </label>
                        <MonacoEditor
                          value={params}
                          onChange={(newParams) => setParams(newParams)}
                          placeholder={defaultParamsPlaceholder}
                          language="javascript"
                        />
                        <p className="text-xs text-blue-400 mt-1">
                          Define your parameters schema using Zod (optional)
                        </p>
                      </div>
                    )}

                    {/* Other Info Editor */}
                    {activeEditorTab === "info" && (
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-blue-300 mb-1"
                          >
                            Description
                          </label>
                          <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what your tool does..."
                            className="w-full p-2 border border-blue-700 rounded-md shadow-md bg-gray-900 text-cyan-400 placeholder-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none min-h-[100px]"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="hashtags"
                            className="block text-sm font-medium text-blue-300 mb-1"
                          >
                            Hashtags (comma separated)
                          </label>
                          <input
                            id="hashtags"
                            type="text"
                            value={hashtags}
                            onChange={(e) => setHashtags(e.target.value)}
                            placeholder="crypto,price,api"
                            className="w-full p-2 border border-blue-700 rounded-md shadow-md bg-gray-900 text-cyan-400 placeholder-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          />
                          <p className="text-xs text-blue-400 mt-1">
                            Add relevant tags to help users discover your tool
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={addTool}
                    disabled={isAddingTool || !recallClient || !authenticated}
                    className={`bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-5 rounded-md hover:from-blue-500 hover:to-cyan-500 focus:outline-none shadow-lg shadow-blue-900/30 flex items-center ${(isAddingTool || !recallClient || !authenticated) ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isAddingTool ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Tool to Bucket
                      </>
                    )}
                  </button>
                  {toolAdded && toolSaveSuccess ? (
                    <div className="mt-2 bg-green-900 bg-opacity-20 border border-green-800 rounded-md p-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      <p className="text-green-400 text-xs">Tool added successfully!</p>
                    </div>
                  ) : toolSaveError ? (
                    <div className="mt-2 bg-yellow-900 bg-opacity-20 border border-yellow-800 rounded-md p-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-400 mr-2" />
                      <p className="text-yellow-400 text-xs">{toolSaveError}</p>
                    </div>
                  ) : addToolError ? (
                    <div className="mt-2 bg-red-900 bg-opacity-20 border border-red-800 rounded-md p-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 text-red-400 mr-2" />
                      <p className="text-red-400 text-xs">{addToolError}</p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-blue-700 border-opacity-30">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-cyan-400">
                      Tools in Bucket
                    </h2>
                    <div className="text-sm text-blue-400">
                      {bucketTools.length} tool{bucketTools.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 p-3 rounded-md border border-blue-600 border-opacity-30 mb-4">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-blue-400">Bucket:</span>
                      <span className="text-xs font-mono text-blue-300">{selectedBucket.bucketId}</span>
                    </div>
                  </div>

                  {isLoadingTools ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                    </div>
                  ) : bucketTools.length === 0 ? (
                    <div className="text-center py-8 text-blue-300">
                      <p>No tools found in this bucket.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {bucketTools.map((tool, index) => (
                        <div key={index} className="bg-gray-900 p-4 rounded-md border border-blue-600 border-opacity-30">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-blue-400">
                              {tool.toolName}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {new Date(tool.createdAt).toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false
                              })}
                            </span>
                          </div>
                          {tool.description && (
                            <p className="text-sm text-blue-300 mb-2">{tool.description}</p>
                          )}
                          {tool.hashtags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {tool.hashtags.map((tag: string, i: number) => (
                                <span key={i} className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="bg-gray-800 p-2 rounded text-xs font-mono text-blue-300 border border-gray-700 overflow-auto">
                            <div>
                              <span className="text-blue-400">Tool Name:</span> {tool.toolName}
                            </div>
                            <div>
                              <span className="text-blue-400">Bucket ID:</span> {tool.bucketId}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </BaseLayout>
  );
};

export default StormToolManager;