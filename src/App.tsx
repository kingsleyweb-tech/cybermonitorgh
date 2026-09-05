import React, { useState, useMemo, useEffect } from "react";

import type { ThreatCategory, ThreatLevel, GhanaRegion, DateRange, Tab, DashboardSettings } from "./types";
import { INITIAL_ARTICLES_SHOWN, DEFAULT_SETTINGS } from "./constants";
import { isInDateRange } from "./utils";
import { useArticles } from "./hooks/useArticles";
import { AppShell }       from "./components/layout/AppShell";
import { DashboardView }  from "./components/dashboard/DashboardView";
import { AnalyticsTab }   from "./components/AnalyticsTab";
import { RegionsTab }     from "./components/RegionsTab";
import { FeedHealthTab }  from "./components/FeedHealthTab";
import { SourcesTab }     from "./components/SourcesTab";
import { CategoriesTab }  from "./components/CategoriesTab";
import { AIAssistantPage } from "./components/AIAssistant/AIAssistantPage";
import { AboutGuidePage }  from "./components/AboutGuidePage";
import { WelcomeModal }   from "./components/WelcomeModal";

const GLOBAL_STYLES = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.98) translateY(6px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  /* High contrast scrollbars */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.3);
    border-radius: 9999px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.5);
  }
`;

function loadSettings(): DashboardSettings {
  try {
    const raw = localStorage.getItem("cyberMonitorSettings");
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SETTINGS;
}

export default function App() {
  const { articles, loading, error, fetchArticles } = useArticles();
  const [tab,          setTab]          = useState<Tab>("news");
  const [search,       setSearch]       = useState("");
  const [dateRange,    setDateRange]    = useState<DateRange>("all");
  const [category,     setCategory]     = useState<ThreatCategory | "All">("All");
  const [level,        setLevel]        = useState<ThreatLevel | "All">("All");
  const [region,       setRegion]       = useState<GhanaRegion | "All">("All");
  const [showAllNews,  setShowAllNews]  = useState(false);
  const [settings]                      = useState<DashboardSettings>(loadSettings);
  
  // Welcome Modal state
  const [welcomeModalOpen, setWelcomeModalOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem("cyberMonitorSeenWelcome") !== "true";
    } catch {
      return true;
    }
  });

  const handleCloseWelcomeModal = () => {
    setWelcomeModalOpen(false);
    try {
      localStorage.setItem("cyberMonitorSeenWelcome", "true");
    } catch {}
  };

  const handleOpenWelcomeModal = () => {
    setWelcomeModalOpen(true);
  };

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try { return localStorage.getItem("cyberMonitorDark") === "true"; } catch { return false; }
  });

  // Sync dark mode class to <html> and <body> for pure pitch black #000000 theme
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (darkMode) {
      root.classList.add("dark");
      body.style.backgroundColor = "#000000";
      body.classList.add("text-white");
      body.classList.remove("text-zinc-900");
    } else {
      root.classList.remove("dark");
      body.style.backgroundColor = "#ffffff";
      body.classList.add("text-zinc-900");
      body.classList.remove("text-white");
    }
    try { localStorage.setItem("cyberMonitorDark", String(darkMode)); } catch {}
  }, [darkMode]);

  // Filter articles
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return articles.filter(a => {
      if (settings.disabledFeeds[a.source]) return false;
      if (!settings.showNonCyber && a.category === "Non-Threat News") return false;
      if (q && !a.title.toLowerCase().includes(q) && !a.summary.toLowerCase().includes(q)) return false;
      if (!isInDateRange(a.date, dateRange)) return false;
      if (category !== "All" && a.category !== category) return false;
      if (level    !== "All" && a.level    !== level)    return false;
      if (region   !== "All" && a.region   !== region)   return false;
      return true;
    });
  }, [articles, search, dateRange, category, level, region, settings.disabledFeeds, settings.showNonCyber]);

  const visibleArticles = showAllNews ? filtered : filtered.slice(0, INITIAL_ARTICLES_SHOWN);
  const hasMore = filtered.length > INITIAL_ARTICLES_SHOWN;

  const stats = useMemo(() => {
    return {
      total:    articles.length,
      critical: articles.filter(a => a.level === "Critical").length,
    };
  }, [articles]);

  const articlesBySource = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach(a => { counts[a.source] = (counts[a.source] || 0) + 1; });
    return counts;
  }, [articles]);

  const hasFilters = !!(search || dateRange !== "all" || category !== "All" || level !== "All" || region !== "All");
  const clearFilters = () => {
    setSearch(""); setDateRange("all"); setCategory("All");
    setLevel("All"); setRegion("All"); setShowAllNews(false);
  };

  return (
    <>
      <AppShell
        activeTab={tab}
        setActiveTab={setTab}
        stats={stats}
        loading={loading}
        settings={settings}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenWelcomeModal={handleOpenWelcomeModal}
      >
        {tab === "news" && (
          <DashboardView
            articles={articles}
            loading={loading}
            error={error}
            settings={settings}
            search={search}          setSearch={setSearch}
            dateRange={dateRange}    setDateRange={setDateRange}
            category={category}      setCategory={setCategory}
            level={level}            setLevel={setLevel}
            region={region}          setRegion={setRegion}
            showAllNews={showAllNews}   setShowAllNews={setShowAllNews}
            visibleArticles={visibleArticles}
            filtered={filtered}
            hasMore={hasMore}
            hasFilters={hasFilters}
            clearFilters={clearFilters}
            fetchArticles={fetchArticles}
          />
        )}
        {tab === "analytics"  && <AnalyticsTab  articles={articles} />}
        {tab === "regions"    && <RegionsTab    articles={articles} />}
        {tab === "health"     && <FeedHealthTab articlesBySource={articlesBySource} />}
        {tab === "sources"    && <SourcesTab    articlesBySource={articlesBySource} />}
        {tab === "categories" && <CategoriesTab articles={articles} />}
        {tab === "ai-assistant" && <AIAssistantPage />}
        {tab === "about-guide"  && <AboutGuidePage onOpenAI={() => setTab("ai-assistant")} />}

        <footer className="border-t border-zinc-200 dark:border-zinc-800/80 pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors font-sans">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
              Cyber News Monitor · Real-Time Threat Intelligence Feeds
            </p>
          </div>
          <div className="flex gap-4">
            {[["CSA Ghana", "https://csa.gov.gh"], ["CISA", "https://csa.gov.gh"], ["BleepingComputer", "https://www.bleepingcomputer.com"]].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-xs font-extrabold text-zinc-500 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-0.5 transition-colors">
                {label}
              </a>
            ))}
          </div>
        </footer>
      </AppShell>

      {/* Welcome & Briefing Modal */}
      <WelcomeModal
        isOpen={welcomeModalOpen}
        onClose={handleCloseWelcomeModal}
        onOpenAI={() => setTab("ai-assistant")}
      />

      <style>{GLOBAL_STYLES}</style>
    </>
  );
}
