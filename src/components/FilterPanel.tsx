import React from 'react';
import {
  Search, Calendar, XCircle, ChevronDown
} from 'lucide-react';
import type { ThreatCategory, ThreatLevel, GhanaRegion, DateRange } from '../types';
import { CATEGORIES, LEVELS, REGIONS } from '../constants';

interface FilterPanelProps {
  search: string;
  setSearch: (v: string) => void;
  dateRange: DateRange;
  setDateRange: (v: DateRange) => void;
  category: ThreatCategory | 'All';
  setCategory: (v: ThreatCategory | 'All') => void;
  level: ThreatLevel | 'All';
  setLevel: (v: ThreatLevel | 'All') => void;
  region: GhanaRegion | 'All';
  setRegion: (v: GhanaRegion | 'All') => void;
  setShowAllNews: (v: boolean) => void;
  hasFilters: boolean;
  clearFilters: () => void;
  visibleCount: number;
  filteredCount: number;
  totalCount: number;
  showAllNews: boolean;
  hasMore: boolean;
}

export function FilterPanel({
  search, setSearch,
  dateRange, setDateRange,
  category, setCategory,
  level, setLevel,
  region, setRegion,
  setShowAllNews,
  hasFilters, clearFilters,
  visibleCount, filteredCount, totalCount,
  showAllNews, hasMore,
}: FilterPanelProps) {

  const FilterSelect = ({
    icon: Icon, value, onChange, children,
  }: {
    icon?: React.ComponentType<{ className?: string }>;
    value: string;
    onChange: (v: string) => void;
    children: React.ReactNode;
  }) => (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`appearance-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-900 dark:text-white rounded-xl ${Icon ? 'pl-9' : 'pl-3'} pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm transition-colors`}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
    </div>
  );

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 transition-colors font-sans">

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setShowAllNews(false);
          }}
          placeholder="Search live threats by headline, keyword, source, or region…"
          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm font-bold text-zinc-900 dark:text-white placeholder-zinc-400 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner"
        />
      </div>

      {/* Filter dropdowns row */}
      <div className="flex flex-wrap gap-2.5 items-center">

        <FilterSelect
          icon={Calendar}
          value={dateRange}
          onChange={v => { setDateRange(v as DateRange); setShowAllNews(false); }}
        >
          {(['all', 'today', 'yesterday', '3days', '7days'] as const).map(v => (
            <option key={v} value={v}>
              {v === 'all'    ? 'All Dates'
               : v === '3days' ? 'Last 3 Days'
               : v === '7days' ? 'Last 7 Days'
               : v.charAt(0).toUpperCase() + v.slice(1)}
            </option>
          ))}
        </FilterSelect>
        
        {([
          { opts: CATEGORIES, value: category, set: (v: string) => { setCategory(v as ThreatCategory | 'All'); setShowAllNews(false); }, label: 'Categories' },
          { opts: LEVELS,     value: level,    set: (v: string) => { setLevel(v as ThreatLevel | 'All');       setShowAllNews(false); }, label: 'Levels'     },
          { opts: REGIONS,    value: region,   set: (v: string) => { setRegion(v as GhanaRegion | 'All');      setShowAllNews(false); }, label: 'Regions'    },
        ] as const).map(({ opts, value, set, label }) => (
          <FilterSelect key={label} value={value} onChange={set as (v: string) => void}>
            {(opts as readonly string[]).map(o => (
              <option key={o} value={o}>{o === 'All' ? `All ${label}` : o}</option>
            ))}
          </FilterSelect>
        ))}

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-black text-red-600 dark:text-red-400 hover:text-red-700 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" /> Clear Filters
          </button>
        )}
      </div>

      {/* Article count display */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
          Showing{' '}
          <span className="text-zinc-900 dark:text-white font-black">{visibleCount}</span>
          {!showAllNews && hasMore && (
            <span className="text-zinc-400 font-semibold"> (of {filteredCount} filtered)</span>
          )}
          {' '}of{' '}
          <span className="text-zinc-900 dark:text-white font-black">{totalCount}</span> total articles
        </p>

        {hasFilters && (
          <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/50">
            Filters Active
          </span>
        )}
      </div>
    </div>
  );
}