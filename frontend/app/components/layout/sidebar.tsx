"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Cloud,
  Zap,
  Code,
  Cpu,
  Terminal,
  User,
  BookOpen
} from "lucide-react";
import { Button } from "../ui/button";

interface NavButton {
  title: string;
  href: string;
  icon: React.ReactNode;
  variant?: "default" | "outline" | "secondary";
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  buttons?: NavButton[];
}

const navItems: NavItem[] = [
  {
    title: "Tool manager",
    href: "/dashboard/tool-manager",
    icon: <Code className="h-4 w-4" />,
  },
  {
    title: "Marketplace",
    href: "/dashboard/marketplace",
    icon: <Cloud className="h-4 w-4" />,
  },
  {
    title: "Profile",
    href: "/dashboard/user",
    icon: <User className="h-5 w-5" />,
  },
  {
    title: "Documentation",
    href: "/dashboard/documentation",
    icon: <BookOpen className="h-4 w-4" />,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col border-r border-blue-800/30 bg-gray-900">
      <div className="flex logo-div items-center border-b border-blue-800/30 px-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-lg font-bold text-cyan-400">Storm</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navItems.map((item) => (
            <div key={item.href} className="mb-2">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-blue-300 transition-all hover:text-cyan-400",
                  pathname === item.href
                    ? "bg-blue-900/20 text-cyan-400"
                    : "hover:bg-gray-800"
                )}
              >
                {item.icon}
                {item.title}
              </Link>

              {item.buttons && (
                <div className="mt-1 ml-4 flex flex-col gap-1">
                  {item.buttons.map((button) => (
                    <Link key={button.href} href={button.href}>
                      <Button
                        className={cn(
                          "w-full flex items-center gap-2 text-xs",
                          button.variant === "outline"
                            ? "bg-gray-800 text-blue-300 hover:bg-gray-700 border border-blue-800/50"
                            : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500"
                        )}
                        size="sm"
                      >
                        {button.icon}
                        {button.title}
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t border-blue-800/30">
        <div className="rounded-lg bg-gray-800 p-4 border border-blue-700/30">
          <h3 className="text-sm font-medium text-cyan-400 mb-2 flex items-center">
            <Cpu className="h-4 w-4 mr-2 text-blue-400" />
            MCP Integration
          </h3>
          <p className="text-xs text-blue-300 mb-3">
            Connect your tools to Claude and other MCP clients
          </p>
          <Link href="/dashboard/mcp-setup">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 text-xs py-1">
              Generate Setup
            </Button>
          </Link>
        </div>
      </div>
      {/* Footer */}
      <div className="text-center text-gray-400 text-sm mb-2">
            <p>Powered by <a href="https://www.gorilli.io/en" target="_blank" rel="noopener" className="text-cyan-400 hover:text-cyan-300">Gorilli</a></p>
      </div>
    </div>
  );
}
