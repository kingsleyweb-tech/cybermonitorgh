import React from 'react';

export interface SectionProps {
  title: string;
  description?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
}

export function SettingsSection({ title, description, isOpen = true, onToggle, children }: SectionProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mb-5 transition-colors">
      <button
        onClick={onToggle}
        className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
          {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
        </div>
        {onToggle && (
          <svg
            className={`w-4 h-4 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
      {isOpen && <div className="px-6 pb-6 border-t border-gray-50 dark:border-slate-800 pt-5 space-y-5">{children}</div>}
    </div>
  );
}

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function SettingsToggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1 pr-4">
        <label className="text-xs font-semibold text-gray-800 dark:text-slate-200">{label}</label>
        {description && <p className="text-[10px] text-gray-400 dark:text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
