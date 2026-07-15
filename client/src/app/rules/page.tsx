'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, ToggleLeft, ToggleRight, Trash2, CheckCircle2, FileText, Sparkles, HelpCircle } from 'lucide-react';

interface Ruleset {
  id: string;
  name: string;
  description: string;
  rules: string;
  isActive: boolean;
  isSystem: boolean;
}

export default function RulesPage() {
  const [rulesets, setRulesets] = useState<Ruleset[]>([]);
  const [editorName, setEditorName] = useState('');
  const [editorDescription, setEditorDescription] = useState('');
  const [editorRules, setEditorRules] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [successMsg, setSuccessMsg] = useState('');

  // Initial Seed Presets
  const systemPresets: Ruleset[] = [
    {
      id: 'rule-owasp',
      name: 'OWASP Security Shield',
      description: 'Audit against injections, broken auth, XSS, and metadata exposure.',
      rules: `# OWASP SECURITY SHIELD AUDIT STANDARDS\n- Scan all raw database queries for SQL Injection vulnerabilities.\n- Verify all HTTP requests enforce parameterized inputs.\n- Enforce password hashing validations (bcrypt/argon2).\n- Check for missing CSRF and CORS security headers.\n- Audit cross-site scripting (XSS) in frontend user inputs.`,
      isActive: true,
      isSystem: true
    },
    {
      id: 'rule-nextjs',
      name: 'Next.js App Router Standard',
      description: 'Audit server/client component boundaries and SEO layouts.',
      rules: `# NEXT.JS STRUCTURE & ROUTING RULES\n- Audit page components to verify Server Component default boundaries.\n- Restrict 'use client' declarations to interactive elements only.\n- Check that all page layouts include correct metadata exports for SEO.\n- Validate that routing uses Next.js <Link> wrapper instead of standard anchor tags.`,
      isActive: true,
      isSystem: true
    },
    {
      id: 'rule-tailwind',
      name: 'Tailwind CSS Layout Guidelines',
      description: 'Enforce standard spacing, typography, and hover order.',
      rules: `# TAILWIND STYLING CONVENTIONS\n- Audit elements to prevent custom inline CSS style overrides.\n- Standardize responsive breakpoints: mobile-first design scaling.\n- Verify class ordering sequence (layout -> size -> typography -> hover details).`,
      isActive: false,
      isSystem: true
    }
  ];

  // Load Rulesets
  useEffect(() => {
    const saved = localStorage.getItem('CODEMIND_RULESETS');
    if (saved) {
      setRulesets(JSON.parse(saved));
    } else {
      localStorage.setItem('CODEMIND_RULESETS', JSON.stringify(systemPresets));
      setRulesets(systemPresets);
    }
  }, []);

  // Save changes
  const saveRulesetsToStorage = (updated: Ruleset[]) => {
    setRulesets(updated);
    localStorage.setItem('CODEMIND_RULESETS', JSON.stringify(updated));
  };

  // Select Ruleset for editing
  const handleSelectRuleset = (rs: Ruleset) => {
    setSelectedId(rs.id);
    setEditorName(rs.name);
    setEditorDescription(rs.description);
    setEditorRules(rs.rules);
  };

  // Toggle Ruleset Status
  const handleToggleRuleset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = rulesets.map(rs => 
      rs.id === id ? { ...rs, isActive: !rs.isActive } : rs
    );
    saveRulesetsToStorage(updated);
    setSuccessMsg('Ruleset configuration updated!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  // Delete Ruleset
  const handleDeleteRuleset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this custom ruleset?')) {
      const updated = rulesets.filter(rs => rs.id !== id);
      saveRulesetsToStorage(updated);
      if (selectedId === id) {
        setEditorName('');
        setEditorDescription('');
        setEditorRules('');
        setSelectedId(null);
      }
      setSuccessMsg('Custom ruleset deleted.');
      setTimeout(() => setSuccessMsg(''), 2000);
    }
  };

  // Commit Rule from Editor
  const handleCommitRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorName.trim() || !editorRules.trim()) return;

    if (selectedId) {
      // Edit existing
      const updated = rulesets.map(rs => 
        rs.id === selectedId 
          ? { ...rs, name: editorName, description: editorDescription || 'Custom ruleset.', rules: editorRules }
          : rs
      );
      saveRulesetsToStorage(updated);
      setSuccessMsg('Ruleset updates committed successfully!');
    } else {
      // Create new
      const newRS: Ruleset = {
        id: `rule-${Math.floor(1000 + Math.random() * 9000)}`,
        name: editorName,
        description: editorDescription || 'Custom ruleset.',
        rules: editorRules,
        isActive: true,
        isSystem: false
      };
      saveRulesetsToStorage([newRS, ...rulesets]);
      setSelectedId(newRS.id);
      setSuccessMsg('New ruleset added and activated!');
    }

    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleStartNewRuleset = () => {
    setSelectedId(null);
    setEditorName('');
    setEditorDescription('');
    setEditorRules('');
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12 font-sans">
      {/* Editorial Header */}
      <div className="border-b-4 border-ink-black pb-6 flex flex-col gap-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 font-sans">instruction manual • ed. 1.0</span>
        <h1 className="text-3xl font-serif font-black uppercase text-ink-black tracking-tight font-sans">Custom Rulesets ("The Rulebook")</h1>
        <p className="font-body italic text-sm text-neutral-600">Inject custom prompts, structure compliance checks, and enforce strict code standards for the Gemini auditing engine.</p>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 border border-ink-black bg-neutral-100 text-ink-black text-xs font-mono font-bold flex items-center gap-2 sharp-corners">
          <CheckCircle2 size={14} className="text-emerald-700 font-bold" />
          <span>RULEBOOK: {successMsg}</span>
        </div>
      )}

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Active Rulesets list */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="flex justify-between items-center border-b border-ink-black pb-2">
            <div className="flex items-center gap-2">
              <BookOpen size={16} strokeWidth={1.5} className="text-ink-black" />
              <h2 className="text-base font-serif font-black uppercase text-ink-black tracking-tight">Active Rules</h2>
            </div>
            <button
              onClick={handleStartNewRuleset}
              className="flex items-center gap-1 border border-ink-black px-2.5 py-1 bg-ink-black text-paper-bg hover:bg-paper-bg hover:text-ink-black transition-all text-[10px] font-mono uppercase font-bold tracking-wider sharp-corners cursor-pointer"
            >
              <Plus size={11} />
              <span>Draft New</span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {rulesets.map((rs) => (
              <div 
                key={rs.id}
                onClick={() => handleSelectRuleset(rs)}
                className={`border p-4 sharp-corners cursor-pointer transition-all duration-150 flex flex-col gap-2.5 ${
                  selectedId === rs.id 
                    ? 'border-ink-black bg-neutral-100/50 shadow-[3px_3px_0px_0px_#111111]' 
                    : 'border-neutral-300 hover:border-ink-black bg-paper-bg'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-ink-black uppercase tracking-wide leading-tight">{rs.name}</span>
                    <span className="text-[8px] font-mono text-neutral-400 mt-1">
                      {rs.isSystem ? 'SYSTEM PRESET' : 'USER CUSTOM'}
                    </span>
                  </div>
                  
                  {/* Toggle Switch */}
                  <button 
                    onClick={(e) => handleToggleRuleset(rs.id, e)}
                    className="text-ink-black focus:outline-none cursor-pointer flex-shrink-0"
                    title={rs.isActive ? 'Deactivate Ruleset' : 'Activate Ruleset'}
                  >
                    {rs.isActive 
                      ? <ToggleRight size={26} className="text-ink-black" /> 
                      : <ToggleLeft size={26} className="text-neutral-300" />
                    }
                  </button>
                </div>

                <p className="text-[11px] font-body text-neutral-600 leading-normal">{rs.description}</p>

                {/* Footer and Actions */}
                <div className="border-t border-ink-black/5 pt-2 flex.justify-between items-center flex">
                  <span className="text-[9px] font-mono text-neutral-400 flex items-center gap-1">
                    <FileText size={10} /> {rs.rules.split('\n').filter(l => l.startsWith('-')).length} directives
                  </span>
                  {!rs.isSystem && (
                    <button
                      onClick={(e) => handleDeleteRuleset(rs.id, e)}
                      className="ml-auto text-neutral-400 hover:text-editorial-red transition-colors p-1"
                      title="Delete Custom Ruleset"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Lined Drafting Paper Editor */}
        <div className="lg:col-span-2 flex flex-col gap-4 font-sans">
          <div className="border-b border-ink-black pb-2 flex items-center gap-2">
            <Sparkles size={16} strokeWidth={1.5} className="text-ink-black" />
            <h2 className="text-base font-serif font-black uppercase text-ink-black tracking-tight">
              {selectedId ? 'Modify System Directives' : 'Draft New Instruction Set'}
            </h2>
          </div>

          <form onSubmit={handleCommitRule} className="flex flex-col gap-5 bg-paper-bg border border-ink-black p-6 sharp-corners hard-shadow-hover z-10">
            {/* Ruleset Label Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-black">Ruleset Standard Label</label>
              <input
                type="text"
                required
                value={editorName}
                onChange={(e) => setEditorName(e.target.value)}
                placeholder="e.g. CSRF Token & Auth Security Audits"
                className="border-b-2 border-ink-black bg-transparent px-3 py-2 font-mono text-xs focus:bg-neutral-100/50 focus:outline-none sharp-corners text-ink-black w-full"
              />
            </div>

            {/* Ruleset Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-black">Short Description</label>
              <input
                type="text"
                value={editorDescription}
                onChange={(e) => setEditorDescription(e.target.value)}
                placeholder="Briefly state the goal of this ruleset standard."
                className="border-b-2 border-ink-black bg-transparent px-3 py-2 font-mono text-xs focus:bg-neutral-100/50 focus:outline-none sharp-corners text-ink-black w-full"
              />
            </div>

            {/* Drafting Paper Textarea */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-black">System Instructions Prompt</label>
                <span className="text-[9px] font-mono text-neutral-400">Lines prefix with (-) or (#)</span>
              </div>
              <div className="relative border border-ink-black sharp-corners overflow-hidden">
                {/* Yellow Margin line on left of drafting notebook */}
                <div className="absolute top-0 left-9 w-[1.5px] h-full bg-editorial-red opacity-30 pointer-events-none"></div>
                <textarea
                  required
                  rows={10}
                  value={editorRules}
                  onChange={(e) => setEditorRules(e.target.value)}
                  placeholder="# RULEBOOK METRICS STANDARD&#10;- Require camelCase function names.&#10;- Flag any missing error handling blocks."
                  className="w-full bg-paper-bg bg-[linear-gradient(#f0ebe1_1px,transparent_1px)] bg-[size:100%_26px] font-mono text-xs text-ink-black leading-[26px] p-3 pl-12 outline-none focus:outline-none resize-y min-h-[260px] newsprint-texture"
                  style={{ textDecoration: 'none' }}
                />
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <button
                type="submit"
                className="bg-ink-black hover:bg-paper-bg text-paper-bg hover:text-ink-black border border-transparent hover:border-ink-black px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all duration-150 sharp-corners flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{selectedId ? 'Commit Ruleset Update' : 'Publish Custom Ruleset'}</span>
              </button>
              
              {selectedId && (
                <button
                  type="button"
                  onClick={handleStartNewRuleset}
                  className="bg-transparent hover:bg-neutral-150 text-ink-black border border-ink-black px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all duration-150 sharp-corners cursor-pointer"
                >
                  Clear & New Draft
                </button>
              )}
            </div>
          </form>

          {/* Quick Help Guide */}
          <div className="border border-ink-black/20 p-4 bg-neutral-100/30 sharp-corners text-xs text-neutral-500 font-mono leading-relaxed flex gap-3">
            <HelpCircle size={18} className="flex-shrink-0 text-ink-black" />
            <div className="flex flex-col gap-1.5">
              <span className="font-bold uppercase tracking-wider text-ink-black">How do rulesets apply?</span>
              <span>Enabled rulesets are compiled and injected directly into Gemini's System Instructions before code files are parsed. This ensures that custom corporate formatting standards and pipeline vulnerability directives are strictly enforced on all subsequent audits.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
