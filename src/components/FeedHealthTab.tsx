import React, { useState, useEffect } from 'react';
import {
  CheckCircle, XCircle, AlertCircle, Radio, Loader2,
} from 'lucide-react';
import type { FeedStatus } from '../types';
import { fetchFeedStatus } from '../services/api';

export function FeedHealthTab({ articlesBySource }: { articlesBySource: Record<string, number> }) {
  const [feeds,   setFeeds]   = useState<FeedStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    fetchFeedStatus()
      .then(data => { setFeeds(data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []); 

  const activeCount  = feeds.filter(f => f.status === 'Active').length;
  const offlineCount = feeds.filter(f => f.status !== 'Active').length;

  const StatusIcon = ({ status }: { status: string }) =>
    status === 'Active'  ? <CheckCircle  className="w-5 h-5 text-emerald-500" />
    : status === 'Offline' ? <XCircle    className="w-5 h-5 text-red-500" />
    :                        <AlertCircle className="w-5 h-5 text-amber-500" />;

  return (
    <div className="space-y-6">

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            ['Online Feeds', activeCount,  'text-emerald-600 dark:text-emerald-400'],
            ['Offline / Error', offlineCount, 'text-red-600 dark:text-red-400'],
            ['Total Monitored', feeds.length, 'text-blue-600 dark:text-blue-400'],
          ].map(([label, val, cls]) => (
            <div key={String(label)} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 text-center shadow-sm transition-colors">
              <p className={`text-3xl font-black ${cls}`}>{val}</p>
              <p className="text-xs font-extrabold text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2.5">
          <Radio className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-black text-zinc-900 dark:text-white">RSS Feed Endpoint Health</h3>
        </div>

        {loading && (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-3" />
            <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300">Checking feed status…</p>
          </div>
        )}

        {!loading && error && (
          <div className="p-10 text-center">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-red-600 dark:text-red-400">Could not check feed status: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {feeds.map(feed => (
              <div key={feed.name} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-3.5 min-w-0">
                  <StatusIcon status={feed.status} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-zinc-900 dark:text-white">{feed.name}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        feed.type === 'Government' 
                          ? 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800' 
                          : feed.type === 'Threat Intel'
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      }`}>
                        {feed.type}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 truncate mt-0.5">{feed.url}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs font-black ${
                    feed.status === 'Active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {feed.status}
                  </span>
                  <p className="text-[10px] font-bold text-zinc-400">{articlesBySource[feed.name] ?? 0} articles</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}