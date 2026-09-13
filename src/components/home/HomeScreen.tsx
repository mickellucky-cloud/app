import React, { useState } from 'react';
import { OKNexusLogo, OKNexusBadge3D } from '../common/OKNexusLogo';
import { CoinIcon } from '../common/CoinIcon';
import { Sparkline } from '../common/Sparkline';
import { FeatureGridSkeleton } from './FeatureGridSkeleton';
import { MarketListSkeleton } from './MarketListSkeleton';
import { HomeSkeleton } from '../skeletons/HomeSkeleton';
import { CryptoNewsSection } from './CryptoNewsSection';
import { PromotionalBannerCarousel } from './PromotionalBannerCarousel';
import { TotalAssetsArea } from './TotalAssetsArea';
import { MarketPair, RecentActivityItem, ThemeMode, AppNotification } from '../../types';
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
import { NotificationsDropdown } from '../navigation/NotificationsDropdown';

interface HomeScreenProps {
  balances: {
    totalAssets: number;
    pnl24hUsd?: number;
    pnl24hPct: number;
    spotUsd?: number;
    fundingUsd?: number;
    earnUsd?: number;
    futuresUsd?: number;
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
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  notifications?: AppNotification[];
  onMarkNotificationAsRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
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
  notifications = [],
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
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
  const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] = useState(false);

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

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <div id="home-screen" className="pb-28 md:pb-12 pt-1 sm:pt-3 px-3 sm:px-6 lg:px-8 max-w-md md:max-w-4xl lg:max-w-7xl mx-auto min-h-screen text-[#0F172A] dark:text-[#EDF1F5] bg-white dark:bg-[#0A0E13] transition-colors">
      {/* Responsive Grid Layout for Tablet and Web */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Main Column */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Upgraded Total Assets Area with luxury animations, live currency switcher & P&L sparklines */}
          <TotalAssetsArea
            balances={balances}
            showBalances={showBalances}
            onToggleShowBalances={onToggleShowBalances}
            onOpenDeposit={onOpenDeposit}
            onOpenWithdraw={onOpenWithdraw}
            onOpenSend={onOpenSend}
            onOpenConvert={onOpenConvert}
            onNavigateWallet={onNavigateWallet}
            variant="home"
            className="mb-3"
          />

          {/* Clean Modern Quick Actions Grid (4-col Mobile / 8-col Desktop) */}
          <section id="home-quick-actions" className="mb-3">
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3 py-1">
              {/* Action 1: Deposit */}
              <button
                id="quick-action-deposit"
                onClick={onOpenDeposit}
                className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.04] active:scale-95 transition-all text-center group"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-500/30 text-purple-600 dark:text-purple-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/60 transition-transform shadow-xs">
                  <PlusSquare className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1.5">Deposit</span>
              </button>

              {/* Action 2: Trade */}
              <button
                id="quick-action-trade"
                onClick={onNavigateTrade}
                className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.04] active:scale-95 transition-all text-center group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-500/30 text-blue-600 dark:text-blue-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 transition-transform shadow-xs">
                  <CandlestickChart className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1.5">Spot</span>
              </button>

              {/* Action 3: P2P */}
              <button
                id="quick-action-p2p"
                onClick={onNavigateP2P}
                className="relative flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.04] active:scale-95 transition-all text-center group"
              >
                <span className="absolute top-1 right-2 px-1 py-0.2 rounded bg-emerald-500 text-white text-[9px] font-extrabold uppercase shadow-2xs">
                  0%
                </span>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60 transition-transform shadow-xs">
                  <Users2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1.5">P2P</span>
              </button>

              {/* Action 4: Earn */}
              <button
                id="quick-action-earn"
                onClick={onNavigateEarn}
                className="relative flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.04] active:scale-95 transition-all text-center group"
              >
                <span className="absolute top-1 right-1 px-1 py-0.2 rounded bg-amber-500 text-white text-[9px] font-extrabold shadow-2xs">
                  18%
                </span>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-500/30 text-amber-600 dark:text-amber-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/60 transition-transform shadow-xs">
                  <Coins className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1.5">Earn</span>
              </button>

              {/* Action 5: Convert */}
              <button
                id="quick-action-convert"
                onClick={onOpenConvert}
                className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.04] active:scale-95 transition-all text-center group"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/60 transition-transform shadow-xs">
                  <Repeat className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1.5">Convert</span>
              </button>

              {/* Action 6: AI Bot */}
              <button
                id="quick-action-ai-bot"
                onClick={onOpenAiTrader}
                className="relative flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.04] active:scale-95 transition-all text-center group"
              >
                <span className="absolute top-1 right-2 px-1 py-0.2 rounded bg-purple-600 text-white text-[9px] font-extrabold uppercase shadow-2xs">
                  PRO
                </span>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-500/30 text-purple-600 dark:text-purple-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/60 transition-transform shadow-xs">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1.5">AI Bot</span>
              </button>

              {/* Action 7: Predictions */}
              <button
                id="quick-action-predictions"
                onClick={onOpenPolymarket}
                className="relative flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.04] active:scale-95 transition-all text-center group"
              >
                <span className="absolute top-1 right-1 px-1 py-0.2 rounded bg-cyan-600 text-white text-[9px] font-extrabold uppercase shadow-2xs">
                  HOT
                </span>
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-200/80 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-900/60 transition-transform shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1.5">Predict</span>
              </button>

              {/* Action 8: More */}
              <button
                id="quick-action-more"
                onClick={onOpenMore}
                className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.04] active:scale-95 transition-all text-center group"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-transform shadow-xs">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1.5">More</span>
              </button>
            </div>
          </section>

          {/* Promotional / Advertisement Slider & Announcements */}
          <section id="home-promotional-section" className="mb-4">
            <PromotionalBannerCarousel
              onNavigateP2P={onNavigateP2P}
              onOpenAiTrader={onOpenAiTrader}
              onOpenPolymarket={onOpenPolymarket}
              onNavigateMarkets={onNavigateMarkets}
              onNavigateEarn={onNavigateEarn}
              onOpenDeposit={onOpenDeposit}
            />
          </section>

          {/* Mobile-First Market Watch: Immediately Visible on Mobile */}
          <div className="block lg:hidden mb-4">
            <section id="home-markets-preview-mobile" className="rounded-2xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] p-3.5 sm:p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-[#0F172A] dark:text-[#EDF1F5] tracking-tight">Market Watch</h2>
                  {isLoading && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#8B5CF6] font-mono font-medium animate-pulse">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                      Syncing...
                    </span>
                  )}
                </div>
                <button
                  onClick={onNavigateMarkets}
                  className="text-xs font-bold text-[#8B5CF6] hover:text-[#8B5CF6]/80 flex items-center gap-0.5 transition-colors"
                >
                  View All
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Market Subtabs */}
              <div className="flex items-center gap-4 border-b border-[#D7E0EB] dark:border-[#242E3B] pb-2 mb-2 text-xs font-semibold">
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
                          <div className="font-bold text-xs text-[#0F172A] group-hover:text-[#8B5CF6] dark:text-[#EDF1F5] dark:group-hover:text-[#8B5CF6] transition-colors">
                            {pair.symbol}
                          </div>
                          <div className="text-[11px] text-[#64748B] dark:text-[#8E98A6]">{pair.name}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="text-right">
                          <div className="font-mono-num text-xs font-bold text-[#0F172A] dark:text-[#EDF1F5]">
                            ${pair.price >= 1 ? pair.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : pair.price.toFixed(4)}
                          </div>
                        </div>

                        <div
                          className={`min-w-[62px] px-2 py-1 rounded-lg text-right font-mono-num text-xs font-bold ${
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
          </div>




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
