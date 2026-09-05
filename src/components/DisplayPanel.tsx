import React from 'react';
import { SettingsSection, SettingsToggle } from './SettingsPrimitives';
import type { DashboardSettings } from '../types';

interface DisplayPanelProps {
  settings: DashboardSettings;
  onChange: (settings: DashboardSettings) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function DisplayPanel({ settings, onChange, isOpen, onToggle }: DisplayPanelProps) {
  const updateStats = (key: keyof DashboardSettings['stats'], checked: boolean) => {
    onChange({
      ...settings,
      stats: {
        ...settings.stats,
        [key]: checked,
      },
    });
  };

  return (
    <SettingsSection
      title="Threat stat cards"
      description="Select which cybersecurity threat categories and stat metrics to highlight in the stats section."
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <SettingsToggle
          label="Show stat cards row"
          description="Completely hides or displays the numerical counters grid at the top."
          checked={settings.stats.showRow}
          onChange={(val) => updateStats('showRow', val)}
        />

        {settings.stats.showRow && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-3 border-t border-gray-50 dark:border-slate-800">
            <SettingsToggle
              label="Malware Attacks"
              checked={settings.stats.malware}
              onChange={(val) => updateStats('malware', val)}
            />
            <SettingsToggle
              label="Hacking Attacks"
              checked={settings.stats.hacking}
              onChange={(val) => updateStats('hacking', val)}
            />
            <SettingsToggle
              label="Ransomware"
              checked={settings.stats.ransomware}
              onChange={(val) => updateStats('ransomware', val)}
            />
            <SettingsToggle
              label="Phishing"
              checked={settings.stats.phishing}
              onChange={(val) => updateStats('phishing', val)}
            />
            <SettingsToggle
              label="Data Breaches"
              checked={settings.stats.breaches}
              onChange={(val) => updateStats('breaches', val)}
            />
            <SettingsToggle
              label="Fraud & Scams"
              checked={settings.stats.fraud}
              onChange={(val) => updateStats('fraud', val)}
            />
          </div>
        )}
      </div>
    </SettingsSection>
  );
}
