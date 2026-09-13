import React from 'react';

export const EarnSkeleton: React.FC = () => {
  return (
    <div
      id="earn-screen-skeleton"
      aria-busy="true"
      aria-label="Loading earn products"
      className="pb-32 md:pb-12 pt-3 px-4 sm:px-6 lg:px-8 max-w-md md:max-w-4xl lg:max-w-7xl mx-auto min-h-screen space-y-4 animate-pulse"
    >
      {/* Header Skeleton */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20" />
          <div className="space-y-1.5">
            <div className="h-5 w-32 rounded bg-slate-200 dark:bg-slate-700/60" />
            <div className="h-3 w-56 rounded bg-slate-100 dark:bg-slate-800/60" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800/80" />
      </div>

      {/* Earn Total Balance Hero Banner Skeleton */}
      <div className="p-5 rounded-3xl bg-slate-100 dark:bg-[#101422] border border-slate-200 dark:border-white/[0.06] space-y-2">
        <div className="h-3.5 w-36 rounded bg-slate-200/80 dark:bg-slate-800/60" />
        <div className="h-7 w-48 rounded-lg bg-slate-200 dark:bg-slate-700/60" />
        <div className="h-3 w-28 rounded bg-slate-200/60 dark:bg-slate-800/50" />
      </div>

      {/* Category Filter Pills Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All Products', 'Flexible Savings', 'Fixed Staking', 'Launchpool'].map((label, idx) => (
          <div
            key={idx}
            className="h-8 w-24 rounded-full bg-slate-200 dark:bg-slate-800/70 flex-shrink-0"
          />
        ))}
      </div>

      {/* Product Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`earn-card-skel-${index}`}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.05] space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800/80" />
                <div className="space-y-1">
                  <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700/60" />
                  <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800/60" />
                </div>
              </div>
              <div className="h-5 w-16 rounded-full bg-slate-200/70 dark:bg-slate-800/50" />
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#07090E] border border-slate-200/60 dark:border-white/[0.04] flex items-center justify-between">
              <div>
                <div className="h-3 w-16 rounded bg-slate-200/60 dark:bg-slate-800/60 mb-1" />
                <div className="h-6 w-20 rounded bg-emerald-500/20" />
              </div>
              <div>
                <div className="h-3 w-14 rounded bg-slate-200/60 dark:bg-slate-800/60 mb-1" />
                <div className="h-5 w-16 rounded bg-slate-200 dark:bg-slate-700/60" />
              </div>
            </div>

            <div className="h-10 rounded-xl bg-purple-500/20" />
          </div>
        ))}
      </div>
    </div>
  );
};
