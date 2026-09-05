import React, { useMemo, useState } from 'react';
import {
  ShieldAlert, Bug, Mail, CreditCard, FileWarning,
  BookOpen, Newspaper, ChevronDown, ChevronUp, ExternalLink,
  Radio, Shield, Cpu, Sparkles, AlertTriangle
} from 'lucide-react';
import type { Article, ThreatCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';

const CATEGORY_META: Record<string, {
  icon: React.ComponentType<{ className?: string }>;
  bg: string;
  darkBg: string;
  text: string;
  darkText: string;
  border: string;
  darkBorder: string;
}> = {
  'Cyber News':          { icon: Radio,       bg: 'bg-blue-50',    darkBg: 'dark:bg-blue-950/40',    text: 'text-blue-700',   darkText: 'dark:text-blue-300',   border: 'border-blue-200',   darkBorder: 'dark:border-blue-900/60'   },
  'Threat Intelligence': { icon: Shield,      bg: 'bg-cyan-50',    darkBg: 'dark:bg-cyan-950/40',    text: 'text-cyan-700',   darkText: 'dark:text-cyan-300',   border: 'border-cyan-200',   darkBorder: 'dark:border-cyan-900/60'   },
  'Vulnerabilities':     { icon: AlertTriangle, bg: 'bg-amber-50', darkBg: 'dark:bg-amber-950/40',   text: 'text-amber-700',  darkText: 'dark:text-amber-300',  border: 'border-amber-200',  darkBorder: 'dark:border-amber-900/60'  },
  'Ransomware':          { icon: ShieldAlert, bg: 'bg-red-50',     darkBg: 'dark:bg-red-950/40',     text: 'text-red-700',    darkText: 'dark:text-red-300',    border: 'border-red-200',    darkBorder: 'dark:border-red-900/60'    },
  'Malware':             { icon: Bug,         bg: 'bg-orange-50',  darkBg: 'dark:bg-orange-950/40',  text: 'text-orange-700', darkText: 'dark:text-orange-300', border: 'border-orange-200', darkBorder: 'dark:border-orange-900/60' },
  'Data Breaches':       { icon: FileWarning, bg: 'bg-rose-50',    darkBg: 'dark:bg-rose-950/40',    text: 'text-rose-700',   darkText: 'dark:text-rose-300',   border: 'border-rose-200',   darkBorder: 'dark:border-rose-900/60'   },
  'Technology':          { icon: Cpu,         bg: 'bg-teal-50',    darkBg: 'dark:bg-teal-950/40',    text: 'text-teal-700',   darkText: 'dark:text-teal-300',   border: 'border-teal-200',   darkBorder: 'dark:border-teal-900/60'   },
  'AI & Security':       { icon: Sparkles,    bg: 'bg-emerald-50', darkBg: 'dark:bg-emerald-950/40', text: 'text-emerald-700',darkText: 'dark:text-emerald-300',border: 'border-emerald-200',darkBorder: 'dark:border-emerald-900/60'},
  'General News':        { icon: Newspaper,   bg: 'bg-zinc-100',   darkBg: 'dark:bg-zinc-800',       text: 'text-zinc-700',   darkText: 'dark:text-zinc-300',   border: 'border-zinc-200',   darkBorder: 'dark:border-zinc-700'     },
  'Fraud & Scams':       { icon: CreditCard,  bg: 'bg-yellow-50',  darkBg: 'dark:bg-yellow-950/40',  text: 'text-yellow-700', darkText: 'dark:text-yellow-300', border: 'border-yellow-200', darkBorder: 'dark:border-yellow-900/60' },
  'Government Advisory': { icon: BookOpen,    bg: 'bg-blue-50',    darkBg: 'dark:bg-blue-950/40',    text: 'text-blue-700',   darkText: 'dark:text-blue-300',   border: 'border-blue-200',   darkBorder: 'dark:border-blue-900/60'   },
  'Phishing':            { icon: Mail,        bg: 'bg-amber-50',   darkBg: 'dark:bg-amber-950/40',   text: 'text-amber-700',  darkText: 'dark:text-amber-300',  border: 'border-amber-200',  darkBorder: 'dark:border-amber-900/60'  },
  'Data Breach':         { icon: FileWarning, bg: 'bg-rose-50',    darkBg: 'dark:bg-rose-950/40',    text: 'text-rose-700',   darkText: 'dark:text-rose-300',   border: 'border-rose-200',   darkBorder: 'dark:border-rose-900/60'   },
  'Non-Threat News':     { icon: Newspaper,   bg: 'bg-zinc-100',   darkBg: 'dark:bg-zinc-800',       text: 'text-zinc-700',   darkText: 'dark:text-zinc-300',   border: 'border-zinc-200',   darkBorder: 'dark:border-zinc-700'     },
};

const CATEGORY_ORDER: ThreatCategory[] = [
  'General News', 'Cyber News', 'Threat Intelligence', 'Vulnerabilities',
  'Ransomware', 'Malware', 'Data Breaches', 'Technology', 'AI & Security',
  'Fraud & Scams', 'Government Advisory', 'Phishing', 'Non-Threat News'
];

const PREVIEW_COUNT = 4;

interface CategorySectionProps {
  category: ThreatCategory;
  articles: Article[];
}

function CategorySection({ category, articles }: CategorySectionProps) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[category] || CATEGORY_META['General News'];
  const Icon = meta.icon;
  const color = CATEGORY_COLORS[category] || '#6b7280';
  const shown = expanded ? articles : articles.slice(0, PREVIEW_COUNT);
  const hasMore = articles.length > PREVIEW_COUNT;

  if (articles.length === 0) return null;

  return (
    <div className={`bg-white dark:bg-zinc-900 border ${meta.border} ${meta.darkBorder} rounded-2xl shadow-sm overflow-hidden transition-colors`}>
      <div className={`flex items-center justify-between px-6 py-4 ${meta.bg} ${meta.darkBg} border-b ${meta.border} ${meta.darkBorder}`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${meta.bg} ${meta.darkBg} border ${meta.border} ${meta.darkBorder}`}>
            <Icon className={`w-4 h-4 ${meta.text} ${meta.darkText}`} />
          </div>
          <span className={`text-base font-black ${meta.text} ${meta.darkText}`}>{category}</span>
          <span
            className="text-xs font-black px-2.5 py-0.5 rounded-full text-white shadow-xs"
            style={{ background: color }}
          >
            {articles.length}
          </span>
        </div>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {shown.map(article => (
          <a
            key={article.id}
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors group"
          >
            <span
              className="mt-2 w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: CATEGORY_COLORS[article.category] || '#3b82f6' }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-extrabold text-zinc-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {article.title}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <span>{article.source}</span>
                <span>·</span>
                <span>{article.date}</span>
                <span
                  className="text-[10px] font-black px-2 py-0.5 rounded-full ml-auto"
                  style={{ background: `${CATEGORY_COLORS[article.category] || '#3b82f6'}20`, color: CATEGORY_COLORS[article.category] || '#3b82f6' }}
                >
                  {article.level}
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 flex-shrink-0 mt-1 transition-colors" />
          </a>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(e => !e)}
          className={`w-full flex items-center justify-center gap-2 text-xs font-extrabold py-3.5 border-t ${meta.border} ${meta.darkBorder} ${meta.bg} ${meta.darkBg} ${meta.text} ${meta.darkText} hover:opacity-90 transition-opacity`}
        >
          {expanded ? (
            <><ChevronUp className="w-4 h-4" /> Show less</>
          ) : (
            <><ChevronDown className="w-4 h-4" /> Show {articles.length - PREVIEW_COUNT} more articles</>
          )}
        </button>
      )}
    </div>
  );
}

export function CategoriesTab({ articles }: { articles: Article[] }) {
  const grouped = useMemo(() => {
    const map: Partial<Record<ThreatCategory, Article[]>> = {};
    articles.forEach(a => {
      if (!map[a.category]) map[a.category] = [];
      map[a.category]!.push(a);
    });
    return map;
  }, [articles]);

  const total = articles.length;

  return (
    <div className="space-y-6">

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-5 transition-colors">
        <div className="flex flex-wrap gap-3">
          {CATEGORY_ORDER.map(cat => {
            const count = grouped[cat]?.length ?? 0;
            if (count === 0) return null;
            const meta = CATEGORY_META[cat] || CATEGORY_META['General News'];
            const pct  = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={cat} className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border ${meta.border} ${meta.darkBorder} ${meta.bg} ${meta.darkBg}`}>
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: CATEGORY_COLORS[cat] || '#3b82f6' }}
                />
                <span className={`text-xs font-extrabold ${meta.text} ${meta.darkText}`}>{cat}</span>
                <span className="text-xs font-black text-zinc-900 dark:text-white">{count}</span>
                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {CATEGORY_ORDER.map(cat => (
        <CategorySection
          key={cat}
          category={cat}
          articles={grouped[cat] ?? []}
        />
      ))}

      {total === 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-14 text-center shadow-sm">
          <p className="text-base text-zinc-600 dark:text-zinc-300 font-extrabold">No articles available</p>
          <p className="text-xs text-zinc-400 mt-1">Try refreshing the feeds</p>
        </div>
      )}
    </div>
  );
}
