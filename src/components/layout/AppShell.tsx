import React, { useState } from 'react';
import { Menu, Sun, Moon, HelpCircle } from 'lucide-react';
import { Sidebar } from './Sidebar';
import type { Tab, DashboardSettings } from '../../types';

interface AppShellProps {
  children: React.ReactNode;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  stats: {
    critical: number;
  };
  loading: boolean;
  settings: DashboardSettings;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  onOpenWelcomeModal: () => void;
}

export function AppShell({
  children,
  activeTab,
  setActiveTab,
  stats,
  loading,
  settings,
  darkMode,
  setDarkMode,
  onOpenWelcomeModal,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white flex flex-col md:flex-row transition-colors duration-200 font-sans selection:bg-blue-500 selection:text-white">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 sticky top-0 z-30 shadow-sm w-full transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo194.png" alt="logo" className="w-8 h-8 rounded-lg object-cover flex-shrink-0 shadow-sm" />
            <span className="text-sm font-black text-zinc-900 dark:text-white tracking-tight">Cyber News Monitor</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Info button on mobile */}
          <button
            onClick={onOpenWelcomeModal}
            className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
            title="About Application"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Theme toggle on mobile */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-yellow-500 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
            title="Toggle theme"
          >
            {darkMode ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}
          </button>
        </div>
      </div>

      {/* Left Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        loading={loading}
        settings={settings}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenWelcomeModal={onOpenWelcomeModal}
      />

      {/* Main content view */}
      <div className={`flex-1 flex flex-col md:pl-64 min-w-0 ${activeTab === 'ai-assistant' ? 'h-[calc(100dvh-3.75rem)] md:h-screen overflow-hidden' : ''}`}>
        <main className={`max-w-7xl w-full mx-auto ${
          activeTab === 'ai-assistant'
            ? 'px-2 sm:px-6 py-2 sm:py-4 flex-1 flex flex-col min-h-0 space-y-0 h-full'
            : 'px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
}
