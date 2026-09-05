import React from 'react';

export function StatCard({ label, value, icon: Icon, accent, alert = false }: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  alert?: boolean;
}) {
  return (
    <div className={`bg-white dark:bg-zinc-900 border rounded-2xl p-5 space-y-3 transition-all duration-200 hover:shadow-lg ${
      alert 
        ? 'border-red-200 dark:border-red-900/60 bg-red-50/30 dark:bg-red-950/20' 
        : 'border-zinc-200 dark:border-zinc-800 shadow-sm'
    }`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
          alert 
            ? 'bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400' 
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200'
        }`}>
          <Icon className={`w-5 h-5 ${accent}`} />
        </div>
      </div>
      <p className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">{value}</p>
    </div>
  );
}