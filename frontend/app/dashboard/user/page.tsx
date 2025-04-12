"use client";

import { useState, useEffect } from "react";
import { BaseLayout } from "../../components/layout/base-layout";
import { Button } from "../../components/ui/button";
import { User, Edit, Github, Code, ExternalLink, Loader } from "lucide-react";
import Link from "next/link";
import axios from "axios";

interface UserProfile {
  walletAddress: string;
  githubUsername: string;
  description: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [editDescription, setEditDescription] = useState("");
  const [editGithubUsername, setEditGithubUsername] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In un'implementazione reale, sostituire con la chiamata API
        // const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';
        // const response = await axios.get(`${API_URL}/users/wallet/${walletAddress}`);
        
        const mockProfile = {
          walletAddress: "0x86fd0D762B53f21011e531fa57629D294d576A36",
          githubUsername: "cryptoDev",
          description: "Full Stack Blockchain Developer passionate about Web3 technologies and decentralized systems.",
          createdAt: new Date().toISOString()
        };
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setUserProfile(mockProfile);
        setEditDescription(mockProfile.description);
        setEditGithubUsername(mockProfile.githubUsername);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!userProfile) return;
    
    setIsLoading(true);
    try {
      // Simuliamo un salvataggio con ritardo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In implementazione reale:
      // await axios.patch(`${API_URL}/users/${userProfile.walletAddress}`, {
      //   githubUsername: editGithubUsername,
      //   description: editDescription
      // });
      
      setUserProfile({
        ...userProfile,
        githubUsername: editGithubUsername,
        description: editDescription
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !userProfile) {
    return (
      <BaseLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <Loader className="h-10 w-10 animate-spin text-cyan-500" />
        </div>
      </BaseLayout>
    );
  }

  if (error && !userProfile) {
    return (
      <BaseLayout>
        <div className="flex justify-center items-center h-[70vh] text-red-400">
          <p>{error}</p>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="space-y-8 w-full px-6 text-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 pb-1">
            Profile
          </h1>
          {isEditing ? (
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500"
                onClick={handleSaveProfile}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gray-800 hover:bg-gray-700 text-blue-300"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          )}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-20">
              <div className="flex flex-col items-center mb-4">
                <div className="bg-blue-900 bg-opacity-30 rounded-full p-6 mb-3">
                  <User className="h-12 w-12 text-cyan-400" />
                </div>
                {isEditing ? (
                  <div className="w-full mt-2">
                    <label className="block text-sm font-medium text-blue-300 mb-1">
                      GitHub Username
                    </label>
                    <input
                      type="text"
                      value={editGithubUsername}
                      onChange={(e) => setEditGithubUsername(e.target.value)}
                      className="w-full p-2 border border-blue-700 rounded-md bg-gray-900 text-cyan-400 placeholder-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="GitHub username"
                    />
                  </div>
                ) : (
                  <>
                    {userProfile?.githubUsername && (
                      <div className="flex items-center gap-1 text-cyan-400 font-medium">
                        <Github className="h-4 w-4" />
                        <span>{userProfile.githubUsername}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="py-2 border-t border-gray-700">
                <div className="flex items-center gap-2 text-sm text-blue-300 mt-2">
                  <Code className="h-4 w-4" />
                  <span>Wallet Address:</span>
                </div>
                <div className="mt-1 text-sm font-mono bg-gray-900 p-2 rounded border border-gray-700 flex items-center justify-between">
                  <span className="text-cyan-400 overflow-auto">
                    {userProfile?.walletAddress || ""}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-blue-300 hover:text-cyan-400 hover:bg-gray-700 flex-shrink-0"
                    onClick={() => navigator.clipboard.writeText(userProfile?.walletAddress || "")}
                    title="Copy to clipboard"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </Button>
                </div>
              </div>

              <div className="py-2 border-t border-gray-700">
                <div className="text-sm text-blue-300 mt-2">
                  <span>Member since:</span>
                </div>
                <div className="text-sm text-cyan-400 mt-1">
                  {userProfile ? formatDate(userProfile.createdAt) : ""}
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Bio */}
          <div className="md:col-span-3">
            <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-20">
              <h3 className="text-lg font-medium text-cyan-400 mb-4">About</h3>
              
              {isEditing ? (
                <div className="w-full">
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-3 border border-blue-700 rounded-md bg-gray-900 text-blue-300 placeholder-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none min-h-[150px]"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              ) : (
                <div className="text-blue-300 whitespace-pre-wrap">
                  {userProfile?.description || "No description provided."}
                </div>
              )}
            </div>

            {/* GitHub repository section */}
            {userProfile?.githubUsername && !isEditing && (
              <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-20 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-cyan-400">GitHub Profile</h3>
                  <Link 
                    href={`https://github.com/${userProfile.githubUsername}`} 
                    target="_blank"
                    className="flex items-center text-sm text-blue-300 hover:text-cyan-400"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" /> View on GitHub
                  </Link>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <Github className="h-10 w-10 text-cyan-400" />
                  <div>
                    <div className="text-cyan-400 font-medium">{userProfile.githubUsername}</div>
                    <div className="text-sm text-blue-300">github.com/{userProfile.githubUsername}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}