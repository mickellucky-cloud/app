import React, { useState } from 'react';
import { OKNexusLogo, OKNexusBadge3D } from '../common/OKNexusLogo';
import { CoinIcon } from '../common/CoinIcon';
import { Sparkline } from '../common/Sparkline';
import { FeatureGridSkeleton } from './FeatureGridSkeleton';
import { MarketListSkeleton } from './MarketListSkeleton';
import { CryptoNewsSection } from './CryptoNewsSection';
import { PromotionalBannerCarousel } from './PromotionalBannerCarousel';
import { MarketPair, RecentActivityItem, ThemeMode } from '../../types';
import {
  Search,
  Bell,
  Eye,
  EyeOff,
  PlusSquare,
  ArrowUpRight,
  Send,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  BellRing,
  BarChart2,
  CandlestickChart,
  Repeat,
  CreditCard,
  Users2,
  Wallet,
  Coins,
  LayoutGrid,
  Headphones,
  Compass,
  LineChart,
  ScanLine,
} from 'lucide-react';

interface HomeScreenProps {
  balances: {
    totalAssets: number;
    pnl24hUsd: number;
    pnl24hPct: number;
  };
  marketPairs: MarketPair[];
  recentActivities: RecentActivityItem[];
  showBalances: boolean;
  onToggleShowBalances: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenSend: () => void;
  onOpenConvert: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  onOpenProfile: () => void;
  onOpenScanToPay?: () => void;
  onOpenAiTrader: () => void;
  onOpenPolymarket: () => void;
  onOpenPriceAlerts?: () => void;
  activeAlertsCount?: number;
  onSelectPair: (pair: MarketPair) => void;
  onNavigateMarkets: () => void;
  onNavigateTrade: () => void;
  onNavigateWallet: () => void;
  onNavigateEarn: () => void;
  onNavigateP2P: () => void;
  onNavigateExplore?: () => void;
  onNavigateAnalytics?: () => void;
  onOpenBuySell: () => void;
  onOpenMore: () => void;
  onOpenSupport?: () => void;
  isLoading?: boolean;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  username?: string;
  userAvatar?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  balances,
  marketPairs,
  recentActivities,
  showBalances,
  onToggleShowBalances,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenSend,
  onOpenConvert,
  onOpenSearch,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  onOpenProfile,
  onOpenScanToPay,
  onOpenAiTrader,
  onOpenPolymarket,
  onOpenPriceAlerts,
  activeAlertsCount = 0,
  onSelectPair,
  onNavigateMarkets,
  onNavigateTrade,
  onNavigateWallet,
  onNavigateEarn,
  onNavigateP2P,
  onNavigateExplore,
  onNavigateAnalytics,
  onOpenBuySell,
  onOpenMore,
  onOpenSupport,
  isLoading = false,
  theme = 'dark',
  onToggleTheme,
  username = 'Mickel_Lucky',
  userAvatar = '',
}) => {
  const [marketTab, setMarketTab] = useState<'hot' | 'gainers' | 'new' | 'losers'>('hot');

  const favoritePairsList = React.useMemo(
    () => marketPairs.filter((p) => p.isFavorite),
    [marketPairs]
  );

  const filteredMarkets = marketPairs
    .filter((pair) => {
      if (marketTab === 'hot') return pair.category === 'hot' || pair.symbol.includes('BTC') || pair.symbol.includes('ETH');
      if (marketTab === 'gainers') return pair.change24h > 0;
      if (marketTab === 'new') return pair.category === 'new' || pair.symbol.includes('OKN');
      if (marketTab === 'losers') return pair.change24h < 0;
      return true;
    })
    .slice(0, 4);

  return (
    <div id="home-screen" className="pb-28 md:pb-12 pt-3 px-3 sm:px-6 lg:px-8 max-w-md md:max-w-4xl lg:max-w-7xl mx-auto min-h-screen text-[#0F172A] dark:text-[#EDF1F5] bg-white dark:bg-[#0A0E13] transition-colors">
      {/* Top Header - Shown on mobile, hidden on tablet/desktop where DesktopTopNav is present */}
      <header className="flex md:hidden items-center justify-between py-2 mb-3 gap-1.5 sm:gap-2 w-full min-w-0">
        {/* Left: Profile Icon & Username (replaces OKNexus logo per user requirement) */}
        <button
          id="home-mobile-profile-btn"
          onClick={onOpenProfile}
          className="flex items-center gap-2 active:scale-95 transition-transform shrink-0"
          aria-label="User profile and settings"
          title={`@${username} • Profile & Settings`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] via-[#EC4899] to-[#F59E0B] p-[1.5px] shadow-xs">
            <div className="w-full h-full rounded-full bg-white dark:bg-[#0E141B] flex items-center justify-center overflow-hidden">
              {userAvatar ? (
                <img src={userAvatar} alt={username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="font-display text-[11px] font-bold text-[#8B5CF6]">
                  {username.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <div className="hidden min-[360px]:flex flex-col text-left">
            <span className="text-xs font-bold text-[#0F172A] dark:text-[#EDF1F5] leading-tight max-w-[90px] truncate">
              @{username}
            </span>
            <span className="text-[10px] text-[#10B981] font-semibold leading-none">VIP 2</span>
          </div>
        </button>

        {/* Right: Search, Scan to Pay, Notifications, Support */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            id="home-search-btn"
            onClick={onOpenSearch}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] flex items-center justify-center text-[#475569] dark:text-[#EDF1F5] hover:text-[#0F172A] dark:hover:text-white active:scale-95 transition-all shrink-0"
            aria-label="Search markets"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {onOpenScanToPay && (
            <button
              id="home-mobile-scan-btn"
              onClick={onOpenScanToPay}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] flex items-center justify-center text-[#475569] dark:text-[#EDF1F5] hover:text-[#8B5CF6] dark:hover:text-[#8B5CF6] active:scale-95 transition-all shrink-0"
              aria-label="Scan to Pay"
              title="Scan to Pay"
            >
              <ScanLine className="w-3.5 h-3.5 text-[#8B5CF6]" />
            </button>
          )}

          <button
            id="home-notifications-btn"
            onClick={onOpenNotifications}
            className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center active:scale-95 transition-all shrink-0 ${
              unreadNotificationsCount > 0
                ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/40 text-[#8B5CF6] dark:bg-[#8B5CF6]/20 dark:border-[#8B5CF6]/40 dark:text-[#EDF1F5] shadow-xs'
                : 'bg-[#F8FAFC] dark:bg-[#141B24] border-[#D7E0EB] dark:border-[#242E3B] text-[#475569] dark:text-[#EDF1F5] hover:text-[#0F172A] dark:hover:text-white'
            }`}
            aria-label="Notifications"
            title={unreadNotificationsCount > 0 ? `${unreadNotificationsCount} unread notifications` : 'Notifications'}
          >
            <Bell className={`w-3.5 h-3.5 transition-colors ${unreadNotificationsCount > 0 ? 'text-[#8B5CF6]' : 'text-[#64748B] dark:text-[#8E98A6]'}`} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-1 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-[7.5px] font-mono-num font-bold flex items-center justify-center border border-white dark:border-[#0A0E13] shadow-[0_0_8px_rgba(139,92,246,0.6)] animate-in zoom-in-75">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </button>

          {onOpenSupport && (
            <button
              id="home-ai-support-btn"
              onClick={onOpenSupport}
              className="hidden min-[360px]:flex relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#8B5CF6]/10 dark:bg-[#141B24] border border-[#8B5CF6]/20 dark:border-[#242E3B] items-center justify-center text-[#8B5CF6] dark:text-[#8E98A6] hover:text-[#8B5CF6] dark:hover:text-white hover:border-[#8B5CF6]/50 active:scale-95 transition-all shadow-2xs group shrink-0"
              aria-label="24/7 AI Customer Support"
              title="24/7 AI Customer Support & Concierge"
            >
              <Headphones className="w-3.5 h-3.5 text-[#8B5CF6] transition-colors" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#10B981] border border-white dark:border-[#0A0E13]" />
            </button>
          )}
        </div>
      </header>

      {/* Responsive Grid Layout for Tablet and Web */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Main Column */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Portfolio Card */}
          <section
            id="home-portfolio-card"
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#F8FAFC] to-[#F1F5F9] dark:from-[#141B24] dark:via-[#0E141B] dark:to-[#0A0E13] border border-[#D7E0EB] dark:border-[#242E3B] p-4 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-colors"
          >
        {/* Ambient background glow */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-[#06B6D4]/10 dark:bg-[#06B6D4]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-[#64748B] dark:text-[#8E98A6]">
              <span className="text-xs font-semibold tracking-wide">Total Assets</span>
              <button
                onClick={onToggleShowBalances}
                className="p-1 text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6] dark:hover:text-[#EDF1F5] transition-colors"
                aria-label="Toggle balance visibility"
              >
                {showBalances ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-baseline gap-1.5 mb-2">
              <h1 className="text-2xl font-bold font-display tracking-tight text-[#0F172A] dark:text-[#EDF1F5]">
                {showBalances ? `$${balances.totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
              </h1>
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#8E98A6]">USD</span>
            </div>

            {/* 24h P&L Indicator */}
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="font-mono-num text-xs font-bold text-[#10B981]">
                +{balances.pnl24hPct}% (24h)
              </span>
              <Sparkline
                data={[100, 104, 102, 108, 112, 115]}
                isPositive={true}
                width={36}
                height={14}
                strokeWidth={1.5}
                showFill={false}
              />
            </div>
          </div>

          {/* 3D OKNexus glowing badge */}
          <div className="flex-shrink-0">
            <OKNexusBadge3D size={58} />
          </div>
        </div>
      </section>

      {/* Quick Actions (Deposit, Withdraw, Send, Convert) */}
      <section id="home-quick-actions" className="grid grid-cols-4 gap-2 sm:gap-2.5 mb-4">
        <button
          id="action-deposit"
          onClick={onOpenDeposit}
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] hover:border-[#8B5CF6]/50 dark:hover:bg-[#141B24] active:scale-95 transition-all group shadow-xs"
        >
          <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] dark:bg-[#141B24] dark:border-[#8B5CF6]/30 dark:text-[#8B5CF6] flex items-center justify-center group-hover:scale-105 transition-transform">
            <PlusSquare className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-[#0F172A] dark:text-[#EDF1F5] mt-1.5">Deposit</span>
        </button>

        <button
          id="action-withdraw"
          onClick={onOpenWithdraw}
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] hover:border-[#8B5CF6]/50 dark:hover:bg-[#141B24] active:scale-95 transition-all group shadow-xs"
        >
          <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] dark:bg-[#141B24] dark:border-[#8B5CF6]/30 dark:text-[#8B5CF6] flex items-center justify-center group-hover:scale-105 transition-transform">
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-[#0F172A] dark:text-[#EDF1F5] mt-1.5">Withdraw</span>
        </button>

        <button
          id="action-send"
          onClick={onOpenSend}
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] hover:border-[#8B5CF6]/50 dark:hover:bg-[#141B24] active:scale-95 transition-all group shadow-xs"
        >
          <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] dark:bg-[#141B24] dark:border-[#8B5CF6]/30 dark:text-[#8B5CF6] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Send className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-[#0F172A] dark:text-[#EDF1F5] mt-1.5">Send</span>
        </button>

        <button
          id="action-convert"
          onClick={onOpenConvert}
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] hover:border-[#8B5CF6]/50 dark:hover:bg-[#141B24] active:scale-95 transition-all group shadow-xs"
        >
          <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] dark:bg-[#141B24] dark:border-[#8B5CF6]/30 dark:text-[#8B5CF6] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Repeat className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-[#0F172A] dark:text-[#EDF1F5] mt-1.5">Convert</span>
        </button>
      </section>

      {/* OKNexus Feature Grid (8 Dedicated Tiles: Markets | Trade, Convert | Buy/Sell, P2P | Wallet, Earn | More) */}
      <section id="home-feature-grid" className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-[#64748B] dark:text-[#8E98A6] uppercase tracking-wider">
            Exchange Features
          </span>
          <span className="text-[10px] text-[#8B5CF6] font-semibold">Web3 Hub</span>
        </div>

        {isLoading ? (
          <FeatureGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 animate-fade-in">
            {/* Feature 1: Markets */}
            <button
              id="feature-markets"
              onClick={onNavigateMarkets}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0D101C] border border-slate-200 dark:border-white/[0.06] hover:border-purple-300 dark:hover:border-purple-500/40 hover:bg-purple-50/40 dark:hover:bg-[#13182B] active:scale-[0.99] transition-all group text-left shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 dark:bg-purple-950/70 dark:border-purple-500/30 dark:text-purple-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-200/80 dark:group-hover:bg-purple-900/60 transition-all flex-shrink-0">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                  Markets
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Quotes & trends</div>
              </div>
            </button>

            {/* Feature 2: Trade */}
            <button
              id="feature-trade"
              onClick={onNavigateTrade}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0D101C] border border-slate-200 dark:border-white/[0.06] hover:border-purple-300 dark:hover:border-purple-500/40 hover:bg-purple-50/40 dark:hover:bg-[#13182B] active:scale-[0.99] transition-all group text-left shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 dark:bg-purple-950/70 dark:border-purple-500/30 dark:text-purple-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-200/80 dark:group-hover:bg-purple-900/60 transition-all flex-shrink-0">
                <CandlestickChart className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                  Trade
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Spot orderbook</div>
              </div>
            </button>

            {/* Feature 3: Explore */}
            <button
              id="feature-explore"
              onClick={onNavigateExplore}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0D101C] border border-slate-200 dark:border-white/[0.06] hover:border-purple-300 dark:hover:border-purple-500/40 hover:bg-purple-50/40 dark:hover:bg-[#13182B] active:scale-[0.99] transition-all group text-left shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 dark:bg-purple-950/70 dark:border-purple-500/30 dark:text-purple-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-200/80 dark:group-hover:bg-purple-900/60 transition-all flex-shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    Explore
                  </span>
                  <span className="px-1 py-0.2 rounded bg-purple-100 text-purple-700 border border-purple-200/60 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30 text-[8px] font-bold">
                    NEW
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">What's next & ecosystem</div>
              </div>
            </button>

            {/* Feature 4: Analytics */}
            <button
              id="feature-analytics"
              onClick={onNavigateAnalytics}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0D101C] border border-slate-200 dark:border-white/[0.06] hover:border-purple-300 dark:hover:border-purple-500/40 hover:bg-purple-50/40 dark:hover:bg-[#13182B] active:scale-[0.99] transition-all group text-left shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 dark:bg-purple-950/70 dark:border-purple-500/30 dark:text-purple-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-200/80 dark:group-hover:bg-purple-900/60 transition-all flex-shrink-0">
                <LineChart className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    Analytics
                  </span>
                  <span className="px-1 py-0.2 rounded bg-purple-100 text-purple-700 border border-purple-200/60 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30 text-[8px] font-bold">
                    P&L
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Portfolio & performance</div>
              </div>
            </button>

            {/* Feature 5: Convert */}
            <button
              id="feature-convert"
              onClick={onOpenConvert}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0D101C] border border-slate-200 dark:border-white/[0.06] hover:border-purple-300 dark:hover:border-purple-500/40 hover:bg-purple-50/40 dark:hover:bg-[#13182B] active:scale-[0.99] transition-all group text-left shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 dark:bg-purple-950/70 dark:border-purple-500/30 dark:text-purple-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-200/80 dark:group-hover:bg-purple-900/60 transition-all flex-shrink-0">
                <Repeat className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                  Convert
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">0 Slippage swap</div>
              </div>
            </button>

            {/* Feature 6: Buy/Sell */}
            <button
              id="feature-buy-sell"
              onClick={onOpenBuySell}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0D101C] border border-slate-200 dark:border-white/[0.06] hover:border-purple-300 dark:hover:border-purple-500/40 hover:bg-purple-50/40 dark:hover:bg-[#13182B] active:scale-[0.99] transition-all group text-left shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 dark:bg-purple-950/70 dark:border-purple-500/30 dark:text-purple-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-200/80 dark:group-hover:bg-purple-900/60 transition-all flex-shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                  Buy/Sell
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Card & fiat ramp</div>
              </div>
            </button>

            {/* Feature 7: P2P */}
            <button
              id="feature-p2p"
              onClick={onNavigateP2P}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0D101C] border border-slate-200 dark:border-white/[0.06] hover:border-purple-300 dark:hover:border-purple-500/40 hover:bg-purple-50/40 dark:hover:bg-[#13182B] active:scale-[0.99] transition-all group text-left shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 dark:bg-purple-950/70 dark:border-purple-500/30 dark:text-purple-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-200/80 dark:group-hover:bg-purple-900/60 transition-all flex-shrink-0">
                <Users2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    P2P
                  </span>
                  <span className="px-1 py-0.2 rounded bg-purple-100 text-purple-700 border border-purple-200/60 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30 text-[8px] font-bold">
                    0% FEE
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Peer-to-peer</div>
              </div>
            </button>

            {/* Feature 8: Wallet */}
            <button
              id="feature-wallet"
              onClick={onNavigateWallet}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0D101C] border border-slate-200 dark:border-white/[0.06] hover:border-purple-300 dark:hover:border-purple-500/40 hover:bg-purple-50/40 dark:hover:bg-[#13182B] active:scale-[0.99] transition-all group text-left shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 dark:bg-purple-950/70 dark:border-purple-500/30 dark:text-purple-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-200/80 dark:group-hover:bg-purple-900/60 transition-all flex-shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                  Wallet
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Assets & ledger</div>
              </div>
            </button>

            {/* Feature 9: Earn */}
            <button
              id="feature-earn"
              onClick={onNavigateEarn}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0D101C] border border-slate-200 dark:border-white/[0.06] hover:border-purple-300 dark:hover:border-purple-500/40 hover:bg-purple-50/40 dark:hover:bg-[#13182B] active:scale-[0.99] transition-all group text-left shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 dark:bg-purple-950/70 dark:border-purple-500/30 dark:text-purple-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-200/80 dark:group-hover:bg-purple-900/60 transition-all flex-shrink-0">
                <Coins className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    Earn
                  </span>
                  <span className="px-1 py-0.2 rounded bg-purple-100 text-purple-700 border border-purple-200/60 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30 text-[8px] font-bold">
                    18% APY
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Yield vaults</div>
              </div>
            </button>

            {/* Feature 10: AI Bot */}
            <button
              id="feature-ai-bot"
              onClick={onOpenAiTrader}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0D101C] border border-slate-200 dark:border-white/[0.06] hover:border-purple-300 dark:hover:border-purple-500/40 hover:bg-purple-50/40 dark:hover:bg-[#13182B] active:scale-[0.99] transition-all group text-left shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 dark:bg-purple-950/70 dark:border-purple-500/30 dark:text-purple-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-200/80 dark:group-hover:bg-purple-900/60 transition-all flex-shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    AI Bot
                  </span>
                  <span className="px-1 py-0.2 rounded bg-purple-100 text-purple-700 border border-purple-200/60 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30 text-[8px] font-bold">
                    AUTO
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Algorithmic DCA</div>
              </div>
            </button>

            {/* Feature 11: Predictions */}
            <button
              id="feature-predictions"
              onClick={onOpenPolymarket}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0D101C] border border-slate-200 dark:border-white/[0.06] hover:border-purple-300 dark:hover:border-purple-500/40 hover:bg-purple-50/40 dark:hover:bg-[#13182B] active:scale-[0.99] transition-all group text-left shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 dark:bg-purple-950/70 dark:border-purple-500/30 dark:text-purple-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-200/80 dark:group-hover:bg-purple-900/60 transition-all flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    Predictions
                  </span>
                  <span className="px-1 py-0.2 rounded bg-purple-100 text-purple-700 border border-purple-200/60 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30 text-[8px] font-bold">
                    HOT
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Polymarket odds</div>
              </div>
            </button>

            {/* Feature 12: More */}
            <button
              id="feature-more"
              onClick={onOpenMore}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0D101C] border border-slate-200 dark:border-white/[0.06] hover:border-purple-300 dark:hover:border-purple-500/40 hover:bg-purple-50/40 dark:hover:bg-[#13182B] active:scale-[0.99] transition-all group text-left shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 dark:bg-purple-950/70 dark:border-purple-500/30 dark:text-purple-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-200/80 dark:group-hover:bg-purple-900/60 transition-all flex-shrink-0">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                  More
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">OTC, Alerts & Hub</div>
              </div>
            </button>
          </div>
        )}
      </section>

      {/* Promotional Campaign Graphic Flyer Carousel */}
      <PromotionalBannerCarousel
        onNavigateP2P={onNavigateP2P}
        onOpenAiTrader={onOpenAiTrader}
        onOpenPolymarket={onOpenPolymarket}
        onNavigateMarkets={onNavigateMarkets}
        onNavigateEarn={onNavigateEarn}
        onOpenDeposit={onOpenDeposit}
      />

      {/* Featured Products: AI Auto Trader & Polymarket */}
      <section id="home-featured-products" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
        {/* AI Auto Trader Card */}
        <button
          id="feature-ai-trader"
          onClick={onOpenAiTrader}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-gradient-to-r dark:from-[#171128] dark:to-[#101322] border border-slate-200 dark:border-purple-500/25 hover:border-purple-300 dark:hover:border-purple-500/50 active:scale-[0.99] transition-all group text-left shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 dark:bg-purple-900/40 dark:border-purple-500/40 dark:text-purple-300 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Cpu className="w-5 h-5 text-purple-600 dark:text-fuchsia-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                  AI Auto Trader
                </h3>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-500/30 dark:text-purple-300">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Smarter trades. 24/7 automation</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 dark:group-hover:text-white transition-colors" />
        </button>

        {/* Polymarket Card */}
        <button
          id="feature-polymarket"
          onClick={onOpenPolymarket}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-gradient-to-r dark:from-[#0E162B] dark:to-[#0E121E] border border-slate-200 dark:border-cyan-500/25 hover:border-cyan-300 dark:hover:border-cyan-500/50 active:scale-[0.99] transition-all group text-left shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 border border-cyan-200 text-cyan-700 dark:bg-cyan-950/50 dark:border-cyan-500/40 dark:text-cyan-300 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                  Polymarket
                </h3>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-100 text-cyan-700 dark:bg-cyan-500/30 dark:text-cyan-300">
                  WEB3
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Predict markets. Win rewards</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-700 dark:group-hover:text-white transition-colors" />
        </button>

        {/* Explore Web3 & Markets Card */}
        {onNavigateExplore && (
          <button
            id="feature-explore-web3-card"
            onClick={onNavigateExplore}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-gradient-to-r dark:from-[#0B1528] dark:to-[#0F1122] border border-slate-200 dark:border-cyan-500/25 hover:border-cyan-300 dark:hover:border-cyan-500/50 active:scale-[0.99] transition-all group text-left shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 border border-cyan-200 text-cyan-700 dark:bg-cyan-900/40 dark:border-cyan-500/40 dark:text-cyan-300 flex items-center justify-center flex-shrink-0 shadow-xs">
                <Compass className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                    Explore Web3 & Markets
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-100 text-cyan-700 dark:bg-cyan-500/30 dark:text-cyan-300">
                    DISCOVER
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sector narratives, top gainers & dApps</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-700 dark:group-hover:text-white transition-colors" />
          </button>
        )}

        {/* Price Alerts Card */}
        {onOpenPriceAlerts && (
          <button
            id="feature-price-alerts"
            onClick={onOpenPriceAlerts}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-gradient-to-r dark:from-[#17142A] dark:to-[#0F1424] border border-slate-200 dark:border-purple-500/25 hover:border-purple-300 dark:hover:border-purple-500/50 active:scale-[0.99] transition-all group text-left shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 dark:bg-purple-900/40 dark:border-purple-500/40 dark:text-purple-300 flex items-center justify-center flex-shrink-0 shadow-xs">
                <BellRing className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                    Price Alert Management
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-500/30 dark:text-purple-300">
                    {activeAlertsCount > 0 ? `${activeAlertsCount} ACTIVE` : 'NEW'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Target price alerts & in-app push triggers</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 dark:group-hover:text-white transition-colors" />
          </button>
        )}

        {/* 24/7 AI Customer Support Card */}
        {onOpenSupport && (
          <button
            id="feature-ai-support"
            onClick={onOpenSupport}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-gradient-to-r dark:from-[#14122E] dark:via-[#0E1528] dark:to-[#120F24] border border-slate-200 dark:border-fuchsia-500/25 hover:border-fuchsia-300 dark:hover:border-fuchsia-500/50 active:scale-[0.99] transition-all group text-left shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-100 border border-fuchsia-200 text-fuchsia-700 dark:bg-fuchsia-950/60 dark:border-fuchsia-500/40 dark:text-fuchsia-300 flex items-center justify-center flex-shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-fuchsia-700 dark:group-hover:text-fuchsia-300 transition-colors">
                    24/7 AI VIP Concierge
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/30 dark:text-fuchsia-300">
                    GEMINI AI
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Instant answers, VIP trading fees & blockchain diagnostics</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-fuchsia-700 dark:group-hover:text-white transition-colors" />
          </button>
        )}
      </section>

          {/* Dedicated Crypto Market Intelligence & News (Real-Time Search for Favorite Assets) */}
          <CryptoNewsSection
            favoritePairs={favoritePairsList}
            onSelectPairForTrade={onSelectPair}
            onNavigateMarkets={onNavigateMarkets}
            allMarketPairs={marketPairs}
          />
        </div>

        {/* Right Sidebar on Desktop & Tablet: Markets Preview & Recent Activity */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          {/* Markets Preview Section */}
          <section id="home-markets-preview" className="rounded-2xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#0F172A] dark:text-[#EDF1F5] tracking-tight">Market Watch</h2>
                {isLoading && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#8B5CF6] font-mono font-medium animate-pulse">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    Syncing...
                  </span>
                )}
              </div>
              <button
                onClick={onNavigateMarkets}
                className="text-xs font-semibold text-[#8B5CF6] hover:text-[#8B5CF6]/80 flex items-center gap-1 transition-colors"
              >
                View All
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Market Subtabs */}
            <div className="flex items-center gap-4 border-b border-[#D7E0EB] dark:border-[#242E3B] pb-2 mb-2 text-xs font-medium">
              {(['hot', 'gainers', 'new', 'losers'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMarketTab(tab)}
                  className={`capitalize transition-colors relative pb-1 ${
                    marketTab === tab
                      ? 'text-[#0F172A] dark:text-[#EDF1F5] font-bold'
                      : 'text-[#64748B] dark:text-[#8E98A6] hover:text-[#0F172A] dark:hover:text-[#EDF1F5]'
                  }`}
                >
                  {tab}
                  {marketTab === tab && (
                    <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Compact Market Rows */}
            {isLoading ? (
              <MarketListSkeleton />
            ) : (
              <div className="space-y-1 animate-fade-in">
                {filteredMarkets.map((pair) => (
                  <div
                    key={pair.symbol}
                    onClick={() => onSelectPair(pair)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8FAFC] active:bg-[#F1F5F9] dark:hover:bg-[#141B24] dark:active:bg-[#1A222D] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <CoinIcon symbol={pair.base} size={32} />
                      <div>
                        <div className="font-semibold text-xs text-[#0F172A] group-hover:text-[#8B5CF6] dark:text-[#EDF1F5] dark:group-hover:text-[#8B5CF6] transition-colors">
                          {pair.symbol}
                        </div>
                        <div className="text-[11px] text-[#64748B] dark:text-[#8E98A6]">{pair.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-mono-num text-xs font-bold text-[#0F172A] dark:text-[#EDF1F5]">
                          ${pair.price >= 1 ? pair.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : pair.price.toFixed(4)}
                        </div>
                      </div>

                      <div
                        className={`min-w-[62px] px-2 py-1 rounded-md text-right font-mono-num text-[11px] font-bold ${
                          pair.change24h >= 0
                            ? 'bg-emerald-50 text-[#10B981] border border-emerald-200 dark:bg-emerald-500/15 dark:text-[#10B981] dark:border-emerald-500/20'
                            : 'bg-rose-50 text-[#EF4444] border border-rose-200 dark:bg-rose-500/15 dark:text-[#EF4444] dark:border-rose-500/20'
                        }`}
                      >
                        {pair.change24h >= 0 ? `+${pair.change24h}%` : `${pair.change24h}%`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Activity */}
          <section id="home-recent-activity" className="rounded-2xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-[#0F172A] dark:text-[#EDF1F5] tracking-tight">Recent Activity</h2>
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#8E98A6]">History</span>
            </div>

            <div className="divide-y divide-[#D7E0EB] dark:divide-[#242E3B]">
              {recentActivities.slice(0, 4).map((act) => (
                <div key={act.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        act.type === 'buy' || act.type === 'deposit'
                          ? 'bg-emerald-50 text-[#10B981] border border-emerald-200 dark:bg-emerald-500/15 dark:text-[#10B981] dark:border-emerald-500/20'
                          : 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 dark:bg-[#8B5CF6]/15 dark:text-[#8B5CF6] dark:border-[#8B5CF6]/30'
                      }`}
                    >
                      {act.type === 'buy' || act.type === 'deposit' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#0F172A] dark:text-[#EDF1F5]">{act.title}</div>
                      <div className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">{act.subtitle}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-mono-num text-xs font-semibold ${
                        act.amount.startsWith('+') ? 'text-[#10B981]' : 'text-[#0F172A] dark:text-[#EDF1F5]'
                      }`}
                    >
                      {act.amount}
                    </div>
                    <div className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* VIP Exchange Status & Security Status (Tablet & Desktop) */}
          <section className="hidden sm:block rounded-2xl bg-gradient-to-br from-purple-50/70 via-white to-slate-50 dark:from-[#131728] dark:via-[#0E1120] dark:to-[#0A0D16] border border-purple-200 dark:border-purple-500/20 p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">VIP 2 Status Active</span>
              </div>
              <span className="text-[10px] text-purple-700 dark:text-purple-400 font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30">
                0.04% / 0.06% Fees
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Protected by OKNexus Multi-Sig Vaults, Biometric WebAuthn & 24/7 AI security monitoring.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex items-center justify-between shadow-2xs">
                <span className="text-slate-500 dark:text-slate-400">Withdraw Limit</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">100 BTC / day</span>
              </div>
              <div className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex items-center justify-between shadow-2xs">
                <span className="text-slate-500 dark:text-slate-400">Proof of Reserves</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">104.2%</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
