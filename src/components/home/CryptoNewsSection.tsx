import React, { useState, useEffect } from 'react';
import { CryptoNewsItem, MarketPair } from '../../types';
import { CoinIcon } from '../common/CoinIcon';
import {
  Newspaper,
  Sparkles,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Clock,
  ChevronDown,
  ChevronUp,
  Star,
  Share2,
  Bookmark,
  Check,
  Zap,
  ArrowUpRight,
  Search,
  Globe,
} from 'lucide-react';

interface CryptoNewsSectionProps {
  favoritePairs: MarketPair[];
  onSelectPairForTrade: (pair: MarketPair) => void;
  onNavigateMarkets: () => void;
  allMarketPairs: MarketPair[];
}

export const CryptoNewsSection: React.FC<CryptoNewsSectionProps> = ({
  favoritePairs,
  onSelectPairForTrade,
  onNavigateMarkets,
  allMarketPairs,
}) => {
  const [headlines, setHeadlines] = useState<CryptoNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [searchSource, setSearchSource] = useState<'google-search-grounding' | 'curated-live-feed'>('curated-live-feed');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedFilterSymbol, setSelectedFilterSymbol] = useState<string>('ALL');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);

  // Extract unique favorite symbols (e.g. BTC, ETH, SOL, OKN)
  const favoriteSymbols = React.useMemo(() => {
    const list = Array.from(new Set(favoritePairs.map((p) => p.base.toUpperCase())));
    return list.length > 0 ? list : ['BTC', 'ETH', 'SOL', 'OKN'];
  }, [favoritePairs]);

  // Fetch news headlines from backend using real-time search
  const fetchNews = async (filterSymbol?: string, isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const symbolsToQuery = filterSymbol && filterSymbol !== 'ALL'
        ? [filterSymbol]
        : favoriteSymbols;

      const res = await fetch('/api/crypto-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbols: symbolsToQuery }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      if (Array.isArray(data.headlines)) {
        setHeadlines(data.headlines.slice(0, 5));
        setSearchSource(data.source || 'curated-live-feed');
        if (data.searchQueries && data.searchQueries.length > 0) {
          setSearchQueries(data.searchQueries);
        } else {
          setSearchQueries(symbolsToQuery.map((s: string) => `${s} breaking crypto news`));
        }
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (_err) {
      // Gracefully silent on network or rate limit fallback
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load when favorite symbols change
  useEffect(() => {
    fetchNews(selectedFilterSymbol === 'ALL' ? undefined : selectedFilterSymbol);
  }, [favoriteSymbols, selectedFilterSymbol]);

  // Handle filter chip click
  const handleFilterClick = (symbol: string) => {
    setSelectedFilterSymbol(symbol);
  };

  // Toggle bookmark
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Share / Copy headline
  const handleShare = (item: CryptoNewsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${item.title} — via OKNexus Market Intel: ${item.url || window.location.href}`);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Navigate to trade for this coin
  const handleTradeCoin = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetPair = allMarketPairs.find(
      (p) => p.base.toUpperCase() === symbol.toUpperCase() && p.quote === 'USDT'
    ) || allMarketPairs.find((p) => p.base.toUpperCase() === symbol.toUpperCase()) || allMarketPairs[0];

    onSelectPairForTrade(targetPair);
  };

  return (
    <section id="home-crypto-news" className="mb-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]">
            <Newspaper className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Market Intelligence</h2>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                Live Search
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            id="refresh-crypto-news-btn"
            onClick={() => fetchNews(selectedFilterSymbol === 'ALL' ? undefined : selectedFilterSymbol, true)}
            disabled={isRefreshing}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 active:scale-95 border border-slate-200 dark:border-white/10 text-[11px] font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all disabled:opacity-50"
            title="Refresh real-time search headlines"
          >
            <RefreshCw className={`w-3 h-3 text-purple-600 dark:text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Sub-header Banner: Favorite Assets Context & Real-time Indicator */}
      <div className="p-3 mb-3 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50/50 to-fuchsia-50 dark:from-[#121028] dark:via-[#0D1527] dark:to-[#120F24] border border-purple-200/80 dark:border-purple-500/20 shadow-xs">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-bold text-slate-900 dark:text-white">Your Favorite Assets</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">• Top 5 Headlines</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {lastUpdated}
          </span>
        </div>

        {/* Favorite Assets Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 pt-0.5">
          <button
            onClick={() => handleFilterClick('ALL')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
              selectedFilterSymbol === 'ALL'
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-2xs dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-700/70 dark:hover:text-white dark:border-white/5'
            }`}
          >
            <Sparkles className="w-3 h-3 text-fuchsia-400 dark:text-fuchsia-300" />
            All ({favoriteSymbols.length})
          </button>

          {favoriteSymbols.map((symbol) => (
            <button
              key={symbol}
              onClick={() => handleFilterClick(symbol)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedFilterSymbol === symbol
                  ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-2xs dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-700/70 dark:hover:text-white dark:border-white/5'
              }`}
            >
              <CoinIcon symbol={symbol} size={14} />
              <span>{symbol}</span>
            </button>
          ))}

          <button
            onClick={onNavigateMarkets}
            className="px-2 py-1 rounded-full text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-100/60 dark:hover:bg-purple-500/10 transition-colors whitespace-nowrap ml-auto"
          >
            + Edit Favorites
          </button>
        </div>

        {/* Grounding / Search Query Status */}
        {searchQueries.length > 0 && (
          <div className="mt-2 pt-2 border-t border-purple-200/60 dark:border-white/[0.06] flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1 truncate max-w-[280px]">
              <Search className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              <span className="truncate">
                Query: <span className="text-slate-800 dark:text-slate-300 italic">{searchQueries[0]}</span>
              </span>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400/90 font-mono text-[9px] flex items-center gap-0.5 flex-shrink-0">
              <Globe className="w-2.5 h-2.5" />
              Real-time Web
            </span>
          </div>
        )}
      </div>

      {/* Headlines List Container */}
      {isLoading ? (
        <div className="space-y-2.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#0E131F]/90 border border-slate-200 dark:border-white/[0.06] animate-pulse"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="w-12 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="w-16 h-3.5 rounded bg-slate-200 dark:bg-slate-800 ml-auto" />
              </div>
              <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-800 mb-1.5" />
              <div className="w-3/4 h-3.5 rounded bg-slate-200/60 dark:bg-slate-800/60" />
            </div>
          ))}
        </div>
      ) : headlines.length === 0 ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0E131F]/70 border border-slate-200 dark:border-white/[0.06] text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            No headlines retrieved for the selected assets.
          </p>
          <button
            onClick={() => fetchNews(undefined, true)}
            className="px-3 py-1.5 rounded-xl bg-purple-600 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
          >
            Re-run Real-time Search
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {headlines.map((item, index) => {
            const isExpanded = expandedId === item.id;
            const isBookmarked = bookmarkedIds.has(item.id);
            const isBullish = item.sentiment === 'bullish';
            const isBearish = item.sentiment === 'bearish';

            return (
              <div
                key={item.id || index}
                id={`crypto-news-card-${index}`}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className={`group rounded-2xl border transition-all cursor-pointer p-3.5 ${
                  isExpanded
                    ? 'bg-gradient-to-b from-purple-50/70 via-white to-white dark:from-[#141A29] dark:to-[#0E131F] border-purple-300 dark:border-purple-500/40 shadow-md'
                    : 'bg-white hover:bg-slate-50/90 dark:bg-[#0D121D]/90 dark:hover:bg-[#111726] border-slate-200 hover:border-slate-300 dark:border-white/[0.07] dark:hover:border-white/15 shadow-2xs'
                }`}
              >
                {/* Meta Top Row: Asset Icon, Category, Sentiment Pill, Time */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white">
                      <CoinIcon symbol={item.coinSymbol} size={16} />
                      <span>{item.coinSymbol}</span>
                    </div>

                    {item.category && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-500/30">
                        {item.category}
                      </span>
                    )}

                    {item.impact && (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                          item.impact === 'High'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                        }`}
                      >
                        {item.impact}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    {/* Sentiment Pill */}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        isBullish
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30'
                          : isBearish
                          ? 'bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30'
                          : 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-700/40 dark:text-slate-300 dark:border-slate-600/30'
                      }`}
                    >
                      {isBullish ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : isBearish ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : null}
                      <span className="capitalize">{item.sentiment}</span>
                    </span>

                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pl-1">{item.timeAgo}</span>
                  </div>
                </div>

                {/* Headline Title */}
                <h3 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors leading-snug mb-1.5">
                  {item.title}
                </h3>

                {/* Summary (truncated when collapsed, full when expanded) */}
                <p
                  className={`text-xs text-slate-600 dark:text-slate-400 leading-relaxed transition-all ${
                    isExpanded ? 'line-clamp-none' : 'line-clamp-2'
                  }`}
                >
                  {item.summary}
                </p>

                {/* Expanded Action Panel */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/[0.08] animate-fade-in">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Trade Asset Quick Action */}
                        <button
                          onClick={(e) => handleTradeCoin(item.coinSymbol, e)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-bold active:scale-95 transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                        >
                          <span>Trade {item.coinSymbol}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        {/* Open Source Article */}
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 dark:text-slate-200 hover:dark:text-white text-xs font-semibold border border-slate-200 dark:border-white/10 transition-colors"
                          >
                            <span>Open Source</span>
                            <ExternalLink className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                          </a>
                        )}
                      </div>

                      {/* Bookmark & Share Icons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleShare(item, e)}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                          title="Share headline"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={(e) => toggleBookmark(item.id, e)}
                          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                            isBookmarked
                              ? 'bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-500/20 dark:border-amber-500/40 dark:text-amber-300'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-700/80 border-slate-200 dark:border-white/10 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                          }`}
                          title={isBookmarked ? 'Remove bookmark' : 'Bookmark headline'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-600 dark:fill-amber-400' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer bar: Publisher info and Expand toggle */}
                <div className="flex items-center justify-between mt-2 pt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-300">{item.publisher}</span>
                    {item.sourceDomain && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">({item.sourceDomain})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-semibold">
                    <span>{isExpanded ? 'Collapse' : 'Deep Dive'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
