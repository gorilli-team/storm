"use client";

import { Input } from "@/app/components/ui/input";
import { BaseLayout } from "../../../components/layout/base-layout";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { Textarea } from "@/app/components/ui/textarea";

export default function NewWidgetPage() {
  return (
    <BaseLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Create New Widget</h1>
          </div>
          <Button>Proceed</Button>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-4 border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
              1
            </div>
            <span className="font-medium">Appearance</span>
          </div>
          <div className="h-px w-8 bg-border" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border text-sm">
              2
            </div>
            <span>Behavior</span>
          </div>
          <div className="h-px w-8 bg-border" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border text-sm">
              3
            </div>
            <span>Messages</span>
          </div>
          <div className="h-px w-8 bg-border" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border text-sm">
              4
            </div>
            <span>Actions</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12">
          {/* Form */}
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-medium mb-2">Appearance</h2>
              <p className="text-muted-foreground text-sm">
                Enter the basic details and customize your widget's look.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium">Widget name</span>
                  <Input placeholder="Customer support" className="mt-1" />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Description</span>
                  <Textarea
                    placeholder="This widget helps customer find answers to common questions and get support."
                    className="mt-1 h-24"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium">Position</span>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Button variant="outline" className="justify-start">
                      Top Left
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Top Right
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Bottom Left
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start bg-primary/5"
                    >
                      Bottom Right
                    </Button>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Theme</span>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <Button
                      variant="outline"
                      className="justify-start bg-primary/5"
                    >
                      Light
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Dark
                    </Button>
                    <Button variant="outline" className="justify-start">
                      System
                    </Button>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Primary color</span>
                  <div className="grid grid-cols-5 gap-2 mt-1">
                    {[
                      "#2563EB", // Blue
                      "#4F46E5", // Indigo
                      "#7C3AED", // Purple
                      "#DB2777", // Pink
                      "#DC2626", // Red
                      "#EA580C", // Orange
                      "#F59E0B", // Amber
                      "#65A30D", // Lime
                      "#059669", // Emerald
                      "#0D9488", // Teal
                    ].map((color) => (
                      <button
                        key={color}
                        className={`h-8 w-full rounded-md border ${
                          color === "#2563EB"
                            ? "ring-2 ring-offset-2 ring-primary"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">
                    Custom CSS (Advanced)
                  </span>
                  <Textarea
                    placeholder=".kommander-widget { /* your custom styles */ }"
                    className="mt-1 font-mono text-sm h-24"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <div className="sticky top-8 space-y-4">
              <h2 className="text-lg font-medium">Widget preview</h2>
              <div className="border rounded-lg p-4 h-[600px] bg-muted/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-sm font-medium">Customer support</span>
                </div>
                <div className="space-y-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-sm">
                      👋 Hi there! I'm your AI assistant.
                    </p>
                    <p className="text-sm">How can I help you today?</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Mobile
                  </Button>
                  <Button variant="outline" size="sm">
                    Desktop
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  Full preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
