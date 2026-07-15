'use client';

import React from 'react';
import { Sparkles, Calendar, Tag, ArrowUpRight } from 'lucide-react';

export default function ChangelogPage() {
  const updates = [
    {
      version: 'v1.2.0',
      date: 'July 14, 2026',
      title: 'The Team & Governance Release',
      description: 'Major platform upgrade introducing team access management, customized rulebook scripting, and macro metrics dashboards.',
      features: [
        'Interactive Team Live Chat & Webhooks notifications.',
        'Accept / Reject Invitation Gateway screens displaying admin pre-invite metadata.',
        'Custom Rulesets ("The Rulebook") allowing local-storage persistent Gemini directives.',
        'Lined drafting notebook styling canvas with red notebooks margins.',
        'Inverted premium dark-mode footers on the root landing page.',
        'Vulnerability ledger tables with weekly critical bug trend lines (SVG vector graphs).'
      ]
    },
    {
      version: 'v1.1.0',
      date: 'July 10, 2026',
      title: 'OAuth & Financial Ledger Ingestion',
      description: 'Introducing secure Google authentication protocols and token-ledgers.',
      features: [
        'Dual-credential Google Sign-In button panel integration.',
        'Monospace ledger tables showing daily credit balances.',
        'API Settings dashboard featuring sk-masked token generators.',
        'Neobrutalist pricing packs with simulated purchase handlers.'
      ]
    },
    {
      version: 'v1.0.0',
      date: 'July 05, 2026',
      title: 'Initial Gazette Publication',
      description: 'The inaugural launch of CodeMind AI - The Editorial Reviewer.',
      features: [
        'AST Parsing crawler connecting local files payloads.',
        'Editorial front-page header with retro marquee breaking news ticker.',
        'Letters to the Editor & Classified Ads section grid.',
        'Gemini analysis integration return speed under 30 seconds.'
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto pb-12 font-sans">
      {/* Editorial Header */}
      <div className="border-b-4 border-ink-black pb-6 flex flex-col gap-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500">release log sheet • v1.2</span>
        <h1 className="text-3xl font-serif font-black uppercase text-ink-black tracking-tight">The Chronicle Changelog</h1>
        <p className="font-body italic text-sm text-neutral-600">Trace the evolution of the CodeMind AI compiler scanner and platform releases.</p>
      </div>

      {/* Timeline entries */}
      <div className="flex flex-col gap-8">
        {updates.map((up, index) => (
          <div 
            key={index}
            className="border border-ink-black p-6 bg-paper-bg sharp-corners shadow-[4px_4px_0px_0px_#111111] hover:shadow-none transition-all duration-150 flex flex-col gap-4"
          >
            <div className="flex justify-between items-center border-b border-ink-black/10 pb-2">
              <div className="flex items-center gap-2">
                <Tag size={13} className="text-editorial-red" />
                <span className="font-mono text-xs font-bold bg-ink-black text-paper-bg px-2.5 py-0.5 sharp-corners">
                  {up.version}
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                <Calendar size={11} />
                <span>{up.date}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-serif font-black text-xl uppercase tracking-tight text-ink-black">
                {up.title}
              </h2>
              <p className="font-body text-xs text-neutral-600 leading-relaxed">
                {up.description}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-ink-black">
                Key updates:
              </span>
              <ul className="flex flex-col gap-2 font-mono text-xs text-neutral-700 pl-4 list-disc">
                {up.features.map((feat, fIdx) => (
                  <li key={fIdx} className="leading-relaxed">
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
