'use client';

import React from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function MetricsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-paper-bg text-ink-black dot-grid-bg">
        <div className="border border-ink-black p-6 bg-paper-bg sharp-corners flex flex-col gap-2 max-w-sm w-full text-center">
          <span className="text-xs uppercase tracking-widest font-mono font-bold">CodeMind AI</span>
          <div className="h-0.5 bg-ink-black w-full my-1"></div>
          <span className="text-sm font-body italic animate-pulse">Authenticating Session...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-paper-bg text-ink-black dot-grid-bg">
      <Sidebar />
      <div className="pl-64">
        <Navbar />
        <main className="pt-16 p-6 min-h-[calc(100vh-4rem)] newsprint-texture">
          {children}
        </main>
      </div>
    </div>
  );
}
