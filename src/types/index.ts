export type ThreatLevel = 'Critical' | 'High' | 'Medium' | 'Low'
export type ThreatCategory =
  | 'General News'
  | 'Cyber News'
  | 'Threat Intelligence'
  | 'Vulnerabilities'
  | 'Ransomware'
  | 'Malware'
  | 'Data Breaches'
  | 'Technology'
  | 'AI & Security'
  | 'Fraud & Scams'
  | 'Government Advisory'
  | 'Phishing'
  | 'Non-Threat News';

export type GlobalRegion =
  | 'Ghana'
  | 'Africa'
  | 'North America'
  | 'South America'
  | 'Europe'
  | 'Middle East'
  | 'Asia'
  | 'Oceania'
  | 'Global';

export type GhanaRegion = GlobalRegion;

export type FeedType = 'News' | 'Government' | 'Threat Intel';

export type Tab = 'news' | 'analytics' | 'regions' | 'health' | 'sources' | 'categories' | 'ai-assistant' | 'about-guide';

export type DateRange = 'all' | 'today' | 'yesterday' | '3days' | '7days';

export interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: ThreatCategory;
  level: ThreatLevel;
  region: GhanaRegion;
  date: string;
  tags: string[];      
  feedType: FeedType;
  isDemo: boolean;
  imageUrl?: string;
}

// Shape of a single RSS feed's health status
export interface FeedStatus {
  name: string;
  url: string;
  type: FeedType;
  status: 'Active' | 'Offline' | 'Error';
  checkedAt: string;
}

// Shape of the JSON response from our backend API
export interface ApiResponse {
  results: Article[];
  count: number;
  liveCount: number;
  demoCount: number;
  fetchTimeMs: number;
  fetchedAt: string;
  source: string;
}

export interface DashboardSettings {
  autoRefreshInterval: number; // in minutes
  showNonCyber: boolean;
  sidebar: {
    latestNews: boolean;
    analytics: boolean;
    regions: boolean;
    health: boolean;
    sources: boolean;
  };
  stats: {
    showRow: boolean;
    malware: boolean;
    hacking: boolean;
    ransomware: boolean;
    phishing: boolean;
    breaches: boolean;
    fraud: boolean;
  };
  disabledFeeds: Record<string, boolean>;
}