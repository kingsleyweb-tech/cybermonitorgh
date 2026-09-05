import type { ThreatLevel, ThreatCategory, GhanaRegion } from '../types';

// API base — uses local backend when running in development
export const API_BASE = process.env.REACT_APP_API_BASE
  || process.env.REACT_APP_API_URL
  || (process.env.NODE_ENV === 'production'
      ? 'https://cybermonitorgh.onrender.com'
      : `http://localhost:${process.env.REACT_APP_SERVER_PORT || 3001}`);

// Auto-refresh
export const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

// How many articles to show before the user clicks "View All News"
export const INITIAL_ARTICLES_SHOWN = 12;

export const LEVEL_STYLE: Record<ThreatLevel, { badge: string; border: string; dot: string; text: string; bg: string }> = {
  Critical: { badge: 'bg-red-100 text-red-700 border border-red-200',           border: 'border-l-red-500',     dot: 'bg-red-500',    text: 'text-red-700',    bg: 'bg-red-50' },
  High:     { badge: 'bg-orange-100 text-orange-700 border border-orange-200',  border: 'border-l-orange-400',  dot: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50' },
  Medium:   { badge: 'bg-amber-100 text-amber-700 border border-amber-200',     border: 'border-l-amber-400',   dot: 'bg-amber-500',  text: 'text-amber-700',  bg: 'bg-amber-50' },
  Low:      { badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200', border: 'border-l-emerald-400', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
};

export const CATEGORY_COLORS: Record<string, string> = {
  'Cyber News':          '#2563eb',
  'Threat Intelligence': '#0284c7',
  'Vulnerabilities':     '#d97706',
  'Ransomware':          '#dc2626',
  'Malware':             '#ea580c',
  'Data Breaches':       '#e11d48',
  'Technology':          '#0891b2',
  'AI & Security':       '#059669',
  'General News':        '#4b5563',
  'Fraud & Scams':       '#ca8a04',
  'Government Advisory': '#0284c7',
  'Phishing':            '#f97316',
  'Data Breach':         '#e11d48',
  'Non-Threat News':     '#6b7280',
};

export const LEVEL_COLORS: Record<string, string> = {
  Critical: '#dc2626',
  High:     '#ea580c',
  Medium:   '#d97706',
  Low:      '#059669',
};

// Arrays used to populate the filter dropdowns
export const CATEGORIES: Array<ThreatCategory | 'All'> = [
  'All',
  'General News',
  'Cyber News',
  'Threat Intelligence',
  'Vulnerabilities',
  'Ransomware',
  'Malware',
  'Data Breaches',
  'Technology',
  'AI & Security',
];

export const LEVELS: Array<'Critical' | 'High' | 'Medium' | 'Low' | 'All'> = [
  'All', 'Critical', 'High', 'Medium', 'Low',
];

export const REGIONS: Array<GhanaRegion | 'All'> = [
  'All',
  'Ghana',
  'Africa',
  'North America',
  'Europe',
  'Asia',
  'Middle East',
  'South America',
  'Oceania',
  'Global',
];

export const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    fontSize: 11,
    color: '#374151',
  },
};

export const DEFAULT_SETTINGS = {
  autoRefreshInterval: 5,
  showNonCyber: true,
  sidebar: {
    latestNews: true,
    analytics: true,
    regions: true,
    health: true,
    sources: true,
  },
  stats: {
    showRow: true,
    malware: true,
    hacking: true,
    ransomware: true,
    phishing: true,
    breaches: true,
    fraud: true,
  },
  disabledFeeds: {} as Record<string, boolean>,
};
