import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface SupportSkeletonProps {
  onBack?: () => void;
}

export const SupportSkeleton: React.FC<SupportSkeletonProps> = ({ onBack }) => {
  return (
    <div
      id="support-skeleton"
      aria-busy="true"
      aria-label="Loading support center"
      className="min-h-screen bg-white dark:bg-[#07090E] text-[#0F172A] dark:text-[#EDF1F5] pb-28 animate-pulse"
    >
      {/* Header Skeleton */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-[#07090E]/95 border-b border-[#D7E0EB] dark:border-[#1E2633] px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 -ml-1 rounded-xl text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6] dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="space-y-1.5">
            <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-700/60" />
            <div className="h-2.5 w-48 rounded bg-slate-100 dark:bg-slate-800/60" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800/80" />
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-4 space-y-4">
        {/* Search bar skeleton */}
        <div className="h-12 w-full rounded-2xl bg-slate-100 dark:bg-[#141B24] border border-slate-200 dark:border-white/[0.06]" />

        {/* Quick action cards skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-100 dark:bg-[#141B24] border border-slate-200 dark:border-white/[0.06] space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700/60" />
              <div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-700/60" />
              <div className="h-2.5 w-28 rounded bg-slate-100 dark:bg-slate-800/60" />
            </div>
          ))}
        </div>

        {/* Categories row */}
        <div className="flex gap-2 overflow-x-hidden py-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 w-28 rounded-xl bg-slate-200 dark:bg-slate-800/80 flex-shrink-0"
            />
          ))}
        </div>

        {/* FAQ list skeleton */}
        <div className="space-y-2.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-100 dark:bg-[#141B24] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between"
            >
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 w-3/4 rounded bg-slate-200 dark:bg-slate-700/60" />
                <div className="h-2.5 w-1/2 rounded bg-slate-100 dark:bg-slate-800/60" />
              </div>
              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
