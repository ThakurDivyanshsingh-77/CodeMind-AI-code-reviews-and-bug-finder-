'use client';

import React, { useState } from 'react';
import { Shield, Key, Plus, Trash2, Copy, Check, ToggleLeft, ToggleRight, Info, AlertTriangle, Code2 } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  status: 'Active' | 'Revoked';
}

export default function ApiSettingsPage() {
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  // Mock API Keys
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: 'KEY-1092', name: 'Production GitHub Actions', key: 'cm_sk_live_7a3d90f23b10...9b82', created: '2026-07-12', lastUsed: '2026-07-14 09:20', status: 'Active' },
    { id: 'KEY-0873', name: 'Local CLI Audit Tool', key: 'cm_sk_live_e82d119fa981...09ac', created: '2026-07-10', lastUsed: '2026-07-13 14:15', status: 'Active' },
    { id: 'KEY-0211', name: 'Staging Vercel Webhook', key: 'cm_sk_live_bc823de21a11...4120', created: '2026-06-25', lastUsed: '2026-06-28 11:02', status: 'Revoked' }
  ]);

  // Webhook states
  const [githubActive, setGithubActive] = useState(true);
  const [gitlabActive, setGitlabActive] = useState(false);
  const [customActive, setCustomActive] = useState(true);

  // Generate Key
  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const fullKey = `cm_sk_live_${randomHex}`;
    const maskedKey = `${fullKey.substring(0, 16)}...${fullKey.substring(fullKey.length - 4)}`;

    const newKeyItem: ApiKey = {
      id: `KEY-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newKeyName,
      key: maskedKey,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      status: 'Active'
    };

    setApiKeys([newKeyItem, ...apiKeys]);
    setNewlyCreatedKey(fullKey);
    setNewKeyName('');
    setShowGenerateForm(false);
  };

  // Revoke Key
  const handleRevokeKey = (id: string) => {
    if (confirm('Are you sure you want to revoke this API key? This action is permanent.')) {
      setApiKeys(apiKeys.map(k => k.id === id ? { ...k, status: 'Revoked' } : k));
    }
  };

  // Copy simulated
  const handleCopy = (id: string, textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12">
      {/* Editorial Header */}
      <div className="border-b-4 border-ink-black pb-6 flex flex-col gap-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500">security shield • ed. 1.0</span>
        <h1 className="text-3xl font-serif font-black uppercase text-ink-black tracking-tight">API & Integration Shield</h1>
        <p className="font-body italic text-sm text-neutral-600">Generate access tokens, manage pipeline webhooks, and secure API bindings.</p>
      </div>

      {/* Warning Box */}
      <div className="p-4 bg-editorial-red/5 border-2 border-editorial-red text-editorial-red font-mono text-xs flex gap-3 sharp-corners">
        <AlertTriangle size={18} className="flex-shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="font-bold uppercase tracking-wider">Security Advisory</span>
          <span>Treat all API credentials with newsprint custody. Never commit keys to public git repositories or expose them on client browsers. Exposing tokens risks unauthorized credit depletion.</span>
        </div>
      </div>

      {/* API Key Creation & List */}
      <div className="flex flex-col gap-4 font-sans">
        <div className="flex justify-between items-center border-b border-ink-black pb-2">
          <div className="flex items-center gap-2">
            <Key size={16} strokeWidth={1.5} className="text-ink-black" />
            <h2 className="text-lg font-serif font-black uppercase text-ink-black tracking-tight">Secret Access Tokens</h2>
          </div>
          <button
            onClick={() => {
              setShowGenerateForm(!showGenerateForm);
              setNewlyCreatedKey(null);
            }}
            className="flex items-center gap-2 border border-ink-black px-3 py-1.5 bg-ink-black text-paper-bg hover:bg-paper-bg hover:text-ink-black transition-all text-xs font-mono uppercase font-bold tracking-wider sharp-corners cursor-pointer"
          >
            <Plus size={14} />
            <span>Generate New Key</span>
          </button>
        </div>

        {/* New Key Generator Form */}
        {showGenerateForm && (
          <form onSubmit={handleGenerateKey} className="bg-neutral-100/50 border border-ink-black p-5 sharp-corners flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-black">Token Description Label</label>
              <input
                type="text"
                required
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g. GitHub Workflow Runner"
                className="border-b-2 border-ink-black bg-transparent px-3 py-2 font-mono text-xs focus:bg-neutral-100 focus:outline-none sharp-corners text-ink-black w-full"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-ink-black hover:bg-paper-bg text-paper-bg hover:text-ink-black border border-transparent hover:border-ink-black px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider sharp-corners transition-all duration-150 cursor-pointer"
              >
                Generate Token
              </button>
              <button
                type="button"
                onClick={() => setShowGenerateForm(false)}
                className="bg-transparent hover:bg-neutral-200 text-ink-black border border-neutral-300 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider sharp-corners cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Newly Created Key Alert Box */}
        {newlyCreatedKey && (
          <div className="bg-amber-50 border-2 border-amber-500 p-5 sharp-corners flex flex-col gap-3 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-amber-200 pb-2">
              <span className="font-bold text-amber-800 uppercase tracking-widest flex items-center gap-1.5">
                <Info size={14} /> Key Generated Successfully
              </span>
              <button 
                onClick={() => handleCopy('new-key', newlyCreatedKey)}
                className="flex items-center gap-1 bg-amber-800 text-paper-bg px-2.5 py-1 sharp-corners hover:bg-amber-900 transition-colors"
              >
                {copiedKeyId === 'new-key' ? (
                  <>
                    <Check size={12} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Secret Key</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-white border border-amber-200 p-3 font-bold select-all break-all overflow-x-auto text-[13px] text-ink-black">
              {newlyCreatedKey}
            </div>
            <p className="text-[10px] text-amber-700 italic">
              *Copy this key now. It will not be shown again for security reasons.
            </p>
          </div>
        )}

        {/* Keys List Table */}
        <div className="overflow-x-auto border border-ink-black sharp-corners">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ink-black text-paper-bg font-mono text-[10px] uppercase tracking-widest">
                <th className="p-4 border-r border-paper-bg/10">Label Name</th>
                <th className="p-4 border-r border-paper-bg/10">Secret Key</th>
                <th className="p-4 border-r border-paper-bg/10">Created Date</th>
                <th className="p-4 border-r border-paper-bg/10">Last Used</th>
                <th className="p-4 border-r border-paper-bg/10 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => {
                const isActive = key.status === 'Active';
                return (
                  <tr key={key.id} className="border-b border-ink-black bg-paper-bg hover:bg-neutral-100/50 transition-colors text-xs font-mono">
                    <td className="p-4 border-r border-ink-black/10 font-sans font-bold text-ink-black uppercase tracking-wider">{key.name}</td>
                    <td className="p-4 border-r border-ink-black/10 text-neutral-500 font-bold tracking-tight">{key.key}</td>
                    <td className="p-4 border-r border-ink-black/10 text-neutral-600">{key.created}</td>
                    <td className="p-4 border-r border-ink-black/10 text-neutral-600">{key.lastUsed}</td>
                    <td className="p-4 border-r border-ink-black/10 text-center">
                      <span className={`px-2 py-0.5 border text-[9px] uppercase font-bold sharp-corners ${
                        isActive
                          ? 'border-emerald-600 text-emerald-700 bg-emerald-50'
                          : 'border-neutral-300 text-neutral-400 bg-neutral-100'
                      }`}>
                        {key.status}
                      </span>
                    </td>
                    <td className="p-4 text-center flex justify-center gap-2">
                      {isActive && (
                        <>
                          <button
                            onClick={() => handleCopy(key.id, `cm_sk_live_demo_key_${key.id}`)}
                            title="Copy Key Reference"
                            className="p-1.5 border border-ink-black hover:bg-ink-black hover:text-paper-bg sharp-corners cursor-pointer"
                          >
                            {copiedKeyId === key.id ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                          <button
                            onClick={() => handleRevokeKey(key.id)}
                            title="Revoke Key"
                            className="p-1.5 border border-editorial-red text-editorial-red hover:bg-editorial-red hover:text-paper-bg sharp-corners cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}
                      {!isActive && (
                        <span className="text-[10px] text-neutral-400 font-sans italic py-1">Revoked</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Webhook Configurations */}
      <div className="flex flex-col gap-4 mt-4 font-sans">
        <div className="flex items-center gap-2 border-b border-ink-black pb-2">
          <Code2 size={16} strokeWidth={1.5} className="text-ink-black" />
          <h2 className="text-lg font-serif font-black uppercase text-ink-black tracking-tight">Active Pipeline Integration Webhooks</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GitHub Integration Webhook */}
          <div className="bg-paper-bg border border-ink-black p-5 sharp-corners flex flex-col justify-between gap-5 hover:border-editorial-red hover:shadow-[4px_4px_0px_0px_#111111] transition-all duration-200">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-serif font-black text-sm uppercase text-ink-black tracking-tight">GitHub Pull Request Audit</span>
                <button 
                  onClick={() => setGithubActive(!githubActive)}
                  className="text-ink-black focus:outline-none cursor-pointer"
                >
                  {githubActive ? <ToggleRight size={32} className="text-ink-black" /> : <ToggleLeft size={32} className="text-neutral-400" />}
                </button>
              </div>
              <p className="text-xs font-body text-neutral-600">Triggers an automated code review comment directly on GitHub PR commits.</p>
              
              {githubActive && (
                <div className="flex flex-col gap-2.5 mt-2 border-t border-dashed border-ink-black/10 pt-3 text-xs font-mono">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-bold text-neutral-400">Webhook Payload URL</span>
                    <span className="bg-neutral-100 p-2 font-mono text-[10px] select-all border border-ink-black/5 break-all">
                      https://connect-315o.onrender.com/api/v1/webhook
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-bold text-neutral-400">HMAC Secret Token</span>
                    <span className="font-mono text-[10px] text-neutral-500 font-bold">••••••••••••••••••••••••••••••••••••</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* GitLab Integration Webhook */}
          <div className="bg-paper-bg border border-ink-black p-5 sharp-corners flex flex-col justify-between gap-5 hover:border-editorial-red hover:shadow-[4px_4px_0px_0px_#111111] transition-all duration-200">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-serif font-black text-sm uppercase text-ink-black tracking-tight">GitLab Pipeline Reviewer</span>
                <button 
                  onClick={() => setGitlabActive(!gitlabActive)}
                  className="text-ink-black focus:outline-none cursor-pointer"
                >
                  {gitlabActive ? <ToggleRight size={32} className="text-ink-black" /> : <ToggleLeft size={32} className="text-neutral-400" />}
                </button>
              </div>
              <p className="text-xs font-body text-neutral-600">Audits code merges during CI/CD build sequences and logs status gates.</p>
              
              {gitlabActive && (
                <div className="flex flex-col gap-2.5 mt-2 border-t border-dashed border-ink-black/10 pt-3 text-xs font-mono">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-bold text-neutral-400">Webhook Payload URL</span>
                    <span className="bg-neutral-100 p-2 font-mono text-[10px] select-all border border-ink-black/5 break-all">
                      https://connect-315o.onrender.com/api/v1/webhook/gitlab
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-bold text-neutral-400">CI Merge Token</span>
                    <span className="font-mono text-[10px] text-neutral-500 font-bold">••••••••••••••••••••••••••••••••••••</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Custom Deployment Webhook */}
          <div className="bg-paper-bg border border-ink-black p-5 sharp-corners flex flex-col justify-between gap-5 hover:border-editorial-red hover:shadow-[4px_4px_0px_0px_#111111] transition-all duration-200">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-serif font-black text-sm uppercase text-ink-black tracking-tight">Custom CLI Webhook Gate</span>
                <button 
                  onClick={() => setCustomActive(!customActive)}
                  className="text-ink-black focus:outline-none cursor-pointer"
                >
                  {customActive ? <ToggleRight size={32} className="text-ink-black" /> : <ToggleLeft size={32} className="text-neutral-400" />}
                </button>
              </div>
              <p className="text-xs font-body text-neutral-600">Dispatches audit reports to Slack, Discord, or generic event listeners.</p>
              
              {customActive && (
                <div className="flex flex-col gap-2.5 mt-2 border-t border-dashed border-ink-black/10 pt-3 text-xs font-mono">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-bold text-neutral-400">Target Endpoint</span>
                    <span className="bg-neutral-100 p-2 font-mono text-[10px] select-all border border-ink-black/5 break-all">
                      https://api.yourdomain.com/codemind-receiver
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-bold text-neutral-400">Security Signature Key</span>
                    <span className="font-mono text-[10px] text-neutral-500 font-bold">••••••••••••••••••••••••••••••••••••</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
