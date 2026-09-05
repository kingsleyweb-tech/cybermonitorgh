import React from 'react';
import { Loader2, WifiOff, Filter, AlertCircle, ChevronUp, ChevronDown, Radio } from 'lucide-react';
import { FilterPanel } from '../FilterPanel';
import { NewsCard } from '../NewsCard';
import type { Article, ThreatCategory, ThreatLevel, GhanaRegion, DateRange, DashboardSettings } from '../../types';

interface DashboardViewProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
  settings: DashboardSettings;
  search: string;
  setSearch: (s: string) => void;
  dateRange: DateRange;
  setDateRange: (r: DateRange) => void;
  category: ThreatCategory | 'All';
  setCategory: (c: ThreatCategory | 'All') => void;
  level: ThreatLevel | 'All';
  setLevel: (l: ThreatLevel | 'All') => void;
  region: GhanaRegion | 'All';
  setRegion: (r: GhanaRegion | 'All') => void;
  showAllNews: boolean;
  setShowAllNews: (b: boolean) => void;
  visibleArticles: Article[];
  filtered: Article[];
  hasMore: boolean;
  hasFilters: boolean;
  clearFilters: () => void;
  fetchArticles: () => void;
}

export function DashboardView({
  articles,
  loading,
  error,
  settings,
  search,
  setSearch,
  dateRange,
  setDateRange,
  category,
  setCategory,
  level,
  setLevel,
  region,
  setRegion,
  showAllNews,
  setShowAllNews,
  visibleArticles,
  filtered,
  hasMore,
  hasFilters,
  clearFilters,
  fetchArticles,
}: DashboardViewProps) {
  const ransomwareCount = articles.filter(a => a.category === 'Ransomware' || a.category === 'Malware').length;
  const vulnCount = articles.filter(a => a.category === 'Vulnerabilities').length;

  return (
    <div className="space-y-6">
      {/* Live Threat Intelligence Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-zinc-900 dark:text-white">Threat Intelligence Stream</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                LIVE RSS
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
              Monitoring global threat feeds, vulnerability advisories, and cyber security intelligence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2 rounded-xl text-center flex-1 sm:flex-none">
            <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Malware & Ransomware</p>
            <p className="text-sm font-black text-red-600 dark:text-red-400">{loading ? '…' : ransomwareCount}</p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2 rounded-xl text-center flex-1 sm:flex-none">
            <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Vulnerabilities</p>
            <p className="text-sm font-black text-amber-600 dark:text-amber-400">{loading ? '…' : vulnCount}</p>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        search={search}
        setSearch={setSearch}
        dateRange={dateRange}
        setDateRange={setDateRange}
        category={category}
        setCategory={setCategory}
        level={level}
        setLevel={setLevel}
        region={region}
        setRegion={setRegion}
        setShowAllNews={setShowAllNews}
        hasFilters={hasFilters}
        clearFilters={clearFilters}
        visibleCount={visibleArticles.length}
        filteredCount={filtered.length}
        totalCount={articles.length}
        showAllNews={showAllNews}
        hasMore={hasMore}
      />

      {/* Feed content views */}
      <section className="space-y-4">
        {loading && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-14 text-center shadow-sm transition-colors">
            <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-3" />
            <p className="text-sm text-zinc-800 dark:text-zinc-200 font-bold">Fetching threat intelligence & news feeds…</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Aggregating global security RSS feeds simultaneously</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-8 text-center shadow-sm transition-colors">
            <WifiOff className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-sm text-red-700 dark:text-red-400 font-bold mb-1">Could not connect to the news backend</p>
            <p className="text-xs text-zinc-500 mb-1">{error}</p>
            <button
              onClick={fetchArticles}
              className="mt-4 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 px-5 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-all shadow-sm font-bold"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && visibleArticles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleArticles.map((a, i) => (
              <NewsCard key={a.id} article={a} index={i} />
            ))}
          </div>
        )}

        {!loading && !error && hasMore && (
          <div className="flex justify-center pt-2 pb-1">
            <button
              onClick={() => {
                if (showAllNews) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                setShowAllNews(!showAllNews);
              }}
              className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/30 px-6 py-2.5 rounded-xl transition-all shadow-sm"
            >
              {showAllNews ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  View All Intelligence ({filtered.length} articles)
                </>
              )}
            </button>
          </div>
        )}

        {!loading && !error && articles.length > 0 && filtered.length === 0 && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-14 text-center shadow-sm transition-colors">
            <Filter className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-bold mb-1">No intelligence matches your filters</p>
            <p className="text-xs text-zinc-400 mt-1 mb-4">Try widening your date range or clearing category filters</p>
            <button
              onClick={clearFilters}
              className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 px-5 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition shadow-sm font-bold"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-14 text-center shadow-sm transition-colors">
            <AlertCircle className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-bold">No intelligence data returned</p>
            <p className="text-xs text-zinc-400 mt-1">RSS feeds may be temporarily offline or unreachable.</p>
          </div>
        )}
      </section>
    </div>
  );
}
