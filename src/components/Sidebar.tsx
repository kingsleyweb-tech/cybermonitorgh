import {
  Shield, Newspaper, BarChart3, MapPin, Activity, Database, RefreshCw, X
} from 'lucide-react';
import type { Tab } from '../types';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  stats: {
    total: number;
    today: number;
    yesterday: number;
    critical: number;
    nonThreat: number;
    topSource: string;
    topCategory: string;
  };
  loading: boolean;
  meta: { liveCount: number; demoCount: number; fetchTimeMs: number } | null;
  fetchArticles: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  stats,
  loading,
  meta,
  fetchArticles,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const navItems = [
    { id: 'news',      label: 'Latest News',    icon: Newspaper },
    { id: 'analytics', label: 'Analytics',      icon: BarChart3 },
    { id: 'regions',   label: 'News by Region', icon: MapPin    },
    { id: 'health',    label: 'Feed Health',    icon: Activity  },
    { id: 'sources',   label: 'Sources',        icon: Database  },
  ] as const;

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Upper Sidebar Section */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Header Branding */}
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="leading-none">
                <p className="text-sm font-black text-gray-900 tracking-tight">Ghana Cyber Monitor</p>
                <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest font-semibold">National Dashboard</p>
              </div>
            </div>
            {/* Close Button on Mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 md:hidden transition-all"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 w-full text-xs font-bold px-4 py-3 rounded-xl transition-all ${
                  activeTab === id
                    ? 'bg-green-600 text-white shadow-md shadow-green-600/10'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Lower/Footer Section */}
        <div className="p-4 border-t border-gray-50 space-y-4 bg-gray-50/50">
          {/* Critical Threats Badge inside Sidebar */}
          {stats.critical > 0 && !loading && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl p-3">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inset-0 rounded-full bg-red-400 opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-red-500" />
              </span>
              <div className="leading-tight">
                <p className="text-xs font-bold text-red-700">{stats.critical} Critical Incidents</p>
                <p className="text-[10px] text-red-400 mt-0.5">Immediate attention required</p>
              </div>
            </div>
          )}

          {/* Refresh Action */}
          <button
            onClick={fetchArticles}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-700 hover:text-green-600 bg-white border border-gray-200 hover:border-green-200 py-2.5 px-4 rounded-xl transition-all disabled:opacity-40 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing feeds...' : 'Refresh Feeds'}</span>
          </button>

          {/* Metadata information */}
          <div className="text-[10px] text-gray-400 space-y-1 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-500">Live Status</span>
              <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-bold">🇬🇭 Ghana-Only</span>
            </div>
            {meta && !loading && (
              <>
                <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                  <span>Live Articles</span>
                  <span className="font-semibold text-gray-700">{meta.liveCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Fetch Time</span>
                  <span className="font-semibold text-gray-700">{meta.fetchTimeMs}ms</span>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
