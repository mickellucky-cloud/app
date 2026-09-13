import React from 'react';

export const SettingsSkeleton: React.FC<{ onBack?: () => void }> = () => {
  return (
    <div
      id="settings-screen-skeleton"
      aria-busy="true"
      aria-label="Loading settings interface"
      className="min-h-screen bg-slate-50 dark:bg-[#07090E] p-4 sm:p-6 lg:p-8 animate-pulse text-[#0F172A] dark:text-[#EDF1F5]"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="space-y-1.5">
              <div className="h-6 w-36 rounded-lg bg-slate-200 dark:bg-slate-700/60" />
              <div className="h-3 w-56 rounded bg-slate-200/60 dark:bg-slate-800/60" />
            </div>
          </div>
          <div className="h-10 w-full sm:w-64 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/70 dark:border-white/[0.06]">
          {['Account', 'Security', 'Preferences', 'Notifications', 'Sessions', 'API Keys'].map(
            (cat) => (
              <div
                key={cat}
                className="h-9 w-24 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0"
              />
            )
          )}
        </div>

        {/* Main Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Account Profile Summary Card */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0D101C] border border-slate-200/80 dark:border-white/[0.06] space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700/60" />
                  <div className="h-3 w-36 rounded bg-slate-200/60 dark:bg-slate-800/60" />
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/[0.04]">
                <div className="flex justify-between">
                  <div className="h-3 w-16 rounded bg-slate-200/60 dark:bg-slate-800" />
                  <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700/60" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3 w-16 rounded bg-slate-200/60 dark:bg-slate-800" />
                  <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700/60" />
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D101C] border border-slate-200/80 dark:border-white/[0.06] space-y-3">
              <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700/60" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800/50"
                />
              ))}
            </div>
          </div>

          {/* Right Column: Settings Sections / Options */}
          <div className="lg:col-span-2 space-y-4">
            {/* Setting Section 1 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0D101C] border border-slate-200/80 dark:border-white/[0.06] space-y-4">
              <div className="h-5 w-40 rounded-lg bg-slate-200 dark:bg-slate-700/60" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]"
                  >
                    <div className="space-y-1.5">
                      <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700/60" />
                      <div className="h-3 w-48 rounded bg-slate-200/60 dark:bg-slate-800/60" />
                    </div>
                    <div className="h-6 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>
                ))}
              </div>
            </div>

            {/* Setting Section 2 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0D101C] border border-slate-200/80 dark:border-white/[0.06] space-y-4">
              <div className="h-5 w-36 rounded-lg bg-slate-200 dark:bg-slate-700/60" />
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]"
                  >
                    <div className="space-y-1.5">
                      <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700/60" />
                      <div className="h-3 w-40 rounded bg-slate-200/60 dark:bg-slate-800/60" />
                    </div>
                    <div className="h-8 w-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
