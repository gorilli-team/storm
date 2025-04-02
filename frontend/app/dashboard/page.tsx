"use client";

import React from "react";
import { BaseLayout } from "../components/layout/base-layout";

export default function DashboardPage() {
  return (
    <BaseLayout>
      <div className="space-y-8 w-full px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Kommander</h1>
        </div>
      </div>
    </BaseLayout>
  );
}
