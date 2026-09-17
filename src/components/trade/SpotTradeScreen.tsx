import React, { useState, useEffect, useRef } from 'react';
import { MarketPair, OpenOrder, ThemeMode } from '../../types';
import { OKNexusLogo } from '../common/OKNexusLogo';
import { TradeChart, ChartTimeframe } from './TradeChart';
import { OrderBookPanel } from './OrderBookPanel';
import { OrderEntryForm } from './OrderEntryForm';
import { OrdersHistoryPanel } from './OrdersHistoryPanel';
import {
  ChevronDown,
  Star,
  QrCode,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Share2,
  CandlestickChart,
  SlidersHorizontal,
  Maximize2,
  Zap,
} from 'lucide-react';
import { TradeSkeleton } from '../skeletons/TradeSkeleton';

interface SpotTradeScreenProps {
  selectedPair: MarketPair;
  availableUsdt: number;
  availableCrypto: number;
  onOpenPairSelector: () => void;
  onOpenDeposit: () => void;
  onToggleFavorite: (symbol: string) => void;
  onOpenPriceAlerts?: (pair: MarketPair) => void;
  activeAlertsCount?: number;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  isLoading?: boolean;
}

export const SpotTradeScreen: React.FC<SpotTradeScreenProps> = ({
  selectedPair,
  availableUsdt,
  availableCrypto,
  onOpenPairSelector,
  onOpenDeposit,
  onToggleFavorite,
  onOpenPriceAlerts,
  activeAlertsCount = 0,
  theme = 'dark',
  onToggleTheme,
  isLoading = false,
}) => {
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('1H');
  const [selectedBookPrice, setSelectedBookPrice] = useState<number | null>(null);
  const [openOrders, setOpenOrders] = useState<OpenOrder[]>([
    {
      id: 'ORD-91A20F',
      symbol: selectedPair.symbol,
      side: 'buy',
      type: 'limit',
      price: Number((selectedPair.price * 0.985).toFixed(2)),
      amount: 0.12,
      filled: 0,
      time: '14:20:10',
      status: 'open',
    },
    {
      id: 'ORD-77F42C',
      symbol: selectedPair.symbol,
      side: 'sell',
      type: 'limit',
      price: Number((selectedPair.price * 1.025).toFixed(2)),
      amount: 0.25,
      filled: 0.10,
      time: '13:45:22',
      status: 'partial',
    },
  ]);
  const [historyOrders, setHistoryOrders] = useState<OpenOrder[]>([
    {
      id: 'ORD-88C11A',
      symbol: selectedPair.symbol,
      side: 'buy',
      type: 'market',
      price: Number((selectedPair.price * 0.975).toFixed(2)),
      amount: 0.085,
      filled: 0.085,
      time: '09:15:32',
      status: 'completed',
    },
    {
      id: 'ORD-65B90X',
      symbol: selectedPair.symbol,
      side: 'sell',
      type: 'limit',
      price: Number((selectedPair.price * 1.018).toFixed(2)),
      amount: 0.15,
      filled: 0.15,
      time: '07:30:15',
      status: 'completed',
    },
  ]);

  // Mobile Dual-Mode Switcher: 'trade' (split terminal) | 'chart' (full chart + floating actions)
  const [mobileViewMode, setMobileViewMode] = useState<'trade' | 'chart'>('trade');
  const [activeSide, setActiveSide] = useState<'buy' | 'sell'>('buy');

  // Live price tick animation state
  const [lastTickDirection, setLastTickDirection] = useState<'up' | 'down' | null>(null);
  const [livePrice, setLivePrice] = useState<number>(selectedPair.price);
  const prevPriceRef = useRef<number>(selectedPair.price);

  const liveAskPrice = Number((livePrice * 1.0001).toFixed(2));
  const liveBidPrice = Number((livePrice * 0.9999).toFixed(2));

  const handleActionBuy = () => {
    setActiveSide('buy');
    setMobileViewMode('trade');
  };

  const handleActionSell = () => {
    setActiveSide('sell');
    setMobileViewMode('trade');
  };

  // Sync when selectedPair changes
  useEffect(() => {
    setLivePrice(selectedPair.price);
    prevPriceRef.current = selectedPair.price;
  }, [selectedPair.symbol, selectedPair.price]);

  // Subtle simulated market ticker pulse (mimicking WebSocket updates)
  useEffect(() => {
    const timer = setInterval(() => {
      // 40% chance of a micro-tick
      if (Math.random() > 0.45) {
        const deltaPct = (Math.random() * 0.0006 - 0.0003); // +/- 0.03%
        const newP = Number((prevPriceRef.current * (1 + deltaPct)).toFixed(2));
        const dir = newP >= prevPriceRef.current ? 'up' : 'down';
        setLastTickDirection(dir);
        prevPriceRef.current = newP;
        setLivePrice(newP);

        // Reset direction glow after 600ms
        setTimeout(() => {
          setLastTickDirection(null);
        }, 600);
      }
    }, 3800);

    return () => clearInterval(timer);
  }, []);

  // Handle order creation
  const handleOrderPlaced = (order: OpenOrder, feedbackMsg: string) => {
    if (order.status === 'completed') {
      setHistoryOrders((prev) => [order, ...prev]);
    } else {
      setOpenOrders((prev) => [order, ...prev]);
    }
  };

  // Cancel orders
  const handleCancelOrder = (id: string) => {
    setOpenOrders((prev) => {
      const target = prev.find((o) => o.id === id);
      if (target) {
        setHistoryOrders((h) => [{ ...target, status: 'cancelled' }, ...h]);
      }
      return prev.filter((o) => o.id !== id);
    });
  };

  const handleCancelAllOrders = () => {
    setHistoryOrders((h) => [
      ...openOrders.map((o) => ({ ...o, status: 'cancelled' as const })),
      ...h,
    ]);
    setOpenOrders([]);
  };

  // Click on orderbook row to fill order form price
  const handleSelectPriceFromBook = (price: number) => {
    setSelectedBookPrice(price);
  };

  const updatedPair: MarketPair = {
    ...selectedPair,
    price: livePrice,
  };

  if (isLoading) {
    return <TradeSkeleton />;
  }

  return (
    <div
      id="spot-trade-screen"
      className="pb-32 md:pb-12 pt-2 px-3 sm:px-6 lg:px-8 max-w-lg md:max-w-4xl lg:max-w-7xl mx-auto min-h-screen text-slate-900 dark:text-slate-100 bg-white dark:bg-[#07090E] transition-colors"
    >
      {/* Desktop Top Bar Header (Hidden on Mobile where MobileTopBar handles it) */}
      <header className="hidden md:flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-white/[0.06] mb-2.5">
        <div className="flex items-center gap-2">
          <OKNexusLogo size={24} />
          <button
            id="pair-selector-trigger"
            type="button"
            onClick={onOpenPairSelector}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#121626] border border-slate-200 dark:border-white/10 hover:border-purple-500/50 text-sm font-bold text-slate-900 dark:text-white transition-all active:scale-95 shadow-xs"
          >
            <span>{selectedPair.symbol}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>
          <span className="text-[10px] font-mono-num font-extrabold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 tracking-wider">
            SPOT
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Price Alert Action */}
          {onOpenPriceAlerts && (
            <button
              id="trade-price-alert-btn"
              type="button"
              onClick={() => onOpenPriceAlerts(updatedPair)}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 hover:border-purple-500/40 transition-colors text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-300 active:scale-95"
              title="Set Price Alert"
              aria-label="Set Price Alert"
            >
              <Bell className="w-4 h-4" />
              {activeAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[15px] h-3.5 px-1 rounded-full bg-purple-600 text-white text-[9px] font-mono-num font-bold flex items-center justify-center shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                  {activeAlertsCount}
                </span>
              )}
            </button>
          )}

          {/* Watchlist Star */}
          <button
            type="button"
            onClick={() => onToggleFavorite(selectedPair.symbol)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-colors active:scale-95"
            aria-label="Favorite pair"
          >
            <Star
              className={`w-4 h-4 ${
                selectedPair.isFavorite
                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            />
          </button>
        </div>
      </header>

      {/* 24h Real-Time Ticker & Market Depth Strip */}
      <section
        id="trade-market-strip"
        className="rounded-2xl bg-slate-50 dark:bg-[#090C14] border border-slate-200 dark:border-white/[0.08] p-3 shadow-xs dark:shadow-lg mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md"
      >
        <div className="flex items-baseline sm:items-center gap-3">
          {/* Main Price with live tick animation */}
          <div className="flex items-baseline gap-2">
            <span
              className={`font-mono-num text-2xl lg:text-3xl font-extrabold tracking-tight transition-colors duration-300 ${
                lastTickDirection === 'up'
                  ? 'text-emerald-600 dark:text-emerald-300 scale-[1.02]'
                  : lastTickDirection === 'down'
                  ? 'text-rose-600 dark:text-rose-300 scale-[1.02]'
                  : selectedPair.change24h >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {livePrice >= 1
                ? livePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : livePrice.toFixed(4)}
            </span>

            <span
              className={`font-mono-num text-xs font-bold px-1.5 py-0.5 rounded-lg flex items-center gap-0.5 ${
                selectedPair.change24h >= 0
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
              }`}
            >
              {selectedPair.change24h >= 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span>{selectedPair.change24h >= 0 ? `+${selectedPair.change24h}%` : `${selectedPair.change24h}%`}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono-num text-slate-500 dark:text-slate-400">
            <span>≈ ${livePrice.toFixed(2)} USD</span>
            {onOpenPriceAlerts && (
              <button
                type="button"
                onClick={() => onOpenPriceAlerts(updatedPair)}
                className="inline-flex items-center gap-1 text-[10px] text-purple-700 dark:text-purple-300 font-sans font-semibold bg-purple-100 hover:bg-purple-200 dark:bg-purple-500/15 dark:hover:bg-purple-500/25 px-1.5 py-0.5 rounded-md border border-purple-200 dark:border-purple-500/30 transition-colors"
              >
                <Bell className="w-2.5 h-2.5" />
                <span>+ Alert</span>
              </button>
            )}
          </div>
        </div>

        {/* 24h High, Low, Vol, Turnover Grid */}
        <div className="grid grid-cols-4 sm:flex sm:items-center gap-x-4 gap-y-1 text-[11px] text-right">
          <div>
            <div className="text-slate-500 text-[10px]">24h High</div>
            <div className="font-mono-num text-slate-800 dark:text-slate-200 font-semibold">{selectedPair.high24h.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-slate-500 text-[10px]">24h Low</div>
            <div className="font-mono-num text-slate-800 dark:text-slate-200 font-semibold">{selectedPair.low24h.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-slate-500 text-[10px]">24h Vol</div>
            <div className="font-mono-num text-slate-800 dark:text-slate-200 font-semibold">{selectedPair.volume24h}</div>
          </div>
          <div>
            <div className="text-slate-500 text-[10px]">24h Turnover</div>
            <div className="font-mono-num text-slate-800 dark:text-slate-200 font-semibold">
              ${(selectedPair.volumeQuote / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Mode Switcher: Trade vs Chart */}
      <div className="flex lg:hidden items-center justify-between gap-2 mb-3 bg-slate-100/90 dark:bg-[#0E121E]/90 backdrop-blur-md p-1 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-xs">
        <button
          type="button"
          onClick={() => setMobileViewMode('trade')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            mobileViewMode === 'trade'
              ? 'bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-xs font-extrabold scale-[1.01]'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Trade</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileViewMode('chart')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            mobileViewMode === 'chart'
              ? 'bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-xs font-extrabold scale-[1.01]'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CandlestickChart className="w-3.5 h-3.5" />
          <span>Chart</span>
        </button>
      </div>

      {/* MOBILE VIEWPORT CONTENT (lg:hidden) */}
      <div className="block lg:hidden">
        {mobileViewMode === 'trade' ? (
          <div className="space-y-4">
            {/* Split Terminal: Left 58% Order Entry, Right 42% Compact Order Book */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-7">
                <OrderEntryForm
                  pair={updatedPair}
                  availableUsdt={availableUsdt}
                  availableCrypto={availableCrypto}
                  externalPrice={selectedBookPrice}
                  onOrderPlaced={handleOrderPlaced}
                  onOpenDeposit={onOpenDeposit}
                  isCompact={true}
                  initialSide={activeSide}
                  onSideChange={setActiveSide}
                />
              </div>
              <div className="col-span-5">
                <OrderBookPanel
                  pair={updatedPair}
                  onSelectPrice={handleSelectPriceFromBook}
                  isCompact={true}
                />
              </div>
            </div>

            {/* Orders Management for Mobile Viewport */}
            <section className="mt-3">
              <OrdersHistoryPanel
                pair={updatedPair}
                openOrders={openOrders}
                historyOrders={historyOrders}
                availableCrypto={availableCrypto}
                availableUsdt={availableUsdt}
                onCancelOrder={handleCancelOrder}
                onCancelAllOrders={handleCancelAllOrders}
              />
            </section>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Full-width mobile chart */}
            <TradeChart
              pair={updatedPair}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />

            {/* Minimal Floating Action Micro-Capsule (Unobtrusive & Sleek) */}
            <div className="fixed bottom-20 inset-x-0 z-40 px-4 pointer-events-none flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="pointer-events-auto py-1 px-2 rounded-full bg-white/90 dark:bg-[#0E121E]/90 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.2)] flex items-center justify-between gap-2 max-w-[280px] w-full">
                {/* Minimal Buy Action */}
                <button
                  type="button"
                  onClick={handleActionBuy}
                  className="py-1 px-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-[10px] flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                  title="Quick Buy"
                >
                  <span>Buy</span>
                  <span className="font-mono-num font-semibold text-[9px] opacity-90">
                    ${liveAskPrice >= 1 ? liveAskPrice.toFixed(2) : liveAskPrice.toFixed(4)}
                  </span>
                </button>

                {/* Available Balance Micro-Indicator */}
                <button
                  type="button"
                  onClick={() => setMobileViewMode('trade')}
                  className="px-1 text-center hover:opacity-75 active:scale-95 transition-all cursor-pointer"
                  title="Switch to trade form"
                >
                  <span className="font-mono-num text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                    {availableUsdt >= 1000 ? `${(availableUsdt / 1000).toFixed(1)}k` : availableUsdt.toFixed(0)} USDT
                  </span>
                </button>

                {/* Minimal Sell Action */}
                <button
                  type="button"
                  onClick={handleActionSell}
                  className="py-1 px-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold text-[10px] flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                  title="Quick Sell"
                >
                  <span>Sell</span>
                  <span className="font-mono-num font-semibold text-[9px] opacity-90">
                    ${liveBidPrice >= 1 ? liveBidPrice.toFixed(2) : liveBidPrice.toFixed(4)}
                  </span>
                </button>
              </div>
            </div>

            {/* Orders Management below chart in mobile chart mode */}
            <section className="mt-3">
              <OrdersHistoryPanel
                pair={updatedPair}
                openOrders={openOrders}
                historyOrders={historyOrders}
                availableCrypto={availableCrypto}
                availableUsdt={availableUsdt}
                onCancelOrder={handleCancelOrder}
                onCancelAllOrders={handleCancelAllOrders}
              />
            </section>
          </div>
        )}
      </div>

      {/* DESKTOP VIEWPORT CONTENT (hidden lg:grid) */}
      <div className="hidden lg:grid grid-cols-12 gap-4">
        {/* Left/Main Column: Chart & History */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Interactive Candlestick / Line / Depth Pro Chart */}
          <section>
            <TradeChart
              pair={updatedPair}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />
          </section>

          {/* Orders Management on Desktop / Tablet (Open Orders, Order History) */}
          <section>
            <OrdersHistoryPanel
              pair={updatedPair}
              openOrders={openOrders}
              historyOrders={historyOrders}
              availableCrypto={availableCrypto}
              availableUsdt={availableUsdt}
              onCancelOrder={handleCancelOrder}
              onCancelAllOrders={handleCancelAllOrders}
            />
          </section>
        </div>

        {/* Right Column: Order Entry & Order Book */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          {/* Pro Order Entry Form */}
          <OrderEntryForm
            pair={updatedPair}
            availableUsdt={availableUsdt}
            availableCrypto={availableCrypto}
            externalPrice={selectedBookPrice}
            onOrderPlaced={handleOrderPlaced}
            onOpenDeposit={onOpenDeposit}
          />

          {/* Order Book & Recent Trades Panel */}
          <OrderBookPanel
            pair={updatedPair}
            onSelectPrice={handleSelectPriceFromBook}
          />
        </div>
      </div>
    </div>
  );
};
