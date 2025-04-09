"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
      {/* Hero noise overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <main className="flex flex-col items-center justify-center space-y-16 text-center">
          {/* Glow effect behind logo */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>

          <div className="space-y-6 relative">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Storm
              </span>
            </h1>
            <p className="mx-auto max-w-[42rem] text-xl text-gray-300 sm:text-2xl font-light">
              A decentralized marketplace connecting developers and users
              through MCP tools, enabling monetization via Recall tokens and
              creating a seamless ecosystem for specialized AI capabilities.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="relative block w-64 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-8 py-6 rounded-md text-center cursor-pointer z-0"
          >
            Get Started
          </Link>

          {/* Feature cards section with glassmorphism */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <p className="mb-8 text-lg text-gray-200 max-w-3xl mx-auto">
              An AI-powered, privacy-first automation assistant that helps users
              analyze data, optimize workflows, and execute actions
              autonomously.
            </p>
          </div>
        </main>
      </div>

      {/* Animated gradient border */}
      <div className="w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-300% animate-gradient mt-6"></div>

      <footer className="w-full py-6 text-center text-sm text-gray-400">
        Built with privacy and security in mind
      </footer>
    </div>
  );
}
