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
  AlertTriangle
} from "lucide-react";
import { Button } from "../../components/ui/button";
import Editor from "@monaco-editor/react";
// Recall imports
import { testnet } from "@recallnet/chains";
import { RecallClient } from "@recallnet/sdk/client";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { BaseLayout } from "../../components/layout/base-layout";
import CryptoJS from "crypto-js";
import axios from "axios";
import { usePrivy } from "@privy-io/react-auth";

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
  language = "typescript",
}) => {
  const editorRef = useRef<any>(null);
  const [isEmpty, setIsEmpty] = useState(value === placeholder || value === "");

  // Handle editor mount
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    // Add focus handler
    editor.onDidFocusEditorText(() => {
      if (isEmpty) {
        // Clear the editor content when it's empty and gets focus
        onChange("");
        setIsEmpty(false);
      }
    });

    // Add blur handler to set placeholder back if content is empty
    editor.onDidBlurEditorText(() => {
      if (!editor.getValue().trim()) {
        editor.setValue(placeholder);
        setIsEmpty(true);
      }
    });
  };

  // Update when value changes from outside
  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();

      // Only update if the editor value is different from the new value
      // and we're not just toggling between empty and placeholder
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
        defaultLanguage="typescript"
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

const StormToolManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"create" | "manage">("create");
  const [showNewBucketForm, setShowNewBucketForm] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [toolName, setToolName] = useState<string>("");
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

  const { ready, authenticated, login, logout, user } = usePrivy();

  useEffect(() => {
    console.log("Checking wallet connection:", { authenticated, user });
    
    if (authenticated && user && user.wallet) {
      const address = user.wallet.address;
      console.log("Found wallet with address:", address);
      
      if (address) {
        setWalletAddress(address);
        console.log("Wallet address set to:", address);
      }
    } else {
      console.log("No wallet available:", { 
        authenticated, 
        hasUser: !!user, 
        hasWallet: user ? !!user.wallet : false 
      });
    }
  }, [authenticated, user]);
  
  /**
   * Fetches all buckets for a wallet address
   * @param {string} address The wallet address to fetch buckets for
   * @returns {Promise<Array>} Array of buckets
   */
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

  useEffect(() => {
    const loadBuckets = async () => {
      if (walletAddress) {
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
  }, [walletAddress]);

  /**
   * Adds a tool to the specified bucket
   * @returns {Promise<boolean>} Success or failure
   */
  const addTool = async () => {
    if (!recallClient) {
      console.error("RecallClient not initialized");
      setAddToolError("RecallClient not initialized");
      return false;
    }

    if (!toolName.trim()) {
      setAddToolError("Tool name is required");
      return false;
    }

    if (!code.trim()) {
      setAddToolError("Tool code is required");
      return false;
    }

    setIsAddingTool(true);
    setAddToolError(null);
    setToolAdded(false);

    try {
      // Get the bucket manager
      const bucketManager = recallClient.bucketManager();
      
      // Fixed bucket address for now (will be dynamic later)
      const bucketAddress = "0xFf0000000000000000000000000000000000626B";
      
      // Create the key using the tool name
      const key = `tool/${toolName.replace(/\s+/g, '_')}`;
      
      const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY || "temp-encryption-key";
      const encryptedFunctionString = CryptoJS.AES.encrypt(code, encryptionKey).toString();
      
      // Create a file with the encrypted string
      const file = new File([encryptedFunctionString], `${toolName.replace(/\s+/g, '_')}.txt`, {
        type: "text/plain",
      });
      
      // Add the object to the bucket
      const { meta: addMeta } = await bucketManager.add(bucketAddress, key, file);
      
      console.log("Tool added successfully:", addMeta?.tx?.transactionHash);
      setToolAdded(true);
      
      // Reset the form
      setToolName("");
      setCode("");
      
      return true;
    } catch (error) {
      console.error("Error adding tool:", error);
      setAddToolError(`Failed to add tool: ${error instanceof Error ? error.message : "Unknown error"}`);
      return false;
    } finally {
      setIsAddingTool(false);
    }
  };

/**
 * Creates a new bucket using the current RecallClient and saves it to the backend
 * @returns {Promise<any | null>} The created bucket or null if failed
 */
const createBucket = async () => {
  if (!recallClient) {
    console.error("RecallClient not initialized");
    setBucketCreationError("RecallClient not initialized");
    return null;
  }

  setIsCreatingBucket(true);
  setBucketCreationError(null);
  setBackendSaveSuccess(false);
  setBackendSaveError(null);

  try {
    // Get the bucket manager
    const bucketManager = recallClient.bucketManager();
    
    // Create a new bucket
    const {
      result: { bucket: newBucket },
    } = await bucketManager.create();
    
    console.log("Bucket created:", newBucket);
    setBucket(newBucket);
    setShowNewBucketForm(false);
    
    if (walletAddress && newBucket) {
      try {
        setIsSavingToBackend(true);
        console.log(`Saving bucket to backend - Bucket ID: ${JSON.stringify(newBucket)}, Wallet: ${walletAddress}`);
        
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';
        
        const response = await axios.post(`${API_URL}/buckets`, {
          bucketId: newBucket,
          walletAddress: walletAddress
        });
        
        console.log('Backend response:', response.data);
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
    } else {
      console.log("Cannot save to backend: missing wallet address or bucket contract");
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

  useEffect(() => {
    // Get the private key from environment variables
    const initializeRecallClient = async () => {
      try {
        const privateKeyEnv = process.env.NEXT_PUBLIC_RECALL_PRIVATE_KEY || "";

        if (!privateKeyEnv || privateKeyEnv === "0x") {
          console.error(
            "Missing private key for Recall. Set NEXT_PUBLIC_RECALL_PRIVATE_KEY in your environment variables."
          );
          return;
        }

        const privateKey = privateKeyEnv as `0x${string}`;

        const walletClient = createWalletClient({
          account: privateKeyToAccount(privateKey),
          chain: testnet,
          transport: http(),
        });

        // Create a client from the wallet client
        const client = new RecallClient({ walletClient });
        setRecallClient(client);

        console.log("Recall client initialized successfully", client);
      } catch (error) {
        console.error("Failed to initialize Recall client:", error);
      }
    };

    initializeRecallClient();
  }, []);

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
              <Zap className="inline mr-2 h-4 w-4 text-yellow-400" /> Create and
              manage your function tools
            </p>
          </div>

          {/* Wallet Debug */}
          {walletAddress && (
            <div className="bg-gray-800 border border-blue-700 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-cyan-400 mb-2">Connected Wallet</h3>
              <div className="bg-gray-900 p-2 rounded text-xs font-mono overflow-auto text-blue-300 border border-gray-700">
                {walletAddress}
              </div>
            </div>
          )}

          {/* Info Card */}
          <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-4 mb-6">
            <div className="flex">
              <div>
                <h3 className="text-sm font-medium text-cyan-400 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-yellow-500" /> Getting
                  Started
                </h3>
                <p className="text-sm text-blue-300 mt-1">
                  1. Create a new bucket to store your tools
                  <br />
                  2. Add tools to your bucket with TypeScript code
                  <br />
                  3. Publish your bucket to make your tools available
                </p>
              </div>
            </div>
          </div>

          {/* Bucket Selection */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-blue-500 border-opacity-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center text-cyan-400">
                <Database className="mr-2 h-5 w-5 text-blue-400" /> Bucket
              </h2>
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

            {!bucket ? (
              <div className="text-center py-8 text-blue-300">
                <p>No buckets created yet. Create a bucket to get started.</p>
              </div>
            ) : (
              <div className="bg-gray-900 p-4 rounded-md border border-blue-600 border-opacity-30">
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
          </div>

          {/* Tabs */}
          <div className="flex border-b border-blue-800 mb-6">
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === "create"
                  ? "text-cyan-400 border-b-2 border-cyan-500 bg-gray-800"
                  : "text-gray-400 hover:text-blue-300"
              }`}
              onClick={() => setActiveTab("create")}
            >
              <div className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Tool
              </div>
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === "manage"
                  ? "text-cyan-400 border-b-2 border-cyan-500 bg-gray-800"
                  : "text-gray-400 hover:text-blue-300"
              }`}
              onClick={() => setActiveTab("manage")}
            >
              <div className="flex items-center">
                <Code className="mr-2 h-4 w-4" /> Manage Tools ({buckets.length})
              </div>
            </button>
          </div>

          {/* Create Tool Tab */}
          {activeTab === "create" && (
            <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-blue-700 border-opacity-30">
              <h2 className="text-xl font-bold mb-4 text-cyan-400">
                Create New Tool
              </h2>

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
                <div>
                  <label
                    htmlFor="codeEditor"
                    className="block text-sm font-medium text-blue-300 mb-1 flex items-center"
                  >
                    <Server className="mr-2 h-4 w-4 text-cyan-500" />
                    Tool Code
                  </label>
                  <MonacoEditor
                    value={code}
                    onChange={(newCode) => setCode(newCode)}
                    placeholder={defaultCodePlaceholder}
                  />
                  <p className="text-xs text-blue-400 mt-1">
                    Write your TypeScript function with JSDoc comments for
                    parameters and return types
                  </p>
                </div>
              </div>

              <button
                onClick={addTool}
                disabled={isAddingTool || !recallClient}
                className={`bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-5 rounded-md hover:from-blue-500 hover:to-cyan-500 focus:outline-none shadow-lg shadow-blue-900/30 flex items-center ${(isAddingTool || !recallClient) ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isAddingTool ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Tool
                  </>
                )}
              </button>
              {toolAdded ? (
                <p className="text-xs text-green-400 mt-2 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" /> Tool added successfully!
                </p>
              ) : addToolError ? (
                <p className="text-xs text-red-400 mt-2">
                  {addToolError}
                </p>
              ) : null}
            </div>
          )}

          {/* Manage Tools Tab */}
          {activeTab === "manage" && (
            <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-blue-700 border-opacity-30">
              <h2 className="text-xl font-bold mb-4 text-cyan-400 flex items-center">
                <Database className="mr-2 h-5 w-5 text-blue-400" />
                Buckets
              </h2>

              {bucketsError && (
                <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-md p-3 mb-4 flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-400 mr-2" />
                  <p className="text-red-400 text-sm">{bucketsError}</p>
                </div>
              )}

              {isLoadingBuckets ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
                </div>
              ) : buckets.length === 0 ? (
                <div className="text-center py-12 text-blue-400 border border-dashed border-blue-800 rounded-md bg-gray-900">
                  <div className="flex flex-col items-center space-y-2">
                    <Database className="h-10 w-10 text-blue-700 mb-2" />
                    <p>No buckets found for your wallet</p>
                    <p className="text-xs text-gray-500">
                      Create a bucket to get started.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {buckets.map((bucket) => (
                    <div 
                      key={bucket._id} 
                      className="bg-gray-900 p-4 rounded-md border border-blue-600 border-opacity-30 hover:border-blue-500"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-blue-400">{bucket.bucketId}</h3>
                        <span className="text-xs text-gray-500">
                          Created: {new Date(bucket.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-gray-800 p-2 rounded text-xs font-mono overflow-auto text-blue-300 border border-gray-700">
                        {JSON.stringify(bucket, null, 2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
};

export default StormToolManager;