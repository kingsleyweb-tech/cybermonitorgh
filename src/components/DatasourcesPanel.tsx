import React from 'react';
import { SettingsSection, SettingsToggle } from './SettingsPrimitives';
import type { DashboardSettings } from '../types';

interface DatasourcesPanelProps {
  settings: DashboardSettings;
  onChange: (settings: DashboardSettings) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FEEDS_LIST = [
  'MyJoyOnline',
  'Citi Newsroom',
  'Graphic Online',
  'Ghana News Agency',
  'Adom Online',
  '3News (TV3)',
  'GBC Ghana Online',
  'Pulse Ghana',
  'Modern Ghana',
  'Business & Financial Times',
  'Daily Guide Network',
  'GhanaWeb',
];

export function DatasourcesPanel({ settings, onChange, isOpen, onToggle }: DatasourcesPanelProps) {
  const toggleFeed = (feedName: string, active: boolean) => {
    // disabledFeeds is true if feed is DISABLED
    onChange({
      ...settings,
      disabledFeeds: {
        ...settings.disabledFeeds,
        [feedName]: !active,
      },
    });
  };

  return (
    <SettingsSection
      title="RSS Feeds (Data sources)"
      description="Enable or disable specific Ghanaian RSS news feeds."
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FEEDS_LIST.map((feedName) => {
          const isEnabled = !settings.disabledFeeds[feedName];
          return (
            <SettingsToggle
              key={feedName}
              label={feedName}
              checked={isEnabled}
              onChange={(checked) => toggleFeed(feedName, checked)}
            />
          );
        })}
      </div>
    </SettingsSection>
  );
}
