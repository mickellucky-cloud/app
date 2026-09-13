import React, { useState } from 'react';
import { MainTab, MarketPair, ThemeMode, AppNotification } from '../../types';
import {
  Search,
  Bell,
  ScanLine,
  ChevronLeft,
  ChevronDown,
  Sun,
  Moon,
  Headphones,
  Plus,
  Star,
  ShieldCheck,
} from 'lucide-react';
import { OKNexusLogo } from '../common/OKNexusLogo';
import { NotificationsDropdown } from './NotificationsDropdown';

interface MobileTopBarProps {
  activeTab: MainTab | 'p2p';
  onSelectTab: (tab: MainTab | 'p2p') => void;
  onBack?: () => void;
  onOpenSearch: () => void;
  onOpenDeposit: () => void;
  onOpenScanToPay?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  notifications?: AppNotification[];
  onMarkNotificationAsRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
  onOpenPriceAlerts?: (pair?: MarketPair) => void;
  activeAlertsCount?: number;
  onOpenSupport: () => void;
  onOpenProfile: () => void;
  userEmail: string;
  username?: string;
  userAvatar?: string;
  selectedPair?: MarketPair;
  onOpenPairSelector?: () => void;
  onToggleFavorite?: (symbol: string) => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  activeTab,
  onSelectTab,
  onBack,
  onOpenSearch,
  onOpenDeposit,
  onOpenScanToPay,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  notifications = [],
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onOpenPriceAlerts,
  activeAlertsCount = 0,
  onOpenSupport,
  onOpenProfile,
  userEmail,
  username = 'Mickel_Lucky',
  userAvatar = '',
  selectedPair,
  onOpenPairSelector,
  onToggleFavorite,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Determine if current view is a detail / sub-screen that should have a back button
  const isSubScreen = ['profile', 'settings', 'support', 'explore', 'analytics', 'more'].includes(activeTab);

  const getSubScreenTitle = (tab: MainTab | 'p2p') => {
    switch (tab) {
      case 'profile':
        return 'Profile & Security';
      case 'settings':
        return 'Settings';
      case 'support':
        return '24/7 VIP Concierge';
      case 'explore':
        return 'Explore Web3';
      case 'analytics':
        return 'Portfolio Analytics';
      case 'more':
        return 'All Services & Tools';
      case 'p2p':
        return 'P2P Escrow Trading';
      default:
        return 'OKNexus';
    }
  };

  // Dedicated Trade Screen Header Mode
  if (activeTab === 'trade' && selectedPair) {
    return (
      <header
        id="mobile-trade-topbar"
        className="flex md:hidden items-center justify-between px-3.5 h-14 bg-white/95 dark:bg-[#090C14]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.08] sticky top-0 z-30 flex-shrink-0 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 shrink-0 active:scale-95 transition-transform"
            aria-label="User Profile"
          >
            <div className="w-full h-full rounded-full bg-white dark:bg-[#0E141B] flex items-center justify-center overflow-hidden">
              {userAvatar ? (
                <img src={userAvatar} alt={username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-[11px] font-bold text-purple-600">
                  {username.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
          </button>

          {/* Pair Selector trigger */}
          <button
            id="mobile-pair-selector-btn"
            type="button"
            onClick={onOpenPairSelector}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 active:scale-95 transition-all text-xs font-bold text-slate-900 dark:text-white"
          >
            <span>{selectedPair.symbol}</span>
            <span
              className={`text-[11px] font-mono-num font-bold px-1.5 py-0.2 rounded-md ${
                selectedPair.change24h >= 0
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
              }`}
            >
              {selectedPair.change24h >= 0 ? '+' : ''}
              {selectedPair.change24h.toFixed(2)}%
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Right Actions: Watchlist star & Price alert bell */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onToggleFavorite && (
            <button
              type="button"
              onClick={() => onToggleFavorite(selectedPair.symbol)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white active:scale-95 transition-all"
              aria-label="Toggle Watchlist"
            >
              <Star
                className={`w-4 h-4 ${
                  selectedPair.isFavorite
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                    : 'text-slate-400'
                }`}
              />
            </button>
          )}

          {onOpenPriceAlerts && (
            <button
              type="button"
              onClick={() => onOpenPriceAlerts(selectedPair)}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white active:scale-95 transition-all"
              aria-label="Set Price Alert"
            >
              <Bell className="w-4 h-4" />
              {activeAlertsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-600 ring-2 ring-white dark:ring-[#090C14]" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onOpenSearch}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white active:scale-95 transition-all"
            aria-label="Search Markets"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </header>
    );
  }

  // Sub-screen Mode (Profile, Settings, Support, Explore, Analytics)
  if (isSubScreen) {
    return (
      <header
        id="mobile-subscreen-topbar"
        className="flex md:hidden items-center justify-between px-3.5 h-14 bg-white/95 dark:bg-[#090C14]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.08] sticky top-0 z-30 flex-shrink-0 transition-colors"
      >
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 py-1.5 px-2.5 -ml-1 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all font-semibold text-xs"
          aria-label="Go Back"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight text-center truncate px-2">
          {getSubScreenTitle(activeTab)}
        </h2>

        <div className="flex items-center gap-1">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>
          )}

          {activeTab !== 'support' && (
            <button
              type="button"
              onClick={onOpenSupport}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
              aria-label="VIP Support"
            >
              <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </button>
          )}
        </div>
      </header>
    );
  }

  // Primary Tabs Mode (Home, Market, Earn, Assets)
  return (
    <header
      id="mobile-main-topbar"
      className="flex md:hidden items-center justify-between gap-2.5 px-3.5 h-14 bg-white/95 dark:bg-[#090C14]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.08] sticky top-0 z-30 flex-shrink-0 transition-colors"
    >
      {/* Left: User Avatar & Quick Tab Badge */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          id="mobile-topbar-profile-btn"
          type="button"
          onClick={onOpenProfile}
          className="relative w-9 h-9 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 shrink-0 active:scale-95 transition-transform"
          aria-label="Open User Profile"
          title={`@${username} • Profile & Settings`}
        >
          <div className="w-full h-full rounded-full bg-white dark:bg-[#0E141B] flex items-center justify-center overflow-hidden">
            {userAvatar ? (
              <img src={userAvatar} alt={username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-xs font-bold text-purple-600">
                {username.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          {/* Online green indicator */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#090C14]" />
        </button>

        {activeTab !== 'home' && (
          <span className="hidden min-[380px]:inline-block font-display text-sm font-bold text-slate-900 dark:text-white capitalize">
            {activeTab}
          </span>
        )}
      </div>

      {/* Center: Clean, Full-Width Search Input Pill */}
      <button
        id="mobile-topbar-search-pill"
        type="button"
        onClick={onOpenSearch}
        className="flex-1 flex items-center gap-2 h-9 px-3 rounded-full bg-slate-100 hover:bg-slate-200/70 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 transition-all text-left shadow-2xs group"
        aria-label="Search crypto tokens, markets, features"
      >
        <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors shrink-0" />
        <span className="truncate text-[12px]">Search BTC, ETH, pairs...</span>
      </button>

      {/* Right: Only 2 essential, well-spaced actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Notifications Button with Dropdown */}
        <div className="relative">
          <button
            id="mobile-topbar-notifications-btn"
            type="button"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
              isNotificationsOpen || unreadNotificationsCount > 0
                ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
            }`}
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[15px] h-3.5 px-0.5 rounded-full bg-purple-600 text-white text-[9px] font-mono-num font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#090C14]">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Anchored Dropdown */}
          <NotificationsDropdown
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            notifications={notifications}
            onMarkAsRead={(id) => onMarkNotificationAsRead?.(id)}
            onMarkAllAsRead={() => onMarkAllNotificationsAsRead?.()}
            onOpenPriceAlerts={onOpenPriceAlerts}
            activeAlertsCount={activeAlertsCount}
            align="right"
            className="right-0"
          />
        </div>

        {/* Scan to Pay (if on Home) or Quick Deposit / Theme */}
        {onOpenScanToPay && activeTab === 'home' ? (
          <button
            id="mobile-topbar-scan-btn"
            type="button"
            onClick={onOpenScanToPay}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
            aria-label="Scan to Pay QR"
            title="Scan to Pay QR"
          >
            <ScanLine className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </button>
        ) : (
          <button
            id="mobile-topbar-deposit-btn"
            type="button"
            onClick={onOpenDeposit}
            className="px-2.5 py-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-500 font-bold text-xs flex items-center gap-1 active:scale-95 transition-all shadow-xs"
            aria-label="Deposit"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Deposit</span>
          </button>
        )}
      </div>
    </header>
  );
};
