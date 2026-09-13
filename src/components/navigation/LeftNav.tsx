import React, { useState } from 'react';
import { MainTab, ThemeMode } from '../../types';
import { OKNexusLogo } from '../common/OKNexusLogo';
import {
  Home,
  BarChart2,
  ArrowLeftRight,
  Percent,
  Wallet,
  Users2,
  Bot,
  TrendingUp,
  BellRing,
  Gift,
  Headphones,
  PlusSquare,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Settings,
  ShieldCheck,
  Zap,
  Sun,
  Moon,
  Compass,
  LineChart,
  ScanLine,
} from 'lucide-react';

export interface LeftNavProps {
  activeTab: MainTab | 'p2p';
  onSelectTab: (tab: MainTab | 'p2p') => void;
  balances: {
    totalAssets: number;
    pnl24hPct: number;
  };
  showBalances: boolean;
  onToggleShowBalances: () => void;
  onOpenDeposit: () => void;
  onOpenScanToPay?: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  onOpenPriceAlerts: () => void;
  activeAlertsCount?: number;
  onOpenAiTrader: () => void;
  onOpenPolymarket: () => void;
  onOpenRewards: () => void;
  onOpenSupport: () => void;
  onOpenProfile: (tab?: 'profile' | 'system_settings') => void;
  onOpenSettings?: () => void;
  userEmail: string;
  username?: string;
  userAvatar?: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}

export const LeftNav: React.FC<LeftNavProps> = ({
  activeTab,
  onSelectTab,
  balances,
  showBalances,
  onToggleShowBalances,
  onOpenDeposit,
  onOpenScanToPay,
  onOpenPriceAlerts,
  activeAlertsCount = 0,
  onOpenAiTrader,
  onOpenPolymarket,
  onOpenRewards,
  onOpenSupport,
  onOpenProfile,
  onOpenSettings,
  userEmail,
  username = 'Mickel_Lucky',
  userAvatar = '',
  isCollapsed,
  onToggleCollapse,
  theme = 'dark',
  onToggleTheme,
}) => {
  const mainNavItems: { id: MainTab | 'p2p'; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'market', label: 'Markets', icon: BarChart2 },
    { id: 'trade', label: 'Spot Trade', icon: ArrowLeftRight },
    { id: 'earn', label: 'Earn & Yield', icon: Percent, badge: '18%' },
    { id: 'assets', label: 'Assets', icon: Wallet },
    { id: 'p2p', label: 'P2P Express', icon: Users2, badge: '0% Fee' },
  ];

  const toolsNavItems = [
    {
      id: 'explore',
      label: 'Explore Web3',
      icon: Compass,
      badge: 'Discover',
      onClick: () => onSelectTab('explore'),
    },
    {
      id: 'analytics',
      label: 'Portfolio Analytics',
      icon: LineChart,
      badge: 'P&L',
      onClick: () => onSelectTab('analytics'),
    },
    {
      id: 'ai_trader',
      label: 'AI Trading Bot',
      icon: Bot,
      badge: 'PRO',
      onClick: onOpenAiTrader,
    },
    {
      id: 'polymarket',
      label: 'Predictions',
      icon: TrendingUp,
      badge: 'Hot',
      onClick: onOpenPolymarket,
    },
    {
      id: 'alerts',
      label: 'Price Alerts',
      icon: BellRing,
      badge: activeAlertsCount > 0 ? `${activeAlertsCount}` : undefined,
      onClick: onOpenPriceAlerts,
    },
    {
      id: 'rewards',
      label: 'Rewards Hub',
      icon: Gift,
      onClick: onOpenRewards,
    },
    {
      id: 'support',
      label: 'VIP AI Concierge',
      icon: Headphones,
      badge: '24/7',
      onClick: onOpenSupport,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      onClick: () => (onOpenSettings ? onOpenSettings() : onSelectTab('settings')),
    },
  ];

  return (
    <aside
      id="desktop-left-nav"
      className={`hidden md:flex flex-col flex-shrink-0 bg-white dark:bg-[#0A0D16] border-r border-slate-200 dark:border-white/[0.07] h-screen sticky top-0 z-40 transition-all duration-300 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding & Collapse Button */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06]">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <button
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2.5 focus:outline-none group text-left"
            >
              <OKNexusLogo size={32} showWordmark={true} />
            </button>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30 tracking-tight">
              VIP 2
            </span>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <button
              onClick={() => onSelectTab('home')}
              className="focus:outline-none group"
              title="OKNexus Home"
            >
              <OKNexusLogo size={32} showWordmark={false} />
            </button>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors ${
            isCollapsed ? 'hidden' : 'flex items-center'
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* When collapsed, small expand button centered below logo */}
      {isCollapsed && (
        <div className="py-2 flex justify-center border-b border-slate-200 dark:border-white/[0.04]">
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Links Scroll Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-3 px-3 space-y-5">
        {/* Group 1: Core Exchange */}
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Exchange
            </div>
          )}
          <nav className="space-y-1" aria-label="Exchange Navigation">
            {mainNavItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  id={`left-nav-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group relative ${
                    isActive
                      ? 'bg-purple-100/90 text-purple-700 border border-purple-300 dark:bg-gradient-to-r dark:from-purple-600/25 dark:to-purple-500/10 dark:text-white dark:border-purple-500/40 shadow-xs dark:shadow-[0_0_16px_rgba(168,85,247,0.15)] font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/[0.04] border border-transparent'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-200'
                    }`}
                  />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/25">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {/* Active bar indicator on the left */}
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-purple-600 dark:bg-purple-500" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Group 2: AI & Smart Services */}
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              AI Ecosystem
            </div>
          )}
          <div className="space-y-1">
            {toolsNavItems.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  id={`left-nav-tool-${tool.id}`}
                  onClick={tool.onClick}
                  title={isCollapsed ? tool.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/[0.04] transition-all group ${
                    isCollapsed ? 'justify-center px-0' : ''
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0 text-slate-500 group-hover:text-purple-600 dark:text-slate-400 dark:group-hover:text-purple-300 transition-colors" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{tool.label}</span>
                      {tool.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            tool.badge === 'PRO'
                              ? 'bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30'
                              : tool.badge === 'Hot'
                              ? 'bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
                              : 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-white/10'
                          }`}
                        >
                          {tool.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: Balance & User Profile */}
      <div className="p-3 border-t border-slate-200 dark:border-white/[0.07] bg-slate-50/70 dark:bg-[#080B12] space-y-2.5">
        {/* Quick Deposit Button */}
        {!isCollapsed ? (
          <button
            onClick={onOpenDeposit}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:brightness-110 active:scale-98 text-white text-xs font-bold shadow-[0_4px_16px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <PlusSquare className="w-3.5 h-3.5" />
            <span>Deposit Crypto</span>
          </button>
        ) : (
          <button
            onClick={onOpenDeposit}
            title="Deposit Crypto"
            className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center"
          >
            <PlusSquare className="w-4 h-4" />
          </button>
        )}

        {/* Quick Action: Scan to Pay */}
        {onOpenScanToPay && (
          !isCollapsed ? (
            <button
              id="left-nav-scan-pay-btn"
              onClick={onOpenScanToPay}
              className="w-full py-2 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 active:scale-98 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-500/30 transition-all flex items-center justify-center gap-2"
            >
              <ScanLine className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Scan to Pay</span>
            </button>
          ) : (
            <button
              id="left-nav-scan-pay-btn"
              onClick={onOpenScanToPay}
              title="Scan to Pay"
              className="w-full py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 flex items-center justify-center border border-purple-500/30 transition-colors"
            >
              <ScanLine className="w-4 h-4" />
            </button>
          )
        )}

        {/* Portfolio Balance Card (Expanded) */}
        {!isCollapsed && (
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.05] shadow-2xs">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                Net Balance
                <button
                  onClick={onToggleShowBalances}
                  className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  aria-label="Toggle balances"
                >
                  {showBalances ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
              </span>
              <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {showBalances ? `+${balances.pnl24hPct}%` : '•••'}
              </span>
            </div>
            <div className="font-mono-num text-sm font-extrabold text-slate-900 dark:text-white">
              {showBalances
                ? `$${balances.totalAssets.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : '••••••••'}
            </div>
          </div>
        )}

        {/* User Profile & Settings Trigger */}
        <div
          onClick={() => onOpenProfile('profile')}
          className={`flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.04] cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/5 ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? `@${username} • Settings` : undefined}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-purple-600 to-amber-400 p-[1.5px] shadow-sm flex-shrink-0">
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
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">@{username}</div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                <span>Verified • Tier 2</span>
              </div>
            </div>
          )}
          {!isCollapsed && (
            <button
              id="leftnav-settings-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenSettings) {
                  onOpenSettings();
                } else {
                  onOpenProfile('system_settings');
                }
              }}
              title="System Settings"
              aria-label="System Settings"
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
