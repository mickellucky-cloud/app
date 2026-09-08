import React from 'react';
import { MarketPair } from '../../types';
import {
  Search,
  Bell,
  Headphones,
  BellRing,
  Plus,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface DesktopTopBarProps {
  onOpenSearch: () => void;
  onOpenDeposit: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  onOpenPriceAlerts: () => void;
  activeAlertsCount?: number;
  onOpenSupport: () => void;
  onOpenProfile: () => void;
  userEmail: string;
  selectedPair?: MarketPair;
}

export const DesktopTopBar: React.FC<DesktopTopBarProps> = ({
  onOpenSearch,
  onOpenDeposit,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  onOpenPriceAlerts,
  activeAlertsCount = 0,
  onOpenSupport,
  onOpenProfile,
  userEmail,
  selectedPair,
}) => {
  return (
    <header
      id="desktop-top-utility-bar"
      className="hidden md:flex items-center justify-between px-6 lg:px-8 h-16 bg-[#090C14]/90 backdrop-blur-md border-b border-white/[0.06] sticky top-0 z-30 flex-shrink-0"
    >
      {/* Left: Quick Search Input & Market quick ticker */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          onClick={onOpenSearch}
          className="flex-1 flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#0D111A] hover:bg-[#121724] border border-white/[0.08] hover:border-white/15 transition-all text-xs text-slate-400 group text-left shadow-inner"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-400 transition-colors" />
            <span className="truncate">Search pairs, tokens, features...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900 rounded border border-white/10">
            ⌘K
          </kbd>
        </button>

        {selectedPair && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/50 border border-white/[0.05] text-xs">
            <span className="font-bold text-white">{selectedPair.baseSymbol}/{selectedPair.quoteSymbol}</span>
            <span className="font-mono-num font-semibold text-white">
              ${selectedPair.price >= 1000 ? selectedPair.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : selectedPair.price.toFixed(4)}
            </span>
            <span className={`text-[10px] font-mono font-bold ${selectedPair.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {selectedPair.change24h >= 0 ? '+' : ''}{selectedPair.change24h.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {/* Right: Network Status, Quick Actions, Alerts, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Network Status Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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

        {/* Price Alerts */}
        <button
          onClick={onOpenPriceAlerts}
          className="relative p-2 rounded-xl bg-[#0D111A] hover:bg-[#121724] border border-white/[0.07] text-slate-300 hover:text-white transition-all"
          title="Price Alerts"
          aria-label="Price Alerts"
        >
          <BellRing className="w-4 h-4" />
          {activeAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[9px] flex items-center justify-center">
              {activeAlertsCount}
            </span>
          )}
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-[#0D111A] hover:bg-[#121724] border border-white/[0.07] text-slate-300 hover:text-white transition-all"
          title="Notifications"
          aria-label="Notifications"
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
          className="p-2 rounded-xl bg-[#0D111A] hover:bg-[#121724] border border-white/[0.07] text-slate-300 hover:text-white transition-all"
          title="24/7 VIP AI Concierge"
          aria-label="24/7 VIP AI Concierge"
        >
          <Headphones className="w-4 h-4 text-purple-400" />
        </button>

        {/* User Avatar */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl bg-[#0D111A] hover:bg-[#121724] border border-white/[0.07] transition-all ml-1"
          title="Profile & Settings"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>
    </header>
  );
};
