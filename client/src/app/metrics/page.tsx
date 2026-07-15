'use client';

import React from 'react';
import { BarChart, ShieldAlert, Award, FileCode, Clock, Download, ArrowDownRight, Compass } from 'lucide-react';

export default function MetricsPage() {
  // Mock repository summaries
  const repos = [
    { name: 'codemind-core-api', lines: '452,102', language: 'TypeScript', critical: 2, warnings: 12, grade: 'A-', color: 'text-emerald-750' },
    { name: 'auth-shield-vault', lines: '85,490', language: 'NodeJS / Go', critical: 0, warnings: 1, grade: 'A+', color: 'text-emerald-750' },
    { name: 'payment-ledger-gateway', lines: '120,400', language: 'Go', critical: 5, warnings: 8, grade: 'C+', color: 'text-amber-700' },
    { name: 'nextjs-client-dashboard', lines: '210,085', language: 'TypeScript', critical: 12, warnings: 32, grade: 'D', color: 'text-editorial-red' }
  ];

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12">
      {/* Editorial Header */}
      <div className="border-b-4 border-ink-black pb-6 flex flex-col gap-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500">analytics report • ed. 1.0</span>
        <h1 className="text-3xl font-serif font-black uppercase text-ink-black tracking-tight">Global Analytics & Reports</h1>
        <p className="font-body italic text-sm text-neutral-600">Aggregate code vulnerability logs, compiler warning metrics, and security index audits.</p>
      </div>

      {/* Row 1: Key Metrics - Large Bold Serif Typography */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-paper-bg border border-ink-black p-5 sharp-corners hard-shadow-hover flex flex-col justify-between min-h-[140px]">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-400">Critical Vulnerabilities</span>
          <div className="flex flex-col mt-2">
            <span className="text-5xl font-serif font-black text-ink-black leading-none">19</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-editorial-red font-bold mt-2">bugs outstanding</span>
          </div>
        </div>

        <div className="bg-paper-bg border border-ink-black p-5 sharp-corners hard-shadow-hover flex flex-col justify-between min-h-[140px]">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-400">Security Index Rating</span>
          <div className="flex flex-col mt-2">
            <span className="text-5xl font-serif font-black text-ink-black leading-none">A-</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold mt-2">94.8% rating index</span>
          </div>
        </div>

        <div className="bg-paper-bg border border-ink-black p-5 sharp-corners hard-shadow-hover flex flex-col justify-between min-h-[140px]">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-400">Total Code Audited</span>
          <div className="flex flex-col mt-2">
            <span className="text-5xl font-serif font-black text-ink-black leading-none">868k</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mt-2">lines of script</span>
          </div>
        </div>

        <div className="bg-paper-bg border border-ink-black p-5 sharp-corners hard-shadow-hover flex flex-col justify-between min-h-[140px]">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-400">Average Scan Latency</span>
          <div className="flex flex-col mt-2">
            <span className="text-5xl font-serif font-black text-ink-black leading-none">4.8s</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mt-2">Gemini response speed</span>
          </div>
        </div>
      </div>

      {/* Row 2: Charts & Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Radar/Spider Chart (SVG Pentagon) */}
        <div className="bg-paper-bg border-2 border-ink-black p-6 sharp-corners hard-shadow-hover flex flex-col justify-between gap-4 lg:col-span-1">
          <div className="border-b border-ink-black/10 pb-3 flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black">Codebase Health Radar</span>
            <span className="text-[9px] font-mono text-neutral-400 uppercase">Vector Audit</span>
          </div>

          {/* Pentagon Radar Chart SVG */}
          <div className="flex items-center justify-center py-2 relative">
            <svg width="240" height="240" viewBox="0 0 300 300" className="w-full max-w-[200px] h-auto">
              {/* Outer boundary Pentagon (Radius 100) */}
              <polygon points="150,50 245.1,119.1 208.8,230.9 91.2,230.9 54.9,119.1" fill="none" stroke="#111" strokeWidth="1.5" />
              {/* Mid boundary Pentagon (Radius 70) */}
              <polygon points="150,80 216.5,128.3 191.1,206.6 108.8,206.6 83.4,128.3" fill="none" stroke="#111" strokeDasharray="3,3" strokeWidth="1" opacity="0.3" />
              {/* Inner boundary Pentagon (Radius 40) */}
              <polygon points="150,110 188.0,137.6 173.5,182.3 126.4,182.3 111.9,137.6" fill="none" stroke="#111" strokeDasharray="3,3" strokeWidth="1" opacity="0.3" />

              {/* Pentagon Center Lines */}
              <line x1="150" y1="150" x2="150" y2="50" stroke="#111" strokeWidth="1" opacity="0.2" />
              <line x1="150" y1="150" x2="245.1" y2="119.1" stroke="#111" strokeWidth="1" opacity="0.2" />
              <line x1="150" y1="150" x2="208.8" y2="230.9" stroke="#111" strokeWidth="1" opacity="0.2" />
              <line x1="150" y1="150" x2="91.2" y2="230.9" stroke="#111" strokeWidth="1" opacity="0.2" />
              <line x1="150" y1="150" x2="54.9" y2="119.1" stroke="#111" strokeWidth="1" opacity="0.2" />

              {/* Data Overlay Polygon (Black Fill, Opacity 0.15) */}
              <polygon 
                points="150,65 216.6,128.4 202.9,222.8 111.8,202.6 73.9,125.3" 
                fill="#111" 
                fillOpacity="0.15" 
                stroke="#111" 
                strokeWidth="2.5" 
              />

              {/* Pentagon Labels */}
              <text x="150" y="35" textAnchor="middle" className="text-[10px] font-mono font-bold uppercase fill-ink-black">Security</text>
              <text x="255" y="122" textAnchor="start" className="text-[10px] font-mono font-bold uppercase fill-ink-black">Performance</text>
              <text x="218" y="245" textAnchor="start" className="text-[10px] font-mono font-bold uppercase fill-ink-black">Quality</text>
              <text x="82" y="245" textAnchor="end" className="text-[10px] font-mono font-bold uppercase fill-ink-black">Reliability</text>
              <text x="45" y="122" textAnchor="end" className="text-[10px] font-mono font-bold uppercase fill-ink-black">Complexity</text>
            </svg>
          </div>

          <div className="border-t border-ink-black/10 pt-3 text-[10px] font-mono text-neutral-500 leading-relaxed uppercase">
            *Code Quality and Security exhibit peak ratings. Reliability is prioritized for optimization next print.
          </div>
        </div>

        {/* Minimalist Line Graph (Vulnerabilities Over Time) */}
        <div className="bg-paper-bg border-2 border-ink-black p-6 sharp-corners hard-shadow-hover flex flex-col justify-between gap-4 lg:col-span-2 font-sans">
          <div className="border-b border-ink-black/10 pb-3 flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black">Critical Bug Trends</span>
            <span className="text-[9px] font-mono text-neutral-400 uppercase">Weekly Frequency</span>
          </div>

          {/* Custom SVG Line Chart */}
          <div className="h-44 w-full flex items-center justify-center py-2 relative">
            <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none" className="w-full">
              {/* Horizontal gridlines */}
              <line x1="0" y1="30" x2="400" y2="30" stroke="#111" strokeWidth="0.5" opacity="0.1" />
              <line x1="0" y1="75" x2="400" y2="75" stroke="#111" strokeWidth="0.5" opacity="0.1" />
              <line x1="0" y1="120" x2="400" y2="120" stroke="#111" strokeWidth="0.5" opacity="0.1" />

              {/* Dynamic line showing trend */}
              <path 
                d="M 20 120 L 100 90 L 180 110 L 260 45 L 340 70 L 380 25" 
                fill="none" 
                stroke="#111" 
                strokeWidth="2.5" 
              />

              {/* Data Node points */}
              <circle cx="20" cy="120" r="4" fill="#111" stroke="#fff" strokeWidth="1" />
              <circle cx="100" cy="90" r="4" fill="#111" stroke="#fff" strokeWidth="1" />
              <circle cx="180" cy="110" r="4" fill="#111" stroke="#fff" strokeWidth="1" />
              <circle cx="260" cy="45" r="4" fill="#111" stroke="#fff" strokeWidth="1" />
              <circle cx="340" cy="70" r="4" fill="#111" stroke="#fff" strokeWidth="1" />
              <circle cx="380" cy="25" r="4" fill="#ef4444" stroke="#fff" strokeWidth="1" />
            </svg>
          </div>

          {/* Monospace X-Axis labels */}
          <div className="flex justify-between px-2 font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
            <span>Week 5</span>
            <span>Current</span>
          </div>
        </div>

      </div>

      {/* Row 3: Repository Vulnerability Grade Ledger */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex justify-between items-center border-b border-ink-black pb-2">
          <div className="flex items-center gap-2">
            <Compass size={16} strokeWidth={1.5} className="text-ink-black" />
            <h2 className="text-lg font-serif font-black uppercase text-ink-black tracking-tight">Codebase Vulnerability Ledger</h2>
          </div>
          <button 
            onClick={() => alert('Summary metrics ledger CSV download simulated!')}
            className="flex items-center gap-2 border border-ink-black px-3 py-1.5 bg-ink-black text-paper-bg hover:bg-paper-bg hover:text-ink-black transition-all text-xs font-mono uppercase font-bold tracking-wider sharp-corners cursor-pointer"
          >
            <Download size={13} />
            <span>Download CSV Statement</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-ink-black sharp-corners">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ink-black text-paper-bg font-mono text-[10px] uppercase tracking-widest">
                <th className="p-4 border-r border-paper-bg/10">Repository Name</th>
                <th className="p-4 border-r border-paper-bg/10">Codebase Size</th>
                <th className="p-4 border-r border-paper-bg/10">Language Stack</th>
                <th className="p-4 border-r border-paper-bg/10 text-center">Critical Bugs</th>
                <th className="p-4 border-r border-paper-bg/10 text-center">Compiler Warnings</th>
                <th className="p-4 text-center">Grade Rating</th>
              </tr>
            </thead>
            <tbody>
              {repos.map((repo, index) => (
                <tr key={index} className="border-b border-ink-black bg-paper-bg hover:bg-neutral-100/50 transition-colors text-xs font-mono">
                  <td className="p-4 border-r border-ink-black/10 font-sans font-bold text-ink-black uppercase tracking-wider">{repo.name}</td>
                  <td className="p-4 border-r border-ink-black/10">{repo.lines} lines</td>
                  <td className="p-4 border-r border-ink-black/10 font-body text-neutral-600 font-semibold">{repo.language}</td>
                  <td className="p-4 border-r border-ink-black/10 text-center text-editorial-red font-bold">{repo.critical}</td>
                  <td className="p-4 border-r border-ink-black/10 text-center text-neutral-700 font-bold">{repo.warnings}</td>
                  <td className="p-4 text-center">
                    <span className={`text-sm font-serif font-black ${repo.color}`}>
                      {repo.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
