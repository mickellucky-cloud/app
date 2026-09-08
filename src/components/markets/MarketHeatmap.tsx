import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MarketPair, ThemeMode } from '../../types';
import { CoinIcon } from '../common/CoinIcon';
import { Sparkline } from '../common/Sparkline';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Bell,
  Layers,
  LayoutGrid,
} from 'lucide-react';

interface MarketHeatmapProps {
  marketPairs: MarketPair[];
  onSelectPair: (pair: MarketPair) => void;
  onToggleFavorite?: (symbol: string) => void;
  onOpenPriceAlerts?: (pair?: MarketPair) => void;
  theme?: ThemeMode;
}

type HeatmapFilter = 'all' | 'gainers' | 'losers';
type HeatmapLayout = 'weighted' | 'uniform';

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({
  marketPairs,
  onSelectPair,
  onToggleFavorite,
  onOpenPriceAlerts,
  theme = 'dark',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 390;
  });

  const [filter, setFilter] = useState<HeatmapFilter>('all');
  const [layout, setLayout] = useState<HeatmapLayout>('weighted');
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

  const isLight = theme === 'light';

  // Automatically track container width to adjust columns fluidly on mobile and all screen sizes
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0) {
          setContainerWidth(rect.width);
          return;
        }
      }
      if (typeof window !== 'undefined') {
        setContainerWidth(window.innerWidth);
      }
    };

    updateWidth();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = entry.contentRect?.width || entry.target.getBoundingClientRect().width;
          if (w > 0) {
            setContainerWidth(w);
          }
        }
      });
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  // Compute the optimal number of columns based on measured width for superior mobile ergonomics
  const columns = useMemo(() => {
    if (containerWidth < 280) return 1; // Ultra-compact screen / narrow split view
    if (containerWidth < 480) return 2; // Standard mobile screens in portrait (320px - 479px)
    if (containerWidth < 720) return 3; // Large mobile devices / landscape mobile / phablets (480px - 719px)
    if (containerWidth < 960) return 4; // Tablets / iPad portrait (720px - 959px)
    if (containerWidth < 1200) return 5; // Large tablets / small desktops (960px - 1199px)
    return 6; // Wide desktop monitors (>= 1200px)
  }, [containerWidth]);

  // Sort & Filter data
  const { gainers, losers, sortedPairs, topGainer, topLoser, avgChange, bullCount, bearCount } =
    useMemo(() => {
      const g = marketPairs.filter((p) => p.change24h > 0).sort((a, b) => b.change24h - a.change24h);
      const l = marketPairs.filter((p) => p.change24h < 0).sort((a, b) => a.change24h - b.change24h);

      let displayed: MarketPair[] = [];
      if (filter === 'gainers') {
        displayed = g;
      } else if (filter === 'losers') {
        displayed = l;
      } else {
        // All: sorted by magnitude of performance / movers
        displayed = [...marketPairs].sort((a, b) => b.change24h - a.change24h);
      }

      const totalChange = marketPairs.reduce((acc, p) => acc + p.change24h, 0);
      const avg = marketPairs.length > 0 ? totalChange / marketPairs.length : 0;

      return {
        gainers: g,
        losers: l,
        sortedPairs: displayed,
        topGainer: g[0] || null,
        topLoser: l[0] || null,
        avgChange: avg,
        bullCount: g.length,
        bearCount: l.length,
      };
    }, [marketPairs, filter]);

  // Styling helper based on 24h Change %
  const getTileStyles = (change: number, isHovered: boolean) => {
    if (isLight) {
      if (change >= 8) {
        return {
          bg: 'bg-emerald-100/95 hover:bg-emerald-200/95',
          border: isHovered ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-emerald-300',
          textTitle: 'text-emerald-950',
          textSub: 'text-emerald-800',
          badgeBg: 'bg-emerald-600 text-white-force font-bold',
          iconColor: 'text-emerald-700',
        };
      }
      if (change >= 4) {
        return {
          bg: 'bg-emerald-100/70 hover:bg-emerald-100/95',
          border: isHovered ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-emerald-200',
          textTitle: 'text-emerald-900',
          textSub: 'text-emerald-700',
          badgeBg: 'bg-emerald-600 text-white-force font-bold',
          iconColor: 'text-emerald-600',
        };
      }
      if (change > 0) {
        return {
          bg: 'bg-emerald-50 hover:bg-emerald-100/60',
          border: isHovered ? 'border-emerald-400 ring-2 ring-emerald-500/20' : 'border-emerald-200/70',
          textTitle: 'text-emerald-900',
          textSub: 'text-emerald-700',
          badgeBg: 'bg-emerald-500/20 text-emerald-800 font-bold',
          iconColor: 'text-emerald-600',
        };
      }
      if (change === 0) {
        return {
          bg: 'bg-slate-100 hover:bg-slate-200/60',
          border: isHovered ? 'border-slate-400' : 'border-slate-200',
          textTitle: 'text-slate-800',
          textSub: 'text-slate-600',
          badgeBg: 'bg-slate-200 text-slate-700 font-medium',
          iconColor: 'text-slate-500',
        };
      }
      if (change > -4) {
        return {
          bg: 'bg-rose-50 hover:bg-rose-100/60',
          border: isHovered ? 'border-rose-400 ring-2 ring-rose-500/20' : 'border-rose-200/70',
          textTitle: 'text-rose-900',
          textSub: 'text-rose-700',
          badgeBg: 'bg-rose-500/20 text-rose-800 font-bold',
          iconColor: 'text-rose-600',
        };
      }
      if (change > -8) {
        return {
          bg: 'bg-rose-100/70 hover:bg-rose-100/95',
          border: isHovered ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-rose-200',
          textTitle: 'text-rose-900',
          textSub: 'text-rose-700',
          badgeBg: 'bg-rose-600 text-white-force font-bold',
          iconColor: 'text-rose-600',
        };
      }
      return {
        bg: 'bg-rose-100/95 hover:bg-rose-200/95',
        border: isHovered ? 'border-rose-600 ring-2 ring-rose-500/30' : 'border-rose-300',
        textTitle: 'text-rose-950',
        textSub: 'text-rose-800',
        badgeBg: 'bg-rose-600 text-white-force font-bold',
        iconColor: 'text-rose-700',
      };
    }

    // Dark Mode Styling
    if (change >= 8) {
      return {
        bg: 'bg-gradient-to-br from-emerald-900/90 via-emerald-800/85 to-emerald-950/90 hover:from-emerald-800 hover:to-emerald-900',
        border: isHovered
          ? 'border-emerald-400 ring-2 ring-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
          : 'border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
        textTitle: 'text-white',
        textSub: 'text-emerald-200/80',
        badgeBg: 'bg-emerald-400 text-emerald-950 font-extrabold shadow-sm',
        iconColor: 'text-emerald-300',
      };
    }
    if (change >= 4) {
      return {
        bg: 'bg-gradient-to-br from-emerald-950/80 via-[#064E3B]/70 to-[#022c22]/80 hover:from-[#065F46]/80 hover:to-[#064E3B]/90',
        border: isHovered
          ? 'border-emerald-400/80 ring-2 ring-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
          : 'border-emerald-600/40',
        textTitle: 'text-white',
        textSub: 'text-emerald-300/80',
        badgeBg: 'bg-emerald-500/25 text-emerald-300 font-bold border border-emerald-500/30',
        iconColor: 'text-emerald-400',
      };
    }
    if (change > 0) {
      return {
        bg: 'bg-gradient-to-br from-[#064e3b]/40 to-[#022c22]/40 hover:from-[#064e3b]/60 hover:to-[#022c22]/60',
        border: isHovered
          ? 'border-emerald-500/70 ring-1 ring-emerald-400/20'
          : 'border-emerald-800/30',
        textTitle: 'text-slate-100',
        textSub: 'text-emerald-300/70',
        badgeBg: 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/20',
        iconColor: 'text-emerald-400',
      };
    }
    if (change === 0) {
      return {
        bg: 'bg-[#13192B]/80 hover:bg-[#1A223A]',
        border: isHovered ? 'border-slate-500' : 'border-slate-800/60',
        textTitle: 'text-slate-200',
        textSub: 'text-slate-400',
        badgeBg: 'bg-slate-800 text-slate-300 font-medium',
        iconColor: 'text-slate-400',
      };
    }
    if (change > -4) {
      return {
        bg: 'bg-gradient-to-br from-[#4c0519]/40 to-[#2c020d]/40 hover:from-[#4c0519]/60 hover:to-[#2c020d]/60',
        border: isHovered
          ? 'border-rose-500/70 ring-1 ring-rose-400/20'
          : 'border-rose-900/30',
        textTitle: 'text-slate-100',
        textSub: 'text-rose-300/70',
        badgeBg: 'bg-rose-500/15 text-rose-400 font-bold border border-rose-500/20',
        iconColor: 'text-rose-400',
      };
    }
    if (change > -8) {
      return {
        bg: 'bg-gradient-to-br from-[#881337]/75 via-[#4c0519]/80 to-[#2c020d]/90 hover:from-[#9f1239]/80 hover:to-[#4c0519]/90',
        border: isHovered
          ? 'border-rose-400/80 ring-2 ring-rose-400/30 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
          : 'border-rose-600/40',
        textTitle: 'text-white',
        textSub: 'text-rose-300/80',
        badgeBg: 'bg-rose-500/25 text-rose-300 font-bold border border-rose-500/30',
        iconColor: 'text-rose-400',
      };
    }
    return {
      bg: 'bg-gradient-to-br from-rose-900/90 via-rose-800/85 to-rose-950/90 hover:from-rose-800 hover:to-rose-900',
      border: isHovered
        ? 'border-rose-400 ring-2 ring-rose-400/40 shadow-[0_0_20px_rgba(244,63,94,0.35)]'
        : 'border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
      textTitle: 'text-white',
      textSub: 'text-rose-200/80',
      badgeBg: 'bg-rose-400 text-rose-950 font-extrabold shadow-sm',
      iconColor: 'text-rose-300',
    };
  };

  // Determine span class when in weighted mode dynamically tailored to the active column count
  const getWeightedSpan = (pair: MarketPair, index: number, totalCols: number) => {
    if (layout !== 'weighted') return 'col-span-1 row-span-1 min-h-[82px] sm:min-h-[88px]';

    if (totalCols <= 1) {
      return 'col-span-1 min-h-[92px]';
    }

    if (totalCols === 2) {
      // 2-column mobile screens:
      // Leader #1 (BTC) takes full 2-column width and 2 rows for spotlight
      if (index === 0) {
        return 'col-span-2 row-span-2 min-h-[126px]';
      }
      // Leader #2 (ETH) takes 1 column and 2 rows
      if (index === 1) {
        return 'col-span-1 row-span-2 min-h-[120px]';
      }
      // Index 2 and 3 each take 1 column and 1 row (stacking neatly beside ETH)
      if (index < 4) {
        return 'col-span-1 row-span-1 min-h-[84px]';
      }
      return 'col-span-1 row-span-1 min-h-[80px]';
    }

    if (totalCols === 3) {
      // 3-column phablet / mobile landscape:
      // Index 0 takes 2 cols x 2 rows; Index 1 takes 1 col x 2 rows (sum = 3 columns, perfectly filling 2 rows)
      if (index === 0) {
        return 'col-span-2 row-span-2 min-h-[132px]';
      }
      if (index === 1) {
        return 'col-span-1 row-span-2 min-h-[132px]';
      }
      return 'col-span-1 row-span-1 min-h-[84px]';
    }

    if (totalCols === 4) {
      // 4-column tablet / iPad portrait:
      if (index === 0 || index === 1) {
        return 'col-span-2 row-span-2 min-h-[138px]';
      }
      if (index === 2) {
        return 'col-span-2 row-span-1 min-h-[90px]';
      }
      return 'col-span-1 min-h-[84px]';
    }

    // 5 or 6 columns for large displays:
    if (index === 0 || index === 1) {
      return 'col-span-2 row-span-2 min-h-[144px]';
    }
    if (totalCols >= 5 && index === 2) {
      return 'col-span-1 row-span-2 min-h-[144px]';
    }
    return 'col-span-1 min-h-[86px]';
  };

  return (
    <div
      id="market-heatmap-container"
      ref={containerRef}
      className={`rounded-2xl border p-3 sm:p-4 transition-colors ${
        isLight
          ? 'bg-white/80 border-slate-200/80 shadow-sm'
          : 'bg-[#0B0F1C]/90 border-white/[0.08] shadow-lg'
      }`}
    >
      {/* Top Header & Overview Bar */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isLight ? 'bg-purple-100 text-purple-700' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className={`text-sm font-bold tracking-tight truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Market Heatmap
              </h2>
              <p className={`text-[11px] truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Visual sentiment matrix & momentum scan
              </p>
            </div>
          </div>

          {/* Auto Column Count Badge & Sizing/Layout Toggle */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Auto-Adjusted Column Indicator Pill */}
            <div
              id="heatmap-auto-col-indicator"
              className={`text-[10px] font-mono px-2 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                isLight
                  ? 'bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-white/[0.06] text-slate-300 border-white/[0.08]'
              }`}
              title={`Auto-adjusted to ${columns} columns based on current screen width (${Math.round(containerWidth)}px)`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold">{columns} {columns === 1 ? 'col' : 'cols'}</span>
              <span className="text-[9px] opacity-70 hidden min-[360px]:inline">auto</span>
            </div>

            <button
              id="heatmap-layout-weighted"
              type="button"
              onClick={() => setLayout('weighted')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                layout === 'weighted'
                  ? isLight
                    ? 'bg-purple-600 text-white-force font-semibold shadow-xs'
                    : 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                  : isLight
                  ? 'text-slate-500 hover:text-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Weighted Treemap (Market Volume & Movers)"
              aria-label="Weighted Treemap"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              id="heatmap-layout-uniform"
              type="button"
              onClick={() => setLayout('uniform')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                layout === 'uniform'
                  ? isLight
                    ? 'bg-purple-600 text-white-force font-semibold shadow-xs'
                    : 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                  : isLight
                  ? 'text-slate-500 hover:text-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Uniform Grid"
              aria-label="Uniform Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pulse Stats Bar */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl border text-xs ${
            isLight
              ? 'bg-slate-50 border-slate-200/70 text-slate-700'
              : 'bg-[#0E1322] border-white/[0.05] text-slate-300'
          }`}
        >
          {/* Sentiment Ratio */}
          <div className="flex flex-col">
            <span className={`text-[10px] uppercase font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Market Pulse
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center text-emerald-500 font-bold text-xs">
                {bullCount} ↗
              </span>
              <span className={`text-[11px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>/</span>
              <span className="inline-flex items-center text-rose-500 font-bold text-xs">
                {bearCount} ↘
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                  avgChange >= 0
                    ? isLight
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-emerald-500/20 text-emerald-400'
                    : isLight
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {avgChange >= 0 ? `+${avgChange.toFixed(2)}%` : `${avgChange.toFixed(2)}%`}
              </span>
            </div>
          </div>

          {/* Top Gainer */}
          {topGainer && (
            <div
              className="flex flex-col cursor-pointer group"
              onClick={() => onSelectPair(topGainer)}
              title="Click to view top gainer"
            >
              <span className={`text-[10px] uppercase font-medium flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <TrendingUp className="w-2.5 h-2.5 text-emerald-500" /> Top Bull
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-bold text-xs text-emerald-500 group-hover:underline">
                  {topGainer.base}
                </span>
                <span className="font-mono text-[11px] text-emerald-400 font-bold">
                  +{topGainer.change24h}%
                </span>
              </div>
            </div>
          )}

          {/* Top Loser */}
          {topLoser && (
            <div
              className="flex flex-col cursor-pointer group"
              onClick={() => onSelectPair(topLoser)}
              title="Click to view top loser"
            >
              <span className={`text-[10px] uppercase font-medium flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <TrendingDown className="w-2.5 h-2.5 text-rose-500" /> Top Bear
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-bold text-xs text-rose-500 group-hover:underline">
                  {topLoser.base}
                </span>
                <span className="font-mono text-[11px] text-rose-400 font-bold">
                  {topLoser.change24h}%
                </span>
              </div>
            </div>
          )}

          {/* Active Pairs Count */}
          <div className="flex flex-col">
            <span className={`text-[10px] uppercase font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Monitored
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {sortedPairs.length} Pairs
              </span>
              <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                Live
              </span>
            </div>
          </div>
        </div>

        {/* Filter Pills (All Movers, Top Gainers, Top Losers) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <button
            id="heatmap-filter-all"
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? isLight
                  ? 'bg-purple-600 text-white-force shadow-xs'
                  : 'bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                : isLight
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                : 'bg-[#101422] text-slate-400 border border-white/[0.06] hover:text-slate-200'
            }`}
          >
            All Movers ({marketPairs.length})
          </button>
          <button
            id="heatmap-filter-gainers"
            type="button"
            onClick={() => setFilter('gainers')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              filter === 'gainers'
                ? isLight
                  ? 'bg-emerald-600 text-white-force shadow-xs'
                  : 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : isLight
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                : 'bg-[#101422] text-slate-400 border border-white/[0.06] hover:text-slate-200'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
            Top Gainers ({gainers.length})
          </button>
          <button
            id="heatmap-filter-losers"
            type="button"
            onClick={() => setFilter('losers')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              filter === 'losers'
                ? isLight
                  ? 'bg-rose-600 text-white-force shadow-xs'
                  : 'bg-rose-600/30 text-rose-200 border border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                : isLight
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                : 'bg-[#101422] text-slate-400 border border-white/[0.06] hover:text-slate-200'
            }`}
          >
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
            Top Losers ({losers.length})
          </button>
        </div>
      </div>

      {/* Heatmap Grid */}
      {sortedPairs.length === 0 ? (
        <div className="py-10 text-center text-xs text-slate-400">
          No pairs match the selected heatmap filter.
        </div>
      ) : (
        <div
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
          className={`grid gap-1.5 sm:gap-2 transition-all ${
            layout === 'weighted' ? 'auto-rows-fr' : ''
          }`}
        >
          {sortedPairs.map((pair, idx) => {
            const isHovered = hoveredSymbol === pair.symbol;
            const styles = getTileStyles(pair.change24h, isHovered);
            const spanClass = getWeightedSpan(pair, idx, columns);
            const isLarge = spanClass.includes('col-span-2 row-span-2');

            return (
              <div
                key={pair.symbol}
                id={`heatmap-tile-${pair.base}`}
                onClick={() => onSelectPair(pair)}
                onMouseEnter={() => setHoveredSymbol(pair.symbol)}
                onMouseLeave={() => setHoveredSymbol(null)}
                className={`relative group rounded-xl border p-2.5 sm:p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 transform-gpu active:scale-[0.98] select-none ${styles.bg} ${styles.border} ${spanClass}`}
              >
                {/* Tile Header: Coin Base & Badge */}
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <CoinIcon symbol={pair.base} size={isLarge ? 30 : (columns >= 3 && containerWidth < 580 ? 20 : 24)} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className={`font-black tracking-tight truncate ${isLarge ? 'text-sm sm:text-base' : 'text-xs'} ${styles.textTitle}`}>
                          {pair.base}
                        </span>
                        {pair.isFavorite && (
                          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className={`text-[9px] sm:text-[10px] truncate max-w-[75px] ${styles.textSub}`}>
                        {pair.quote}
                      </div>
                    </div>
                  </div>

                  {/* 24h Change Pill */}
                  <div
                    className={`px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-mono leading-none tracking-tight flex items-center gap-0.5 flex-shrink-0 ${styles.badgeBg}`}
                  >
                    {pair.change24h > 0 ? (
                      <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                    ) : pair.change24h < 0 ? (
                      <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                    ) : null}
                    <span>{pair.change24h > 0 ? `+${pair.change24h}%` : `${pair.change24h}%`}</span>
                  </div>
                </div>

                {/* Center / Large Tile Elements: Sparkline or Range */}
                {isLarge && (
                  <div className="my-1.5 sm:my-2 flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className={`text-[9px] sm:text-[10px] font-medium ${styles.textSub}`}>24h Range</div>
                      <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-mono mt-0.5 opacity-85">
                        <span>${pair.low24h.toLocaleString()}</span>
                        <span>${pair.high24h.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-1 bg-black/20 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-white/80 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                5,
                                ((pair.price - pair.low24h) /
                                  Math.max(1, pair.high24h - pair.low24h)) *
                                  100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-16 sm:w-20 hidden min-[360px]:block flex-shrink-0">
                      <Sparkline
                        data={pair.sparkline}
                        isPositive={pair.change24h >= 0}
                        width={columns >= 3 ? 60 : 76}
                        height={24}
                      />
                    </div>
                  </div>
                )}

                {/* Tile Footer: Current Price & Volume */}
                <div className="mt-1.5 sm:mt-2 flex items-end justify-between gap-1 pt-1 border-t border-black/10 dark:border-white/10">
                  <div className="min-w-0">
                    <div className={`font-mono font-bold tracking-tight truncate ${isLarge ? 'text-sm sm:text-base' : 'text-xs'} ${styles.textTitle}`}>
                      ${pair.price >= 1
                        ? pair.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : pair.price.toFixed(4)}
                    </div>
                    <div className={`text-[8.5px] sm:text-[9px] font-mono truncate max-w-[90px] ${styles.textSub}`}>
                      Vol: {pair.volume24h.split(' ')[0]}
                    </div>
                  </div>

                  {/* Quick Action Button for Alerts on Hover/Always */}
                  {onOpenPriceAlerts && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPriceAlerts(pair);
                      }}
                      className={`p-1 rounded-lg transition-all opacity-80 hover:opacity-100 ${
                        isLight
                          ? 'hover:bg-white/80 text-slate-700'
                          : 'hover:bg-white/20 text-slate-200'
                      }`}
                      title={`Set alert for ${pair.symbol}`}
                      aria-label={`Set price alert for ${pair.symbol}`}
                    >
                      <Bell className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Heatmap Color Scale Legend */}
      <div className="mt-4 pt-3 border-t border-white/[0.08] dark:border-white/[0.05] flex flex-wrap items-center justify-between gap-2 text-[10px]">
        <div className={`flex items-center gap-1.5 font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          <span>Scale:</span>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3 rounded bg-rose-600 inline-block" title="≤ -8%" />
            <span className="w-3.5 h-3 rounded bg-rose-800 inline-block" title="-4% to -8%" />
            <span className="w-3.5 h-3 rounded bg-rose-950/80 inline-block" title="0% to -4%" />
            <span className="w-2.5 h-3 rounded bg-slate-700 inline-block" title="0%" />
            <span className="w-3.5 h-3 rounded bg-emerald-950/80 inline-block" title="0% to +4%" />
            <span className="w-3.5 h-3 rounded bg-emerald-800 inline-block" title="+4% to +8%" />
            <span className="w-3.5 h-3 rounded bg-emerald-500 inline-block" title="≥ +8%" />
          </div>
          <span className="font-mono text-[9px]">-8%</span>
          <span className="font-mono text-[9px]">0%</span>
          <span className="font-mono text-[9px]">+8%</span>
        </div>

        <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Tap any block to trade pair
        </div>
      </div>
    </div>
  );
};
