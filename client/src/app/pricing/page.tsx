'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, ArrowRight, ShieldCheck, Check, Info } from 'lucide-react';
import { PublicNavbar } from '@/components/shared/PublicNavbar';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-paper-bg text-ink-black flex flex-col justify-between selection:bg-editorial-red/20 dot-grid-bg">
      {/* Header Navbar */}
      <PublicNavbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col gap-12 newsprint-texture">
        {/* Editorial Header */}
        <div className="border-b border-ink-black pb-4 text-center">
          <div className="font-serif italic text-md text-neutral-600 mb-2">
            "Rates and Circulation Plans for Auditing Worksheets"
          </div>
          <div className="border-y border-ink-black py-2 flex flex-wrap justify-between items-center text-[10px] font-mono uppercase tracking-widest font-bold text-neutral-700 gap-2">
            <span>Section IV: Subscription Ledger</span>
            <span>Indian Edition</span>
            <span>Est. 2026</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col gap-4 max-w-3xl">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-editorial-red">
            SUBSCRIPTION CIRCULATION
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-none uppercase text-ink-black">
            Choose Your Printing Press Plan.
          </h1>
          <p className="font-body text-xs sm:text-sm text-neutral-700 leading-relaxed text-justify mt-4">
            Select a plan structured to support your team's code ingestion volume. All paid tiers include our high-contrast review dashboards, full Monaco one-click physical file patching, and automatic Groq fallback routers.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-l border-t border-ink-black mt-4">
          
          {/* Card 1: Sandbox Free */}
          <div className="border-r border-b border-ink-black p-8 flex flex-col justify-between bg-paper-bg hover:bg-neutral-50 transition-colors duration-150 group">
            <div className="flex flex-col gap-6">
              <span className="text-xs font-mono uppercase tracking-widest font-bold text-neutral-500">Tavern Gazette</span>
              <h3 className="font-serif font-black text-3xl uppercase text-ink-black">Free Dispatch</h3>
              <div className="h-0.5 bg-ink-black w-full my-2"></div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif font-black text-4xl">$0</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">/ forever</span>
              </div>
              <p className="font-body text-xs text-neutral-600 leading-relaxed text-justify mt-2">
                Ideal for independent developers or open-source maintainers auditing simple single-file scripts.
              </p>
              <ul className="flex flex-col gap-3 font-mono text-[10px] text-neutral-700 mt-4 border-t border-neutral-300 pt-4">
                <li className="flex items-start gap-2">
                  <Check size={12} className="text-editorial-red mt-0.5" />
                  <span>1,000 Sandbox Credits</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={12} className="text-editorial-red mt-0.5" />
                  <span>5 scans per hour rate-limit</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={12} className="text-editorial-red mt-0.5" />
                  <span>Dual AST &amp; Dataflow checks</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 w-full border border-ink-black bg-transparent hover:bg-ink-black hover:text-paper-bg py-3 text-center font-mono text-xs uppercase tracking-widest font-bold transition-all duration-200 sharp-corners"
            >
              Start Ingestion
            </Link>
          </div>

          {/* Card 2: Pro */}
          <div className="border-r border-b border-ink-black p-8 flex flex-col justify-between bg-neutral-100/50 hover:bg-neutral-100 transition-colors duration-150 relative group">
            <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-editorial-red text-paper-bg text-[8px] font-mono font-bold uppercase tracking-widest px-3 py-1 sharp-corners">
              Recommended
            </div>
            <div className="flex flex-col gap-6">
              <span className="text-xs font-mono uppercase tracking-widest font-bold text-editorial-red">Daily Chronicle</span>
              <h3 className="font-serif font-black text-3xl uppercase text-ink-black">Daily Gazette</h3>
              <div className="h-0.5 bg-ink-black w-full my-2"></div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif font-black text-4xl">$29</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">/ monthly</span>
              </div>
              <p className="font-body text-xs text-neutral-600 leading-relaxed text-justify mt-2">
                Engineered for growing software startups needing continuous analysis pipelines and GitHub webhook monitoring.
              </p>
              <ul className="flex flex-col gap-3 font-mono text-[10px] text-neutral-700 mt-4 border-t border-neutral-300 pt-4">
                <li className="flex items-start gap-2">
                  <Check size={12} className="text-editorial-red mt-0.5" />
                  <span>25,000 monthly credits</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={12} className="text-editorial-red mt-0.5" />
                  <span>Infinite codebase ZIP uploads</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={12} className="text-editorial-red mt-0.5" />
                  <span>GitHub webhook PR integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={12} className="text-editorial-red mt-0.5" />
                  <span>Advanced RAG codebase search</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 w-full bg-ink-black text-paper-bg hover:bg-paper-bg hover:text-ink-black border border-ink-black py-3 text-center font-mono text-xs uppercase tracking-widest font-bold transition-all duration-200 sharp-corners"
            >
              Subscribe Today
            </Link>
          </div>

          {/* Card 3: Enterprise */}
          <div className="border-r border-b border-ink-black p-8 flex flex-col justify-between bg-paper-bg hover:bg-neutral-50 transition-colors duration-150 group">
            <div className="flex flex-col gap-6">
              <span className="text-xs font-mono uppercase tracking-widest font-bold text-neutral-500">Printing Press</span>
              <h3 className="font-serif font-black text-3xl uppercase text-ink-black">The Broadside</h3>
              <div className="h-0.5 bg-ink-black w-full my-2"></div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif font-black text-4xl">$149</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">/ monthly</span>
              </div>
              <p className="font-body text-xs text-neutral-600 leading-relaxed text-justify mt-2">
                Tailored for broad-scale operations requiring concurrent workspace pipelines and custom safety configurations.
              </p>
              <ul className="flex flex-col gap-3 font-mono text-[10px] text-neutral-700 mt-4 border-t border-neutral-300 pt-4">
                <li className="flex items-start gap-2">
                  <Check size={12} className="text-editorial-red mt-0.5" />
                  <span>Unlimited scanned credits</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={12} className="text-editorial-red mt-0.5" />
                  <span>Multi-seat user access controls</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={12} className="text-editorial-red mt-0.5" />
                  <span>Dedicated uvicorn server thread</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={12} className="text-editorial-red mt-0.5" />
                  <span>Prioritized support hotline</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 w-full border border-ink-black bg-transparent hover:bg-ink-black hover:text-paper-bg py-3 text-center font-mono text-xs uppercase tracking-widest font-bold transition-all duration-200 sharp-corners"
            >
              Contact Typographer
            </Link>
          </div>

        </div>

        {/* Feature Matrix Table */}
        <div className="border-t border-ink-black pt-8">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black block mb-4 border-b border-ink-black pb-2">
            SECTION V: SUBSCRIPTION COMPARISON MATRIX
          </span>
          <div className="border border-ink-black overflow-x-auto sharp-corners">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-ink-black">
                  <th className="p-3 border-r border-ink-black uppercase font-bold text-neutral-700">Capabilities</th>
                  <th className="p-3 border-r border-ink-black uppercase font-bold text-neutral-700">Free Dispatch</th>
                  <th className="p-3 border-r border-ink-black uppercase font-bold text-neutral-700">Daily Gazette</th>
                  <th className="p-3 uppercase font-bold text-neutral-700">Broadside (Enterprise)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ink-black hover:bg-neutral-50">
                  <td className="p-3 border-r border-ink-black font-bold">Monthly Scan Limits</td>
                  <td className="p-3 border-r border-ink-black">10 Scans</td>
                  <td className="p-3 border-r border-ink-black font-bold">250 Scans</td>
                  <td className="p-3">Unlimited Scans</td>
                </tr>
                <tr className="border-b border-ink-black hover:bg-neutral-50">
                  <td className="p-3 border-r border-ink-black font-bold">Maximum Project File Count</td>
                  <td className="p-3 border-r border-ink-black">15 Files</td>
                  <td className="p-3 border-r border-ink-black">150 Files</td>
                  <td className="p-3">2,000 Files</td>
                </tr>
                <tr className="border-b border-ink-black hover:bg-neutral-50">
                  <td className="p-3 border-r border-ink-black font-bold">RAG Chat with Codebase</td>
                  <td className="p-3 border-r border-ink-black text-neutral-400">Offline Fallback Only</td>
                  <td className="p-3 border-r border-ink-black font-bold">Vector Embeddings Active</td>
                  <td className="p-3">Custom Graph Indexing</td>
                </tr>
                <tr className="border-b border-ink-black hover:bg-neutral-50">
                  <td className="p-3 border-r border-ink-black font-bold">GitHub PR Webhook Integration</td>
                  <td className="p-3 border-r border-ink-black text-neutral-400">Unavailable</td>
                  <td className="p-3 border-r border-ink-black">1 Target Repository</td>
                  <td className="p-3">Unlimited Repositories</td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <td className="p-3 border-r border-ink-black font-bold">Support SLA</td>
                  <td className="p-3 border-r border-ink-black">Documentation Only</td>
                  <td className="p-3 border-r border-ink-black">48-Hour Email Dispatch</td>
                  <td className="p-3 font-bold text-editorial-red">Dedicated Slack/Voice Link</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Small Print Info Badge */}
        <div className="border border-ink-black p-4 bg-paper-bg sharp-corners flex items-start gap-3 mt-4">
          <Info size={16} className="text-neutral-550 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 leading-relaxed">
            NOTICE: Pricing is invoiced on a recurring monthly ledger. Scanned credits are calculated based on overall characters ingested. Rate-limits are subject to API availability; fallback models (Groq / Llama) are executed during peak load hours at no additional charge.
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t-4 border-ink-black bg-paper-bg mt-16">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center px-6 py-8 gap-6 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="text-ink-black font-serif text-sm font-black">CODEMIND PRINTING CO.</span>
            <span>© 2026 CodeMind AI. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <span>Edition: Vol. I / IND Edition</span>
            <span>•</span>
            <span className="underline hover:text-ink-black transition-colors cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="underline hover:text-ink-black transition-colors cursor-pointer">Privacy Charter</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
