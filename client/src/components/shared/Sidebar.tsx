'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderCode, FileSearch, Settings, LogOut, Terminal, CreditCard, Shield, Users, BarChart3, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const Sidebar = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderCode },
    { name: 'Reviews', path: '/reviews', icon: FileSearch },
    { name: 'Billing', path: '/billing', icon: CreditCard },
    { name: 'API Shield', path: '/api-settings', icon: Shield },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Metrics', path: '/metrics', icon: BarChart3 },
    { name: 'Rulebook', path: '/rules', icon: BookOpen },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-paper-bg border-r border-ink-black h-screen fixed left-0 top-0 flex flex-col justify-between p-6 z-40 sharp-corners">
      <div className="flex flex-col gap-8">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 py-2 border-b-4 border-ink-black group">
          <div className="h-10 w-10 border border-ink-black flex items-center justify-center bg-ink-black text-paper-bg group-hover:bg-paper-bg group-hover:text-ink-black transition-colors duration-200 sharp-corners">
            <Terminal size={18} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-black text-lg tracking-tight leading-none text-ink-black">
              CodeMind AI
            </span>
            <span className="text-[9px] font-mono tracking-wider uppercase text-neutral-500 mt-1">
              Ed. Vol 1.0
            </span>
          </div>
        </Link>

        {/* Navigation list */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 border transition-all duration-150 sharp-corners ${
                  isActive
                    ? 'bg-ink-black text-paper-bg border-ink-black font-bold'
                    : 'text-ink-black border-transparent hover:bg-neutral-100 hover:border-ink-black'
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                <span className="text-xs font-mono uppercase tracking-widest">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile actions */}
      <div className="flex flex-col gap-4 border-t border-ink-black pt-6">
        {user && (
          <div className="flex items-center gap-3 border border-ink-black p-3 bg-neutral-100 sharp-corners">
            <div className="w-9 h-9 border border-ink-black bg-ink-black text-paper-bg flex items-center justify-center font-mono font-bold text-sm sharp-corners">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-ink-black truncate uppercase tracking-wider font-sans">{user.name}</span>
              <span className="text-[10px] text-neutral-500 font-mono truncate">{user.email}</span>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 border border-ink-black text-ink-black bg-transparent hover:bg-editorial-red hover:text-paper-bg hover:border-editorial-red transition-all duration-200 py-3 text-xs font-mono uppercase tracking-widest w-full sharp-corners cursor-pointer"
        >
          <LogOut size={14} strokeWidth={1.5} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
