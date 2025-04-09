"use client";

import { BaseLayout } from "../../components/layout/base-layout";
import { Button } from "../../components/ui/button";
import { Plus, MoreVertical, Key, Lock } from "lucide-react";
import Link from "next/link";

interface ApiConnection {
  id: string;
  title: string;
  url: string;
  status: "Connected" | "Error";
  authType: "OAuth 2.0" | "API Key" | "JWT";
  actionsCount: number;
}

const apiConnections: ApiConnection[] = [
  {
    id: "1",
    title: "Get User Profile",
    url: "https://api.example.com/users",
    status: "Connected",
    authType: "OAuth 2.0",
    actionsCount: 4,
  },
  {
    id: "2",
    title: "Task Management API",
    url: "https://api.example.com/tasks",
    status: "Connected",
    authType: "API Key",
    actionsCount: 2,
  },
  {
    id: "3",
    title: "Order Processing API",
    url: "https://api.example.com/orders",
    status: "Connected",
    authType: "JWT",
    actionsCount: 3,
  },
  {
    id: "4",
    title: "Analytics API",
    url: "https://api.example.com/analytics",
    status: "Error",
    authType: "API Key",
    actionsCount: 1,
  },
  {
    id: "5",
    title: "Product Catalog API",
    url: "https://api.example.com/products",
    status: "Connected",
    authType: "API Key",
    actionsCount: 5,
  },
  {
    id: "6",
    title: "Appointment API",
    url: "https://api.example.com/appointments",
    status: "Connected",
    authType: "OAuth 2.0",
    actionsCount: 2,
  },
];

export default function ApiConnectionsPage() {
  return (
    <BaseLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">API Connections</h1>
            <p className="text-muted-foreground">Manage your backend API connections</p>
          </div>
          <Link href="/dashboard/api-connections/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Connection
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex gap-4">
            <Link
              href="/dashboard/widgets"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Widgets
            </Link>
            <Link
              href="/dashboard/actions"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Actions
            </Link>
            <Link
              href="/dashboard/api-connections"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 border-primary -mb-px"
            >
              API Connections
            </Link>
          </nav>
        </div>

        {/* API Connection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {apiConnections.map((connection) => (
            <div
              key={connection.id}
              className="border rounded-lg bg-card overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{connection.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {connection.url}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        connection.status === "Connected"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {connection.status}
                    </span>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  {connection.authType === "OAuth 2.0" && (
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      <span className="text-xs font-medium">OAuth 2.0</span>
                    </div>
                  )}
                  {connection.authType === "API Key" && (
                    <div className="flex items-center">
                      <Key className="h-4 w-4 mr-2" />
                      <span className="text-xs font-medium">API Key</span>
                    </div>
                  )}
                  {connection.authType === "JWT" && (
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      <span className="text-xs font-medium">JWT</span>
                    </div>
                  )}
                  <span className="text-muted-foreground text-xs ml-4">
                    {connection.actionsCount} actions using this API
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing 1-6 of 1000</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="min-w-[2.5rem]">
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-w-[2.5rem] text-muted-foreground"
            >
              2
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-w-[2.5rem] text-muted-foreground"
            >
              3
            </Button>
            <span className="text-muted-foreground">...</span>
            <Button
              variant="outline"
              size="sm"
              className="min-w-[2.5rem] text-muted-foreground"
            >
              100
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}