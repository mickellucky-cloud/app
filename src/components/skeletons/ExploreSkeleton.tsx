import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ExploreSkeletonProps {
  onBack?: () => void;
}

export const ExploreSkeleton: React.FC<ExploreSkeletonProps> = ({ onBack }) => {
  return (
    <div
      id="explore-screen-skeleton"
      aria-busy="true"
      aria-label="Loading explore screen"
      className="pb-32 md:pb-12 pt-3 px-4 sm:px-6 lg:px-8 max-w-md md:max-w-4xl lg:max-w-7xl mx-auto min-h-screen space-y-4 animate-pulse"
    >
      {/* Header */}
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

      {/* Featured Banner Skeleton */}
      <div className="p-6 rounded-3xl bg-slate-100 dark:bg-[#101422] border border-slate-200 dark:border-white/[0.06] space-y-3">
        <div className="h-5 w-24 rounded-full bg-purple-500/20" />
        <div className="h-7 w-64 rounded-xl bg-slate-200 dark:bg-slate-700/60" />
        <div className="h-4 w-80 max-w-full rounded bg-slate-200/70 dark:bg-slate-800/50" />
        <div className="h-10 w-36 rounded-xl bg-purple-500/30" />
      </div>

      {/* Category Tabs Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All Features', 'Trading & Earn', 'Card & Payments', 'Web3 & API'].map((tab, i) => (
          <div
            key={i}
            className="h-8 w-28 rounded-full bg-slate-200 dark:bg-slate-800/70 flex-shrink-0"
          />
        ))}
      </div>

      {/* Feature Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`explore-skel-${index}`}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.05] space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800/80" />
              <div className="h-5 w-20 rounded-full bg-slate-200/70 dark:bg-slate-800/50" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700/60" />
              <div className="h-3 w-48 rounded bg-slate-100 dark:bg-slate-800/50" />
            </div>
            <div className="h-8 rounded-xl bg-slate-200/60 dark:bg-slate-800/40" />
          </div>
        ))}
      </div>
    </div>
  );
};
