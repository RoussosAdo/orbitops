import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OrbitOps | Workspace Operations Platform",
  description:
    "OrbitOps helps small and growing teams manage clients, projects, tasks, team access and billing from one clean workspace.",
  icons: {
    icon: [
      {
        url: "/orbitops-icon.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/orbitops-icon.png",
        type: "image/png",
        sizes: "192x192",
      },
    ],
    shortcut: "/orbitops-icon.png",
    apple: "/orbitops-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}