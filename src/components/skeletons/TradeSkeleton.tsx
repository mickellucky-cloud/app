import React from 'react';

export const TradeSkeleton: React.FC = () => {
  return (
    <div
      id="trade-screen-skeleton"
      aria-busy="true"
      aria-label="Loading spot trading interface"
      className="min-h-screen bg-white dark:bg-[#07090E] p-3 sm:p-5 max-w-[1600px] mx-auto space-y-3 animate-pulse"
    >
      {/* Top Ticker Header Bar Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700/60" />
          <div className="space-y-1">
            <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700/60" />
            <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800/60" />
          </div>
          <div className="h-6 w-20 rounded-md bg-slate-200 dark:bg-slate-800/80 ml-2" />
        </div>

        <div className="hidden sm:flex items-center gap-6">
          <div className="space-y-1">
            <div className="h-2.5 w-12 rounded bg-slate-200/60 dark:bg-slate-800/60" />
            <div className="h-3.5 w-16 rounded bg-slate-200 dark:bg-slate-700/60" />
          </div>
          <div className="space-y-1">
            <div className="h-2.5 w-12 rounded bg-slate-200/60 dark:bg-slate-800/60" />
            <div className="h-3.5 w-16 rounded bg-slate-200 dark:bg-slate-700/60" />
          </div>
          <div className="space-y-1">
            <div className="h-2.5 w-14 rounded bg-slate-200/60 dark:bg-slate-800/60" />
            <div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-700/60" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800/80" />
          <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800/80" />
        </div>
      </div>

      {/* Main Trading Area Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Chart Column (8 cols on large) */}
        <div className="lg:col-span-8 space-y-3">
          {/* Chart container skeleton */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.06] h-[360px] sm:h-[440px] flex flex-col justify-between">
            {/* Timeframe buttons skeleton */}
            <div className="flex items-center gap-2">
              {['15m', '1H', '4H', '1D', 'More'].map((tf) => (
                <div
                  key={tf}
                  className="h-6 w-10 rounded-md bg-slate-200 dark:bg-slate-800/70"
                />
              ))}
            </div>

            {/* Faux candlestick bars */}
            <div className="flex items-end justify-between gap-1 sm:gap-2 h-48 px-2">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={`chart-bar-skel-${i}`}
                  className="w-full rounded bg-slate-200/70 dark:bg-slate-800/50"
                  style={{ height: `${20 + ((i * 17) % 75)}%` }}
                />
              ))}
            </div>

            <div className="h-4 w-48 rounded bg-slate-200/60 dark:bg-slate-800/40" />
          </div>

          {/* Orders History Panel Skeleton */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.06] space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-5 w-24 rounded bg-slate-200 dark:bg-slate-700/60" />
              <div className="h-5 w-24 rounded bg-slate-100 dark:bg-slate-800/50" />
            </div>
            <div className="space-y-2">
              <div className="h-10 rounded-xl bg-slate-200/60 dark:bg-slate-800/40" />
              <div className="h-10 rounded-xl bg-slate-200/60 dark:bg-slate-800/40" />
            </div>
          </div>
        </div>

        {/* Order Book & Entry Form Column (4 cols on large) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Order book skeleton */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/[0.06]">
              <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700/60" />
              <div className="h-4 w-12 rounded bg-slate-100 dark:bg-slate-800/50" />
            </div>

            {/* Asks (Sell orders red) */}
            <div className="space-y-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`ask-skel-${i}`}
                  className="flex justify-between h-4 rounded bg-rose-500/10"
                />
              ))}
            </div>

            {/* Mid market price */}
            <div className="py-2 text-center">
              <div className="h-6 w-32 mx-auto rounded bg-slate-200 dark:bg-slate-700/60" />
            </div>

            {/* Bids (Buy orders green) */}
            <div className="space-y-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`bid-skel-${i}`}
                  className="flex justify-between h-4 rounded bg-emerald-500/10"
                />
              ))}
            </div>
          </div>

          {/* Order Entry Form Skeleton */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.06] space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="h-9 rounded-xl bg-emerald-500/20" />
              <div className="h-9 rounded-xl bg-slate-200 dark:bg-slate-800/60" />
            </div>
            <div className="h-10 rounded-xl bg-slate-200/70 dark:bg-slate-800/60" />
            <div className="h-10 rounded-xl bg-slate-200/70 dark:bg-slate-800/60" />
            <div className="h-10 rounded-xl bg-emerald-500/30" />
          </div>
        </div>
      </div>
    </div>
  );
};
