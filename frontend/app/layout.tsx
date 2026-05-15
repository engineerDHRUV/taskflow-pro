import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TaskFlow Pro — Futuristic Task Management",
  description: "A premium collaborative task management platform with AI-powered insights, real-time collaboration, and stunning UI.",
  keywords: ["task management", "project management", "collaboration", "productivity"],
  authors: [{ name: "Dhruv", url: "https://github.com/dhruv" }],
  openGraph: {
    title: "TaskFlow Pro",
    description: "Premium collaborative task management",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-[#050816] text-[#f8fafc] font-body antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(10, 15, 46, 0.95)",
              color: "#f8fafc",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              backdropFilter: "blur(20px)",
            },
            success: {
              iconTheme: { primary: "#22d3ee", secondary: "#050816" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#050816" },
            },
          }}
        />
      </body>
    </html>
  );
}
