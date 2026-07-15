'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal } from 'lucide-react';
import { PublicNavbar } from '@/components/shared/PublicNavbar';

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper-bg text-ink-black flex flex-col justify-between selection:bg-editorial-red/20 dot-grid-bg">
      {/* Header Navbar */}
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 newsprint-texture">
        {children}
      </main>

      <footer className="bg-ink-black text-paper-bg mt-16 font-sans border-t border-paper-bg/10">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center px-6 py-6 gap-4 text-[9px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
          <div className="flex flex-col gap-0.5 text-center md:text-left">
            <span>CODEMIND PRINTING CO. LTD.</span>
            <span>© 2026 CodeMind AI. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="underline hover:text-paper-bg transition-colors">Home Gazette</Link>
            <span>•</span>
            <span className="underline hover:text-paper-bg transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
