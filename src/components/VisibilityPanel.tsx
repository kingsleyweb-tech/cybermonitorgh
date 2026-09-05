import React from 'react';
import { SettingsSection, SettingsToggle } from './SettingsPrimitives';
import type { DashboardSettings } from '../types';

interface VisibilityPanelProps {
  settings: DashboardSettings;
  onChange: (settings: DashboardSettings) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function VisibilityPanel({ settings, onChange, isOpen, onToggle }: VisibilityPanelProps) {
  const updateSidebar = (key: keyof DashboardSettings['sidebar'], checked: boolean) => {
    onChange({
      ...settings,
      sidebar: {
        ...settings.sidebar,
        [key]: checked,
      },
    });
  };

  return (
    <SettingsSection
      title="Sidebar navigation"
      description="Toggle which navigation tabs and pages appear in the sidebar."
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SettingsToggle
          label="Latest News"
          checked={settings.sidebar.latestNews}
          onChange={(val) => updateSidebar('latestNews', val)}
        />
        <SettingsToggle
          label="Analytics"
          checked={settings.sidebar.analytics}
          onChange={(val) => updateSidebar('analytics', val)}
        />
        <SettingsToggle
          label="News by Region"
          checked={settings.sidebar.regions}
          onChange={(val) => updateSidebar('regions', val)}
        />
        <SettingsToggle
          label="Feed Health"
          checked={settings.sidebar.health}
          onChange={(val) => updateSidebar('health', val)}
        />
        <SettingsToggle
          label="Sources"
          checked={settings.sidebar.sources}
          onChange={(val) => updateSidebar('sources', val)}
        />
      </div>
    </SettingsSection>
  );
}
