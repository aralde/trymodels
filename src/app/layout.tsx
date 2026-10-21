import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "TryModels | Catalog of Free AI Models",
  description: "Explore the community-curated directory of free and trial LLM API providers. Find resources for Gemini, OpenAI, Claude, and more without hidden costs.",
  keywords: [
    "free llm", "ai api", "free ai models", "llm catalog", "gemini free api", 
    "openai trial", "claude free tier", "developers", "artificial intelligence", 
    "trymodels", "llm directory", "free ai resources"
  ],
  authors: [{ name: "Aralde" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "TryModels | Catalog of Free AI Models",
    description: "The definitive catalog of free-access Large Language Models for developers. Find your next AI resource here.",
    url: "https://trymodels.com",
    siteName: "TryModels",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "TryModels - Catalog of Free AI Models",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TryModels | Catalog of Free AI Models",
    description: "A community-curated list of free and trial LLM API providers.",
    images: ["/banner.png"],
    creator: "@arieldeibe",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
