"use client";

import React from "react";
import { BaseLayout } from "../components/layout/base-layout";
import { Zap } from "lucide-react";

export default function DashboardPage() {
  return (
    <BaseLayout>
      <div className="space-y-8 w-full px-6 text-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 pb-1">
              Dashboard
            </h1>
            <p className="text-blue-300 mt-2 flex items-center">
              <Zap className="inline mr-2 h-4 w-4 text-yellow-400" /> Welcome to
              your Storm dashboard
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-50">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Quick Stats
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-300">Total Buckets</span>
                <span className="text-cyan-400 font-medium">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-300">Total Tools</span>
                <span className="text-cyan-400 font-medium">0</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-50">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Recent Activity
            </h2>
            <p className="text-blue-300">No recent activity</p>
          </div>

          <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-50">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Getting Started
            </h2>
            <ul className="space-y-2 text-blue-300">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                Create your first bucket
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                Add tools to your bucket
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                Publish your bucket
              </li>
            </ul>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
