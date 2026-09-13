import React, { useState } from 'react';
import { OKNexusBadge3D } from '../common/OKNexusLogo';
import { CoinIcon } from '../common/CoinIcon';
import { Sparkline } from '../common/Sparkline';
import { CryptoAsset, ThemeMode } from '../../types';
import {
  Bell,
  Eye,
  EyeOff,
  ArrowDownLeft,
  ArrowUpRight,
  SendHorizontal,
  Repeat,
  Shield,
  MapPin,
  Sparkles,
  Compass,
  Search,
  ChevronRight,
} from 'lucide-react';
import { AssetsSkeleton } from '../skeletons/AssetsSkeleton';

interface AssetsScreenProps {
  balances: {
    totalAssets: number;
    pnl24hPct: number;
    spotUsd: number;
    spotUsdtEquiv: number;
    fundingUsd: number;
    fundingUsdtEquiv: number;
    earnUsd: number;
    earnUsdtEquiv: number;
    futuresUsd: number;
    futuresUsdtEquiv: number;
  };
  assets: CryptoAsset[];
  showBalances: boolean;
  onToggleShowBalances: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenSend: () => void;
  onOpenConvert: () => void;
  onOpenNotifications: () => void;
  onSelectAssetForTrade?: (symbol: string) => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  isLoading?: boolean;
}

export const AssetsScreen: React.FC<AssetsScreenProps> = ({
  balances,
  assets,
  showBalances,
  onToggleShowBalances,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenSend,
  onOpenConvert,
  onOpenNotifications,
  onSelectAssetForTrade,
  theme = 'dark',
  onToggleTheme,
  isLoading = false,
}) => {
  if (isLoading) {
    return <AssetsSkeleton />;
  }
  const [activeCategory, setActiveCategory] = useState<'all' | 'spot' | 'funding' | 'earn'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = assets.filter(
    (a) =>
      a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="assets-screen" className="pb-32 md:pb-12 pt-3 px-4 sm:px-6 lg:px-8 max-w-md md:max-w-4xl lg:max-w-7xl mx-auto min-h-screen text-slate-900 dark:text-slate-100 bg-white dark:bg-[#07090E] transition-colors">
      {/* Top Header */}
      <header className="flex items-center justify-between py-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">Wallet & Portfolio</h1>
              <button
                onClick={onToggleShowBalances}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Toggle balances"
              >
                {showBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Crypto, Fiat Cash & DeFi Web3 Balances</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onOpenDeposit}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:brightness-110 transition-all shadow-xs"
            >
              Deposit Funds
            </button>
            <button
              onClick={onOpenWithdraw}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-purple-500/40 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all"
            >
              Withdraw
            </button>
          </div>
          <button
            onClick={onOpenNotifications}
            className="md:hidden w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Portfolio Card & Quick Actions (Responsive Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-5">
        {/* Portfolio Card */}
        <section
          id="assets-portfolio-card"
          className="lg:col-span-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:bg-gradient-to-br dark:from-[#121624] dark:via-[#0E121E] dark:to-[#0A0D16] border border-purple-200 dark:border-purple-500/20 p-5 shadow-xs dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col justify-between"
        >
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-purple-500/10 dark:bg-purple-600/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 text-slate-500 dark:text-slate-400">
                <span className="text-xs font-medium uppercase tracking-wider">Total Net Worth</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20 font-mono-num font-semibold">
                  {showBalances ? `+${balances.pnl24hPct}% (24h)` : '•••'}
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <div className="font-mono-num text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {showBalances ? `$${balances.totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
                </div>
                <div className="font-mono-num text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {showBalances ? `≈ ${(balances.totalAssets / 1.0).toFixed(2)} USDT` : '•••'}
                </div>
              </div>
            </div>

            <OKNexusBadge3D size={64} />
          </div>

          {/* Quick Action Buttons (Deposit, Withdraw, Send, Convert) - Never Truncated */}
          <div id="assets-quick-actions" className="grid grid-cols-4 gap-2 pt-3.5 border-t border-slate-200 dark:border-white/[0.08]">
            <button
              id="assets-btn-deposit"
              onClick={onOpenDeposit}
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 px-1 rounded-xl bg-slate-100/90 hover:bg-[#8B5CF6]/10 border border-slate-200 hover:border-[#8B5CF6]/40 dark:bg-white/[0.04] dark:hover:bg-[#8B5CF6]/15 dark:border-white/[0.08] dark:hover:border-[#8B5CF6]/40 active:scale-95 transition-all group"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] dark:bg-[#8B5CF6]/20 dark:text-[#8B5CF6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">Deposit</span>
            </button>

            <button
              id="assets-btn-withdraw"
              onClick={onOpenWithdraw}
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 px-1 rounded-xl bg-slate-100/90 hover:bg-[#8B5CF6]/10 border border-slate-200 hover:border-[#8B5CF6]/40 dark:bg-white/[0.04] dark:hover:bg-[#8B5CF6]/15 dark:border-white/[0.08] dark:hover:border-[#8B5CF6]/40 active:scale-95 transition-all group"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] dark:bg-[#8B5CF6]/20 dark:text-[#8B5CF6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">Withdraw</span>
            </button>

            <button
              id="assets-btn-send"
              onClick={onOpenSend}
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 px-1 rounded-xl bg-slate-100/90 hover:bg-[#8B5CF6]/10 border border-slate-200 hover:border-[#8B5CF6]/40 dark:bg-white/[0.04] dark:hover:bg-[#8B5CF6]/15 dark:border-white/[0.08] dark:hover:border-[#8B5CF6]/40 active:scale-95 transition-all group"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] dark:bg-[#8B5CF6]/20 dark:text-[#8B5CF6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <SendHorizontal className="w-4 h-4" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">Send</span>
            </button>

            <button
              id="assets-btn-convert"
              onClick={onOpenConvert}
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 px-1 rounded-xl bg-slate-100/90 hover:bg-[#8B5CF6]/10 border border-slate-200 hover:border-[#8B5CF6]/40 dark:bg-white/[0.04] dark:hover:bg-[#8B5CF6]/15 dark:border-white/[0.08] dark:hover:border-[#8B5CF6]/40 active:scale-95 transition-all group"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] dark:bg-[#8B5CF6]/20 dark:text-[#8B5CF6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Repeat className="w-4 h-4" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">Convert</span>
            </button>
          </div>
        </section>

        {/* Security & Proof of Reserves Banner (Desktop & Tablet) */}
        <section className="lg:col-span-4 rounded-2xl bg-slate-50 dark:bg-[#0C0F1A] border border-slate-200 dark:border-white/[0.08] p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Vault Protection</span>
              </div>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/20">
                100% Reserve Backed
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Your assets are segregated in institutional-grade cold storage with MPC multi-signature custody and real-time cryptographic audit trails.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400">Security Rating</span>
              <span className="font-semibold text-slate-900 dark:text-white">AAA Tier 1 Certified</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400">Insurance Fund</span>
              <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">$500,000,000 USD</span>
            </div>
          </div>
        </section>
      </div>

      {/* Wallets Breakdown (Spot, Funding, Earn, Futures) as a Responsive Grid */}
      <section id="assets-wallets-breakdown" className="mb-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Wallets Allocation</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Spot */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.07] hover:border-purple-500/30 transition-all shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Spot Account</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Trading & Orders</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono-num text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {showBalances ? `$${balances.spotUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
              </div>
              <div className="font-mono-num text-[10px] text-slate-500 dark:text-slate-400">
                {showBalances ? `≈ ${balances.spotUsdtEquiv} USDT` : '•••'}
              </div>
            </div>
          </div>

          {/* Funding */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.07] hover:border-indigo-500/30 transition-all shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Funding Account</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">P2P & Transfers</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono-num text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {showBalances ? `$${balances.fundingUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
              </div>
              <div className="font-mono-num text-[10px] text-slate-500 dark:text-slate-400">
                {showBalances ? `≈ ${balances.fundingUsdtEquiv} USDT` : '•••'}
              </div>
            </div>
          </div>

          {/* Earn */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.07] hover:border-amber-500/30 transition-all shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Earn Yield</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Staking & Stash</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono-num text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {showBalances ? `$${balances.earnUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
              </div>
              <div className="font-mono-num text-[10px] text-slate-500 dark:text-slate-400">
                {showBalances ? `≈ ${balances.earnUsdtEquiv} USDT` : '•••'}
              </div>
            </div>
          </div>

          {/* Futures */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.07] hover:border-slate-400/40 transition-all shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center text-slate-600 dark:text-slate-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Futures Account</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Derivative margin</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono-num text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {showBalances ? `$${balances.futuresUsd.toFixed(2)}` : '••••••'}
              </div>
              <div className="font-mono-num text-[10px] text-slate-500 dark:text-slate-400">
                {showBalances ? `≈ ${balances.futuresUsdtEquiv.toFixed(2)} USDT` : '•••'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asset Holdings Breakdown (Responsive Table / Cards) */}
      <section id="assets-holdings-list">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Crypto Asset Holdings</h3>
          <div className="relative w-48 sm:w-64">
            <input
              type="text"
              placeholder="Search crypto holdings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-7 pr-3 text-xs rounded-xl bg-slate-100 dark:bg-[#111624] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Table Header on Tablet & Desktop */}
        <div className="hidden sm:flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/[0.08] mb-2">
          <div className="w-48">Asset</div>
          <div className="flex-1 flex items-center justify-end gap-8">
            <div className="w-28 text-right">Balance</div>
            <div className="w-28 text-right">USD Value</div>
            <div className="w-24 text-right">Action</div>
          </div>
        </div>

        <div className="space-y-2">
          {filteredAssets.map((asset) => (
            <div
              key={asset.symbol}
              onClick={() => onSelectAssetForTrade && onSelectAssetForTrade(asset.symbol)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.06] hover:border-purple-500/40 transition-all cursor-pointer group shadow-xs"
            >
              <div className="flex items-center gap-3 w-48">
                <CoinIcon symbol={asset.symbol} size={36} />
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    {asset.symbol}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{asset.name}</div>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-end gap-8">
                <div className="text-right w-28">
                  <div className="font-mono-num text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {showBalances ? asset.balance.toLocaleString('en-US', { maximumFractionDigits: 4 }) : '••••'}
                  </div>
                  <div className="font-mono-num text-[10px] text-slate-500 dark:text-slate-400 sm:hidden">
                    {showBalances ? `$${asset.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••'}
                  </div>
                </div>

                <div className="hidden sm:block text-right w-28 font-mono-num text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {showBalances ? `$${asset.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••'}
                </div>

                <div className="hidden sm:block text-right w-24">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white border border-purple-200 dark:bg-purple-600/20 dark:group-hover:bg-purple-600 dark:border-purple-500/30 dark:text-purple-300 dark:group-hover:text-white transition-all shadow-xs">
                    Trade
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
