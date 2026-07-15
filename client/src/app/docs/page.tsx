'use client';

import React from 'react';
import { Terminal, Shield, GitBranch, Settings, Info, CheckCircle2 } from 'lucide-react';

export default function DocsPage() {
  const sections = [
    { id: 'start', title: '1. Getting Started' },
    { id: 'api-setup', title: '2. API Authentication' },
    { id: 'git-pipeline', title: '3. Git Pipeline Shield' },
    { id: 'rulebook-script', title: '4. Rulebook Scripting' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Column: Anchor Index */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="border border-ink-black p-4 bg-paper-bg sharp-corners shadow-[3px_3px_0px_0px_#111111] sticky top-24">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black border-b border-ink-black pb-1.5 block mb-3">
            DOCUMENT INDEX
          </span>
          <ul className="flex flex-col gap-2 font-mono text-xs text-neutral-600">
            {sections.map((s) => (
              <li key={s.id}>
                <a 
                  href={`#${s.id}`} 
                  className="hover:text-editorial-red hover:underline block py-1 uppercase tracking-wider"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Column: Documentation Sheets */}
      <div className="lg:col-span-3 flex flex-col gap-10 font-sans">
        {/* Header Title */}
        <div className="border-b border-ink-black pb-4 flex flex-col gap-2">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-500">
            technical reference manual • v1.0
          </span>
          <h1 className="text-3xl font-serif font-black uppercase text-ink-black tracking-tight">
            CodeMind Reference Manual
          </h1>
          <p className="font-body italic text-sm text-neutral-600">
            Learn how to hook repository pipelines, authenticate via CLI keys, and script Gemini rules.
          </p>
        </div>

        {/* Section 1: Getting Started */}
        <section id="start" className="flex flex-col gap-4 border-b border-ink-black/10 pb-8 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-ink-black" />
            <h2 className="text-xl font-serif font-black uppercase text-ink-black tracking-tight">1. Getting Started</h2>
          </div>
          <p className="text-xs text-neutral-700 font-body leading-relaxed text-justify">
            CodeMind AI integrates directly into your compiler toolchains to scan code representations using Abstract Syntax Trees (ASTs). To initiate scanning, create an account, navigate to the <span className="font-bold">Projects Ledger</span>, and connect a target folder or repository.
          </p>
          <div className="bg-neutral-100/50 border border-ink-black p-4 sharp-corners font-mono text-xs flex flex-col gap-1.5">
            <span className="font-bold text-[10px] text-editorial-red">QUICK SHELL INITIATION</span>
            <div className="bg-ink-black text-paper-bg p-3 sharp-corners overflow-x-auto">
              <code>$ npx codemind-cli scan --path ./src --key cm_sk_live_xxxx</code>
            </div>
          </div>
        </section>

        {/* Section 2: API Authentication */}
        <section id="api-setup" className="flex flex-col gap-4 border-b border-ink-black/10 pb-8 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-ink-black" />
            <h2 className="text-xl font-serif font-black uppercase text-ink-black tracking-tight">2. API & Secret Key Authentication</h2>
          </div>
          <p className="text-xs text-neutral-700 font-body leading-relaxed text-justify">
            API commands require bearer key authentication. Generate secrets inside the <span className="font-bold">API Shield</span> dashboard panel. All keys are prefixed with <code>cm_sk_live_</code> and should be stored securely.
          </p>
          <div className="border border-ink-black/15 p-4 bg-paper-bg sharp-corners flex flex-col gap-2">
            <span className="font-mono font-bold text-[9px] text-neutral-500 uppercase">Example Authorization Header</span>
            <pre className="bg-neutral-100 p-2.5 font-mono text-[10px] text-ink-black overflow-x-auto sharp-corners">
{`GET /api/v1/projects HTTP/1.1
Host: connect-315o.onrender.com
Authorization: Bearer cm_sk_live_dbd89240fc...`}
            </pre>
          </div>
        </section>

        {/* Section 3: Git Pipeline Shield */}
        <section id="git-pipeline" className="flex flex-col gap-4 border-b border-ink-black/10 pb-8 scroll-mt-24">
          <div className="flex items-center gap-2">
            <GitBranch size={18} className="text-ink-black" />
            <h2 className="text-xl font-serif font-black uppercase text-ink-black tracking-tight">3. Git Pipeline Shield Hooks</h2>
          </div>
          <p className="text-xs text-neutral-700 font-body leading-relaxed text-justify">
            Integrate CodeMind as an automated Gatekeeper inside your continuous integration pipelines. Enable webhooks in the Settings module to receive automatic commit payload analysis updates.
          </p>
          <div className="bg-neutral-50 border border-dashed border-ink-black p-4 sharp-corners text-xs font-mono text-neutral-600 flex flex-col gap-2">
            <span className="font-bold text-ink-black uppercase text-[10px]">GitHub Workflow Integration Script</span>
            <pre className="bg-ink-black text-paper-bg p-3 sharp-corners overflow-x-auto text-[10px]">
{`name: CodeMind Audit Gate
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install -g @codemind/cli
      - run: codemind-audit --fail-on-critical`}
            </pre>
          </div>
        </section>

        {/* Section 4: Rulebook Scripting */}
        <section id="rulebook-script" className="flex flex-col gap-4 pb-12 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-ink-black" />
            <h2 className="text-xl font-serif font-black uppercase text-ink-black tracking-tight">4. Rulebook Prompt Scripting</h2>
          </div>
          <p className="text-xs text-neutral-700 font-body leading-relaxed text-justify">
            The <span className="font-bold">Rulebook</span> allows corporate policy injection directly inside Gemini's prompt framework. Directives can verify formatting, check imports structures, or prevent SQL injections.
          </p>
          <div className="border border-ink-black p-4 bg-paper-bg sharp-corners flex flex-col gap-2">
            <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-editorial-red">Enforcement Example</span>
            <div className="flex gap-2.5 items-start text-xs text-neutral-600 leading-relaxed font-mono bg-neutral-100 p-3 sharp-corners">
              <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
              <span>"- Force all Next.js layouts to export static metadata headers to enforce global SEO standards."</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
