'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ScoreCardProps {
  title: string;
  score: number;
  description: string;
  color: 'blue' | 'emerald' | 'amber' | 'rose';
}

export const ScoreCard = ({ title, score, description, color }: ScoreCardProps) => {
  const colors = {
    blue: {
      gauge: 'bg-ink-black'
    },
    emerald: {
      gauge: 'bg-editorial-red'
    },
    amber: {
      gauge: 'bg-ink-black'
    },
    rose: {
      gauge: 'bg-editorial-red'
    }
  };

  const selected = colors[color];

  return (
    <div className="p-6 bg-paper-bg border border-ink-black flex flex-col gap-4 relative sharp-corners hard-shadow-hover group">
      <div className="flex justify-between items-start border-b border-ink-black pb-2">
        <span className="text-ink-black text-xs font-mono uppercase tracking-widest font-bold">{title}</span>
        <span className="text-ink-black opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ArrowUpRight size={14} strokeWidth={1.5} />
        </span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-serif font-black text-ink-black">{score}</span>
        <span className="text-neutral-500 text-xs font-mono font-semibold uppercase tracking-wider">/ 100</span>
      </div>

      {/* Editorial standard bar graph representation */}
      <div className="w-full border border-ink-black h-3 bg-neutral-200 sharp-corners overflow-hidden p-[1px]">
        <div 
          className={`h-full sharp-corners transition-all duration-500 ${selected.gauge}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>

      <p className="text-[11px] text-neutral-600 font-body italic leading-relaxed">{description}</p>
    </div>
  );
};
