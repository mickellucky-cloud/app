import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface AnalyticsSkeletonProps {
  onBack?: () => void;
}

export const AnalyticsSkeleton: React.FC<AnalyticsSkeletonProps> = ({ onBack }) => {
  return (
    <div
      id="analytics-screen-skeleton"
      aria-busy="true"
      aria-label="Loading analytics dashboard"
      className="pb-32 md:pb-12 pt-3 px-4 sm:px-6 lg:px-8 max-w-md md:max-w-4xl lg:max-w-7xl mx-auto min-h-screen space-y-4 animate-pulse"
    >
      {/* Header Skeleton */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="space-y-1.5">
            <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-700/60" />
            <div className="h-3 w-56 rounded bg-slate-100 dark:bg-slate-800/60" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800/80" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {['Total P&L', 'Win Rate', 'Sharpe Ratio', 'Max Drawdown'].map((metric) => (
          <div
            key={metric}
            className="p-4 rounded-2xl bg-slate-100 dark:bg-[#101422] border border-slate-200 dark:border-white/[0.06] space-y-2"
          >
            <div className="h-3 w-20 rounded bg-slate-200/80 dark:bg-slate-800/60" />
            <div className="h-6 w-24 rounded bg-slate-200 dark:bg-slate-700/60" />
            <div className="h-3 w-16 rounded bg-emerald-500/20" />
          </div>
        ))}
      </div>

      {/* ROI Chart Card Skeleton */}
      <div className="p-5 rounded-3xl bg-slate-100 dark:bg-[#101422] border border-slate-200 dark:border-white/[0.06] space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700/60" />
            <div className="h-7 w-28 rounded bg-emerald-500/20" />
          </div>
          <div className="flex gap-1.5">
            {['24H', '7D', '30D', '90D', 'ALL'].map((r) => (
              <div
                key={r}
                className="h-7 w-10 rounded-lg bg-slate-200 dark:bg-slate-800/60"
              />
            ))}
          </div>
        </div>

        {/* Chart area */}
        <div className="h-48 rounded-2xl bg-slate-200/50 dark:bg-slate-800/30 flex items-center justify-center">
          <div className="h-1 w-full mx-6 rounded bg-slate-300/50 dark:bg-slate-700/40" />
        </div>
      </div>

      {/* Asset Allocation & Performance Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-[#101422] border border-slate-200 dark:border-white/[0.06] space-y-3">
          <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-700/60" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-8 rounded-xl bg-slate-200/70 dark:bg-slate-800/50"
              />
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-[#101422] border border-slate-200 dark:border-white/[0.06] space-y-3">
          <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-700/60" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-8 rounded-xl bg-slate-200/70 dark:bg-slate-800/50"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
