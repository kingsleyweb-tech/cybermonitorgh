import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  BarChart3, AlertTriangle, Database, Globe, Activity, ShieldAlert, Radio, Flame
} from 'lucide-react';
import type { Article } from '../types';
import { CATEGORY_COLORS, LEVEL_COLORS, TOOLTIP_STYLE } from '../constants';
import { countArticlesBy } from '../utils';

const AnalyticsCard = ({
  title, icon: Icon, iconClass, children, subtitle,
}: {
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm transition-colors">
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
      <div>
        <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white flex items-center gap-2">
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconClass}`} />
          {title}
        </h3>
        {subtitle && <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);

export function AnalyticsTab({ articles }: { articles: Article[] }) {

  const totalCount = articles.length;
  const criticalCount = useMemo(() => articles.filter(a => a.level === 'Critical').length, [articles]);
  const highCount = useMemo(() => articles.filter(a => a.level === 'High').length, [articles]);

  const categoryData = useMemo(() =>
    countArticlesBy(articles, 'category').map(([name, value]) => ({
      name, value, color: CATEGORY_COLORS[name] || '#6b7280',
    })), [articles]);

  const topCategory = categoryData[0]?.name || 'N/A';

  const levelData = useMemo(() => {
    const counts: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    articles.forEach(a => { if (counts[a.level] !== undefined) counts[a.level]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, color: LEVEL_COLORS[name] || '#3b82f6' }));
  }, [articles]);

  const regionData = useMemo(() =>
    countArticlesBy(articles, 'region').slice(0, 7).map(([name, value]) => ({ name, value })),
  [articles]);

  const sourceData = useMemo(() =>
    countArticlesBy(articles, 'source').slice(0, 7).map(([name, value]) => ({ name, value })),
  [articles]);

  const uniqueSourcesCount = useMemo(() => new Set(articles.map(a => a.source)).size, [articles]);

  return (
    <div className="space-y-6">
      
      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm transition-colors flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Intelligence</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{totalCount}</p>
            <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Aggregated items
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Radio className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm transition-colors flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Critical Alerts</p>
            <p className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">{criticalCount}</p>
            <p className="text-[10px] font-semibold text-zinc-500 mt-1">High Severity: {highCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm transition-colors flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Leading Threat Vector</p>
            <p className="text-base font-black text-amber-600 dark:text-amber-400 mt-1 truncate max-w-[150px]">{topCategory}</p>
            <p className="text-[10px] font-semibold text-zinc-500 mt-1">Category lead</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm transition-colors flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Active Sources</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{uniqueSourcesCount}</p>
            <p className="text-[10px] font-semibold text-zinc-500 mt-1">Global &amp; regional feeds</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Database className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Threat Category Distribution */}
        <AnalyticsCard
          title="Threat Category Breakdown"
          subtitle="Distribution across threat types and news categories"
          icon={BarChart3}
          iconClass="text-blue-600 dark:text-blue-400"
        >
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={90}
                    paddingAngle={3} dataKey="value"
                  >
                    {categoryData.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                {categoryData.map(d => (
                  <span key={d.name} className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    {d.name} ({d.value})
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm font-bold text-zinc-400">No category data available</div>
          )}
        </AnalyticsCard>

        {/* Severity Breakdown */}
        <AnalyticsCard
          title="Threat Severity Distribution"
          subtitle="Count of intelligence items by threat severity level"
          icon={AlertTriangle}
          iconClass="text-amber-600 dark:text-amber-400"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={levelData} barSize={42}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#a1a1aa', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {levelData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>

      </div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Regional Activity Breakdown */}
        <AnalyticsCard
          title="Geographic Intelligence Volume"
          subtitle="Top threat and news intelligence items by region"
          icon={Globe}
          iconClass="text-emerald-600 dark:text-emerald-400"
        >
          {regionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={regionData} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#3f3f46" opacity={0.2} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: '#a1a1aa', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="value" fill="#059669" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm font-bold text-zinc-400">No regional data available</div>
          )}
        </AnalyticsCard>

        {/* Intelligence Sources Breakdown */}
        <AnalyticsCard
          title="Top Intelligence Sources"
          subtitle="Feeds contributing the most verified articles"
          icon={Database}
          iconClass="text-blue-600 dark:text-blue-400"
        >
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={sourceData} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#3f3f46" opacity={0.2} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fill: '#a1a1aa', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="value" fill="#2563eb" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm font-bold text-zinc-400">No source data available</div>
          )}
        </AnalyticsCard>

      </div>

    </div>
  );
}