import React, { useState, useMemo } from 'react';
import { MarketPair, ThemeMode } from '../../types';
import { CoinIcon } from '../common/CoinIcon';
import { Sparkline } from '../common/Sparkline';
import { MarketHeatmap } from './MarketHeatmap';
import { Search, Star, ArrowUpDown, Bell, List, LayoutGrid, ArrowRight, Flame } from 'lucide-react';
import { MarketsSkeleton } from '../skeletons/MarketsSkeleton';

interface MarketsScreenProps {
  marketPairs: MarketPair[];
  onSelectPair: (pair: MarketPair) => void;
  onToggleFavorite: (symbol: string) => void;
  onOpenPriceAlerts?: (pair?: MarketPair) => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  isLoading?: boolean;
}

export const MarketsScreen: React.FC<MarketsScreenProps> = ({
  marketPairs,
  onSelectPair,
  onToggleFavorite,
  onOpenPriceAlerts,
  theme = 'dark',
  onToggleTheme,
  isLoading = false,
}) => {
  if (isLoading) {
    return <MarketsSkeleton />;
  }
  const [viewMode, setViewMode] = useState<'list' | 'heatmap'>('list');
  const [activeCategory, setActiveCategory] = useState<'favorites' | 'hot' | 'gainers' | 'new' | 'losers'>('hot');
  const [quoteFilter, setQuoteFilter] = useState<'all' | 'USDT' | 'BTC' | 'ETH' | 'SOL'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'pair' | 'price' | 'change'>('change');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredPairs = useMemo(() => {
    return marketPairs
      .filter((pair) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            pair.symbol.toLowerCase().includes(q) ||
            pair.name.toLowerCase().includes(q) ||
            pair.base.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Category filter
        if (activeCategory === 'favorites') return pair.isFavorite;
        if (activeCategory === 'hot') return pair.category === 'hot' || pair.isFavorite;
        if (activeCategory === 'gainers') return pair.change24h > 0;
        if (activeCategory === 'losers') return pair.change24h < 0;
        if (activeCategory === 'new') return pair.category === 'new' || pair.symbol.includes('OKN');

        return true;
      })
      .filter((pair) => {
        if (quoteFilter === 'all') return true;
        return pair.quote === quoteFilter;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortField === 'pair') diff = a.symbol.localeCompare(b.symbol);
        if (sortField === 'price') diff = a.price - b.price;
        if (sortField === 'change') diff = a.change24h - b.change24h;
        return sortAsc ? diff : -diff;
      });
  }, [marketPairs, searchQuery, activeCategory, quoteFilter, sortField, sortAsc]);

  const handleSort = (field: 'pair' | 'price' | 'change') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div
      id="markets-screen"
      className={`pb-28 md:pb-12 pt-3 px-3 sm:px-6 lg:px-8 mx-auto min-h-screen text-slate-900 dark:text-slate-100 bg-white dark:bg-[#07090E] transition-all duration-300 ${
        viewMode === 'heatmap' ? 'w-full max-w-5xl lg:max-w-7xl' : 'w-full max-w-md md:max-w-4xl lg:max-w-7xl'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold font-display text-slate-900 dark:text-white tracking-tight">Markets</h1>
          
          {/* List vs Heatmap Segmented View Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-[#111624] border border-slate-200 dark:border-white/10 rounded-xl p-0.5">
            <button
              id="markets-view-mode-list"
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'list'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title="Classic List View"
              aria-label="List View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              id="markets-view-mode-heatmap"
              type="button"
              onClick={() => setViewMode('heatmap')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'heatmap'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title="Market Heatmap View"
              aria-label="Market Heatmap View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Heatmap</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 sm:flex-1 sm:max-w-[280px] justify-end">
          <div className="relative flex-1 min-w-[100px] max-w-[160px] sm:max-w-none">
            <input
              type="text"
              placeholder="Search coin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-7 sm:pl-8 pr-2 text-xs rounded-xl bg-slate-100 dark:bg-[#111624] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
            <Search className="absolute left-2 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
          {onOpenPriceAlerts && (
            <button
              type="button"
              onClick={() => onOpenPriceAlerts()}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-[#111624] border border-slate-200 dark:border-white/10 hover:border-purple-500/40 text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-300 transition-colors flex-shrink-0"
              title="Price Alerts"
              aria-label="Price Alerts"
            >
              <Bell className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs (Favorites, Hot, Gainers, New, Losers) */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-2 mb-3 text-xs font-semibold">
        {(['favorites', 'hot', 'gainers', 'new', 'losers'] as const).map((tab) => (
          <button
            key={tab}
            id={`market-tab-${tab}`}
            onClick={() => setActiveCategory(tab)}
            className={`capitalize transition-all relative pb-1.5 px-1 ${
              activeCategory === tab
                ? 'text-purple-600 dark:text-white font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab}
            {activeCategory === tab && (
              <span className="absolute bottom-[-9px] left-0 right-0 h-[2.5px] bg-gradient-to-r from-purple-500 to-fuchsia-400 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Secondary Filter Pills (All, USDT, BTC, ETH, SOL) */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['all', 'USDT', 'BTC', 'ETH', 'SOL'] as const).map((q) => (
            <button
              key={q}
              id={`filter-quote-${q}`}
              onClick={() => setQuoteFilter(q)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                quoteFilter === q
                  ? 'bg-purple-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 dark:bg-[#101422] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.06] hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {q.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Quick View Toggle indicator */}
        <button
          type="button"
          onClick={() => setViewMode((prev) => (prev === 'list' ? 'heatmap' : 'list'))}
          className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 flex-shrink-0 transition-colors"
        >
          {viewMode === 'list' ? (
            <>
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Heatmap</span>
            </>
          ) : (
            <>
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </>
          )}
        </button>
      </div>

      {/* VIEW MODE: HEATMAP */}
      {viewMode === 'heatmap' ? (
        <div className="animate-in fade-in duration-200">
          <MarketHeatmap
            marketPairs={
              // If search query is present, filter by search query; otherwise display active categorized/quote pairs or all
              searchQuery.trim()
                ? filteredPairs
                : filteredPairs.length > 0
                ? filteredPairs
                : marketPairs
            }
            onSelectPair={onSelectPair}
            onToggleFavorite={onToggleFavorite}
            onOpenPriceAlerts={onOpenPriceAlerts}
            theme={theme}
          />
        </div>
      ) : (
        /* VIEW MODE: LIST */
        <div className="animate-in fade-in duration-200">
          {/* Quick Jump / Spotlight to Market Heatmap */}
          <div
            id="heatmap-spotlight-banner"
            onClick={() => setViewMode('heatmap')}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-purple-500/25 bg-slate-50 dark:bg-gradient-to-r dark:from-purple-900/15 dark:via-[#0A1020] dark:to-[#0A1020] hover:border-purple-500/40 transition-all cursor-pointer flex items-center justify-between group mb-3 shadow-xs"
            title="Open Market Heatmap"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-gradient-to-tr dark:from-rose-500/30 dark:via-purple-500/30 dark:to-emerald-500/30 flex items-center justify-center border border-purple-200 dark:border-white/10 group-hover:scale-105 transition-transform">
                <LayoutGrid className="w-4 h-4 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  <span>Market Heatmap Scanner</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Scan top gainers & losers using color-coded blocks
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300">
              <span className="hidden sm:inline">Open</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Column Headers */}
          <div className="flex items-center justify-between px-3 py-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/[0.08] mb-1">
            <button
              onClick={() => handleSort('pair')}
              className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200 transition-colors w-44 sm:w-56"
            >
              <span>Pair / Name</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>

            <div className="flex items-center justify-end gap-5 lg:gap-8 flex-1">
              <div className="hidden md:block text-right w-24">
                <span>24h High</span>
              </div>
              <div className="hidden md:block text-right w-24">
                <span>24h Low</span>
              </div>
              <div className="hidden lg:block text-right w-24">
                <span>24h Volume</span>
              </div>
              <div className="hidden sm:block text-center w-24">
                <span>7d Trend</span>
              </div>
              <button
                onClick={() => handleSort('price')}
                className="flex items-center justify-end gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition-colors w-24 text-right"
              >
                <span>Price</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>

              <button
                onClick={() => handleSort('change')}
                className="flex items-center justify-end gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition-colors w-20 text-right"
              >
                <span>24h Change</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>

              <div className="hidden md:block w-16 text-right">
                <span>Action</span>
              </div>
            </div>
          </div>

          {/* Market Pairs List */}
          <div id="markets-pair-list" className="space-y-1">
            {filteredPairs.length === 0 ? (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs">
                No matching crypto pairs found.
              </div>
            ) : (
              filteredPairs.map((pair) => (
                <div
                  key={pair.symbol}
                  id={`market-row-${pair.base}`}
                  onClick={() => onSelectPair(pair)}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.04] active:bg-slate-100 dark:active:bg-white/[0.08] transition-colors cursor-pointer group"
                >
                  {/* Left: Star + Coin Icon + Symbol + Name */}
                  <div className="flex items-center gap-2.5 w-44 sm:w-56">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(pair.symbol);
                      }}
                      className="p-1 -ml-1 text-slate-400 hover:text-amber-400 transition-colors"
                      aria-label="Toggle favorite"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          pair.isFavorite
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-400 hover:text-slate-500 dark:hover:text-slate-300'
                        }`}
                      />
                    </button>

                    <CoinIcon symbol={pair.base} size={34} />

                    <div className="min-w-0">
                      <div className="flex items-baseline gap-1">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                          {pair.base}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                          /{pair.quote}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[90px] sm:max-w-[130px]">
                        {pair.name}
                      </div>
                    </div>
                  </div>

                  {/* Middle/Right: High, Low, Vol, Trend, Price, 24h% badge, Trade button */}
                  <div className="flex items-center justify-end gap-5 lg:gap-8 flex-1">
                    {/* 24h High (Tablet & Desktop) */}
                    <div className="hidden md:block text-right w-24 font-mono-num text-xs text-slate-700 dark:text-slate-300">
                      ${pair.high24h >= 1 ? pair.high24h.toLocaleString('en-US', { minimumFractionDigits: 2 }) : pair.high24h.toFixed(4)}
                    </div>

                    {/* 24h Low (Tablet & Desktop) */}
                    <div className="hidden md:block text-right w-24 font-mono-num text-xs text-slate-500 dark:text-slate-400">
                      ${pair.low24h >= 1 ? pair.low24h.toLocaleString('en-US', { minimumFractionDigits: 2 }) : pair.low24h.toFixed(4)}
                    </div>

                    {/* 24h Volume (Desktop) */}
                    <div className="hidden lg:block text-right w-24 font-mono-num text-xs text-slate-500 dark:text-slate-400">
                      ${(pair.volumeQuote / 1_000_000).toFixed(1)}M
                    </div>

                    {/* Sparkline (Tablet & Desktop) */}
                    <div className="hidden sm:flex items-center justify-center w-24">
                      <Sparkline
                        data={pair.sparkline}
                        isPositive={pair.change24h >= 0}
                        width={64}
                        height={20}
                      />
                    </div>

                    {/* Price */}
                    <div className="text-right w-24">
                      <div className="font-mono-num text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {pair.price >= 1
                          ? `$${pair.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : `$${pair.price.toFixed(4)}`}
                      </div>
                      <div className="text-[10px] font-mono-num text-slate-500 dark:text-slate-400 md:hidden">
                        ${pair.price >= 1 ? pair.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : pair.price.toFixed(4)}
                      </div>
                    </div>

                    {/* 24h Change Pill */}
                    <div className="w-20 text-right">
                      <div
                        className={`inline-block min-w-[68px] px-2 py-1.5 rounded-lg text-center font-mono-num text-xs font-bold ${
                          pair.change24h >= 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/20'
                        }`}
                      >
                        {pair.change24h >= 0 ? `+${pair.change24h}%` : `${pair.change24h}%`}
                      </div>
                    </div>

                    {/* Trade Button (Tablet & Desktop) */}
                    <div className="hidden md:block w-16 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPair(pair);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white border border-purple-200 dark:bg-purple-600/20 dark:hover:bg-purple-600 dark:border-purple-500/40 dark:text-purple-300 dark:hover:text-white transition-all shadow-xs"
                      >
                        Trade
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

