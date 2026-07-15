'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, ArrowRight, ShieldCheck, Bug, Zap, Eye, Code, FileText, Cpu } from 'lucide-react';
import { PublicNavbar } from '@/components/shared/PublicNavbar';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-paper-bg text-ink-black flex flex-col justify-between selection:bg-editorial-red/20 dot-grid-bg">
      {/* Header Navbar */}
      <PublicNavbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col gap-12 newsprint-texture">
        {/* Editorial Front Page Header */}
        <div className="border-b border-ink-black pb-4 text-center">
          <div className="font-serif italic text-md text-neutral-600 mb-2">
            "An Exhaustive Overview of the Static Analysis Pipeline"
          </div>
          <div className="border-y border-ink-black py-2 flex flex-wrap justify-between items-center text-[10px] font-mono uppercase tracking-widest font-bold text-neutral-700 gap-2">
            <span>Section III: Tech Spec Sheet</span>
            <span>Indian Edition</span>
            <span>Est. 2026</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Feature Page Hero Headline */}
        <div className="flex flex-col gap-4 max-w-4xl">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-editorial-red">
            THE ENGINE ARCHITECTURE
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-none uppercase text-ink-black">
            Auditing Codebases with Rigor and Semantic Authority.
          </h1>
          <p className="font-body text-base text-neutral-700 leading-relaxed text-justify mt-4">
            CodeMind AI operates differently than traditional linear syntax scanners. By constructing a localized tree representation of your project, our pipeline traces the movement of values across module bounds and compares your programming logic against strict rules of security and execution efficiency.
          </p>
        </div>

        {/* Three Columns Detailed Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-ink-black pt-8">
          
          <div className="flex flex-col gap-4 lg:border-r lg:border-ink-black lg:pr-8">
            <div className="h-10 w-10 border border-ink-black flex items-center justify-center bg-ink-black text-paper-bg sharp-corners">
              <Code size={16} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif font-bold text-2xl uppercase tracking-tight text-ink-black">AST Graph Analysis</h3>
            <p className="font-body text-xs text-neutral-700 leading-relaxed text-justify">
              Rather than searching raw text strings, CodeMind parses files to build Abstract Syntax Trees (ASTs). This compiler-grade representation exposes nesting structures, block scopes, and recursive patterns, enabling the AI to analyze your source code with the exact semantic context of an interpreter.
            </p>
            <div className="bg-neutral-100 border border-ink-black/20 p-4 sharp-corners mt-4">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider block text-neutral-500 mb-1">AUDIT DEPTH</span>
              <span className="font-mono text-xs font-bold block text-ink-black">Scope Auditing &amp; Dead-branch Identification</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:border-r lg:border-ink-black lg:px-4">
            <div className="h-10 w-10 border border-ink-black flex items-center justify-center bg-ink-black text-paper-bg sharp-corners">
              <ShieldCheck size={16} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif font-bold text-2xl uppercase tracking-tight text-ink-black">Taint &amp; Dataflow Checks</h3>
            <p className="font-body text-xs text-neutral-700 leading-relaxed text-justify">
              Our analyzer maps user-controlled parameters (sources) to insecure execution blocks (sinks). By tracing parameter values across scope boundaries, the dynamic engine blocks potential cross-site scripting (XSS), database command injections, path-traversals, and hardcoded secret keys.
            </p>
            <div className="bg-neutral-100 border border-ink-black/20 p-4 sharp-corners mt-4">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider block text-neutral-500 mb-1">SECURITY STANDARD</span>
              <span className="font-mono text-xs font-bold block text-ink-black">OWASP Top-10 &amp; Secret Key Ingestion Safety</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:pl-8">
            <div className="h-10 w-10 border border-ink-black flex items-center justify-center bg-ink-black text-paper-bg sharp-corners">
              <Cpu size={16} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif font-bold text-2xl uppercase tracking-tight text-ink-black">Monaco One-Click Fixes</h3>
            <p className="font-body text-xs text-neutral-700 leading-relaxed text-justify">
              The editor integrates directly with uvicorn physical file operations. If CodeMind finds an issue, it prints a suggested patch layout in Monaco. Developers can apply the change with a single click, rewriting files on the server instantly without introducing offsets.
            </p>
            <div className="bg-neutral-100 border border-ink-black/20 p-4 sharp-corners mt-4">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider block text-neutral-500 mb-1">INTERFACE MODEL</span>
              <span className="font-mono text-xs font-bold block text-ink-black">vs-Light High Contrast Code Annotator</span>
            </div>
          </div>

        </div>

        {/* Feature Specifics Callout Card (Halftone Graphic) */}
        <div className="border border-ink-black p-8 bg-paper-bg sharp-corners flex flex-col lg:flex-row items-center gap-8 mt-4">
          <div className="flex-1 flex flex-col gap-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-editorial-red">TECHNICAL SPECIFICATION</span>
            <h2 className="font-serif font-black text-3xl uppercase tracking-tight text-ink-black">
              Hybrid LLM Routing Pipeline
            </h2>
            <p className="font-body text-xs leading-relaxed text-neutral-700 text-justify">
              To balance performance speed and context accuracy, CodeMind utilizes a dual-engine architecture:
            </p>
            <ul className="flex flex-col gap-2 font-mono text-[11px] text-neutral-600 mt-2 list-disc list-inside">
              <li>**Gemini Ingestion Engine**: Creates structural vector nodes with high tokens bandwidth.</li>
              <li>**Groq Fallback Executor**: Serves chat and logic reports under 15 seconds if API limits are hit.</li>
              <li>**Offline Keyword Search**: Guarantees RAG chats remain functional even without an internet key.</li>
            </ul>
          </div>
          <div className="w-full lg:w-96 border border-ink-black p-4 bg-neutral-100 sharp-corners text-center font-mono text-xs">
            <div className="h-40 border border-ink-black bg-neutral-200 flex flex-col justify-center items-center relative select-none uppercase tracking-widest font-black">
              <div className="bg-[radial-gradient(#111111_1px,transparent_1px)] opacity-15 absolute inset-0 [background-size:10px_10px]" />
              <span>Fig 3.2: Routing Map</span>
              <span className="text-[9px] font-normal text-neutral-500 mt-2">Gemini ──(429)──&gt; Groq Fallback</span>
            </div>
            <span className="text-[9px] text-neutral-500 block mt-2 uppercase tracking-wide">
              Fig 3.2. Architecture Pipeline Fallback Scheme.
            </span>
          </div>
        </div>

        {/* Action Column CTA */}
        <div className="border-t-4 border-ink-black pt-12 text-center flex flex-col items-center gap-6 mt-8">
          <h2 className="font-serif font-black text-3xl uppercase text-ink-black">
            Ready to review your codebase?
          </h2>
          <div className="flex gap-4">
            <Link 
              href="/register" 
              className="bg-ink-black text-paper-bg hover:bg-paper-bg hover:text-ink-black border border-ink-black px-8 py-4 font-mono text-xs uppercase tracking-widest font-bold transition-all duration-200 sharp-corners flex items-center justify-center gap-2 cursor-pointer"
            >
              CREATE FREE ACCOUNT
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
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
