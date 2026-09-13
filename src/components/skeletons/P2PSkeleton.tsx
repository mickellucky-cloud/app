import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface P2PSkeletonProps {
  onExit?: () => void;
}

export const P2PSkeleton: React.FC<P2PSkeletonProps> = ({ onExit }) => {
  return (
    <div
      id="p2p-screen-skeleton"
      aria-busy="true"
      aria-label="Loading peer-to-peer trading"
      className="pb-32 md:pb-12 pt-3 px-4 sm:px-6 lg:px-8 max-w-md md:max-w-4xl lg:max-w-7xl mx-auto min-h-screen space-y-4 animate-pulse"
    >
      {/* Top Header Skeleton */}
      <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-white/[0.06]">
        <div className="flex items-center gap-3">
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="space-y-1">
            <div className="h-5 w-32 rounded bg-slate-200 dark:bg-slate-700/60" />
            <div className="h-3 w-48 rounded bg-slate-100 dark:bg-slate-800/60" />
          </div>
        </div>

        {/* Buy/Sell toggle pill */}
        <div className="flex bg-slate-200 dark:bg-slate-800/80 rounded-xl p-1 gap-1">
          <div className="h-7 w-16 rounded-lg bg-emerald-500/20" />
          <div className="h-7 w-16 rounded-lg bg-slate-300 dark:bg-slate-700/60" />
        </div>
      </div>

      {/* Filter and Currency Bar Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.04]">
        <div className="flex items-center gap-2">
          {['USDT', 'BTC', 'ETH'].map((c) => (
            <div
              key={c}
              className="h-7 w-16 rounded-full bg-slate-200 dark:bg-slate-800/70"
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 rounded-xl bg-slate-200 dark:bg-slate-800/70" />
          <div className="h-8 w-24 rounded-xl bg-slate-200 dark:bg-slate-800/70" />
        </div>
      </div>

      {/* P2P Merchant Ads List Skeleton */}
      <div className="space-y-3 pt-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={`p2p-skel-${index}`}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.05] space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800/80" />
                <div className="space-y-1">
                  <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700/60" />
                  <div className="h-3 w-36 rounded bg-slate-100 dark:bg-slate-800/50" />
                </div>
              </div>
              <div className="h-4 w-20 rounded bg-slate-200/80 dark:bg-slate-800/60" />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-white/[0.04]">
              <div className="space-y-1">
                <div className="h-3 w-16 rounded bg-slate-200/60 dark:bg-slate-800/50" />
                <div className="h-6 w-28 rounded bg-slate-200 dark:bg-slate-700/60" />
              </div>
              <div className="h-9 w-24 rounded-xl bg-purple-500/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
