import React from 'react';

export const AssetsSkeleton: React.FC = () => {
  return (
    <div
      id="assets-screen-skeleton"
      aria-busy="true"
      aria-label="Loading wallet and asset balances"
      className="pb-32 md:pb-12 pt-3 px-4 sm:px-6 lg:px-8 max-w-md md:max-w-4xl lg:max-w-7xl mx-auto min-h-screen space-y-4 animate-pulse"
    >
      {/* Top Total Balance Hero Card Skeleton */}
      <div className="p-6 rounded-3xl bg-slate-100 dark:bg-[#101422] border border-slate-200 dark:border-white/[0.06] space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 rounded bg-slate-200/80 dark:bg-slate-800/60" />
          <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800/80" />
        </div>

        <div className="space-y-1">
          <div className="h-9 w-52 rounded-xl bg-slate-200 dark:bg-slate-700/60" />
          <div className="h-4 w-36 rounded bg-slate-200/70 dark:bg-slate-800/50" />
        </div>

        {/* Sub-account balance pills */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-white/[0.06]">
          {['Spot', 'Funding', 'Earn'].map((name) => (
            <div key={name} className="space-y-1">
              <div className="h-3 w-12 rounded bg-slate-200/60 dark:bg-slate-800/50" />
              <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700/60" />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons Row Skeleton */}
      <div className="grid grid-cols-4 gap-2.5">
        {['Deposit', 'Withdraw', 'Send', 'Convert'].map((btn) => (
          <div
            key={btn}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.04]"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800/80" />
            <div className="h-3 w-12 rounded bg-slate-200 dark:bg-slate-800/70" />
          </div>
        ))}
      </div>

      {/* Search & Filter Header Skeleton */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="h-9 w-44 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
        <div className="h-4 w-28 rounded bg-slate-100 dark:bg-slate-800/50" />
      </div>

      {/* Crypto Asset List Items Skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`asset-row-skel-${index}`}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.04]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800/80 flex-shrink-0" />
              <div className="space-y-1.5">
                <div className="h-4 w-14 rounded bg-slate-200 dark:bg-slate-700/60" />
                <div className="h-3 w-20 rounded bg-slate-100 dark:bg-slate-800/50" />
              </div>
            </div>

            <div className="hidden sm:block w-24 h-5 rounded bg-slate-200/60 dark:bg-slate-800/40" />

            <div className="text-right space-y-1.5">
              <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700/60 ml-auto" />
              <div className="h-3 w-14 rounded bg-slate-100 dark:bg-slate-800/50 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
