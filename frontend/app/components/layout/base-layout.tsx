"use client";

import React, { useState } from "react";
import { Header } from "./header";
import { AppSidebar } from "./sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { useI18n } from "../../../lib/i18n";
import Link from "next/link";
import { User } from "lucide-react";

interface BaseLayoutProps {
  children: React.ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-gray-800/80 backdrop-blur-sm border border-blue-700/30 text-cyan-400"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar with mobile responsiveness */}
      <div
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-blue-800/30 bg-gray-900/95 backdrop-blur-sm transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AppSidebar />
      </div>

      {/* Main content with responsive padding */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-blue-800/30 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="font-semibold text-cyan-400">
                Developer
              </Link>
              <nav className="flex gap-4">
                <Link
                  href="/dashboard/widgets"
                  className="font-semibold text-cyan-400"
                >
                  User
                </Link>
              </nav>
            </div>
            <Link href="/dashboard/profile">
              <Button
                variant="ghost"
                size="sm"
                className="h-12 w-12 text-cyan-400 hover:text-cyan-300 hover:bg-gray-800"
              >
                <User className="h-8 w-8" />
              </Button>
            </Link>
          </div>
        </header>
        <main className="container mx-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
