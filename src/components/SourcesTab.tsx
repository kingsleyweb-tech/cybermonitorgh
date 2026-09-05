import React from 'react';
import { Globe, Shield, Newspaper, ExternalLink, Radio } from 'lucide-react';
import { SOURCES } from '../data/sources';

interface SourcesTabProps {
  articlesBySource: Record<string, number>;
}

const INT_SOURCES = [
  { name: 'The Hacker News', url: 'https://thehackernews.com', type: 'Threat Intel', note: 'Global cybersecurity & hacking news portal' },
  { name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com', type: 'News', note: 'Computer security, ransomware & technology news' },
  { name: 'SecurityWeek', url: 'https://www.securityweek.com', type: 'Threat Intel', note: 'Enterprise cybersecurity news & vulnerability advisories' },
  { name: 'Dark Reading', url: 'https://www.darkreading.com', type: 'Threat Intel', note: 'Cybersecurity insights, threat trends & IT risk' },
  { name: 'CISA Advisories', url: 'https://www.cisa.gov', type: 'Government', note: 'Official US Cybersecurity & Infrastructure Security Agency' },
  { name: 'Krebs on Security', url: 'https://krebsonsecurity.com', type: 'Threat Intel', note: 'In-depth security news & cybercrime investigation' },
  { name: 'BBC Tech News', url: 'http://www.bbc.com/news/technology', type: 'News', note: 'International technology & digital security coverage' },
];

export function SourcesTab({ articlesBySource }: SourcesTabProps) {
  const allSources = [...SOURCES, ...INT_SOURCES];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden transition-colors font-sans">
      <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">
        <h3 className="text-base font-black text-zinc-900 dark:text-white flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Monitored News &amp; Security Sources
        </h3>
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">
          Aggregating RSS security intelligence feeds from verified global and Ghanaian institutions.
        </p>
      </div>
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {allSources.map(src => (
          <div key={src.name} className="px-6 py-4 flex items-start gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
              {src.type === 'Government'
                ? <Shield    className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                : src.type === 'Threat Intel'
                ? <Radio     className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                : <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-black text-zinc-900 dark:text-white">{src.name}</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  src.type === 'Government' 
                    ? 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800' 
                    : src.type === 'Threat Intel'
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                }`}>
                  {src.type}
                </span>
              </div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">{src.note}</p>
              <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline transition-colors flex items-center gap-1 mt-1 w-fit">
                {src.url} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="text-right shrink-0">
              <span className="text-base font-black text-zinc-900 dark:text-white">{articlesBySource[src.name] ?? 0}</span>
              <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">articles</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}