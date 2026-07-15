'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, ArrowRight, ShieldCheck, Bug, Zap, Eye, Check } from 'lucide-react';
import { PublicNavbar } from '@/components/shared/PublicNavbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-paper-bg text-ink-black flex flex-col justify-between selection:bg-editorial-red/20 dot-grid-bg">
      {/* Header Navbar */}
      <PublicNavbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col gap-12 newsprint-texture">

        {/* Editorial Front Page Header */}
        <div className="border-b border-ink-black pb-4 text-center">
          <div className="font-serif italic text-md text-neutral-600 mb-2">
            "All the Code That's Fit to Ship"
          </div>
          <div className="border-y border-ink-black py-2 flex flex-wrap justify-between items-center text-[10px] font-mono uppercase tracking-widest font-bold text-neutral-700 gap-2">
            <span>Vol. I / No. 1</span>
            <span>Indian Edition</span>
            <span>Est. 2026</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Hero Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Main Headline & Intro */}
          <div className="lg:col-span-8 flex flex-col gap-6 justify-between pr-0 lg:pr-8 lg:border-r border-ink-black">
            <div className="flex flex-col gap-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tighter leading-[0.95] text-ink-black uppercase">
                Automate Code Reviews With <span className="underline decoration-4 decoration-editorial-red underline-offset-8">Precision AI</span>.
              </h1>

              <div className="font-body text-base text-neutral-700 text-justify leading-relaxed mt-4">
                {/* Drop Cap */}
                <span className="text-5xl font-serif font-black float-left mr-3 mt-1 bg-ink-black text-paper-bg px-2.5 py-1 sharp-corners leading-none">
                  I
                </span>
                dentify critical runtime bugs, scan security vulnerabilities, and extract high-value performance optimization opportunities in under 30 seconds. Powered by advanced semantic code graph analysis, CodeMind reviews your commits with the rigor and authority of a veteran editor-in-chief, leaving your engineering pipeline clean and completely secure.
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/register"
                className="bg-ink-black text-paper-bg border border-transparent hover:bg-paper-bg hover:text-ink-black hover:border-ink-black px-8 py-4 font-mono text-xs uppercase tracking-widest font-bold transition-all duration-200 sharp-corners flex items-center justify-center gap-2 cursor-pointer"
              >
                GET STARTED NOW
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
              <Link
                href="/login"
                className="border border-ink-black bg-transparent hover:bg-ink-black hover:text-paper-bg px-8 py-4 font-mono text-xs uppercase tracking-widest font-bold transition-all duration-200 sharp-corners flex items-center justify-center gap-2 cursor-pointer"
              >
                CONNECT GITHUB
              </Link>
            </div>
          </div>

          {/* Sidebar Column: Summary & Illustration */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6 pl-0 lg:pl-2">
            <div className="bg-neutral-100 border border-ink-black p-6 sharp-corners flex flex-col gap-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black border-b border-ink-black pb-1.5">
                EDITORIAL BRIEFING
              </span>
              <ul className="flex flex-col gap-2.5 font-mono text-xs text-neutral-700">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-editorial-red mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <span>Dual AST & Dataflow Analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-editorial-red mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <span>Security compliance checks</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-editorial-red mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <span>O(1) integration in 30s</span>
                </li>
              </ul>
            </div>

            {/* Halftone image mockup figure */}
            <div className="border border-ink-black p-4 bg-paper-bg sharp-corners flex flex-col gap-3 group">
              <div className="relative border border-ink-black aspect-video bg-neutral-200 flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 group-hover:sepia-[40%] transition-all duration-300">
                {/* Halftone radial pattern */}
                <div className="bg-[radial-gradient(#111111_1px,transparent_1px)] opacity-10 absolute inset-0 [background-size:12px_12px] pointer-events-none" />

                {/* Graphical AST diagram simulation */}
                <div className="font-mono text-[10px] text-neutral-600 flex flex-col gap-1 items-center z-10 select-none">
                  <span>ROOT [PROJ_NODE]</span>
                  <span>├── PARSE_TREE</span>
                  <span>│   ├── PARSE_STMT [FAIL]</span>
                  <span>│   └── EXPR_STMT</span>
                </div>
              </div>
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wide text-center">
                Fig 1.1. AST Graph Vulnerability Scan Node Map.
              </span>
            </div>
          </div>
        </div>

        {/* Breaking News Ticker / Marquee Ticker */}
        <div className="border-y-4 border-ink-black bg-ink-black text-paper-bg py-3 overflow-hidden mt-8 select-none w-full relative">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
            {/* Slide content repeated twice for loop */}
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-12 text-xs font-mono font-bold uppercase tracking-widest">
                <span className="bg-editorial-red text-paper-bg px-2 py-0.5 sharp-corners">BREAKING</span>
                <span>SYSTEM HEALTH INDEX: 99.8%</span>
                <span className="text-editorial-red">•</span>
                <span>BUGS PREVENTED: 1,482,903</span>
                <span className="text-editorial-red">•</span>
                <span>AVERAGE REVIEW: 18.2 SECONDS</span>
                <span className="text-editorial-red">•</span>
                <span>EDITION VOL. 1.0 READY</span>
                <span className="text-editorial-red">•</span>
                <span>VULNERABILITIES SCAN RATE: 48M LINE/MIN</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ornamental Divider */}
        <div className="py-6 text-center font-serif text-3xl text-neutral-400 tracking-[1em] select-none">
          &#x2727; &#x2727; &#x2727;
        </div>

        {/* The Feature Column Grid (Collapsed Grid) */}
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black block mb-4 border-b border-ink-black pb-2">
            SECTION II: CORE PIPELINE SCOPE
          </span>
          <div className="grid grid-cols-1 md:grid-cols-4 border-l border-t border-ink-black">

            <div className="border-r border-b border-ink-black p-6 flex flex-col gap-4 bg-paper-bg hover:bg-neutral-100 transition-colors duration-150 group">
              <div className="h-10 w-10 border border-ink-black flex items-center justify-center bg-ink-black text-paper-bg group-hover:bg-paper-bg group-hover:text-ink-black transition-colors duration-200 sharp-corners">
                <Bug size={16} strokeWidth={1.5} />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest font-bold text-neutral-500 mt-2">Column 1</span>
              <h3 className="font-serif font-bold text-xl text-ink-black leading-tight">Runtime Bug Detection</h3>
              <p className="font-body text-xs text-neutral-600 leading-relaxed text-justify">
                Scans code segments for memory leaks, null pointers, race conditions, and logical flaws with automated lint-level accuracy.
              </p>
            </div>

            <div className="border-r border-b border-ink-black p-6 flex flex-col gap-4 bg-paper-bg hover:bg-neutral-100 transition-colors duration-150 group">
              <div className="h-10 w-10 border border-ink-black flex items-center justify-center bg-ink-black text-paper-bg group-hover:bg-paper-bg group-hover:text-ink-black transition-colors duration-200 sharp-corners">
                <ShieldCheck size={16} strokeWidth={1.5} />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest font-bold text-neutral-500 mt-2">Column 2</span>
              <h3 className="font-serif font-bold text-xl text-ink-black leading-tight">Vulnerability Check</h3>
              <p className="font-body text-xs text-neutral-600 leading-relaxed text-justify">
                Monitors data structures to prevent injection points, dependency exploits, and insecure credentials leaks.
              </p>
            </div>

            <div className="border-r border-b border-ink-black p-6 flex flex-col gap-4 bg-paper-bg hover:bg-neutral-100 transition-colors duration-150 group">
              <div className="h-10 w-10 border border-ink-black flex items-center justify-center bg-ink-black text-paper-bg group-hover:bg-paper-bg group-hover:text-ink-black transition-colors duration-200 sharp-corners">
                <Zap size={16} strokeWidth={1.5} />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest font-bold text-neutral-500 mt-2">Column 3</span>
              <h3 className="font-serif font-bold text-xl text-ink-black leading-tight">Performance Tips</h3>
              <p className="font-body text-xs text-neutral-600 leading-relaxed text-justify">
                Highlights memory bottlenecks, wasteful database fetches, and complex time loops, offering drop-in solutions.
              </p>
            </div>

            <div className="border-r border-b border-ink-black p-6 flex flex-col gap-4 bg-paper-bg hover:bg-neutral-100 transition-colors duration-150 group">
              <div className="h-10 w-10 border border-ink-black flex items-center justify-center bg-ink-black text-paper-bg group-hover:bg-paper-bg group-hover:text-ink-black transition-colors duration-200 sharp-corners">
                <Eye size={16} strokeWidth={1.5} />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest font-bold text-neutral-500 mt-2">Column 4</span>
              <h3 className="font-serif font-bold text-xl text-ink-black leading-tight">AI Explanations</h3>
              <p className="font-body text-xs text-neutral-600 leading-relaxed text-justify">
                Not just warnings. It details the exact cognitive mechanism behind the issue and explains the proposed remedy.
              </p>
            </div>

          </div>
        </div>

        {/* Inverted Section: How It Works */}
        <section className="bg-ink-black text-paper-bg py-16 px-8 mt-8 border-t-4 border-ink-black sharp-corners relative">
          {/* Subtle line grid graph texture overlay */}
          <div className="bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-5 absolute inset-0 [background-size:12px_12px] pointer-events-none" />

          <div className="max-w-4xl mx-auto flex flex-col gap-12 z-10 relative">
            <div className="text-center flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-editorial-red">PIPELINE CHRONOLOGY</span>
              <h2 className="font-serif font-black text-3xl sm:text-4xl uppercase">How CodeMind Analyzes</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              <div className="flex flex-col gap-4 border border-neutral-700/50 p-6 bg-neutral-900 sharp-corners hover:border-paper-bg transition-colors">
                <span className="font-mono text-4xl font-bold text-editorial-red">01.</span>
                <h3 className="font-serif font-bold text-lg uppercase text-paper-bg">Ingest Codebase</h3>
                <p className="font-body text-xs text-neutral-400 leading-relaxed">
                  Upload a ZIP payload or connect your GitHub repository directly. Our crawler catalogs files instantly.
                </p>
              </div>

              <div className="flex flex-col gap-4 border border-neutral-700/50 p-6 bg-neutral-900 sharp-corners hover:border-paper-bg transition-colors">
                <span className="font-mono text-4xl font-bold text-editorial-red">02.</span>
                <h3 className="font-serif font-bold text-lg uppercase text-paper-bg">AI Semantic Scan</h3>
                <p className="font-body text-xs text-neutral-400 leading-relaxed">
                  Our compiler builds custom syntax parse graphs and pipes them through specialized LLMs to audit architecture.
                </p>
              </div>

              <div className="flex flex-col gap-4 border border-neutral-700/50 p-6 bg-neutral-900 sharp-corners hover:border-paper-bg transition-colors">
                <span className="font-mono text-4xl font-bold text-editorial-red">03.</span>
                <h3 className="font-serif font-bold text-lg uppercase text-paper-bg">Ship Report</h3>
                <p className="font-body text-xs text-neutral-400 leading-relaxed">
                  Receive a detailed editorial log sheet breakdown showing index scores, precise files, and remediation guidelines.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Section III: Letters to the Editor & Ads Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-ink-black pt-8">
          {/* Letters to the Editor (8-cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6 lg:border-r lg:border-ink-black lg:pr-8">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black border-b border-ink-black pb-2">
              SECTION III: LETTERS TO THE EDITOR
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-ink-black p-4 bg-paper-bg sharp-corners flex flex-col justify-between">
                <p className="font-serif italic text-xs leading-relaxed text-neutral-800 text-justify">
                  "Gentlemen, I must express my profound satisfaction with the CodeMind system. Our engineering department recently uploaded a legacy codebase of some fifty-thousand lines of Java, and in a mere twenty-eight seconds, the parser flagged a thread-safety hazard that had eluded our QA board for three consecutive fortnights."
                </p>
                <div className="flex justify-between items-center mt-4 border-t border-neutral-300 pt-2 font-mono text-[9px] uppercase tracking-wider text-neutral-600">
                  <span>— A. Hamilton, CTO</span>
                  <span>July 2026</span>
                </div>
              </div>

              <div className="border border-ink-black p-4 bg-paper-bg sharp-corners flex flex-col justify-between">
                <p className="font-serif italic text-xs leading-relaxed text-neutral-800 text-justify">
                  "Regarding the newsprint interface, it is a magnificent return to visual clarity. While other tools assault the eye with neon indicators and complex graphs, CodeMind delivers clean, monochrome lists and structured double-border warnings that feel as solid as the morning chronicle."
                </p>
                <div className="flex justify-between items-center mt-4 border-t border-neutral-300 pt-2 font-mono text-[9px] uppercase tracking-wider text-neutral-600">
                  <span>— E. Lovelace, Chief Architect</span>
                  <span>June 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Advertisements of the Era (4-cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black border-b border-ink-black pb-2">
              CLASSIFIED ADVERTISEMENTS
            </span>
            <div className="border-2 border-ink-black p-4 bg-neutral-100 text-center flex flex-col gap-2 sharp-corners">
              <span className="font-serif font-black text-sm uppercase tracking-wider text-ink-black">WANTED: CLEAN CODE</span>
              <p className="font-mono text-[9px] uppercase tracking-wider leading-relaxed text-neutral-600">
                Lacking security bugs, runtime exceptions, or memory leaks. High rewards promised. CodeMind review guarantees shipment within the day.
              </p>
              <div className="border-t border-ink-black pt-1 mt-1 font-serif italic text-[10px] text-editorial-red">
                Inquire Within at the Sign of the Terminal.
              </div>
            </div>

            <div className="border border-ink-black border-dashed p-4 flex flex-col gap-1 text-center sharp-corners">
              <span className="font-mono text-[10px] font-bold uppercase">THE AST NODE PARSER</span>
              <p className="font-serif text-[10px] italic text-neutral-600 text-center">
                Now serving Dual-Dataflow structures. Speed: 50,000 lines per minute.
              </p>
            </div>
          </div>
        </div>

        {/* Section IV: Historical Classification Archive (Use Cases) */}
        <div className="border-t border-ink-black pt-8">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black block mb-4 border-b border-ink-black pb-2">
            SECTION IV: HISTORICAL CLASSIFICATION ARCHIVES
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-ink-black p-5 sharp-corners bg-paper-bg flex flex-col gap-3">
              <span className="bg-ink-black text-paper-bg font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 w-fit sharp-corners">
                CASE STUDY I
              </span>
              <h4 className="font-serif font-bold text-lg uppercase text-ink-black">Legacy Modernization</h4>
              <p className="font-body text-xs text-neutral-700 leading-relaxed text-justify">
                Auditing decades-old codebase repositories to flag deprecated dependencies and critical security failures before cloud ingestion.
              </p>
            </div>

            <div className="border border-ink-black p-5 sharp-corners bg-paper-bg flex flex-col gap-3">
              <span className="bg-ink-black text-paper-bg font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 w-fit sharp-corners">
                CASE STUDY II
              </span>
              <h4 className="font-serif font-bold text-lg uppercase text-ink-black">Continuous Integration Audits</h4>
              <p className="font-body text-xs text-neutral-700 leading-relaxed text-justify">
                Piping every developer pull-request through uvicorn parsing rules to catch runtime exceptions before shipping compilation bundles.
              </p>
            </div>

            <div className="border border-ink-black p-5 sharp-corners bg-paper-bg flex flex-col gap-3">
              <span className="bg-ink-black text-paper-bg font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 w-fit sharp-corners">
                CASE STUDY III
              </span>
              <h4 className="font-serif font-bold text-lg uppercase text-ink-black">Compliance Reporting</h4>
              <p className="font-body text-xs text-neutral-700 leading-relaxed text-justify">
                Generating high-contrast monochrome PDFs detailing overall quality levels for executive review and third-party security audits.
              </p>
            </div>
          </div>
        </div>

        {/* Section V: Scan Operations Manifest (Specs Comparison Table) */}
        <div className="border-t border-ink-black pt-8 mb-8">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black block mb-4 border-b border-ink-black pb-2">
            SECTION V: SCAN OPERATIONS MANIFEST &amp; PROTOCOLS
          </span>
          <div className="border border-ink-black overflow-x-auto sharp-corners">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-ink-black">
                  <th className="p-3 border-r border-ink-black uppercase font-bold text-neutral-700">Audit Metric</th>
                  <th className="p-3 border-r border-ink-black uppercase font-bold text-neutral-700">Ingested File Rules</th>
                  <th className="p-3 border-r border-ink-black uppercase font-bold text-neutral-700">Security Check Criteria</th>
                  <th className="p-3 uppercase font-bold text-neutral-700">Latency Expectation</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ink-black hover:bg-neutral-50">
                  <td className="p-3 border-r border-ink-black font-bold">JavaScript / TS</td>
                  <td className="p-3 border-r border-ink-black">.js, .ts, .jsx, .tsx files</td>
                  <td className="p-3 border-r border-ink-black">Scope vulnerabilities, prototype leaks</td>
                  <td className="p-3">Average 15–20 Seconds</td>
                </tr>
                <tr className="border-b border-ink-black hover:bg-neutral-50">
                  <td className="p-3 border-r border-ink-black font-bold">Python App Code</td>
                  <td className="p-3 border-r border-ink-black">.py scripts, configurations</td>
                  <td className="p-3 border-r border-ink-black">GIL lock bottlenecks, reference leakage</td>
                  <td className="p-3">Average 12–15 Seconds</td>
                </tr>
                <tr className="border-b border-ink-black hover:bg-neutral-50">
                  <td className="p-3 border-r border-ink-black font-bold">C++ &amp; Go Systems</td>
                  <td className="p-3 border-r border-ink-black">.cpp, .go, .rs packages</td>
                  <td className="p-3 border-r border-ink-black">Memory overflow, goroutine leakage</td>
                  <td className="p-3">Average 25–30 Seconds</td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <td className="p-3 border-r border-ink-black font-bold">Config &amp; Docker</td>
                  <td className="p-3 border-r border-ink-black">YAML, TOML, Dockerfiles</td>
                  <td className="p-3 border-r border-ink-black">Exposed secret keys, insecure base ports</td>
                  <td className="p-3">Average 5–8 Seconds</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section VI: Op-Ed Opinion Columns */}
        <div className="border-t border-ink-black pt-8">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black block mb-4 border-b border-ink-black pb-2">
            SECTION VI: OP-ED OPINION &amp; COMMENTARY
          </span>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
            <div className="flex flex-col gap-3">
              <h4 className="font-serif font-black text-xl uppercase leading-tight text-ink-black">
                "The Death of the Manual Code Review"
              </h4>
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                By Prof. Barnaby Finch, Senior Audit Critic • Vol 1.0 Page 4
              </span>
              <p className="font-body text-xs text-neutral-600 leading-relaxed text-justify">
                <span className="text-3xl font-serif font-black float-left mr-2 mt-0.5 leading-none">M</span>any software teams still cling to the archaic ritual of manual code reviews. Two senior developers huddled over a workstation, debating indentation schemes while critical logical race conditions slip silently past their tired eyes. As codebase volume scales exponentially, manual inspection ceases to be a protocol—it becomes a bottleneck. Gemini-powered semantic parsing offers a scientific release: O(1) ingestion with O(n) precision.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:border-l lg:border-ink-black lg:pl-8">
              <h4 className="font-serif font-black text-xl uppercase leading-tight text-ink-black">
                "Refactoring as a Fine Art: Monoliths vs Micro-audits"
              </h4>
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                By Ada Lovelace II, Principal Systems Scholar • Vol 1.0 Page 7
              </span>
              <p className="font-body text-xs text-neutral-600 leading-relaxed text-justify">
                <span className="text-3xl font-serif font-black float-left mr-2 mt-0.5 leading-none">T</span>he architectural layout of modern web frameworks demands continuous micro-auditing. We no longer write monoliths; we deploy complex trees of server and client component nodes. Without automated guidelines, styling layouts drift and boundary leaks compromise system safety. The ruleset is not a restriction; it is the blueprint. Committing rulesets to the shared ledger keeps the blueprint intact.
              </p>
            </div>
          </div>
        </div>

        {/* Section VII: Daily Audit Crossword & Puzzle */}
        <div className="border-t border-ink-black pt-8">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black block mb-4 border-b border-ink-black pb-2">
            SECTION VII: DAILY AUDIT PUZZLE CORNER
          </span>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans items-center">
            {/* Clues */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <h4 className="font-serif font-black text-lg uppercase text-ink-black tracking-tight">CodeMind Daily Crossword</h4>
              <p className="text-xs font-body text-neutral-600 leading-relaxed">
                Test your engineering and security knowledge with our daily puzzle. Solutions can be verified using the automated console engine.
              </p>
              <div className="grid grid-cols-2 gap-4 font-mono text-[10px] leading-relaxed uppercase border-t border-ink-black/10 pt-3">
                <div>
                  <span className="font-bold text-editorial-red block mb-1">ACROSS</span>
                  <ul className="flex flex-col gap-1.5 text-neutral-505">
                    <li><strong className="text-ink-black">1.</strong> 5-letter AI brain (GEMINI)</li>
                    <li><strong className="text-ink-black">3.</strong> 6-letter security layout (SHIELD)</li>
                    <li><strong className="text-ink-black">5.</strong> 6-letter repository unit (PROJECT)</li>
                  </ul>
                </div>
                <div>
                  <span className="font-bold text-editorial-red block mb-1">DOWN</span>
                  <ul className="flex flex-col gap-1.5 text-neutral-505">
                    <li><strong className="text-ink-black">2.</strong> 3-letter parsing tree (AST)</li>
                    <li><strong className="text-ink-black">4.</strong> 6-letter accounting ledger (BILLING)</li>
                    <li><strong className="text-ink-black">6.</strong> 5-letter code inspection (AUDIT)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Crossword Grid */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="grid grid-cols-6 gap-1 bg-ink-black p-2.5 sharp-corners shadow-[4px_4px_0px_0px_#111111]">
                {/* Row 1 */}
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">
                  <span className="absolute top-0.5 left-0.5 text-[8px] text-neutral-400">1</span>G
                </div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">E</div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">M</div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">I</div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">N</div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">I</div>
                
                {/* Row 2 */}
                <div className="w-10 h-10 bg-ink-black"></div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">
                  <span className="absolute top-0.5 left-0.5 text-[8px] text-neutral-400">2</span>A
                </div>
                <div className="w-10 h-10 bg-ink-black"></div>
                <div className="w-10 h-10 bg-ink-black"></div>
                <div className="w-10 h-10 bg-ink-black"></div>
                <div className="w-10 h-10 bg-ink-black"></div>

                {/* Row 3 */}
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">
                  <span className="absolute top-0.5 left-0.5 text-[8px] text-neutral-400">3</span>S
                </div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">H</div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">I</div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">E</div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">L</div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">D</div>

                {/* Row 4 */}
                <div className="w-10 h-10 bg-ink-black"></div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">T</div>
                <div className="w-10 h-10 bg-ink-black"></div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">
                  <span className="absolute top-0.5 left-0.5 text-[8px] text-neutral-400">4</span>B
                </div>
                <div className="w-10 h-10 bg-ink-black"></div>
                <div className="w-10 h-10 bg-ink-black"></div>

                {/* Row 5 */}
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">
                  <span className="absolute top-0.5 left-0.5 text-[8px] text-neutral-400">5</span>P
                </div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">R</div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">O</div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">J</div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">E</div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">C</div>

                {/* Row 6 */}
                <div className="w-10 h-10 bg-ink-black"></div>
                <div className="w-10 h-10 bg-ink-black"></div>
                <div className="w-10 h-10 bg-ink-black"></div>
                <div className="w-10 h-10 bg-paper-bg flex items-center justify-center font-mono font-bold text-xs relative text-ink-black">L</div>
                <div className="w-10 h-10 bg-ink-black"></div>
                <div className="w-10 h-10 bg-ink-black"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Section VIII: Corporate Publishers & Partnerships */}
        <div className="border-t border-ink-black pt-8 mb-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black block mb-4 border-b border-ink-black pb-2">
            SECTION VIII: SYNDICATED CODE QUALITY METRICS &amp; CLIENTS
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-mono uppercase text-[10px]">
            <div className="border border-ink-black p-4 bg-paper-bg sharp-corners flex flex-col gap-1 hover:bg-neutral-100 transition-colors duration-150">
              <span className="font-serif font-black text-sm text-ink-black">GITHUB ACTIONS</span>
              <span className="text-neutral-500">4.8M Lines/Wk Audited</span>
              <span className="text-emerald-700 font-bold">100% PIPELINE ACTIVE</span>
            </div>
            <div className="border border-ink-black p-4 bg-paper-bg sharp-corners flex flex-col gap-1 hover:bg-neutral-100 transition-colors duration-150">
              <span className="font-serif font-black text-sm text-ink-black">VERCEL CLOUD</span>
              <span className="text-neutral-500">99.9% Clean Deploys</span>
              <span className="text-emerald-700 font-bold">ZERO SECURITY BLOCKERS</span>
            </div>
            <div className="border border-ink-black p-4 bg-paper-bg sharp-corners flex flex-col gap-1 hover:bg-neutral-100 transition-colors duration-150">
              <span className="font-serif font-black text-sm text-ink-black">RENDER SERVICES</span>
              <span className="text-neutral-500">0 Critical Leaks</span>
              <span className="text-emerald-700 font-bold">SHIELD PROTECTION ACTIVE</span>
            </div>
            <div className="border border-ink-black p-4 bg-paper-bg sharp-corners flex flex-col gap-1 hover:bg-neutral-100 transition-colors duration-150">
              <span className="font-serif font-black text-sm text-ink-black">GITLAB CI/CD</span>
              <span className="text-neutral-500">12k Commit Gates/Day</span>
              <span className="text-emerald-700 font-bold">STATUS RESOLVER STABLE</span>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-ink-black text-paper-bg mt-16 font-sans border-t border-paper-bg/10">
        {/* Main Grid */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 px-6 py-12 border-b border-paper-bg/10">
          {/* Col 1: Brand & Press Identity */}
          <div className="md:col-span-4 flex flex-col gap-4 pr-0 md:pr-6 md:border-r border-paper-bg/10">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 border border-paper-bg flex items-center justify-center bg-paper-bg text-ink-black sharp-corners">
                <Terminal size={16} strokeWidth={1.5} />
              </div>
              <span className="font-serif font-black text-lg tracking-tight uppercase text-paper-bg">CodeMind AI</span>
            </div>
            <p className="text-xs font-body text-neutral-400 leading-relaxed text-justify">
              Delivering syntactic precision, runtime security audits, and dataflow integrity with the authority of the morning print press since 2026.
            </p>
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mt-2">
              VOL. I • ED. 1.0 • NEW DELHI
            </span>
          </div>

          {/* Col 2: Sections */}
          <div className="md:col-span-2 flex flex-col gap-3 font-mono text-[10px] uppercase tracking-wider">
            <span className="font-bold border-b border-paper-bg/10 pb-1.5 text-paper-bg">Sections</span>
            <ul className="flex flex-col gap-2 text-neutral-400 font-bold">
              <li><Link href="/login" className="hover:text-paper-bg hover:underline">Auditing Dashboard</Link></li>
              <li><Link href="/register" className="hover:text-paper-bg hover:underline">Projects Ledger</Link></li>
              <li><Link href="/login" className="hover:text-paper-bg hover:underline">Vulnerability Reports</Link></li>
              <li><Link href="/login" className="hover:text-paper-bg hover:underline">Gemini Rulebook</Link></li>
              <li><Link href="/login" className="hover:text-paper-bg hover:underline">Billing & Tokens</Link></li>
            </ul>
          </div>

          {/* Col 3: Integrations */}
          <div className="md:col-span-2 flex flex-col gap-3 font-mono text-[10px] uppercase tracking-wider">
            <span className="font-bold border-b border-paper-bg/10 pb-1.5 text-paper-bg">Syndicates</span>
            <ul className="flex flex-col gap-2 text-neutral-400 font-bold">
              <li><a href="#" className="hover:text-paper-bg hover:underline">GitHub Workflows</a></li>
              <li><a href="#" className="hover:text-paper-bg hover:underline">GitLab Integrations</a></li>
              <li><a href="#" className="hover:text-paper-bg hover:underline">Vercel Hooks</a></li>
              <li><a href="#" className="hover:text-paper-bg hover:underline">API Reference Shield</a></li>
              <li><a href="#" className="hover:text-paper-bg hover:underline">System Status</a></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="md:col-span-4 flex flex-col gap-3 pl-0 md:pl-6 md:border-l border-paper-bg/10">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider border-b border-paper-bg/10 pb-1.5 text-paper-bg">Daily Correspondence</span>
            <p className="text-[11px] font-body text-neutral-400 leading-normal mb-2">
              Subscribe to receive the morning code vulnerability briefing directly in your inbox.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to the Morning Briefing!'); }} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="editor@domain.com"
                className="flex-1 border border-paper-bg/30 bg-neutral-900 px-3 py-2 font-mono text-xs focus:outline-none sharp-corners w-full text-paper-bg focus:border-paper-bg/60"
              />
              <button 
                type="submit"
                className="bg-paper-bg hover:bg-neutral-200 text-ink-black border border-transparent px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors sharp-corners cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center px-6 py-6 gap-4 text-[9px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
          <div className="flex flex-col gap-0.5 text-center md:text-left">
            <span>CODEMIND PRINTING CO. LTD.</span>
            <span>© 2026 CodeMind AI. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <span>Edition: VOL. I / IND Edition</span>
            <span>•</span>
            <span className="underline hover:text-paper-bg transition-colors cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="underline hover:text-paper-bg transition-colors cursor-pointer">Privacy Charter</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
