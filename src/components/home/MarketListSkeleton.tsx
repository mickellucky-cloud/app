import React from 'react';

export const MarketListSkeleton: React.FC = () => {
  // 4 rows matching the 4 preview market rows on HomeScreen
  const items = [
    { symbolWidth: 'w-16', nameWidth: 'w-20', priceWidth: 'w-16' },
    { symbolWidth: 'w-14', nameWidth: 'w-16', priceWidth: 'w-14' },
    { symbolWidth: 'w-16', nameWidth: 'w-24', priceWidth: 'w-12' },
    { symbolWidth: 'w-12', nameWidth: 'w-18', priceWidth: 'w-16' },
  ];

  return (
    <div
      id="market-list-skeleton"
      aria-busy="true"
      aria-label="Loading live markets"
      className="space-y-1.5"
    >
      {items.map((item, index) => (
        <div
          key={`market-skeleton-${index}`}
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.03] animate-shimmer"
        >
          {/* Coin icon & symbol/name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800/80 border border-slate-300/50 dark:border-white/[0.05] animate-pulse flex-shrink-0" />
            <div>
              <div
                className={`h-3.5 rounded bg-slate-200 dark:bg-slate-700/60 ${item.symbolWidth} animate-pulse mb-1.5`}
              />
              <div
                className={`h-2.5 rounded bg-slate-200/80 dark:bg-slate-800/60 ${item.nameWidth} animate-pulse`}
              />
            </div>
          </div>

          {/* Price & 24h Change Badge */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <div
                className={`h-3.5 rounded bg-slate-200 dark:bg-slate-700/60 ${item.priceWidth} animate-pulse`}
              />
            </div>
            <div className="w-[62px] h-[26px] rounded-md bg-slate-200 dark:bg-slate-800/70 border border-slate-300/50 dark:border-white/[0.05] animate-pulse flex-shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
};
