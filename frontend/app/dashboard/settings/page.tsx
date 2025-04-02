"use client";

import React from "react";
import { BaseLayout } from "../../../components/layout/base-layout";

export default function SettingsPage() {
  return (
    <BaseLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings.</p>
        </div>
      </div>
    </BaseLayout>
  );
}
