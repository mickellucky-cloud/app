import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  PieChart,
  ShieldCheck,
  Zap,
  BarChart2,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  CheckCircle2,
  RefreshCw,
  Award,
  Clock,
  Sparkles,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { ThemeMode } from '../../types';
import { AnalyticsSkeleton } from '../skeletons/AnalyticsSkeleton';

interface AnalyticsScreenProps {
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  onNavigateTrade?: () => void;
  onNavigateMarkets?: () => void;
  onOpenDeposit?: () => void;
  onBack?: () => void;
  isLoading?: boolean;
}

type TimeRange = '24H' | '7D' | '30D' | '90D' | '1Y' | 'ALL';

interface TradeLogItem {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  amount: string;
  pnlUsd: number;
  pnlPct: number;
  date: string;
  strategy: 'Spot Grid' | 'Arbitrage' | 'Manual' | 'DCA';
}

const PERFORMANCE_DATA: Record<TimeRange, { roiPct: number; profitUsd: number; points: number[] }> = {
  '24H': { roiPct: 2.85, profitUsd: 1380.20, points: [100, 101, 100.5, 101.8, 102.2, 102.85] },
  '7D': { roiPct: 8.42, profitUsd: 3950.40, points: [95, 96.2, 98.4, 97.1, 101.3, 102.5, 108.42] },
  '30D': { roiPct: 24.15, profitUsd: 9420.80, points: [80, 84, 88, 85, 93, 98, 104.15] },
  '90D': { roiPct: 46.80, profitUsd: 15640.00, points: [68, 74, 79, 88, 96, 108, 114.8] },
  '1Y': { roiPct: 112.50, profitUsd: 26800.50, points: [48, 55, 64, 78, 85, 99, 112.5] },
  'ALL': { roiPct: 184.20, profitUsd: 38450.00, points: [35, 48, 62, 75, 90, 115, 184.2] },
};

const ASSET_ALLOCATIONS = [
  { symbol: 'BTC', name: 'Bitcoin', pct: 45, value: 21712.50, color: 'bg-amber-500', hex: '#F59E0B' },
  { symbol: 'ETH', name: 'Ethereum', pct: 25, value: 12062.50, color: 'bg-indigo-500', hex: '#6366F1' },
  { symbol: 'SOL', name: 'Solana', pct: 15, value: 7237.50, color: 'bg-cyan-500', hex: '#06B6D4' },
  { symbol: 'USDT', name: 'Tether USD', pct: 10, value: 4825.00, color: 'bg-emerald-500', hex: '#10B981' },
  { symbol: 'OKN', name: 'OKNexus Token', pct: 5, value: 2412.50, color: 'bg-purple-500', hex: '#A855F7' },
];

const RECENT_TRADE_LOGS: TradeLogItem[] = [
  {
    id: 't-1',
    pair: 'BTC/USDT',
    type: 'BUY',
    entryPrice: 65840.0,
    exitPrice: 67210.5,
    amount: '0.45 BTC',
    pnlUsd: 616.72,
    pnlPct: 2.08,
    date: 'Today, 14:32',
    strategy: 'Spot Grid',
  },
  {
    id: 't-2',
    pair: 'SOL/USDT',
    type: 'BUY',
    entryPrice: 172.5,
    exitPrice: 184.2,
    amount: '35.0 SOL',
    pnlUsd: 409.50,
    pnlPct: 6.78,
    date: 'Today, 11:15',
    strategy: 'Arbitrage',
  },
  {
    id: 't-3',
    pair: 'ETH/USDT',
    type: 'SELL',
    entryPrice: 3480.0,
    exitPrice: 3410.0,
    amount: '2.5 ETH',
    pnlUsd: 175.00,
    pnlPct: 2.01,
    date: 'Yesterday, 19:40',
    strategy: 'Manual',
  },
  {
    id: 't-4',
    pair: 'OKN/USDT',
    type: 'BUY',
    entryPrice: 4.15,
    exitPrice: 4.85,
    amount: '1,500 OKN',
    pnlUsd: 1050.00,
    pnlPct: 16.86,
    date: '2 days ago',
    strategy: 'DCA',
  },
];

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  theme = 'dark',
  onToggleTheme,
  onNavigateTrade,
  onNavigateMarkets,
  onOpenDeposit,
  onBack,
  isLoading = false,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');
  const currentPerf = PERFORMANCE_DATA[timeRange];

  // SVG Chart points calculation
  const points = currentPerf.points;
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const range = maxVal - minVal || 1;
  const svgWidth = 700;
  const svgHeight = 220;
  const padding = 20;

  const polylineCoords = points
    .map((val, idx) => {
      const x = padding + (idx / (points.length - 1)) * (svgWidth - padding * 2);
      const y = svgHeight - padding - ((val - minVal) / range) * (svgHeight - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const areaCoords = `${polylineCoords} ${svgWidth - padding},${svgHeight} ${padding},${svgHeight}`;

  if (isLoading) {
    return <AnalyticsSkeleton onBack={onBack} />;
  }

  return (
    <div
      id="analytics-dashboard-screen"
      className="pb-32 md:pb-16 pt-4 px-4 sm:px-6 lg:px-8 max-w-md md:max-w-4xl lg:max-w-7xl mx-auto min-h-screen text-slate-900 dark:text-slate-100 bg-white dark:bg-[#07090E] transition-colors"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-200 dark:border-white/[0.07]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              id="analytics-back-button"
              onClick={onBack}
              aria-label="Go back"
              className="hidden md:flex p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                Portfolio & Trade Analytics
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-500/30">
                PRO TRADER
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real-time PnL performance, win-rate metrics, asset distribution, and execution logs.
            </p>
          </div>
        </div>

        {/* Time Range Selector & Theme Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#0E121E] border border-slate-200 dark:border-white/10 shadow-2xs">
            {(['24H', '7D', '30D', '90D', '1Y', 'ALL'] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  timeRange === r
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {/* Card 1: Net Cumulative ROI */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0D111C] border border-slate-200 dark:border-white/[0.07] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold">Cumulative Return</span>
            <span className="text-[10px] font-mono-num font-bold text-emerald-600 dark:text-emerald-400">
              +{currentPerf.roiPct}%
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono-num text-slate-900 dark:text-white">
            +${currentPerf.profitUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Outperforming BTC by +12.4%</span>
          </div>
        </div>

        {/* Card 2: Win Rate */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0D111C] border border-slate-200 dark:border-white/[0.07] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold">Win Rate (30d)</span>
            <span className="text-[10px] font-mono-num font-bold text-purple-600 dark:text-purple-400">
              113 / 148 W
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono-num text-slate-900 dark:text-white">
            76.4%
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
            <span>Profit Factor: 2.84</span>
          </div>
        </div>

        {/* Card 3: Sharpe Ratio & Risk */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0D111C] border border-slate-200 dark:border-white/[0.07] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold">Sharpe Ratio</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
              LOW RISK
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono-num text-slate-900 dark:text-white">
            2.45
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
            <span>Max Drawdown: -5.2%</span>
          </div>
        </div>

        {/* Card 4: 30D Trading Volume */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0D111C] border border-slate-200 dark:border-white/[0.07] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold">30D Volume</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
              VIP 2
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono-num text-slate-900 dark:text-white">
            $284,500
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>$542.50 fee savings</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Performance Curve & Asset Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6 items-start">
        {/* Performance Chart Curve (8 Cols) */}
        <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0D111C] border border-slate-200 dark:border-white/[0.07] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                PnL Performance Trajectory ({timeRange})
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Continuous mark-to-market NAV evaluation with high-watermark tracking
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-mono-num font-bold text-emerald-600 dark:text-emerald-400">
                LIVE
              </span>
            </div>
          </div>

          {/* SVG Vector Chart with Smooth Gradient Fill */}
          <div className="w-full overflow-hidden rounded-xl bg-white dark:bg-[#080B14] p-3 border border-slate-200 dark:border-white/[0.05]">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-48 sm:h-56"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={0} y1={svgHeight / 4} x2={svgWidth} y2={svgHeight / 4} stroke="currentColor" strokeOpacity="0.08" />
              <line x1={0} y1={svgHeight / 2} x2={svgWidth} y2={svgHeight / 2} stroke="currentColor" strokeOpacity="0.08" />
              <line x1={0} y1={(svgHeight * 3) / 4} x2={svgWidth} y2={(svgHeight * 3) / 4} stroke="currentColor" strokeOpacity="0.08" />

              {/* Area Fill */}
              <polygon points={areaCoords} fill="url(#curveGradient)" />

              {/* Primary Curve */}
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylineCoords}
              />

              {/* High Watermark Dot */}
              <circle
                cx={svgWidth - padding}
                cy={svgHeight - padding - ((points[points.length - 1] - minVal) / range) * (svgHeight - padding * 2)}
                r="6"
                fill="#10B981"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          {/* Chart footer insights */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-white/[0.06] text-center">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Lowest NAV</span>
              <span className="font-mono-num text-xs font-bold text-slate-800 dark:text-slate-200">
                ${(48250 * 0.92).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Peak NAV</span>
              <span className="font-mono-num text-xs font-bold text-emerald-600 dark:text-emerald-400">
                $48,250.00
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Net Gain</span>
              <span className="font-mono-num text-xs font-bold text-emerald-600 dark:text-emerald-400">
                +${currentPerf.profitUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>

        {/* Asset Allocation Breakdown (4 Cols) */}
        <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0D111C] border border-slate-200 dark:border-white/[0.07] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Asset Allocation</span>
            </h3>
            <span className="text-[11px] font-mono-num text-slate-500 dark:text-slate-400">
              5 Coins
            </span>
          </div>

          {/* Visual Color Segmented Progress Bar */}
          <div className="h-3 w-full rounded-full overflow-hidden flex shadow-inner bg-slate-200 dark:bg-slate-800">
            {ASSET_ALLOCATIONS.map((asset) => (
              <div
                key={asset.symbol}
                style={{ width: `${asset.pct}%`, backgroundColor: asset.hex }}
                title={`${asset.name}: ${asset.pct}%`}
                className="h-full first:rounded-l-full last:rounded-r-full hover:opacity-80 transition-opacity"
              />
            ))}
          </div>

          {/* Allocation Items */}
          <div className="space-y-2.5 pt-1">
            {ASSET_ALLOCATIONS.map((asset) => (
              <div
                key={asset.symbol}
                className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-white dark:hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: asset.hex }} />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{asset.symbol}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1.5 hidden sm:inline">
                      {asset.name}
                    </span>
                  </div>
                </div>
                <div className="text-right font-mono-num">
                  <span className="font-bold text-slate-900 dark:text-white">${asset.value.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1.5 font-semibold">
                    ({asset.pct}%)
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Rebalance Call to action */}
          <button
            onClick={onNavigateTrade}
            className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>Rebalance Portfolio</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Trade History & Execution Journal */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0D111C] border border-slate-200 dark:border-white/[0.07] shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Recent Trade Execution Journal
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Closed orders with algorithmic attribution and net realized profit
            </p>
          </div>
          {onNavigateTrade && (
            <button
              onClick={onNavigateTrade}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>Spot Terminal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Table list */}
        <div className="divide-y divide-slate-200 dark:divide-white/[0.06] overflow-x-auto">
          {RECENT_TRADE_LOGS.map((trade) => (
            <div key={trade.id} className="py-3 flex items-center justify-between gap-3 text-xs">
              {/* Pair & Side */}
              <div className="flex items-center gap-3 min-w-[140px]">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                    trade.type === 'BUY'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                  }`}
                >
                  {trade.type}
                </span>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{trade.pair}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{trade.date}</div>
                </div>
              </div>

              {/* Strategy Badge */}
              <div className="hidden sm:block">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {trade.strategy}
                </span>
              </div>

              {/* Execution Prices */}
              <div className="hidden md:block text-right font-mono-num">
                <div className="text-slate-900 dark:text-white">
                  ${trade.exitPrice.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Entry: ${trade.entryPrice.toLocaleString()}
                </div>
              </div>

              {/* PnL and Profit */}
              <div className="text-right font-mono-num">
                <div className="font-bold text-emerald-600 dark:text-emerald-400">
                  +${trade.pnlUsd.toFixed(2)}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  +{trade.pnlPct.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
