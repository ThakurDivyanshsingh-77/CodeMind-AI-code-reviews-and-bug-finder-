'use client';

import React, { useState } from 'react';
import { CreditCard, ArrowUpRight, History, BarChart2 } from 'lucide-react';

export default function BillingPage() {
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

  // Mock Ledger Transaction History
  const transactions = [
    { id: 'TXN-9082-A', date: '2026-07-14', description: 'Google OAuth Integration Audit', type: 'Usage', amount: -150, model: 'gemini-2.5-flash', status: 'Settled' },
    { id: 'TXN-8841-B', date: '2026-07-13', description: 'Credit Top-up (Developer Pack)', type: 'Purchase', amount: 10000, model: '—', status: 'Completed' },
    { id: 'TXN-8729-A', date: '2026-07-12', description: 'Code Review: Auth Routes', type: 'Usage', amount: -420, model: 'gemini-2.5-pro', status: 'Settled' },
    { id: 'TXN-8510-C', date: '2026-07-11', description: 'Chat Session: RAG Code Search', type: 'Usage', amount: -85, model: 'gemini-2.5-flash', status: 'Settled' },
    { id: 'TXN-8201-B', date: '2026-07-10', description: 'Initial Account Credit Grant', type: 'System', amount: 1000, model: '—', status: 'Active' }
  ];

  // Mock Daily Token Usage Data for Gemini Models (past 7 days)
  const usageData = [
    { day: 'Jul 08', tokens: 12000, height: '24%' },
    { day: 'Jul 09', tokens: 45000, height: '55%' },
    { day: 'Jul 10', tokens: 89000, height: '80%' },
    { day: 'Jul 11', tokens: 30000, height: '40%' },
    { day: 'Jul 12', tokens: 112000, height: '95%' },
    { day: 'Jul 13', tokens: 8000, height: '16%' },
    { day: 'Jul 14', tokens: 65000, height: '70%' },
  ];

  const pricingPacks = [
    { id: 'dev', name: 'Developer Pack', credits: '10,000', price: '$10', description: 'Perfect for individual developers auditing medium codebases.' },
    { id: 'team', name: 'Team Ledger', credits: '50,000', price: '$45', description: 'Designed for small teams collaborating on larger repositories.' },
    { id: 'enterprise', name: 'Enterprise Print', credits: '200,000', price: '$150', description: 'High-volume audits with dedicated queue and zero rate limits.' }
  ];

  const handlePurchase = (packId: string) => {
    setPurchaseLoading(packId);
    setTimeout(() => {
      setPurchaseLoading(null);
      alert('Credit purchase simulated successfully! (Credits will be added to your ledger)');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12">
      {/* Editorial Header */}
      <div className="border-b-4 border-ink-black pb-6 flex flex-col gap-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500">financial volume • ed. 1.0</span>
        <h1 className="text-3xl font-serif font-black uppercase text-ink-black tracking-tight">Billing & Token Ledger</h1>
        <p className="font-body italic text-sm text-neutral-600">Review credit allocations, daily usage audits, and transaction logs.</p>
      </div>

      {/* Top Cards: Balance & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {/* Balance Card */}
        <div className="bg-paper-bg border-2 border-ink-black p-6 sharp-corners hard-shadow-hover flex flex-col justify-between gap-6">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500">Available Balance</span>
              <span className="text-4xl font-mono font-black text-ink-black mt-2">1,000</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mt-1">credits remaining</span>
            </div>
            <div className="h-10 w-10 border border-ink-black bg-ink-black text-paper-bg flex items-center justify-center sharp-corners">
              <CreditCard size={18} strokeWidth={1.5} />
            </div>
          </div>
          <div className="border-t border-ink-black/20 pt-4 flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-500">Daily Average Usage:</span>
              <span className="font-bold text-ink-black">51,570 Credits</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-500">Auto-Refill:</span>
              <span className="text-editorial-red font-bold">DISABLED</span>
            </div>
          </div>
        </div>

        {/* Gemini Token Usage Bar Chart (Black, White, Grey) */}
        <div className="bg-paper-bg border-2 border-ink-black p-6 sharp-corners hard-shadow-hover lg:col-span-2 flex flex-col justify-between gap-4">
          <div className="flex justify-between items-center border-b border-ink-black/10 pb-3">
            <div className="flex items-center gap-2">
              <BarChart2 size={16} strokeWidth={1.5} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black">Daily Gemini Token Consumption</span>
            </div>
            <span className="text-[9px] font-mono text-neutral-400 uppercase">Past 7 Days (Tokens)</span>
          </div>

          {/* Simple Custom Bar Chart */}
          <div className="h-32 flex items-end justify-between gap-2 px-2 border-b border-ink-black pt-4 relative">
            {/* Grid Line Accents */}
            <div className="absolute top-1/4 left-0 w-full border-t border-ink-black/5 pointer-events-none"></div>
            <div className="absolute top-2/4 left-0 w-full border-t border-ink-black/5 pointer-events-none"></div>
            <div className="absolute top-3/4 left-0 w-full border-t border-ink-black/5 pointer-events-none"></div>

            {usageData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                {/* Tooltip on Hover */}
                <div className="absolute bottom-full mb-2 bg-ink-black text-paper-bg text-[9px] font-mono px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none sharp-corners border border-ink-black z-10 whitespace-nowrap">
                  {data.tokens.toLocaleString()} Tokens
                </div>
                {/* Chart Bar */}
                <div 
                  style={{ height: data.height }}
                  className={`w-full border border-ink-black transition-all duration-300 group-hover:bg-ink-black cursor-pointer sharp-corners ${
                    index === usageData.length - 1 ? 'bg-ink-black' : index % 2 === 0 ? 'bg-neutral-300' : 'bg-neutral-100'
                  }`}
                ></div>
              </div>
            ))}
          </div>

          {/* Monospace X-Axis labels */}
          <div className="flex justify-between px-2 font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
            {usageData.map((data, index) => (
              <span key={index} className="flex-1 text-center">{data.day}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Credit Purchase Packs */}
      <div className="flex flex-col gap-4 mt-4 font-sans">
        <h2 className="text-lg font-serif font-black uppercase text-ink-black tracking-tight border-b border-ink-black pb-2">Purchase Token Ledger Blocks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPacks.map((pack) => (
            <div key={pack.id} className="bg-paper-bg border border-ink-black p-5 sharp-corners flex flex-col justify-between gap-4 hover:border-editorial-red hover:shadow-[4px_4px_0px_0px_#111111] transition-all duration-200 group">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">{pack.name}</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-mono font-black text-ink-black">{pack.credits}</span>
                  <span className="text-xs font-mono text-neutral-500 font-bold">Credits</span>
                </div>
                <p className="text-xs font-body text-neutral-600 mt-2">{pack.description}</p>
              </div>
              <button 
                onClick={() => handlePurchase(pack.id)}
                disabled={purchaseLoading !== null}
                className="w-full mt-2 bg-transparent hover:bg-ink-black text-ink-black hover:text-paper-bg border border-ink-black py-2.5 font-mono text-xs font-bold uppercase tracking-widest transition-all duration-150 sharp-corners flex items-center justify-center gap-2 cursor-pointer disabled:bg-neutral-200 disabled:text-neutral-400 disabled:border-neutral-200"
              >
                {purchaseLoading === pack.id ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Buy for {pack.price}</span>
                    <ArrowUpRight size={14} />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="flex flex-col gap-4 mt-6">
        <div className="flex items-center gap-2 border-b border-ink-black pb-2">
          <History size={16} strokeWidth={1.5} className="text-ink-black" />
          <h2 className="text-lg font-serif font-black uppercase text-ink-black tracking-tight">Ledger Balance Statements</h2>
        </div>

        <div className="overflow-x-auto border border-ink-black sharp-corners">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ink-black text-paper-bg font-mono text-[10px] uppercase tracking-widest">
                <th className="p-4 border-r border-paper-bg/10">Statement ID</th>
                <th className="p-4 border-r border-paper-bg/10">Date</th>
                <th className="p-4 border-r border-paper-bg/10">Description</th>
                <th className="p-4 border-r border-paper-bg/10">Audit Model</th>
                <th className="p-4 border-r border-paper-bg/10 text-center">Status</th>
                <th className="p-4 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, idx) => {
                const isNegative = txn.amount < 0;
                return (
                  <tr key={idx} className="border-b border-ink-black bg-paper-bg hover:bg-neutral-100/50 transition-colors text-xs font-mono">
                    <td className="p-4 border-r border-ink-black/10 font-mono text-[11px] text-neutral-500">{txn.id}</td>
                    <td className="p-4 border-r border-ink-black/10 text-neutral-600">{txn.date}</td>
                    <td className="p-4 border-r border-ink-black/10 font-body text-ink-black font-semibold">{txn.description}</td>
                    <td className="p-4 border-r border-ink-black/10 text-neutral-600">{txn.model}</td>
                    <td className="p-4 border-r border-ink-black/10 text-center col-status">
                      <span className={`px-2 py-0.5 border text-[9px] uppercase font-bold sharp-corners ${
                        txn.status === 'Completed' || txn.status === 'Settled'
                          ? 'border-ink-black/20 text-neutral-600'
                          : 'border-editorial-red text-editorial-red bg-editorial-red/5'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className={`p-4 text-right font-bold font-mono ${isNegative ? 'text-editorial-red' : 'text-emerald-700'}`}>
                      {isNegative ? '' : '+'}{txn.amount.toLocaleString()} Cr
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
