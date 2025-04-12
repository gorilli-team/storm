"use client";

import React from "react";
import Link from "next/link";
import {
  Zap,
  ArrowRight,
  Code,
  Cloud,
  Coins,
  Users,
  Cpu,
  Network,
  Sparkles,
} from "lucide-react";
import { Button } from "./components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
                  Storm
                </h1>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white">
                The{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  AI-Powered
                </span>{" "}
                MCP Tools Marketplace
              </h2>

              <p className="text-xl text-blue-300 max-w-2xl">
                A decentralized marketplace connecting developers and users
                through MCP tools, enabling monetization via Recall tokens and
                creating a seamless ecosystem for specialized AI capabilities.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 px-8 py-6 text-lg shadow-lg shadow-blue-500/30">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/dashboard/storm">
                  <Button
                    variant="outline"
                    className="border-blue-700 text-blue-300 hover:bg-gray-800 px-8 py-6 text-lg"
                  >
                    Explore Tools
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center border border-blue-700">
                    <Cpu className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">AI-Powered</div>
                    <div className="text-blue-300 font-medium">
                      Intelligent Tools
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center border border-blue-700">
                    <Network className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Decentralized</div>
                    <div className="text-blue-300 font-medium">
                      Global Network
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center border border-blue-700">
                    <Coins className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Token Economy</div>
                    <div className="text-blue-300 font-medium">
                      Earn & Spend
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="relative w-full h-[500px]">
                {/* AI visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-80 h-80">
                    {/* Central node */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/50 z-10">
                      <Zap className="h-10 w-10 text-white" />
                    </div>

                    {/* Orbiting nodes */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-blue-500/30 animate-spin-slow"></div>
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-cyan-500/30 animate-spin-slow"
                      style={{
                        animationDirection: "reverse",
                        animationDuration: "15s",
                      }}
                    ></div>

                    {/* Tool nodes */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gray-800 border border-blue-500 flex items-center justify-center shadow-lg">
                      <Code className="h-8 w-8 text-cyan-400" />
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 rounded-full bg-gray-800 border border-blue-500 flex items-center justify-center shadow-lg">
                      <Cloud className="h-8 w-8 text-cyan-400" />
                    </div>
                    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gray-800 border border-blue-500 flex items-center justify-center shadow-lg">
                      <Coins className="h-8 w-8 text-cyan-400" />
                    </div>
                    <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gray-800 border border-blue-500 flex items-center justify-center shadow-lg">
                      <Users className="h-8 w-8 text-cyan-400" />
                    </div>

                    {/* Connection lines */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80">
                      <div className="absolute top-0 left-1/2 w-px h-40 bg-gradient-to-b from-blue-500/50 to-transparent"></div>
                      <div className="absolute bottom-0 left-1/2 w-px h-40 bg-gradient-to-t from-blue-500/50 to-transparent"></div>
                      <div className="absolute left-0 top-1/2 h-px w-40 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                      <div className="absolute right-0 top-1/2 h-px w-40 bg-gradient-to-l from-blue-500/50 to-transparent"></div>
                    </div>

                    {/* Floating particles */}
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-cyan-400 animate-float"></div>
                    <div
                      className="absolute top-3/4 left-1/3 w-1.5 h-1.5 rounded-full bg-blue-400 animate-float"
                      style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                      className="absolute top-1/3 left-3/4 w-2 h-2 rounded-full bg-cyan-400 animate-float"
                      style={{ animationDelay: "2s" }}
                    ></div>
                    <div
                      className="absolute top-2/3 left-2/3 w-1.5 h-1.5 rounded-full bg-blue-400 animate-float"
                      style={{ animationDelay: "3s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 mb-12">
            Why Choose Storm?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-50">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">
                Developer Tools
              </h3>
              <p className="text-blue-300">
                Create, publish, and monetize your MCP tools in a secure and
                decentralized environment.
              </p>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-50">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center mb-4">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">
                Seamless Integration
              </h3>
              <p className="text-blue-300">
                Easily integrate tools into your applications with our simple
                API and comprehensive documentation.
              </p>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-50">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center mb-4">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">
                Token Economy
              </h3>
              <p className="text-blue-300">
                Earn STORM tokens for your contributions and use them to access
                premium tools and features.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gray-800 shadow-lg rounded-lg p-8 border border-blue-500 border-opacity-50 text-center">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 mb-4">
              Ready to Join the Storm?
            </h2>
            <p className="text-blue-300 mb-6 max-w-2xl mx-auto">
              Create your account today and start building or using powerful MCP
              tools in our ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 px-6 py-6 text-lg">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/user/tools">
                <Button
                  variant="outline"
                  className="border-blue-700 text-blue-300 hover:bg-gray-800 px-6 py-6 text-lg"
                >
                  Browse Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-blue-800/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-cyan-400">Storm</span>
            </div>
            <div className="flex gap-6 text-blue-300">
              <Link href="#" className="hover:text-cyan-400">
                About
              </Link>
              <Link href="#" className="hover:text-cyan-400">
                Documentation
              </Link>
              <Link href="#" className="hover:text-cyan-400">
                Terms
              </Link>
              <Link href="#" className="hover:text-cyan-400">
                Privacy
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-blue-300 text-sm">
            © {new Date().getFullYear()} Storm. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
