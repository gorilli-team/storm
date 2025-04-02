import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "../app/components/theme-provider";

export const metadata: Metadata = {
  title: "Kommander",
  description:
    "Kommander is a privacy-first automation assistant that helps users analyze data, optimize workflows, and execute actions autonomously.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
