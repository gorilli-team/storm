"use client";

import React, { useState } from "react";
import { Header } from "./header";
import { AppSidebar } from "./sidebar";
import { Menu, X } from "lucide-react";

interface BaseLayoutProps {
  children: React.ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-black/5"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar with mobile responsiveness */}
      <div
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white/80 backdrop-blur-sm transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AppSidebar />
      </div>

      {/* Main content with responsive padding */}
      <div className="lg:pl-64">
        <Header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" />
        <main className="container mx-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
