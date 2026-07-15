'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Settings, User, Cpu, CreditCard, Save, CheckCircle, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [geminiModel, setGeminiModel] = useState('gemini-2.5-flash');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load preferences
  useEffect(() => {
    const savedModel = localStorage.getItem('GEMINI_MODEL');
    if (savedModel) {
      setGeminiModel(savedModel);
    }
  }, []);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('GEMINI_MODEL', geminiModel);
    setSuccessMsg('Preferences saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  if (authLoading) {
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
    <div className="min-h-screen bg-paper-bg text-ink-black dot-grid-bg flex">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Navbar />
        <main className="pt-20 p-6 min-h-[calc(100vh-4rem)] newsprint-texture">
          <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-1 pb-6 border-b border-ink-black">
              <h1 className="text-4xl lg:text-5xl font-serif font-black tracking-tight leading-none uppercase text-ink-black flex items-center gap-3">
                System Settings
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mt-2">Configure user profile details and default AI reviewer models.</p>
            </div>

            {/* Success notification */}
            {successMsg && (
              <div className="p-4 border border-ink-black bg-neutral-100 text-ink-black text-xs font-mono font-bold flex items-center gap-2 sharp-corners animate-pulse">
                <CheckCircle size={14} strokeWidth={1.5} />
                <span>SUCCESS: {successMsg}</span>
              </div>
            )}

            {/* Grid structure */}
            <div className="flex flex-col gap-8">
              {/* Profile details */}
              <div className="bg-paper-bg border border-ink-black p-6 flex flex-col gap-6 sharp-corners hard-shadow-hover">
                <h2 className="text-sm font-mono font-bold text-ink-black flex items-center gap-2 border-b border-ink-black pb-2 uppercase tracking-widest">
                  <User size={16} strokeWidth={1.5} />
                  User Profile Information
                </h2>

                <div className="flex flex-col md:flex-row items-center gap-6 border-b border-ink-black/20 pb-6">
                  <div className="w-16 h-16 border-2 border-ink-black bg-ink-black text-paper-bg flex items-center justify-center font-serif font-black text-2xl sharp-corners">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="grid grid-cols-2 gap-4 flex-1 text-xs font-mono uppercase tracking-wider">
                    <div className="flex flex-col gap-1">
                      <span className="text-neutral-500 font-bold text-[9px]">Full Name</span>
                      <span className="text-ink-black font-sans font-bold text-sm capitalize">{user.name}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-neutral-500 font-bold text-[9px]">Email Address</span>
                      <span className="text-ink-black font-sans font-bold text-sm lowercase select-all">{user.email}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-neutral-550 font-bold text-[9px]">Account Role</span>
                      <span className="text-ink-black font-sans font-bold text-sm capitalize">{user.role || 'User'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-neutral-550 font-bold text-[9px]">Account Creation</span>
                      <span className="text-ink-black font-sans font-bold text-sm">
                        {new Date((user as any).createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
                  <ShieldCheck size={14} className="text-ink-black animate-pulse" strokeWidth={1.5} />
                  <span>Session authorization credentials are managed securely via api shielding.</span>
                </div>
              </div>

              {/* Gemini Model configurations */}
              <div className="bg-paper-bg border border-ink-black p-6 flex flex-col gap-6 sharp-corners hard-shadow-hover">
                <h2 className="text-sm font-mono font-bold text-ink-black flex items-center gap-2 border-b border-ink-black pb-2 uppercase tracking-widest">
                  <Cpu size={16} strokeWidth={1.5} />
                  AI Large Language Model Config
                </h2>

                <form onSubmit={handleSavePreferences} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-600">Default Gemini Ingestion Model</label>
                    <select
                      value={geminiModel}
                      onChange={(e) => setGeminiModel(e.target.value)}
                      className="bg-paper-bg border border-ink-black text-ink-black px-4 py-3 outline-none text-xs font-mono font-bold focus:bg-neutral-100 cursor-pointer w-full max-w-md sharp-corners"
                    >
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash (Default - Balanced & Fast)</option>
                      <option value="gemini-3.5-flash">Gemini 3.5 Flash (High - Complex Codebases)</option>
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash (Fast - Legacy fallback)</option>
                    </select>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 leading-relaxed max-w-xl mt-1">
                      Select which Gemini API model is used to inspect codebase files, identify critical security bugs, and generate report metrics. High models provide deep context scans but consume more token rate-limits.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-3.5 bg-ink-black hover:bg-paper-bg text-paper-bg hover:text-ink-black border border-transparent hover:border-ink-black font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 sharp-corners cursor-pointer w-fit mt-2"
                  >
                    <Save size={13} strokeWidth={1.5} />
                    Save Model Preferences
                  </button>
                </form>
              </div>

              {/* Credit consumption details */}
              <div className="bg-paper-bg border border-ink-black p-6 flex flex-col gap-6 sharp-corners hard-shadow-hover">
                <h2 className="text-sm font-mono font-bold text-ink-black flex items-center gap-2 border-b border-ink-black pb-2 uppercase tracking-widest">
                  <CreditCard size={16} strokeWidth={1.5} />
                  API Credits & Subscription Limits
                </h2>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex flex-col gap-1.5 font-mono">
                    <span className="text-[10px] font-bold text-neutral-550 uppercase tracking-wider">Available API Balance</span>
                    <span className="text-3xl font-serif font-black text-ink-black">1,000 Credits</span>
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 leading-relaxed max-w-sm mt-1">
                      Credits are consumed based on size of uploaded project code files during AI scans. Ingesting ZIP archives consumes 10 credits per scan.
                    </p>
                  </div>

                  <div className="p-4 bg-neutral-100 border border-ink-black/35 flex flex-col gap-2 min-w-[200px] sharp-corners font-mono">
                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Plan Status</span>
                    <span className="text-xs font-extrabold text-ink-black uppercase">Sandbox Free Tier</span>
                    <span className="text-[9px] text-neutral-500 font-bold uppercase">Limit: 5 scans / hour</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
