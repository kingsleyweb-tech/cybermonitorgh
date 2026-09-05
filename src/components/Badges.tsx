import React from 'react';
import { Zap } from 'lucide-react';
import type { ThreatLevel, ThreatCategory } from '../types';
import { LEVEL_STYLE, CATEGORY_COLORS } from '../constants';

export function LevelBadge({ level }: { level: ThreatLevel }) {
  const s = LEVEL_STYLE[level] || LEVEL_STYLE['Low'];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {level}
    </span>
  );
}

export function CategoryBadge({ category }: { category: ThreatCategory }) {
  const color = CATEGORY_COLORS[category] || '#3b82f6';
  return (
    <span
      className="inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: `${color}18`, color: color, border: `1px solid ${color}40` }}
    >
      {category}
    </span>
  );
}

export function PillBadge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${className}`}>
      {children}
    </span>
  );
}

export function DemoBadge() {
  return (
    <PillBadge className="bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50">
      <Zap className="w-2.5 h-2.5" /> Demo
    </PillBadge>
  );
}

export function LiveBadge() {
  return (
    <PillBadge className="bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
      Live
    </PillBadge>
  );
}