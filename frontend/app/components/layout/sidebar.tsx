"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Link2,
  BarChart2,
  FileText,
  HelpCircle,
  Plus,
  ChevronDown,
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
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    dashboard: false,
    analytics: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const mainNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      section: "dashboard",
      children: [
        { title: "Widgets", href: "/dashboard/widgets" },
        { title: "Actions", href: "/dashboard/actions" },
        { title: "API Connections", href: "/dashboard/api-connections" },
      ],
    },
  ];

  const analyticsNavItems = [
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart2,
      section: "analytics",
      children: [
        { title: "Overview", href: "/analytics/overview" },
        { title: "Widgets", href: "/analytics/widgets" },
        { title: "Actions", href: "/analytics/actions" },
        { title: "Users", href: "/analytics/users" },
      ],
    },
  ];

  const bottomNavItems = [
    {
      title: "Conversations",
      href: "/conversations",
      icon: MessageSquare,
      badge: true,
    },
    {
      title: "Docs",
      href: "/docs",
      icon: FileText,
    },
    {
      title: "Help",
      href: "/help",
      icon: HelpCircle,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-5">
        <Link href="/" className="flex items-center gap-2 mb-6">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
            <Link2 className="h-3.5 w-3.5" />
          </div>
          <span className="text-xl font-bold">Kommander.ai</span>
        </Link>
        <Button
          className="w-full flex items-center gap-2"
          size="sm"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          New Widget
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <div key={item.href}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => toggleSection(item.section)}
                  tooltip={item.title}
                >
                  <div className="flex items-center gap-3 w-full">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                    <ChevronDown
                      className={`ml-auto h-4 w-4 transition-transform ${
                        expandedSections[item.section] ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {expandedSections[item.section] &&
                item.children?.map((child) => (
                  <SidebarMenuItem key={child.href} className="pl-11">
                    <SidebarMenuButton
                      isActive={pathname === child.href}
                      tooltip={child.title}
                    >
                      <Link
                        href={child.href}
                        className="flex items-center gap-3 w-full"
                      >
                        <span>{child.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </div>
          ))}

          {analyticsNavItems.map((item) => (
            <div key={item.href}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => toggleSection(item.section)}
                  tooltip={item.title}
                >
                  <div className="flex items-center gap-3 w-full">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                    <ChevronDown
                      className={`ml-auto h-4 w-4 transition-transform ${
                        expandedSections[item.section] ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {expandedSections[item.section] &&
                item.children?.map((child) => (
                  <SidebarMenuItem key={child.href} className="pl-11">
                    <SidebarMenuButton
                      isActive={pathname === child.href}
                      tooltip={child.title}
                    >
                      <Link
                        href={child.href}
                        className="flex items-center gap-3 w-full"
                      >
                        <span>{child.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </div>
          ))}

          {bottomNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                isActive={pathname === item.href}
                tooltip={item.title}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-3 w-full"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex items-center gap-2">
                    {item.title}
                    {item.badge && (
                      <span className="flex h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
