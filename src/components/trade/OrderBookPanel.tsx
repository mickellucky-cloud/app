import React, { useState } from 'react';
import { MarketPair, OrderBookItem, TradeHistoryItem } from '../../types';
import { ArrowUpRight, ArrowDownRight, Layers, Clock, Settings2 } from 'lucide-react';

interface OrderBookPanelProps {
  pair: MarketPair;
  onSelectPrice: (price: number) => void;
  className?: string;
}

export const OrderBookPanel: React.FC<OrderBookPanelProps> = ({
  pair,
  onSelectPrice,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'book' | 'trades'>('book');
  const [bookDisplay, setBookDisplay] = useState<'both' | 'bids' | 'asks'>('both');
  const [precision, setPrecision] = useState<'0.01' | '0.1' | '1'>('0.01');
  const [clickedPrice, setClickedPrice] = useState<number | null>(null);

  // Generate dynamic asks & bids around pair.price
  const price = pair.price;
  const pUnit = precision === '1' ? 1 : precision === '0.1' ? 0.1 : 0.01;

  const asks: OrderBookItem[] = [
    { price: price + pUnit * 5, amount: 0.3845, total: (price + pUnit * 5) * 0.3845, depthPct: 82 },
    { price: price + pUnit * 4, amount: 0.5120, total: (price + pUnit * 4) * 0.5120, depthPct: 95 },
    { price: price + pUnit * 3, amount: 0.2194, total: (price + pUnit * 3) * 0.2194, depthPct: 48 },
    { price: price + pUnit * 2, amount: 0.1652, total: (price + pUnit * 2) * 0.1652, depthPct: 35 },
    { price: price + pUnit * 1, amount: 0.2980, total: (price + pUnit * 1) * 0.2980, depthPct: 62 },
  ];

  const bids: OrderBookItem[] = [
    { price: price - pUnit * 1, amount: 0.3421, total: (price - pUnit * 1) * 0.3421, depthPct: 68 },
    { price: price - pUnit * 2, amount: 0.4812, total: (price - pUnit * 2) * 0.4812, depthPct: 88 },
    { price: price - pUnit * 3, amount: 0.1985, total: (price - pUnit * 3) * 0.1985, depthPct: 42 },
    { price: price - pUnit * 4, amount: 0.5310, total: (price - pUnit * 4) * 0.5310, depthPct: 92 },
    { price: price - pUnit * 5, amount: 0.2415, total: (price - pUnit * 5) * 0.2415, depthPct: 50 },
  ];

  // Simulated live trade stream
  const trades: TradeHistoryItem[] = [
    { id: '1', price: price, amount: 0.1542, time: '16:42:18', type: 'buy' },
    { id: '2', price: price, amount: 0.0821, time: '16:42:15', type: 'buy' },
    { id: '3', price: price - pUnit, amount: 0.4109, time: '16:42:09', type: 'sell' },
    { id: '4', price: price + pUnit, amount: 0.2014, time: '16:42:01', type: 'buy' },
    { id: '5', price: price - pUnit, amount: 0.1872, time: '16:41:54', type: 'sell' },
    { id: '6', price: price, amount: 0.3120, time: '16:41:48', type: 'buy' },
    { id: '7', price: price - pUnit * 2, amount: 0.0954, time: '16:41:39', type: 'sell' },
  ];

  const handleRowClick = (val: number) => {
    setClickedPrice(val);
    onSelectPrice(val);
    setTimeout(() => setClickedPrice(null), 600);
  };

  const bidRatio = 54.8;
  const askRatio = 45.2;

  return (
    <div
      id="order-book-panel"
      className={`rounded-2xl bg-slate-50 dark:bg-[#090C14] border border-slate-200 dark:border-white/[0.08] p-3 shadow-xs dark:shadow-xl transition-all ${className}`}
    >
      {/* Tab Switcher: Order Book vs Recent Trades */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06] pb-2 mb-2">
        <div className="flex items-center gap-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('book')}
            className={`flex items-center gap-1.5 pb-1 relative transition-colors ${
              activeTab === 'book' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Order Book</span>
            {activeTab === 'book' && (
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-purple-600 dark:bg-purple-500 rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('trades')}
            className={`flex items-center gap-1.5 pb-1 relative transition-colors ${
              activeTab === 'trades' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Trades</span>
            {activeTab === 'trades' && (
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-cyan-600 dark:bg-cyan-400 rounded-full" />
            )}
          </button>
        </div>

        {/* Display Controls (Precision Selector) */}
        {activeTab === 'book' && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono-num">Prec:</span>
            {(['0.01', '0.1', '1'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPrecision(p)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono-num font-bold transition-all ${
                  precision === p
                    ? 'bg-purple-100 text-purple-700 border border-purple-300 dark:bg-purple-600/40 dark:text-purple-200 dark:border-purple-500/40'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.04]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeTab === 'book' ? (
        <div>
          {/* Market Sentiment Depth Ratio */}
          <div className="mb-2">
            <div className="flex justify-between text-[10px] font-mono-num font-bold mb-1">
              <span className="text-emerald-600 dark:text-emerald-400">Bids {bidRatio}%</span>
              <span className="text-rose-600 dark:text-rose-400">Asks {askRatio}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 flex overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${bidRatio}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
                style={{ width: `${askRatio}%` }}
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-3 text-[10px] text-slate-500 dark:text-slate-400 font-medium pb-1 mb-1 border-b border-slate-200 dark:border-white/[0.04]">
            <span>Price (USDT)</span>
            <span className="text-right">Size ({pair.base})</span>
            <span className="text-right">Total</span>
          </div>

          {/* Asks (Sells - Crimson/Red) */}
          <div className="space-y-1">
            {asks.slice(0, 4).map((ask, i) => (
              <button
                key={`ask-${i}`}
                type="button"
                onClick={() => handleRowClick(ask.price)}
                className={`w-full grid grid-cols-3 text-[11px] font-mono-num py-0.5 px-1 rounded relative text-left transition-all active:scale-[0.99] ${
                  clickedPrice === ask.price ? 'bg-purple-100 dark:bg-purple-500/30' : 'hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                }`}
                title="Click to fill price in order terminal"
              >
                {/* Visual Depth Bar (right to left) */}
                <div
                  className="absolute inset-y-0 right-0 bg-rose-500/10 pointer-events-none rounded-r transition-all"
                  style={{ width: `${ask.depthPct}%` }}
                />
                <span className="text-rose-600 dark:text-rose-400 font-semibold relative z-10">
                  {ask.price.toFixed(precision === '1' ? 0 : precision === '0.1' ? 1 : 2)}
                </span>
                <span className="text-slate-700 dark:text-slate-300 text-right relative z-10">{ask.amount.toFixed(3)}</span>
                <span className="text-slate-500 dark:text-slate-400 text-right relative z-10">
                  {ask.total >= 1000 ? `${(ask.total / 1000).toFixed(1)}k` : ask.total.toFixed(0)}
                </span>
              </button>
            ))}
          </div>

          {/* Center Spread & Last Price Strip */}
          <div className="my-2 py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-[#111624] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`font-mono-num font-extrabold text-sm ${
                  pair.change24h >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {pair.price.toFixed(2)}
              </span>
              {pair.change24h >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono-num text-slate-500 dark:text-slate-400">
              <span>Spread:</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">{(pUnit * 2).toFixed(2)} (0.01%)</span>
            </div>
          </div>

          {/* Bids (Buys - Emerald/Green) */}
          <div className="space-y-1">
            {bids.slice(0, 4).map((bid, i) => (
              <button
                key={`bid-${i}`}
                type="button"
                onClick={() => handleRowClick(bid.price)}
                className={`w-full grid grid-cols-3 text-[11px] font-mono-num py-0.5 px-1 rounded relative text-left transition-all active:scale-[0.99] ${
                  clickedPrice === bid.price ? 'bg-purple-100 dark:bg-purple-500/30' : 'hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                }`}
                title="Click to fill price in order terminal"
              >
                {/* Visual Depth Bar (right to left) */}
                <div
                  className="absolute inset-y-0 right-0 bg-emerald-500/10 pointer-events-none rounded-r transition-all"
                  style={{ width: `${bid.depthPct}%` }}
                />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold relative z-10">
                  {bid.price.toFixed(precision === '1' ? 0 : precision === '0.1' ? 1 : 2)}
                </span>
                <span className="text-slate-700 dark:text-slate-300 text-right relative z-10">{bid.amount.toFixed(3)}</span>
                <span className="text-slate-500 dark:text-slate-400 text-right relative z-10">
                  {bid.total >= 1000 ? `${(bid.total / 1000).toFixed(1)}k` : bid.total.toFixed(0)}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Real-Time Trades Stream */
        <div className="space-y-1 font-mono-num">
          <div className="grid grid-cols-4 text-[10px] text-slate-500 dark:text-slate-400 font-medium pb-1 mb-1 border-b border-slate-200 dark:border-white/[0.04]">
            <span>Time</span>
            <span>Side</span>
            <span className="text-right">Price</span>
            <span className="text-right">Amount</span>
          </div>
          {trades.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleRowClick(t.price)}
              className="w-full grid grid-cols-4 text-[11px] py-1 px-1 rounded hover:bg-slate-100 dark:hover:bg-white/[0.04] text-left transition-colors"
            >
              <span className="text-slate-500 dark:text-slate-400 text-[10px]">{t.time}</span>
              <span
                className={`font-bold text-[10px] ${
                  t.type === 'buy' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {t.type.toUpperCase()}
              </span>
              <span className="text-right text-slate-900 dark:text-slate-100 font-semibold">{t.price.toFixed(2)}</span>
              <span className="text-right text-slate-600 dark:text-slate-300">{t.amount.toFixed(3)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
