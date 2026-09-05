import React, { useState } from "react";
import { Settings2 } from "lucide-react";
import { GeneralPanel } from "./GeneralPanel";
import { VisibilityPanel } from "./VisibilityPanel";
import { DisplayPanel } from "./DisplayPanel";
import { DatasourcesPanel } from "./DatasourcesPanel";
import type { DashboardSettings } from "../types";

interface SettingsViewProps {
  settings: DashboardSettings;
  onChange: (settings: DashboardSettings) => void;
}

export function SettingsView({ settings, onChange }: SettingsViewProps) {
  const [openSection, setOpenSection] = useState<string>("general");
  const toggle = (key: string) => setOpenSection(prev => (prev === key ? "" : key));

  return (
    <div className="space-y-2">
      <div className="pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Settings2 className="w-5 h-5 text-blue-500" />
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Dashboard Settings</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage every section of the dashboard. Changes save automatically.
        </p>
      </div>

      <GeneralPanel settings={settings} onChange={onChange} isOpen={openSection === "general"} onToggle={() => toggle("general")} />
      <VisibilityPanel settings={settings} onChange={onChange} isOpen={openSection === "visibility"} onToggle={() => toggle("visibility")} />
      <DisplayPanel settings={settings} onChange={onChange} isOpen={openSection === "display"} onToggle={() => toggle("display")} />
      <DatasourcesPanel settings={settings} onChange={onChange} isOpen={openSection === "datasources"} onToggle={() => toggle("datasources")} />
    </div>
  );
}
