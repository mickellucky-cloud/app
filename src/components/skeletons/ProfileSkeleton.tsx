import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ProfileSkeletonProps {
  onBack?: () => void;
}

export const ProfileSkeleton: React.FC<ProfileSkeletonProps> = ({ onBack }) => {
  return (
    <div
      id="profile-skeleton"
      aria-busy="true"
      aria-label="Loading profile"
      className="min-h-screen bg-white dark:bg-[#07090E] text-[#0F172A] dark:text-[#EDF1F5] pb-28 animate-pulse"
    >
      {/* Skeleton Header */}
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
            <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700/60" />
            <div className="h-2.5 w-44 rounded bg-slate-100 dark:bg-slate-800/60" />
          </div>
        </div>
        <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800/80" />
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
        {/* Profile Identity Card Skeleton */}
        <div className="p-5 rounded-3xl bg-slate-100 dark:bg-[#141B24] border border-slate-200 dark:border-white/[0.06] space-y-4">
          <div className="flex items-center gap-4">
            {/* Avatar circle */}
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700/60 flex-shrink-0" />
            {/* Info rows */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <div className="h-5 w-28 rounded bg-slate-200 dark:bg-slate-700/60" />
                <div className="h-4 w-12 rounded-full bg-slate-200 dark:bg-slate-700/60" />
              </div>
              <div className="h-3 w-40 rounded bg-slate-200/80 dark:bg-slate-800/60" />
              <div className="h-3 w-48 rounded bg-slate-200/80 dark:bg-slate-800/60" />
            </div>
          </div>
        </div>

        {/* System Settings Tile Skeleton */}
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-[#141B24] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-700/60" />
            <div className="space-y-1.5">
              <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700/60" />
              <div className="h-3 w-52 rounded bg-slate-200/80 dark:bg-slate-800/60" />
            </div>
          </div>
          <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-700/60" />
        </div>

        {/* Security Box Skeleton */}
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-[#141B24] border border-slate-200 dark:border-white/[0.06] space-y-3">
          <div className="h-3 w-36 rounded bg-slate-200 dark:bg-slate-700/60" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="h-14 rounded-xl bg-slate-200/70 dark:bg-slate-800/60" />
            <div className="h-14 rounded-xl bg-slate-200/70 dark:bg-slate-800/60" />
          </div>
        </div>

        {/* Shortcuts Skeleton */}
        <div className="space-y-2">
          <div className="h-14 rounded-2xl bg-slate-100 dark:bg-[#141B24] border border-slate-200 dark:border-white/[0.06]" />
          <div className="h-14 rounded-2xl bg-slate-100 dark:bg-[#141B24] border border-slate-200 dark:border-white/[0.06]" />
          <div className="h-14 rounded-2xl bg-slate-100 dark:bg-[#141B24] border border-slate-200 dark:border-white/[0.06]" />
        </div>
      </div>
    </div>
  );
};
