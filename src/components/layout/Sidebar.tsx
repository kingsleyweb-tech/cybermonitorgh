import React from 'react';
import {
  BarChart3, MapPin, Activity, Tag, Sun, Moon, X, LayoutDashboard, Bot, HelpCircle
} from 'lucide-react';
import type { Tab, DashboardSettings } from '../../types';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  stats: {
    critical: number;
  };
  loading: boolean;
  settings: DashboardSettings;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  onOpenWelcomeModal: () => void;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  stats,
  loading,
  settings,
  isOpen,
  setIsOpen,
  darkMode,
  setDarkMode,
}: SidebarProps) {
  
  const navItems = [
    { id: 'news',         label: 'Dashboard',      icon: LayoutDashboard, visible: settings.sidebar.latestNews },
    { id: 'analytics',   label: 'Analytics',      icon: BarChart3,       visible: settings.sidebar.analytics },
    { id: 'regions',     label: 'News by Region', icon: MapPin,          visible: settings.sidebar.regions },
    { id: 'health',      label: 'Feed Health',    icon: Activity,        visible: settings.sidebar.health },
    { id: 'categories',  label: 'Categories',     icon: Tag,             visible: true },
    { id: 'ai-assistant', label: 'AI Assistant',  icon: Bot,             visible: true },
    { id: 'about-guide',  label: 'About & App Guide', icon: HelpCircle,  visible: true },
  ] as const;

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar panel - Dark mode bg #09090b (Zinc 950, zero blue-black) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800 text-white flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Upper Sidebar Section */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Header Branding */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo194.png" alt="logo" className="w-8 h-8 rounded-lg object-cover flex-shrink-0 shadow-md ring-2 ring-blue-500/20" />
              <div className="leading-none">
                <p className="text-sm font-black text-white tracking-tight">Cyber News Monitor</p>
                <p className="text-[10px] text-blue-400 mt-1 uppercase tracking-widest font-extrabold">Threat Intelligence</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 md:hidden transition-all"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-5 pt-6 pb-2">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Navigation</p>
            <p className="text-[9px] text-zinc-500 mt-0.5 font-medium">Verified feeds &amp; threat intelligence</p>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1.5 font-sans">
            {navItems
              .filter((item) => item.visible)
              .map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id as Tab);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full text-xs font-extrabold px-4 py-3 rounded-xl transition-all ${
                    activeTab === id
                      ? id === 'ai-assistant'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                        : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black'
                      : id === 'ai-assistant'
                      ? 'text-emerald-400 hover:text-white hover:bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400/50'
                      : id === 'about-guide'
                      ? 'text-blue-300 hover:text-white hover:bg-blue-950/40 border border-blue-500/30 hover:border-blue-400/50'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{label}</span>
                  {id === 'ai-assistant' && activeTab !== 'ai-assistant' && (
                    <span className="ml-auto text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      AI
                    </span>
                  )}
                  {id === 'about-guide' && activeTab !== 'about-guide' && (
                    <span className="ml-auto text-[9px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Guide
                    </span>
                  )}
                </button>
              ))}
          </nav>
        </div>

        {/* Lower/Footer Section */}
        <div className="p-4 border-t border-zinc-800 space-y-3 bg-zinc-950/60 font-sans">
          {stats.critical > 0 && !loading && (
            <div className="flex items-center gap-2.5 bg-red-950/40 border border-red-800/60 rounded-xl p-3">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inset-0 rounded-full bg-red-500 opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-red-500" />
              </span>
              <div className="leading-tight">
                <p className="text-xs font-black text-red-400">{stats.critical} Critical Alerts</p>
                <p className="text-[9px] text-red-300/80 mt-0.5 font-medium">Active advisories detected</p>
              </div>
            </div>
          )}

          {/* Theme mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-between text-xs font-extrabold text-zinc-300 hover:text-white py-2.5 px-3 rounded-xl hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 transition-all"
          >
            <span>{darkMode ? 'Dark Mode (Pure Black)' : 'Light Mode (Pure White)'}</span>
            {darkMode ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-yellow-400" />}
          </button>
        </div>
      </aside>
    </>
  );
}
