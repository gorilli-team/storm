"use client"
import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Save, Trash2, FolderPlus, Database, Code, Zap, Cloud, Server } from 'lucide-react';
import { Button } from "../../components/ui/button";
import Editor from '@monaco-editor/react';

interface Tool {
  name: string;
  description: string;
  code: string;
}

interface Bucket {
  id: string;
  name: string;
  tools: Tool[];
}

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
  language = "typescript" 
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
      if (currentValue !== value && 
          !(isEmpty && value === placeholder) && 
          !(currentValue === "" && value === placeholder)) {
        
        editorRef.current.setValue(value);
        setIsEmpty(value === placeholder || value === "");
      }
    }
  }, [value, placeholder, isEmpty]);

  return (
    <div className="relative h-80 border border-gray-500 rounded-md overflow-hidden bg-gray-900">
      <div className="absolute top-0 right-0 bg-gray-800 text-xs text-blue-400 px-2 py-1 rounded-bl z-10 flex items-center">
        <Server className="w-3 h-3 mr-1"/> {language}
      </div>
      <Editor
        height="100%"
        defaultLanguage="typescript"
        language={language}
        value={isEmpty ? placeholder : value}
        theme="vs-dark"
        onChange={(newValue) => {
          if (isEmpty) setIsEmpty(false);
          onChange(newValue || '');
        }}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
          fontSize: 14,
          lineNumbers: 'on',
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
          },
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
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
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [buckets, setBuckets] = useState<Bucket[]>([]); // Inizia senza bucket
  const [activeBucketId, setActiveBucketId] = useState<string | null>(null);
  const [showNewBucketForm, setShowNewBucketForm] = useState<boolean>(false);
  const [newBucketName, setNewBucketName] = useState<string>('');
  
  // Initialize with empty code instead of placeholder
  const [currentTool, setCurrentTool] = useState<Tool>({
    name: '',
    description: '',
    code: ''  // Start with empty code instead of defaultCodePlaceholder
  });

  // Get active bucket (or null if none exists)
  const activeBucket = activeBucketId 
    ? buckets.find(b => b.id === activeBucketId) 
    : buckets.length > 0 ? buckets[0] : null;

  // Set the first bucket as active when buckets change
  useEffect(() => {
    if (buckets.length > 0 && !activeBucketId) {
      setActiveBucketId(buckets[0].id);
    }
  }, [buckets, activeBucketId]);

  const handleCreateBucket = () => {
    if (!newBucketName.trim()) {
      alert("Bucket name is required");
      return;
    }

    const newBucketId = `bucket${Date.now()}`;
    const newBucket: Bucket = {
      id: newBucketId,
      name: newBucketName,
      tools: []
    };

    setBuckets([...buckets, newBucket]);
    setActiveBucketId(newBucketId);
    setNewBucketName('');
    setShowNewBucketForm(false);
  };

  const handleSaveTool = () => {
    if (!currentTool.name.trim()) {
      alert("Tool name is required");
      return;
    }

    if (!activeBucketId) {
      alert("Please create or select a bucket first");
      return;
    }

    // Make sure we're not saving an empty tool or just the placeholder
    const codeToSave = currentTool.code === defaultCodePlaceholder ? '' : currentTool.code;
    
    const updatedBuckets = [...buckets];
    const bucketIndex = updatedBuckets.findIndex(b => b.id === activeBucketId);
    
    if (bucketIndex === -1) return;

    const toolExists = updatedBuckets[bucketIndex].tools.some(
      tool => tool.name === currentTool.name
    );

    if (toolExists) {
      if (!confirm(`Tool with name "${currentTool.name}" already exists in this bucket. Do you want to update it?`)) {
        return;
      }
      // Update existing tool
      updatedBuckets[bucketIndex].tools = updatedBuckets[bucketIndex].tools.map(
        tool => tool.name === currentTool.name ? { ...currentTool, code: codeToSave || '' } : tool
      );
    } else {
      // Add new tool
      updatedBuckets[bucketIndex].tools.push({ ...currentTool, code: codeToSave || '' });
    }

    setBuckets(updatedBuckets);

    // Reset form
    setCurrentTool({
      name: '',
      description: '',
      code: ''  // Reset to empty rather than to placeholder
    });
  };

  const handleDeleteTool = (name: string) => {
    if (!activeBucketId) return;
    
    if (confirm(`Are you sure you want to delete tool "${name}"?`)) {
      const updatedBuckets = [...buckets];
      const bucketIndex = updatedBuckets.findIndex(b => b.id === activeBucketId);
      
      if (bucketIndex === -1) return;
      
      updatedBuckets[bucketIndex].tools = updatedBuckets[bucketIndex].tools.filter(
        tool => tool.name !== name
      );
      
      setBuckets(updatedBuckets);
    }
  };

  const handleEditTool = (tool: Tool) => {
    // When editing, use the actual code from the tool
    setCurrentTool({ ...tool });
    setActiveTab('create');
  };

  const handlePublishBucket = () => {
    if (!activeBucket) return;
    
    if (activeBucket.tools.length === 0) {
      alert("This bucket has no tools. Add at least one tool before publishing.");
      return;
    }

    // In a real app, this would send the data to the backend
    alert(`Bucket "${activeBucket.name}" published successfully!`);
    console.log("Published bucket:", activeBucket);
  };

  return (
    <div className="p-6 bg-gray-900 text-gray-100 min-h-screen">
      <div className='container'>
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 pb-1">Storm Tool Manager</h1>
            <p className="text-blue-300 mt-2 flex items-center"><Zap className="inline mr-2 h-4 w-4 text-yellow-400" /> Create and manage your function tools</p>
        </div>

        {/* Bucket Selection */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-blue-500 border-opacity-50">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center text-cyan-400">
                <Database className="mr-2 h-5 w-5 text-blue-400" /> Bucket Selection
            </h2>
                <Button
                    onClick={() => setShowNewBucketForm(!showNewBucketForm)}
                    className="flex items-center gap-2 mt-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500"
                    size="sm"
                >
                <FolderPlus className="mr-1 h-4 w-4 text-blue-300" /> 
                {showNewBucketForm ? 'Cancel' : 'New Bucket'}
                </Button>
            </div>
            
            {showNewBucketForm && (
            <div className="mb-4 p-4 border border-blue-500 border-opacity-50 rounded-md bg-gray-900">
                <div className="flex">
                <input 
                    type="text"
                    value={newBucketName} 
                    onChange={(e) => setNewBucketName(e.target.value)}
                    placeholder="Enter new bucket name"
                    className="flex-1 p-2 border border-blue-700 rounded-l-md shadow-lg bg-gray-900 text-cyan-400 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button 
                    onClick={handleCreateBucket}
                    className="bg-gradient-to-r from-blue-700 to-cyan-700 text-white py-2 px-4 rounded-r-md hover:from-blue-600 hover:to-cyan-600"
                >
                    Create
                </button>
                </div>
            </div>
            )}
            
            {buckets.length === 0 ? (
            <div className="text-center py-8 text-blue-300">
                <p>No buckets created yet. Create a bucket to get started.</p>
            </div>
            ) : (
            <>
                <div className="flex flex-wrap gap-2">
                {buckets.map(bucket => (
                    <button
                    key={bucket.id}
                    onClick={() => setActiveBucketId(bucket.id)}
                    className={`py-2 px-4 rounded-md text-sm font-medium ${
                        bucket.id === activeBucketId 
                        ? 'bg-blue-900 text-blue-200 border border-blue-500' 
                        : 'bg-gray-900 text-gray-400 border border-gray-700 hover:bg-gray-800 hover:text-cyan-400'
                    }`}
                    >
                    {bucket.name} ({bucket.tools.length})
                    </button>
                ))}
                </div>
                
                {activeBucket && (
                <div className="mt-4 flex justify-between items-center">
                    <div>
                    <h3 className="font-medium text-cyan-400 flex items-center">
                        <Cloud className="w-4 h-4 mr-2 text-blue-400" />
                        Active: {activeBucket.name}
                    </h3>
                    <p className="text-sm text-blue-300">
                        {activeBucket.tools.length} tool{activeBucket.tools.length !== 1 ? 's' : ''} in this bucket
                    </p>
                    </div>
                    <button 
                    onClick={handlePublishBucket}
                    className={`py-2 px-4 rounded-md text-sm font-medium ${
                        activeBucket.tools.length > 0 
                        ? 'bg-gradient-to-r from-green-600 to-cyan-600 text-white hover:from-green-500 hover:to-cyan-500 shadow-lg shadow-cyan-900/30' 
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={activeBucket.tools.length === 0}
                    >
                    Publish Bucket
                    </button>
                </div>
                )}
            </>
            )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-blue-800 mb-6">
            <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'create' ? 'text-cyan-400 border-b-2 border-cyan-500 bg-gray-800' : 'text-gray-400 hover:text-blue-300'}`}
            onClick={() => setActiveTab('create')}
            >
            <div className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Tool
            </div>
            </button>
            <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'manage' ? 'text-cyan-400 border-b-2 border-cyan-500 bg-gray-800' : 'text-gray-400 hover:text-blue-300'}`}
            onClick={() => setActiveTab('manage')}
            >
            <div className="flex items-center">
                <Code className="mr-2 h-4 w-4" /> Manage Tools ({activeBucket ? activeBucket.tools.length : 0})
            </div>
            </button>
        </div>

        {/* Create Tool Tab */}
        {activeTab === 'create' && (
            <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">
                {currentTool.name ? `Edit Tool: ${currentTool.name}` : 'Create New Tool'}
            </h2>
            
            <div className="space-y-4 mb-4">
                <div>
                <label htmlFor="toolName" className="block text-sm font-medium text-blue-300 mb-1">
                    Tool Name
                </label>
                <input 
                    id="toolName"
                    type="text"
                    value={currentTool.name} 
                    onChange={(e) => setCurrentTool({...currentTool, name: e.target.value})}
                    placeholder="getCryptoPrice, getWeather, etc."
                    className="w-full p-2 border border-blue-700 rounded-md shadow-md bg-gray-900 text-cyan-400 placeholder-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-xs text-blue-400 mt-1">
                    The name that will be used to call your function
                </p>
                </div>
                <div>
                <label htmlFor="codeEditor" className="block text-sm font-medium text-blue-300 mb-1 flex items-center">
                    <Server className="mr-2 h-4 w-4 text-cyan-500" />
                    Tool Code
                </label>
                <MonacoEditor 
                    value={currentTool.code} 
                    onChange={(newCode) => setCurrentTool({...currentTool, code: newCode})}
                    placeholder={defaultCodePlaceholder}
                />
                <p className="text-xs text-blue-400 mt-1">
                    Write your TypeScript function with JSDoc comments for parameters and return types
                </p>
                </div>
            </div>
            
            <button 
                onClick={handleSaveTool}
                disabled={!activeBucketId}
                className={`bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-5 rounded-md hover:from-blue-500 hover:to-cyan-500 focus:outline-none shadow-lg shadow-blue-900/30 flex items-center ${!activeBucketId ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <Save className="mr-2 h-4 w-4" /> 
                {currentTool.name ? 'Update Tool' : 'Save Tool'} {activeBucket ? `to ${activeBucket.name}` : ''}
            </button>
            {!activeBucketId && <p className="text-xs text-yellow-400 mt-2">You need to create a bucket first</p>}
            </div>
        )}

        {/* Manage Tools Tab */}
        {activeTab === 'manage' && (
            <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-blue-700 border-opacity-30">
            <h2 className="text-xl font-bold mb-4 text-cyan-400 flex items-center">
                <Code className="mr-2 h-5 w-5 text-blue-400" />
                {activeBucket ? `Tools in ${activeBucket.name}` : 'Tools'}
            </h2>
            
            {!activeBucket ? (
                <div className="text-center py-12 text-blue-400 border border-dashed border-blue-800 rounded-md bg-gray-900">
                <div className="flex flex-col items-center space-y-2">
                    <Database className="h-10 w-10 text-blue-700 mb-2" />
                    <p>No buckets created yet.</p>
                    <p className="text-xs text-gray-500">Create a bucket to store your tools.</p>
                </div>
                </div>
            ) : activeBucket.tools.length === 0 ? (
                <div className="text-center py-12 text-blue-400 border border-dashed border-blue-800 rounded-md bg-gray-900">
                <div className="flex flex-col items-center space-y-2">
                    <Database className="h-10 w-10 text-blue-700 mb-2" />
                    <p>No tools in this bucket yet.</p>
                    <p className="text-xs text-gray-500">Switch to "Create Tool" tab to add one.</p>
                </div>
                </div>
            ) : (
                <div className="space-y-4">
                {activeBucket.tools.map((tool, index) => (
                    <div key={index} className="border border-blue-800 border-opacity-50 rounded-md p-4 bg-gray-900 hover:bg-gray-800 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                        <h3 className="font-medium text-lg text-cyan-400">{tool.name}</h3>
                        <p className="text-blue-300 text-sm">{tool.description}</p>
                        </div>
                        <div className="flex space-x-2">
                        <button 
                            onClick={() => handleEditTool(tool)}
                            className="text-cyan-500 hover:text-cyan-300 p-1 border border-cyan-800 rounded px-2 text-xs"
                        >
                            Edit
                        </button>
                        <button 
                            onClick={() => handleDeleteTool(tool.name)}
                            className="text-red-500 hover:text-red-400 p-1 border border-red-900 rounded"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        </div>
                    </div>
                    <div className="mt-2 bg-gray-800 p-2 rounded text-xs font-mono overflow-hidden text-ellipsis whitespace-nowrap text-blue-400 border border-gray-700">
                        {tool.code.split('\n')[0]}...
                    </div>
                    </div>
                ))}
                </div>
            )}
            </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-4 mt-6">
            <div className="flex">
            <div>
                <h3 className="text-sm font-medium text-cyan-400 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-500" /> Getting Started
                </h3>
                <p className="text-sm text-blue-300 mt-1">
                1. Create a new bucket to store your tools<br />
                2. Add tools to your bucket with TypeScript code<br />
                3. Publish your bucket to make your tools available
                </p>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StormToolManager;