"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Database,
  Code,
  FolderPlus,
  Zap,
  Cloud,
  Server,
  PlusCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { useState } from "react";

export function AppSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Buckets",
      href: "/buckets",
      icon: Database,
      button: {
        title: "New Bucket",
        href: "/buckets/new",
        icon: FolderPlus,
      },
    },
    {
      title: "Tools",
      href: "/tools",
      icon: Code,
      button: {
        title: "New Tool",
        href: "/tools/new",
        icon: PlusCircle,
      },
    },
    {
      title: "Storm",
      href: "/storm",
      icon: Cloud,
      button: {
        title: "Storm",
        href: "/dashboard/storm",
        icon: Cloud,
      },
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-blue-800/30 px-6 py-5">
        <Link href="/" className="flex items-center gap-2 mb-6">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <span className="text-xl font-bold text-cyan-400">Storm</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <div key={item.href} className="mb-4">
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/")
                  }
                  tooltip={item.title}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 w-full"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem className="mt-2 px-4">
                <Link href={item.button.href}>
                  <Button
                    className="w-full flex items-center gap-2 mt-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500"
                    size="sm"
                  >
                    <item.button.icon className="h-4 w-4" />
                    {item.button.title}
                  </Button>
                </Link>
              </SidebarMenuItem>
            </div>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
