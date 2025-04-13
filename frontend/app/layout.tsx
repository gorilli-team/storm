import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "../app/components/theme-provider";
import { I18nProvider } from "../lib/i18n";
import { Providers } from "../app/providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Storm",
  description:
    "Storm: A decentralized marketplace connecting developers and users through MCP tools, enabling monetization via Recall tokens and creating a seamless ecosystem for specialized AI capabilities.",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="dec0279c-09da-46de-979c-e715306bfbba"
          strategy="afterInteractive"
          defer
        />
      </head>
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
