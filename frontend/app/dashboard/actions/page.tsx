"use client";

import { BaseLayout } from "../../components/layout/base-layout";
import { Button } from "../../components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import Link from "next/link";

interface ActionCard {
  id: string;
  title: string;
  description: string;
  status: "Active" | "Inactive";
  type: "Info" | "Tool" | "API";
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  endpoint?: string;
  triggerPhrases: string[];
  executions: string;
  successRate: string;
  lastUpdated: string;
}

const actions: ActionCard[] = [
  {
    id: "1",
    title: "Get User Profile",
    description: "Retrieves user profile information from the API",
    status: "Active",
    type: "API",
    method: "GET",
    endpoint: "/api/users/{userId}",
    triggerPhrases: ["show my profile", "get my account", "view my info"],
    executions: "4.8k",
    successRate: "98.5%",
    lastUpdated: "2 days ago",
  },
  {
    id: "2",
    title: "Create New Task",
    description: "Creates a new task in the system",
    status: "Active",
    type: "API",
    method: "POST",
    endpoint: "/api/tasks",
    triggerPhrases: ["add a task", "create new todo", "remind me to"],
    executions: "6.2k",
    successRate: "95.2%",
    lastUpdated: "1 day ago",
  },
  {
    id: "3",
    title: "Check Order Status",
    description: "Checks the status of a user order",
    status: "Active",
    type: "API",
    method: "GET",
    endpoint: "/api/orders/{orderId}",
    triggerPhrases: ["where is my order", "order status", "track package"],
    executions: "3.5k",
    successRate: "99.1%",
    lastUpdated: "3 days ago",
  },
  {
    id: "4",
    title: "Company Policies",
    description: "Provides information about company policies and procedures",
    status: "Active",
    type: "Info",
    triggerPhrases: ["what are the policies", "tell me about procedures", "company guidelines"],
    executions: "1.7k",
    successRate: "100%",
    lastUpdated: "5 days ago",
  },
  {
    id: "5",
    title: "Product Recommendations",
    description: "Suggests products based on user preferences",
    status: "Active",
    type: "Tool",
    triggerPhrases: ["recommend products", "what should I buy", "suggest items"],
    executions: "3.2k",
    successRate: "94.8%",
    lastUpdated: "1 day ago",
  },
  {
    id: "6",
    title: "Product Search",
    description: "Searches available products in catalog",
    status: "Active",
    type: "API",
    method: "GET",
    endpoint: "/api/products/search",
    triggerPhrases: ["find products", "search for", "looking for"],
    executions: "8.7k",
    successRate: "97.3%",
    lastUpdated: "2 days ago",
  },
];

export default function ActionsPage() {
  return (
    <BaseLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Actions</h1>
            <p className="text-muted-foreground">Manage your natural language to API mappings</p>
          </div>
          <Link href="/dashboard/actions/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Action
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
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 border-primary -mb-px"
            >
              Actions
            </Link>
            <Link
              href="/dashboard/api-connections"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              API Connections
            </Link>
          </nav>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {actions.map((action) => (
            <div
              key={action.id}
              className="border rounded-lg bg-card overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Type Badge moved to top right as requested */}
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                      action.type === "API" ? "bg-blue-100 text-blue-700" :
                      action.type === "Tool" ? "bg-orange-100 text-orange-700" :
                      "bg-purple-100 text-purple-700"
                    }`}>
                      {action.type}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        action.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {action.status}
                    </span>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Method & Endpoint for API types */}
                {action.type === "API" && action.method && action.endpoint && (
                  <div className="flex items-center text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-bold mr-2 ${
                      action.method === "GET" ? "bg-teal-100 text-teal-700" :
                      action.method === "POST" ? "bg-green-100 text-green-700" :
                      action.method === "PUT" ? "bg-yellow-100 text-yellow-700" :
                      action.method === "PATCH" ? "bg-indigo-100 text-indigo-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {action.method}
                    </span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                      {action.endpoint}
                    </code>
                  </div>
                )}

                {/* Trigger Phrases */}
                <div className="flex flex-wrap gap-2">
                  {action.triggerPhrases.map((phrase, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      {phrase}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      {action.status === "Active" && (
                        <>
                          <span>Executions: </span>
                          <span className="font-medium ml-1">{action.executions}</span>
                          <span className="mx-2">•</span>
                        </>
                      )}
                      <span>Success rate: </span>
                      <span className="font-medium">{action.successRate}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">
                      Updated {action.lastUpdated}
                    </span>
                  </div>
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