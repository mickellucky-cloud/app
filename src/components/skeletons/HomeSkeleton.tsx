import React from 'react';

export const HomeSkeleton: React.FC = () => {
  return (
    <div
      id="home-screen-skeleton"
      aria-busy="true"
      aria-label="Loading home dashboard"
      className="pb-28 md:pb-12 pt-3 px-3 sm:px-6 lg:px-8 max-w-md md:max-w-4xl lg:max-w-7xl mx-auto min-h-screen animate-pulse space-y-4"
    >
      {/* Mobile Top Header Skeleton */}
      <div className="flex md:hidden items-center justify-between py-2 mb-2">
        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
        {/* Right action cluster */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Hero / Portfolio Balance Card Skeleton */}
      <div className="rounded-3xl p-5 sm:p-6 bg-slate-100 dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.06] space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-700/60" />
            <div className="h-8 w-44 rounded-lg bg-slate-300 dark:bg-slate-700" />
          </div>
          <div className="h-7 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* 24h PnL row */}
        <div className="flex items-center gap-3">
          <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* 4 Action Buttons: Deposit, Withdraw, Send, Convert */}
        <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-200/60 dark:border-white/[0.04]">
          {['Deposit', 'Withdraw', 'Send', 'Convert'].map((_, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 pt-2">
              <div className="w-11 h-11 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-12 rounded bg-slate-200/70 dark:bg-slate-800/60" />
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Banner Carousel Skeleton */}
      <div className="h-24 sm:h-28 rounded-2xl bg-slate-200 dark:bg-[#101422] border border-slate-200/70 dark:border-white/[0.05] relative overflow-hidden" />

      {/* Exchange Feature Grid (8 Tiles) Skeleton */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-28 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-[#0D101C] border border-slate-200/70 dark:border-white/[0.04] flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 w-16 rounded bg-slate-200 dark:bg-slate-700/60" />
                <div className="h-2.5 w-20 rounded bg-slate-200/60 dark:bg-slate-800/60" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Quotes Section Skeleton */}
      <div className="space-y-3 pt-2">
        {/* Tabs: Hot, Gainers, New, Losers */}
        <div className="flex items-center gap-2 border-b border-slate-200/70 dark:border-white/[0.06] pb-2">
          {['Hot', 'Gainers', 'New Coins', '24h Losers'].map((_, idx) => (
            <div
              key={idx}
              className="h-7 w-20 rounded-full bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>

        {/* Market Rows */}
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#0D101C] border border-slate-200/70 dark:border-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700/60" />
                  <div className="h-3 w-28 rounded bg-slate-200/60 dark:bg-slate-800/50" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="space-y-1.5 text-right">
                  <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700/60 ml-auto" />
                  <div className="h-3 w-14 rounded bg-slate-200/60 dark:bg-slate-800/50 ml-auto" />
                </div>
                <div className="w-16 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
