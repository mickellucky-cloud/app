import React from 'react';

export const MarketsSkeleton: React.FC = () => {
  const rows = Array.from({ length: 8 });

  return (
    <div
      id="markets-screen-skeleton"
      aria-busy="true"
      aria-label="Loading markets data"
      className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 animate-pulse"
    >
      {/* Search and Title Bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1.5">
          <div className="h-6 w-36 rounded-lg bg-slate-200 dark:bg-slate-700/60" />
          <div className="h-3 w-56 rounded bg-slate-100 dark:bg-slate-800/60" />
        </div>
        <div className="h-10 w-full sm:w-72 rounded-xl bg-slate-200 dark:bg-slate-800/70" />
      </div>

      {/* Category Tabs Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`market-cat-skel-${i}`}
            className="h-8 w-20 rounded-full bg-slate-200 dark:bg-slate-800/70 flex-shrink-0"
          />
        ))}
      </div>

      {/* Quote Filter Pills Skeleton */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`quote-skel-${i}`}
              className="h-7 w-16 rounded-full bg-slate-100 dark:bg-slate-800/50"
            />
          ))}
        </div>
        <div className="h-7 w-20 rounded-lg bg-slate-100 dark:bg-slate-800/50" />
      </div>

      {/* Market Pairs List Skeleton */}
      <div className="space-y-2 pt-1">
        {rows.map((_, index) => (
          <div
            key={`market-row-skel-${index}`}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.04]"
          >
            {/* Coin & Pair info */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800/80 flex-shrink-0" />
              <div className="space-y-1.5">
                <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700/60" />
                <div className="h-3 w-28 rounded bg-slate-100 dark:bg-slate-800/60" />
              </div>
            </div>

            {/* Sparkline placeholder */}
            <div className="hidden md:block w-28 h-6 rounded bg-slate-200/60 dark:bg-slate-800/40" />

            {/* Price & Change Badge */}
            <div className="flex items-center gap-3.5">
              <div className="text-right space-y-1">
                <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700/60 ml-auto" />
                <div className="h-3 w-14 rounded bg-slate-100 dark:bg-slate-800/60 ml-auto" />
              </div>
              <div className="w-16 h-7 rounded-lg bg-slate-200 dark:bg-slate-800/80" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
