import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye,
  EyeOff,
  TrendingUp,
  ArrowUpRight,
  PlusSquare,
  Send,
  Repeat,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { OKNexusBadge3D } from '../common/OKNexusLogo';

export interface TotalAssetsAreaProps {
  balances: {
    totalAssets: number;
    pnl24hUsd?: number;
    pnl24hPct: number;
    spotUsd?: number;
    fundingUsd?: number;
    earnUsd?: number;
    futuresUsd?: number;
  };
  showBalances: boolean;
  onToggleShowBalances: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenSend: () => void;
  onOpenConvert: () => void;
  onNavigateAnalytics?: () => void;
  onNavigateWallet?: () => void;
  variant?: 'home' | 'assets';
  className?: string;
}

type CurrencyUnit = 'USD' | 'USDT' | 'BTC';
type TimeframeOption = '24H' | '7D' | '30D' | '1Y';

export const TotalAssetsArea: React.FC<TotalAssetsAreaProps> = ({
  balances,
  showBalances,
  onToggleShowBalances,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenSend,
  onOpenConvert,
  onNavigateAnalytics,
  onNavigateWallet,
  variant = 'home',
  className = '',
}) => {
  const [currency, setCurrency] = useState<CurrencyUnit>('USD');
  const [timeframe, setTimeframe] = useState<TimeframeOption>('24H');

  // Constants & conversions
  const BTC_RATE = 87450; // Reference BTC exchange rate
  const totalUsd = balances.totalAssets || 42318.65;

  // Timeframe-specific P&L data
  const timeframeData: Record<
    TimeframeOption,
    { pnlUsd: number; pnlPct: number; sparkline: number[]; label: string }
  > = {
    '24H': {
      pnlUsd: balances.pnl24hUsd ?? +(totalUsd * 0.0293).toFixed(2),
      pnlPct: balances.pnl24hPct ?? 2.93,
      sparkline: [100, 102, 101, 105, 108, 106, 112, 115],
      label: 'Today',
    },
    '7D': {
      pnlUsd: +(totalUsd * 0.0876).toFixed(2),
      pnlPct: 8.76,
      sparkline: [95, 98, 103, 101, 107, 112, 119, 122],
      label: 'Past 7 Days',
    },
    '30D': {
      pnlUsd: +(totalUsd * 0.2748).toFixed(2),
      pnlPct: 27.48,
      sparkline: [80, 85, 83, 94, 98, 105, 116, 128],
      label: 'Past 30 Days',
    },
    '1Y': {
      pnlUsd: +(totalUsd * 0.773).toFixed(2),
      pnlPct: 77.3,
      sparkline: [60, 68, 72, 85, 92, 105, 120, 142],
      label: 'Past Year',
    },
  };

  const activePnl = timeframeData[timeframe];

  // Formatted main display balance based on selected currency
  const formattedBalance = useMemo(() => {
    if (!showBalances) return '••••••••';
    switch (currency) {
      case 'USDT':
        return `${totalUsd.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      case 'BTC':
        return `${(totalUsd / BTC_RATE).toFixed(4)}`;
      case 'USD':
      default:
        return `$${totalUsd.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
    }
  }, [totalUsd, currency, showBalances, BTC_RATE]);

  // Sub-currency reference equivalent
  const subEquivalent = useMemo(() => {
    if (!showBalances) return '••••••';
    if (currency === 'BTC') {
      return `≈ $${totalUsd.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} USD`;
    }
    return `≈ ${(totalUsd / BTC_RATE).toFixed(4)} BTC`;
  }, [totalUsd, currency, showBalances, BTC_RATE]);

  // Sparkline coordinates generator
  const sparklineCoords = useMemo(() => {
    const data = activePnl.sparkline;
    const width = 84;
    const height = 28;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padY = 3;
    const usableH = height - padY * 2;

    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - padY - ((val - min) / range) * usableH;
      return { x, y };
    });

    const pathD = `M ${points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`;
    const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

    return { pathD, areaD, points, width, height };
  }, [activePnl]);

  return (
    <div id="total-assets-container" className={`relative select-none ${className}`}>
      {/* Outer Border Glow Wrapper */}
      <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-purple-500/30 via-indigo-500/15 to-emerald-500/20 dark:from-purple-500/30 dark:via-white/[0.08] dark:to-emerald-500/20 shadow-[0_8px_30px_rgba(139,92,246,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all">
        {/* Main Card Canvas */}
        <div
          id="total-assets-card"
          className="relative overflow-hidden rounded-[23px] bg-gradient-to-br from-white via-[#F9FAFC] to-[#F1F5F9] dark:from-[#10141E] dark:via-[#0B0E17] dark:to-[#07090F] p-4 sm:p-5.5 text-slate-900 dark:text-white transition-colors"
        >
          {/* Animated Atmospheric Gradient Orbs */}
          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-purple-500/15 dark:bg-purple-600/20 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-emerald-500/10 dark:bg-cyan-500/15 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.06),transparent_50%)] pointer-events-none" />

          {/* Top Bar: Title, Live Status, Currency Switcher, and Privacy Eye */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 mb-3.5">
            <div className="flex items-center gap-2.5">
              {/* Title & Live Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  {variant === 'assets' ? 'Total Net Worth' : 'Total Assets'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 -ml-3" />
                  Live
                </span>
              </div>

              {/* Eye Visibility Toggle with Smooth Rotation */}
              <motion.button
                id="toggle-balance-eye-btn"
                onClick={onToggleShowBalances}
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.08 }}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200/80 dark:border-white/[0.08] transition-colors"
                title={showBalances ? 'Hide Balance' : 'Show Balance'}
                aria-label={showBalances ? 'Hide Balance' : 'Show Balance'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {showBalances ? (
                    <motion.div
                      key="eye-open"
                      initial={{ rotate: -45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 45, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="eye-closed"
                      initial={{ rotate: 45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -45, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Currency Unit Switcher (USD | USDT | BTC) */}
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-200/70 dark:bg-white/[0.06] border border-slate-300/60 dark:border-white/[0.08]">
              {(['USD', 'USDT', 'BTC'] as CurrencyUnit[]).map((curr) => {
                const isActive = currency === curr;
                return (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`relative px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                      isActive
                        ? 'text-slate-900 dark:text-white font-extrabold'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-currency-pill"
                        className="absolute inset-0 rounded-lg bg-white dark:bg-[#182030] shadow-xs border border-slate-200 dark:border-white/10"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{curr}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Balance Presentation & 3D Logo Badge */}
          <div className="relative z-10 flex items-start justify-between gap-4 mb-4">
            <div>
              {/* Animated Rolling Balance Output */}
              <div className="flex items-baseline gap-2.5">
                <motion.div
                  key={`${formattedBalance}-${currency}`}
                  initial={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="font-mono-num text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
                >
                  {formattedBalance}
                </motion.div>
                <span className="text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                  {currency}
                </span>
              </div>

              {/* Sub-Equivalent Line */}
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono-num text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  {subEquivalent}
                </span>
                {showBalances && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
                    Est. Valuation
                  </span>
                )}
              </div>
            </div>

            {/* 3D OKNexus Holographic Badge with Idle Floating Animation */}
            <motion.div
              className="flex-shrink-0 cursor-pointer"
              animate={{ y: [0, -3.5, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
              onClick={onNavigateWallet || onNavigateAnalytics}
              title="View Complete Portfolio"
            >
              <OKNexusBadge3D size={62} />
            </motion.div>
          </div>

          {/* Performance & P&L Area with Timeframe Pills & Sparkline */}
          <div className="relative z-10 p-3 rounded-2xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] mb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* P&L Figure & Trending Badge */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-mono-num text-xs sm:text-sm font-extrabold">
                    {showBalances ? `+${activePnl.pnlPct}%` : '••••'}
                  </span>
                </div>

                {showBalances && (
                  <div className="font-mono-num text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    +${activePnl.pnlUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                )}
              </div>

              {/* Sparkline Visual Graph */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg
                    width={sparklineCoords.width}
                    height={sparklineCoords.height}
                    viewBox={`0 0 ${sparklineCoords.width} ${sparklineCoords.height}`}
                    className="overflow-visible select-none"
                  >
                    <defs>
                      <linearGradient id="pnl-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      key={`area-${timeframe}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      d={sparklineCoords.areaD}
                      fill="url(#pnl-grad)"
                    />
                    <motion.path
                      key={`path-${timeframe}`}
                      initial={{ pathLength: 0, opacity: 0.5 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      d={sparklineCoords.pathD}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Glowing End Pulse */}
                    {sparklineCoords.points.length > 0 && (
                      <circle
                        cx={sparklineCoords.points[sparklineCoords.points.length - 1].x}
                        cy={sparklineCoords.points[sparklineCoords.points.length - 1].y}
                        r={3}
                        fill="#10B981"
                        className="animate-ping"
                      />
                    )}
                  </svg>
                </div>

                {/* Timeframe Selectors (24H | 7D | 30D | 1Y) */}
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-200/60 dark:bg-white/[0.05]">
                  {(['24H', '7D', '30D', '1Y'] as TimeframeOption[]).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${
                        timeframe === tf
                          ? 'bg-white dark:bg-purple-600 text-purple-600 dark:text-white shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Financial Actions (Deposit | Withdraw | Send | Convert) */}
          <div
            id="total-assets-actions"
            className="relative z-10 grid grid-cols-4 gap-2 pt-3 border-t border-slate-200/80 dark:border-white/[0.08]"
          >
            {/* Action 1: Deposit (Highlighted Hero Primary Button) */}
            <motion.button
              id="action-deposit-btn"
              onClick={onOpenDeposit}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="relative overflow-hidden flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-gradient-to-b from-purple-600 via-purple-600 to-indigo-700 text-white shadow-[0_4px_16px_rgba(139,92,246,0.35)] hover:shadow-[0_6px_22px_rgba(139,92,246,0.45)] border border-purple-400/30 transition-all group"
            >
              <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <PlusSquare className="w-4 h-4 text-white" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold tracking-wide">Deposit</span>
            </motion.button>

            {/* Action 2: Withdraw */}
            <motion.button
              id="action-withdraw-btn"
              onClick={onOpenWithdraw}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white hover:bg-slate-50 dark:bg-[#141A26] dark:hover:bg-[#1A2232] border border-slate-200 dark:border-white/[0.08] hover:border-purple-300 dark:hover:border-purple-500/30 transition-all group shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200">
                Withdraw
              </span>
            </motion.button>

            {/* Action 3: Send */}
            <motion.button
              id="action-send-btn"
              onClick={onOpenSend}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white hover:bg-slate-50 dark:bg-[#141A26] dark:hover:bg-[#1A2232] border border-slate-200 dark:border-white/[0.08] hover:border-purple-300 dark:hover:border-purple-500/30 transition-all group shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Send className="w-4 h-4" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200">
                Send
              </span>
            </motion.button>

            {/* Action 4: Convert */}
            <motion.button
              id="action-convert-btn"
              onClick={onOpenConvert}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white hover:bg-slate-50 dark:bg-[#141A26] dark:hover:bg-[#1A2232] border border-slate-200 dark:border-white/[0.08] hover:border-purple-300 dark:hover:border-purple-500/30 transition-all group shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1 group-hover:rotate-180 transition-transform duration-300">
                <Repeat className="w-4 h-4" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200">
                Convert
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
