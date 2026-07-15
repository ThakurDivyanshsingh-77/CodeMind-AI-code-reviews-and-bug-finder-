import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "CodeMind AI | The Editorial Code Reviewer",
  description: "Review Smarter. Ship Faster. Automated AI Code Reviewer platform built with newsprint precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased scroll-smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-paper-bg text-ink-black font-body dot-grid-bg">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

