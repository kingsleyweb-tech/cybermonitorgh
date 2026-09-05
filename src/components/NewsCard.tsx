import React from 'react';
import { ExternalLink, Calendar, MapPin, Newspaper } from 'lucide-react';
import type { Article } from '../types';
import { LEVEL_STYLE, LEVEL_COLORS } from '../constants';
import { fmtDate } from '../utils';

export function NewsCard({ article, index }: { article: Article; index: number }) {
  const s = LEVEL_STYLE[article.level]; 

  const titleEl = article.sourceUrl
    ? (
      <a
        href={article.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-sm font-extrabold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 leading-snug transition-colors group line-clamp-2"
      >
        {article.title}
        <ExternalLink className="inline-block w-3.5 h-3.5 ml-1 text-zinc-400 group-hover:text-blue-500 transition-colors" />
      </a>
    )
    : <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white leading-snug line-clamp-2">{article.title}</h3>;

  return (
    <div
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200"
      style={{ animation: 'fadeIn 0.25s ease both', animationDelay: `${Math.min(index, 20) * 20}ms` }}
    >
      {/* Thumbnail */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 relative bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
        <Newspaper className="w-6 h-6 text-zinc-300 dark:text-zinc-700" />
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title || 'article thumbnail'}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.onerror = null;
              img.style.display = 'none';
            }}
          />
        ) : null}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2 font-sans">
        <div className="space-y-1.5">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: LEVEL_COLORS[article.level] || '#3b82f6' }}
                aria-hidden
              />
              <span className="text-[10px] font-black text-zinc-700 dark:text-zinc-200 uppercase tracking-wider">
                {article.level}
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 truncate max-w-[130px]">
              {article.category}
            </span>
          </div>

          {titleEl}

          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-normal line-clamp-2">{article.summary}</p>
        </div>

        {/* Footer info & link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-zinc-400" />
              {fmtDate(article.date)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-zinc-400" />
              {article.region}
            </span>
            <span className="flex items-center gap-1 truncate max-w-[110px]">
              <Newspaper className="w-3 h-3 text-zinc-400" />
              {article.source}
            </span>
          </div>

          {article.sourceUrl && (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 text-[10px] font-black self-start sm:self-auto hover:underline transition-colors ${s.text}`}
            >
              Read Article <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}