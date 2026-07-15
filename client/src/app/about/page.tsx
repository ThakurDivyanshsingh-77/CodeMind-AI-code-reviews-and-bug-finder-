'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, ArrowRight, ShieldCheck, Heart, Info } from 'lucide-react';
import { PublicNavbar } from '@/components/shared/PublicNavbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper-bg text-ink-black flex flex-col justify-between selection:bg-editorial-red/20 dot-grid-bg">
      {/* Header Navbar */}
      <PublicNavbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col gap-12 newsprint-texture">
        {/* Editorial Header */}
        <div className="border-b border-ink-black pb-4 text-center">
          <div className="font-serif italic text-md text-neutral-600 mb-2">
            "The History, Principles, and Manifesto of the Printing House"
          </div>
          <div className="border-y border-ink-black py-2 flex flex-wrap justify-between items-center text-[10px] font-mono uppercase tracking-widest font-bold text-neutral-700 gap-2">
            <span>Section V: The Manifesto</span>
            <span>Indian Edition</span>
            <span>Est. 2026</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Story Headline */}
        <div className="flex flex-col gap-4 max-w-4xl">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-editorial-red">
            OUR FOUNDATION &amp; PURPOSE
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-none uppercase text-ink-black">
            The CodeMind Gazette: Why We Built The Editorial Reviewer.
          </h1>
          <p className="font-body text-base text-neutral-700 leading-relaxed text-justify mt-4">
            In an era where developer tools are increasingly cluttered with neon charts, flashing dials, and dark, high-contrast dashboard grids, CodeMind was founded on a simple returning principle: **readability and semantic focus are the cornerstones of clean engineering.**
          </p>
        </div>

        {/* Two Columns Story Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-ink-black pt-8">
          
          {/* Left Column: Story (8-cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6 lg:border-r lg:border-ink-black lg:pr-8">
            <h3 className="font-serif font-bold text-2xl uppercase tracking-tight text-ink-black">Our Founding Manifesto</h3>
            
            <div className="font-body text-xs sm:text-sm text-neutral-700 leading-relaxed text-justify flex flex-col gap-4">
              <p>
                The seed of CodeMind was planted in late 2025 during a retrospective on legacy system failures. We noticed that engineers were spending more time resolving minor warning alerts on futuristic dashboards than inspecting actual code scopes. The tools they relied on treated bugs as mere numbers in a spreadsheet, lacking context or remediation details.
              </p>
              <p>
                We asked ourselves: *What if a codebase reviewer worked like a veteran newspaper editor?*
              </p>
              <p>
                An editor does not simply cross out a sentence; they suggest a cleaner flow, explain the cognitive flaw in the original formulation, and write a drop-in replacement. We built CodeMind to replicate that editorial authority. By compiling codebases into semantic AST graphs, we can audit repositories, identify vulnerabilities, and print clean, monochrome log reports with explanation context.
              </p>
              <p>
                We chose the **Newsprint** design system to guarantee zero distraction. No flashing charts, no dark mode eye fatigue—just clean paper typography, sharp borders, and solid mechanical buttons that honor the long history of technical typography.
              </p>
            </div>

            {/* Quote Block */}
            <div className="border-l-4 border-editorial-red pl-4 py-2 italic font-serif text-sm text-neutral-800 bg-neutral-50 my-2">
              "We believe that programming is a form of writing, and codebase structures deserve the same editorial rigor, typographic clarity, and critical proofreading as any morning broadside."
            </div>
          </div>

          {/* Right Column: Board of Editors (4-cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <h3 className="font-serif font-bold text-lg uppercase tracking-tight text-ink-black border-b border-ink-black pb-2">
              The Board of Editors
            </h3>

            <div className="border border-ink-black p-4 bg-paper-bg sharp-corners flex flex-col gap-4">
              <div className="flex flex-col gap-1 border-b border-neutral-300 pb-2">
                <span className="font-serif font-black text-sm uppercase text-ink-black">A. Hamilton</span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Editor-in-Chief &amp; Founder</span>
              </div>
              <p className="font-body text-xs text-neutral-600 leading-relaxed text-justify">
                Responsible for the compiler AST parsing engine. Believes in strict block structures and zero border-radius interfaces.
              </p>
            </div>

            <div className="border border-ink-black p-4 bg-paper-bg sharp-corners flex flex-col gap-4">
              <div className="flex flex-col gap-1 border-b border-neutral-300 pb-2">
                <span className="font-serif font-black text-sm uppercase text-ink-black">E. Lovelace</span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Chief Typesetter</span>
              </div>
              <p className="font-body text-xs text-neutral-600 leading-relaxed text-justify">
                Architect of the Newsprint theme system. Replaced all legacy dark mode variables with warm paper overlays.
              </p>
            </div>

            <div className="border border-ink-black p-4 bg-paper-bg sharp-corners flex flex-col gap-4">
              <div className="flex flex-col gap-1 border-b border-neutral-300 pb-2">
                <span className="font-serif font-black text-sm uppercase text-ink-black">C. Babbage</span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Lead Machinist</span>
              </div>
              <p className="font-body text-xs text-neutral-600 leading-relaxed text-justify">
                Manages backend uvicorn routing systems. Optimizes RAG database embeddings and Groq fallback channels.
              </p>
            </div>
          </div>

        </div>

        {/* Small Love Callout */}
        <div className="border border-ink-black p-4 bg-paper-bg sharp-corners flex items-center justify-center gap-2 mt-4 text-xs font-mono uppercase tracking-widest">
          <Heart size={14} className="text-editorial-red fill-editorial-red animate-pulse" />
          <span>Printed with Care in IND and San Francisco • Established 2026</span>
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
