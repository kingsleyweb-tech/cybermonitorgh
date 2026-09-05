import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { Globe, MapPin, ChevronDown, Filter, ExternalLink, Shield } from 'lucide-react';
import type { Article } from '../types';
import { TOOLTIP_STYLE } from '../constants';
import { fmtDate } from '../utils';
import { LevelBadge, CategoryBadge } from './Badges';

const GLOBAL_REGIONS = [
  'All',
  'Ghana',
  'Africa',
  'North America',
  'Europe',
  'Asia',
  'Middle East',
  'South America',
  'Oceania',
  'Global',
];

export function RegionsTab({ articles }: { articles: Article[] }) {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [openRegion, setOpenRegion] = useState<string | null>(null);

  const byRegion = useMemo(() => {
    const map: Record<string, Article[]> = {};
    articles.forEach(a => {
      const reg = a.region || 'Global';
      (map[reg] = map[reg] || []).push(a);
    });
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (selectedRegion === 'All') return articles;
    return articles.filter(a => (a.region || 'Global') === selectedRegion);
  }, [articles, selectedRegion]);

  const chartData = useMemo(() => {
    return byRegion.map(([name, arts]) => ({ name, value: arts.length }));
  }, [byRegion]);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Region Selector Pills */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-black text-zinc-900 dark:text-white">Global &amp; Regional Intelligence View</h2>
          </div>
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
            {filteredArticles.length} item{filteredArticles.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {GLOBAL_REGIONS.map(reg => {
            const isActive = selectedRegion === reg;
            const count = reg === 'All'
              ? articles.length
              : articles.filter(a => (a.region || 'Global') === reg).length;

            return (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-xs ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <span>{reg}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Chart of Regional Distribution */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors">
        <h3 className="text-sm font-black text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Threat Intelligence Volume by Region
        </h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData.slice(0, 9)} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#3f3f46" opacity={0.2} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: '#a1a1aa', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="value" fill="#059669" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-36 flex items-center justify-center text-xs font-bold text-zinc-400">No regional data available</div>
        )}
      </div>

      {/* Regional Grouping Accordion & Filtered View */}
      {selectedRegion === 'All' ? (
        <div className="space-y-3">
          {byRegion.length === 0 && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-sm">
              <Globe className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
              <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">No regional intelligence data available</p>
            </div>
          )}

          {byRegion.map(([regionName, arts]) => {
            const isOpen = openRegion === regionName || openRegion === null;
            return (
              <div key={regionName} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
                <button
                  onClick={() => setOpenRegion(openRegion === regionName ? 'closed' : regionName)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-black text-zinc-900 dark:text-white">{regionName}</span>
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full font-black">
                      {arts.length} article{arts.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="border-t border-zinc-100 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
                    {arts.slice(0, 5).map(art => (
                      <div key={art.id} className="px-6 py-3.5 flex items-start gap-3.5">
                        <LevelBadge level={art.level} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <CategoryBadge category={art.category} />
                            <span className="text-[11px] font-bold text-zinc-400">{art.source}</span>
                          </div>
                          {art.sourceUrl ? (
                            <a
                              href={art.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 transition-colors flex items-center gap-1"
                            >
                              <span>{art.title}</span>
                              <ExternalLink className="w-3 h-3 text-zinc-400 inline shrink-0" />
                            </a>
                          ) : (
                            <p className="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-white line-clamp-2">{art.title}</p>
                          )}
                          <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mt-1">{fmtDate(art.date)}</p>
                        </div>
                      </div>
                    ))}
                    {arts.length > 5 && (
                      <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-950 text-center">
                        <button
                          onClick={() => setSelectedRegion(regionName)}
                          className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View all {arts.length} articles for {regionName} &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Single Region Filtered View */
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-black text-blue-900 dark:text-blue-200">
                Filtered Region: <span className="underline">{selectedRegion}</span>
              </span>
            </div>
            <button
              onClick={() => setSelectedRegion('All')}
              className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear Filter
            </button>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-sm">
              <Filter className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
              <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">No intelligence found for {selectedRegion}</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredArticles.map(art => (
                <div key={art.id} className="p-5 flex items-start gap-4">
                  <LevelBadge level={art.level} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CategoryBadge category={art.category} />
                      <span className="text-xs font-bold text-zinc-500">{art.source}</span>
                    </div>
                    {art.sourceUrl ? (
                      <a
                        href={art.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-black text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                      >
                        <span>{art.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      </a>
                    ) : (
                      <p className="text-sm font-black text-zinc-900 dark:text-white">{art.title}</p>
                    )}
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 line-clamp-2 font-medium">{art.summary}</p>
                    <p className="text-[11px] font-semibold text-zinc-400 mt-2">{fmtDate(art.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}