import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "../app/components/theme-provider";
import { I18nProvider } from "../lib/i18n";
import { Providers } from "../app/providers";

export const metadata: Metadata = {
  title: "Storm",
  description:
    "Storm: A decentralized marketplace connecting developers and users through MCP tools, enabling monetization via Recall tokens and creating a seamless ecosystem for specialized AI capabilities.",
  icons: {
    icon: "/fav.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <ThemeProvider>
            <I18nProvider>{children}</I18nProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
