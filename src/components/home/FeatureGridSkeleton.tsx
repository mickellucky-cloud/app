import React from 'react';

export const FeatureGridSkeleton: React.FC = () => {
  // 8 placeholders matching the 8 OKNexus feature tiles (Markets, Trade, Convert, Buy/Sell, P2P, Wallet, Earn, More)
  const items = [
    { titleWidth: 'w-14', descWidth: 'w-20' },
    { titleWidth: 'w-12', descWidth: 'w-24' },
    { titleWidth: 'w-16', descWidth: 'w-22' },
    { titleWidth: 'w-16', descWidth: 'w-24' },
    { titleWidth: 'w-10', descWidth: 'w-18' },
    { titleWidth: 'w-14', descWidth: 'w-20' },
    { titleWidth: 'w-12', descWidth: 'w-20' },
    { titleWidth: 'w-12', descWidth: 'w-24' },
  ];

  return (
    <div
      id="feature-grid-skeleton"
      aria-busy="true"
      aria-label="Loading exchange features"
      className="grid grid-cols-2 gap-2"
    >
      {items.map((item, index) => (
        <div
          key={`feature-skeleton-${index}`}
          className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-[#0D101C] border border-slate-200 dark:border-white/[0.06] animate-shimmer shadow-2xs"
        >
          {/* Icon box placeholder with subtle pulse & border */}
          <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800/80 border border-slate-300/60 dark:border-white/[0.06] flex-shrink-0 animate-pulse" />

          {/* Text lines */}
          <div className="min-w-0 flex-1">
            <div
              className={`h-3.5 rounded bg-slate-200 dark:bg-slate-700/60 ${item.titleWidth} animate-pulse mb-1.5`}
            />
            <div
              className={`h-2.5 rounded bg-slate-200/80 dark:bg-slate-800/60 ${item.descWidth} animate-pulse`}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
