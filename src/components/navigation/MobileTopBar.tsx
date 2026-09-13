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
} from 'lucide-react';
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
  username = 'Mickel_Lucky',
  userAvatar = '',
  selectedPair,
  onOpenPairSelector,
  onToggleFavorite,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleNotificationsClick = () => {
    if (onOpenNotifications) {
      onOpenNotifications();
    } else {
      setIsNotificationsOpen((prev) => !prev);
    }
  };

  /* =========================================================================
     1. HOME NAV BAR:
     profile Icon, search bar, scan, notifican, live chat
     ========================================================================= */
  if (activeTab === 'home') {
    return (
      <header
        id="mobile-home-topbar"
        className="flex md:hidden items-center justify-between gap-1.5 px-2.5 sm:px-3 h-14 bg-white/95 dark:bg-[#0A0E13]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.08] sticky top-0 z-30 flex-shrink-0 transition-colors"
      >
        {/* Profile Icon */}
        <button
          id="mobile-home-profile-btn"
          type="button"
          onClick={onOpenProfile}
          className="relative w-9 h-9 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 shrink-0 active:scale-95 transition-transform"
          aria-label="User Profile"
          title={`@${username} • Profile & Security`}
        >
          <div className="w-full h-full rounded-full bg-white dark:bg-[#0E141B] flex items-center justify-center overflow-hidden">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={username}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                {username.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#090C14]" />
        </button>

        {/* Search Bar */}
        <button
          id="mobile-home-search-bar"
          type="button"
          onClick={onOpenSearch}
          className="flex-1 min-w-0 flex items-center gap-2 h-9 px-2.5 sm:px-3 rounded-full bg-slate-100 hover:bg-slate-200/70 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 transition-all text-left shadow-2xs group"
          aria-label="Search crypto tokens, markets, features"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors shrink-0" />
          <span className="truncate text-[11px] min-[360px]:text-xs">Search BTC, ETH, pairs...</span>
        </button>

        {/* Right Actions: Scan, Notification, Live Chat */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Scan */}
          <button
            id="mobile-home-scan-btn"
            type="button"
            onClick={onOpenScanToPay}
            className="w-8.5 h-8.5 min-[360px]:w-9 min-[360px]:h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
            aria-label="Scan QR Code"
            title="Scan QR Code"
          >
            <ScanLine className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </button>

          {/* Notifican (Notification) */}
          <div className="relative">
            <button
              id="mobile-home-notifications-btn"
              type="button"
              onClick={handleNotificationsClick}
              className={`relative w-8.5 h-8.5 min-[360px]:w-9 min-[360px]:h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                isNotificationsOpen || unreadNotificationsCount > 0
                  ? 'text-purple-600 dark:text-purple-300 bg-purple-500/10'
                  : 'text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
              }`}
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[14px] h-3.5 px-0.5 rounded-full bg-purple-600 text-white text-[9px] font-mono-num font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#090C14]">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Fallback Anchored Dropdown (if onOpenNotifications modal is not provided) */}
            {!onOpenNotifications && (
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
            )}
          </div>

          {/* Live Chat */}
          <button
            id="mobile-home-livechat-btn"
            type="button"
            onClick={onOpenSupport}
            className="relative w-8.5 h-8.5 min-[360px]:w-9 min-[360px]:h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
            aria-label="Live Chat Support"
            title="24/7 VIP Live Chat"
          >
            <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-[#0A0E13]" />
          </button>
        </div>
      </header>
    );
  }

  /* =========================================================================
     2. OTHER MOBILE PAGES:
     back icon, name of page, and any other relevant icon to the page
     ========================================================================= */

  // Page title mapping
  const getPageTitle = (tab: MainTab | 'p2p') => {
    switch (tab) {
      case 'market':
        return 'Markets';
      case 'trade':
        return selectedPair ? selectedPair.symbol : 'Spot Trading';
      case 'earn':
        return 'OKNexus Earn';
      case 'assets':
        return 'Assets & Wallet';
      case 'analytics':
        return 'Portfolio Analytics';
      case 'explore':
        return 'Explore Web3';
      case 'more':
        return 'All Services';
      case 'profile':
        return 'Profile & Security';
      case 'settings':
        return 'Settings';
      case 'support':
        return 'Live Support (24/7)';
      case 'p2p':
        return 'P2P Trading';
      default:
        return 'OKNexus';
    }
  };

  // Render page-specific relevant action icon(s)
  const renderRelevantIcons = () => {
    switch (activeTab) {
      // 1. Markets: Search tokens & Notifications
      case 'market':
        return (
          <>
            <button
              id="mobile-market-search-btn"
              type="button"
              onClick={onOpenSearch}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
              aria-label="Search Markets"
              title="Search Markets"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              id="mobile-market-notif-btn"
              type="button"
              onClick={handleNotificationsClick}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-600 ring-1.5 ring-white dark:ring-[#090C14]" />
              )}
            </button>
          </>
        );

      // 2. Spot Trading: Favorite Star, Price Alert Bell, Search Pairs
      case 'trade':
        return (
          <>
            {onToggleFavorite && selectedPair && (
              <button
                id="mobile-trade-fav-btn"
                type="button"
                onClick={() => onToggleFavorite(selectedPair.symbol)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white active:scale-95 transition-all"
                aria-label="Toggle Watchlist"
                title="Add to Watchlist"
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
            {onOpenPriceAlerts && selectedPair && (
              <button
                id="mobile-trade-alert-btn"
                type="button"
                onClick={() => onOpenPriceAlerts(selectedPair)}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white active:scale-95 transition-all"
                aria-label="Set Price Alert"
                title="Set Price Alert"
              >
                <Bell className="w-4 h-4" />
                {activeAlertsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-600 ring-2 ring-white dark:ring-[#090C14]" />
                )}
              </button>
            )}
            <button
              id="mobile-trade-search-btn"
              type="button"
              onClick={onOpenSearch}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white active:scale-95 transition-all"
              aria-label="Search Markets"
              title="Search Pairs"
            >
              <Search className="w-4 h-4" />
            </button>
          </>
        );

      // 3. Earn: Search pools & Live Chat Support
      case 'earn':
        return (
          <>
            <button
              id="mobile-earn-search-btn"
              type="button"
              onClick={onOpenSearch}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
              aria-label="Search Earn Products"
              title="Search Earn Staking"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              id="mobile-earn-support-btn"
              type="button"
              onClick={onOpenSupport}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
              aria-label="VIP Support"
              title="Earn Concierge Support"
            >
              <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-[#0A0E13]" />
            </button>
          </>
        );

      // 4. Assets: Quick Deposit & Live Chat Support
      case 'assets':
        return (
          <>
            <button
              id="mobile-assets-deposit-btn"
              type="button"
              onClick={onOpenDeposit}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-600 hover:bg-purple-500 text-white active:scale-95 transition-all shadow-2xs"
              aria-label="Quick Deposit"
              title="Deposit Crypto / Cash"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              id="mobile-assets-support-btn"
              type="button"
              onClick={onOpenSupport}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
              aria-label="Asset Inquiries & Support"
              title="24/7 Asset Support"
            >
              <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-[#0A0E13]" />
            </button>
          </>
        );

      // 5. Explore: Search Web3 & Live Chat
      case 'explore':
        return (
          <>
            <button
              id="mobile-explore-search-btn"
              type="button"
              onClick={onOpenSearch}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
              aria-label="Search Ecosystem"
              title="Search Web3 Ecosystem"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              id="mobile-explore-support-btn"
              type="button"
              onClick={onOpenSupport}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
              aria-label="VIP Concierge"
              title="Web3 Support"
            >
              <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-[#0A0E13]" />
            </button>
          </>
        );

      // 6. Analytics: Theme Toggle & Live Chat
      case 'analytics':
        return (
          <>
            {onToggleTheme && (
              <button
                id="mobile-analytics-theme-btn"
                type="button"
                onClick={onToggleTheme}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
                aria-label="Toggle Theme"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
              </button>
            )}
            <button
              id="mobile-analytics-support-btn"
              type="button"
              onClick={onOpenSupport}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
              aria-label="Analytics Consultation"
              title="Trader Inquiries"
            >
              <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-[#0A0E13]" />
            </button>
          </>
        );

      // 7. All Services / More: Search Tools & Live Chat
      case 'more':
        return (
          <>
            <button
              id="mobile-more-search-btn"
              type="button"
              onClick={onOpenSearch}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
              aria-label="Search Services"
              title="Search Tools & Services"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              id="mobile-more-support-btn"
              type="button"
              onClick={onOpenSupport}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
              aria-label="Customer Support"
              title="24/7 VIP Helpdesk"
            >
              <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-[#0A0E13]" />
            </button>
          </>
        );

      // 8. Profile & Security: Theme Toggle & Live Chat
      case 'profile':
        return (
          <>
            {onToggleTheme && (
              <button
                id="mobile-profile-theme-btn"
                type="button"
                onClick={onToggleTheme}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
                aria-label="Toggle Theme"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
              </button>
            )}
            <button
              id="mobile-profile-support-btn"
              type="button"
              onClick={onOpenSupport}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
              aria-label="VIP Concierge"
              title="VIP Account Support"
            >
              <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-[#0A0E13]" />
            </button>
          </>
        );

      // 9. Settings: Theme Toggle & Live Chat
      case 'settings':
        return (
          <>
            {onToggleTheme && (
              <button
                id="mobile-settings-theme-btn"
                type="button"
                onClick={onToggleTheme}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
                aria-label="Toggle Theme"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
              </button>
            )}
            <button
              id="mobile-settings-support-btn"
              type="button"
              onClick={onOpenSupport}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
              aria-label="Security Helpdesk"
              title="Security Concierge"
            >
              <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-[#0A0E13]" />
            </button>
          </>
        );

      // 10. Live Support Center: Search FAQs & Theme Toggle
      case 'support':
        return (
          <>
            <button
              id="mobile-support-search-btn"
              type="button"
              onClick={onOpenSearch}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
              aria-label="Search Help Center"
              title="Search Help Articles"
            >
              <Search className="w-4 h-4" />
            </button>
            {onToggleTheme && (
              <button
                id="mobile-support-theme-btn"
                type="button"
                onClick={onToggleTheme}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
                aria-label="Toggle Theme"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
              </button>
            )}
          </>
        );

      // 11. P2P Escrow Trading: Theme Toggle & Live Chat
      case 'p2p':
        return (
          <>
            {onToggleTheme && (
              <button
                id="mobile-p2p-theme-btn"
                type="button"
                onClick={onToggleTheme}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
                aria-label="Toggle Theme"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
              </button>
            )}
            <button
              id="mobile-p2p-support-btn"
              type="button"
              onClick={onOpenSupport}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all"
              aria-label="P2P Dispute & Support"
              title="P2P Support"
            >
              <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-[#0A0E13]" />
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <header
      id="mobile-other-topbar"
      className="flex md:hidden items-center justify-between gap-2 px-2.5 sm:px-3 h-14 bg-white/95 dark:bg-[#0A0E13]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.08] sticky top-0 z-30 flex-shrink-0 transition-colors"
    >
      {/* 1. Back Icon */}
      <div className="flex items-center justify-start shrink-0">
        <button
          id="mobile-page-back-btn"
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 py-1.5 px-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all font-semibold text-xs -ml-1"
          aria-label="Go Back"
          title="Back"
        >
          <ChevronLeft className="w-5 h-5 shrink-0 text-slate-600 dark:text-slate-300" />
          <span className="hidden min-[400px]:inline text-xs font-semibold">Back</span>
        </button>
      </div>

      {/* 2. Name of Page (Interactive pair selector for Trade, or clear page title) */}
      <div className="flex-1 min-w-0 flex items-center justify-center px-1">
        {activeTab === 'trade' && selectedPair ? (
          <button
            id="mobile-trade-pair-selector-btn"
            type="button"
            onClick={onOpenPairSelector}
            className="min-w-0 max-w-full flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 active:scale-95 transition-all text-xs font-bold text-slate-900 dark:text-white"
            aria-label="Select Trading Pair"
            title="Change Trading Pair"
          >
            <span className="truncate">{selectedPair.symbol}</span>
            <span
              className={`shrink-0 text-[10px] font-mono-num font-bold px-1.5 py-0.5 rounded-md ${
                selectedPair.change24h >= 0
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
              }`}
            >
              {selectedPair.change24h >= 0 ? '+' : ''}
              {selectedPair.change24h.toFixed(2)}%
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>
        ) : (
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight text-center truncate">
            {getPageTitle(activeTab)}
          </h2>
        )}
      </div>

      {/* 3. Any Other Relevant Icon to the Page */}
      <div className="flex items-center justify-end gap-1 shrink-0">
        {renderRelevantIcons()}
      </div>
    </header>
  );
};
