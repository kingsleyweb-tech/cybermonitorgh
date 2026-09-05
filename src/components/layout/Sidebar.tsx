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
    { id: 'news',         label: 'Home',            icon: LayoutDashboard, visible: settings.sidebar.latestNews },
    { id: 'categories',  label: 'Categories',      icon: Tag,             visible: true },
    { id: 'analytics',   label: 'Analytics',       icon: BarChart3,       visible: settings.sidebar.analytics },
    { id: 'regions',     label: 'News by Region',  icon: MapPin,          visible: settings.sidebar.regions },
    { id: 'ai-assistant', label: 'AI Assistant',   icon: Bot,             visible: true },
    { id: 'health',      label: 'Feed Health',     icon: Activity,        visible: settings.sidebar.health },
    { id: 'about-guide',  label: 'Help & Support',  icon: HelpCircle,  visible: true },
  ] as const;

  return (
    <>
      {/* ─── FULL-SCREEN MOBILE HAMBURGER MENU OVERLAY (Matching Screenshot) ─── */}
      <div
        className={`fixed inset-0 z-50 md:hidden flex flex-col transition-all duration-300 ease-in-out ${
          darkMode ? 'bg-black text-white' : 'bg-white text-zinc-900'
        } ${
          isOpen
            ? 'opacity-100 pointer-events-auto scale-100'
            : 'opacity-0 pointer-events-none scale-95'
        }`}
      >
        {/* Mobile Top Header: Logo + Brand on left, Round 'X' button on right */}
        <div className={`px-6 py-5 flex items-center justify-between border-b ${
          darkMode ? 'border-zinc-900' : 'border-zinc-100'
        }`}>
          <div className="flex items-center gap-3">
            <img
              src="/logo194.png"
              alt="logo"
              className="w-9 h-9 rounded-xl object-cover shadow-sm ring-1 ring-blue-500/20"
            />
            <span className="text-xl font-black tracking-tight font-sans">
              Cyber Monitor
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm ${
              darkMode
                ? 'bg-zinc-900 text-zinc-200 hover:bg-zinc-800'
                : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
            }`}
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Centered Large Navigation Links matching the reference layout */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-8 overflow-y-auto">
          <nav className="flex flex-col items-center space-y-6 sm:space-y-7 w-full max-w-sm">
            {navItems
              .filter((item) => item.visible)
              .map(({ id, label }, index) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveTab(id as Tab);
                      setIsOpen(false);
                    }}
                    style={{
                      transitionDelay: isOpen ? `${index * 50 + 60}ms` : '0ms',
                    }}
                    className={`text-2xl sm:text-3xl font-black tracking-tight text-center w-full transition-all duration-300 transform ${
                      isOpen
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-6 opacity-0'
                    } ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 scale-105'
                        : darkMode
                        ? 'text-white hover:text-blue-400 active:scale-95'
                        : 'text-zinc-900 hover:text-blue-600 active:scale-95'
                    }`}
                  >
                    <span className="relative inline-block py-1">
                      {label}
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                      )}
                    </span>
                  </button>
                );
              })}
          </nav>
        </div>

        {/* Mobile Menu Footer */}
        <div className={`px-6 py-6 border-t flex flex-col items-center gap-4 ${
          darkMode ? 'border-zinc-900' : 'border-zinc-100'
        }`}>
          {/* Theme Mode Switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs font-black transition-all shadow-xs active:scale-95 ${
              darkMode
                ? 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700'
                : 'bg-zinc-100 text-zinc-800 border border-zinc-200 hover:border-zinc-300'
            }`}
          >
            {darkMode ? (
              <>
                <Moon className="w-4 h-4 text-blue-400" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-yellow-500" />
                <span>Light Mode</span>
              </>
            )}
          </button>

          <p className="text-[11px] font-bold text-zinc-400 tracking-wider">
            © Ghana Cyber Monitor
          </p>
        </div>
      </div>


      {/* ─── DESKTOP PERMANENT LEFT SIDEBAR (hidden on mobile, visible on md+) ─── */}
      <aside
        className="hidden md:flex fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800 text-white flex-col justify-between"
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
