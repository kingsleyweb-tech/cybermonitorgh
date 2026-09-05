import React from 'react';
import { SettingsSection, SettingsToggle } from './SettingsPrimitives';
import type { DashboardSettings } from '../types';

interface GeneralPanelProps {
  settings: DashboardSettings;
  onChange: (settings: DashboardSettings) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function GeneralPanel({ settings, onChange, isOpen, onToggle }: GeneralPanelProps) {
  const handleToggle = (checked: boolean) => {
    onChange({ ...settings, showNonCyber: checked });
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 1;
    onChange({ ...settings, autoRefreshInterval: val });
  };

  return (
    <SettingsSection
      title="General"
      description="Refresh behaviour and default content filters."
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-800 dark:text-slate-200 mb-1.5">
            Auto-refresh interval (minutes)
          </label>
          <input
            type="number"
            min={1}
            max={60}
            value={settings.autoRefreshInterval}
            onChange={handleIntervalChange}
            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <SettingsToggle
          label="Show non-cyber articles"
          description="When off, articles classified as Non-Threat News are hidden."
          checked={settings.showNonCyber}
          onChange={handleToggle}
        />
      </div>
    </SettingsSection>
  );
}
