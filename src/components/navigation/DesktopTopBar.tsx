import React from 'react';
import { MarketPair, ThemeMode } from '../../types';
import {
  Search,
  Bell,
  Headphones,
  Plus,
  ShieldCheck,
  Settings,
} from 'lucide-react';

interface DesktopTopBarProps {
  onOpenSearch: () => void;
  onOpenDeposit: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  onOpenPriceAlerts?: () => void;
  activeAlertsCount?: number;
  onOpenSupport: () => void;
  onOpenProfile: (tab?: 'profile' | 'system_settings') => void;
  userEmail: string;
  username?: string;
  userAvatar?: string;
  selectedPair?: MarketPair;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}

export const DesktopTopBar: React.FC<DesktopTopBarProps> = ({
  onOpenSearch,
  onOpenDeposit,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  onOpenSupport,
  onOpenProfile,
  userEmail,
  username = 'Mickel_Lucky',
  userAvatar = '',
  selectedPair,
  theme = 'dark',
  onToggleTheme,
}) => {
  return (
    <header
      id="desktop-top-utility-bar"
      className="hidden md:flex items-center justify-between px-6 lg:px-8 h-16 bg-white/95 dark:bg-[#090C14]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/[0.06] sticky top-0 z-30 flex-shrink-0"
    >
      {/* Left: Quick Search Input & Market quick ticker */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          onClick={onOpenSearch}
          className="flex-1 flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200 hover:border-slate-300 dark:bg-[#0D111A] dark:hover:bg-[#121724] dark:border-white/[0.08] dark:hover:border-white/15 transition-all text-xs text-slate-600 dark:text-slate-400 group text-left shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
            <span className="truncate">Search pairs, tokens, features...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 bg-white border border-slate-200 dark:text-slate-400 dark:bg-slate-900 dark:border-white/10 rounded">
            ⌘K
          </kbd>
        </button>

        {selectedPair && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-900/50 dark:border-white/[0.05] text-xs">
            <span className="font-bold text-slate-900 dark:text-white">{selectedPair.base}/{selectedPair.quote}</span>
            <span className="font-mono-num font-semibold text-slate-900 dark:text-white">
              ${selectedPair.price >= 1000 ? selectedPair.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : selectedPair.price.toFixed(4)}
            </span>
            <span className={`text-[10px] font-mono font-bold ${selectedPair.change24h >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {selectedPair.change24h >= 0 ? '+' : ''}{selectedPair.change24h.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {/* Right: Network Status, Deposit, Single Notifications Icon, AI Concierge, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Network Status Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          <span>99.99% Uptime</span>
        </div>

        {/* Deposit Button */}
        <button
          onClick={onOpenDeposit}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xs shadow-[0_2px_12px_rgba(168,85,247,0.3)] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Deposit</span>
        </button>

        {/* Single Unified Notifications Button (No duplicate bell) */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-[#0D111A] dark:hover:bg-[#121724] dark:border-white/[0.07] dark:text-slate-300 dark:hover:text-white transition-all"
          title="Notifications & Alerts"
          aria-label="Notifications and Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center shadow-[0_0_8px_rgba(168,85,247,0.8)]">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* 24/7 AI Concierge */}
        <button
          onClick={onOpenSupport}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-[#0D111A] dark:hover:bg-[#121724] dark:border-white/[0.07] dark:text-slate-300 dark:hover:text-white transition-all"
          title="24/7 VIP AI Concierge"
          aria-label="24/7 VIP AI Concierge"
        >
          <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        </button>

        {/* System Settings & Preferences */}
        <button
          id="desktop-settings-trigger-btn"
          onClick={() => onOpenProfile('system_settings')}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-[#0D111A] dark:hover:bg-[#121724] dark:border-white/[0.07] dark:text-slate-300 dark:hover:text-white transition-all"
          title="System Settings & Theme"
          aria-label="System Settings & Theme"
        >
          <Settings className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        </button>

        {/* User Avatar & Identity */}
        <button
          onClick={() => onOpenProfile('profile')}
          className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 dark:bg-[#0D111A] dark:hover:bg-[#121724] dark:border-white/[0.07] transition-all ml-1"
          title={`@${username} • Profile & Settings`}
        >
          <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-tr from-purple-600 to-amber-400 p-[1.5px] shadow-sm flex-shrink-0">
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-950 flex items-center justify-center overflow-hidden">
              {userAvatar ? (
                <img src={userAvatar} alt={username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-white text-xs font-bold">
                  {username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <span className="hidden xl:inline text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
            @{username}
          </span>
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
        </button>
      </div>
    </header>
  );
};
