'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, CreditCard, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-paper-bg border-b border-ink-black fixed top-0 right-0 left-64 z-30 flex items-center justify-between px-6 sharp-corners">
      <div className="flex items-center gap-2">
        <Link href="/api-settings" className="flex items-center gap-2 border border-ink-black px-3 py-1 bg-paper-bg text-ink-black sharp-corners hover:bg-neutral-100 transition-colors duration-150 cursor-pointer">
          <ShieldCheck size={14} className="text-editorial-red" strokeWidth={1.5} />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
            API Shield Active
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Token Balance Indicator */}
        <Link href="/billing" className="flex items-center gap-2 bg-ink-black text-paper-bg px-3 py-1.5 border border-ink-black sharp-corners text-[10px] font-mono font-semibold uppercase tracking-wider hover:bg-neutral-100 hover:text-ink-black transition-colors duration-150 cursor-pointer">
          <CreditCard size={12} strokeWidth={1.5} />
          <span>1,000 Credits</span>
        </Link>

        {/* Notifications Button */}
        <button className="p-2.5 text-ink-black hover:bg-neutral-100 border border-ink-black bg-paper-bg transition-all relative sharp-corners cursor-pointer">
          <Bell size={14} strokeWidth={1.5} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-editorial-red sharp-corners"></span>
        </button>
      </div>
    </header>
  );
};
