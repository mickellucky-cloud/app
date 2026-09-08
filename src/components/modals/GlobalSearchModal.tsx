import React, { useState } from 'react';
import { MarketPair } from '../../types';
import { CoinIcon } from '../common/CoinIcon';
import { X, Search, ChevronRight } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketPairs: MarketPair[];
  onSelectPair: (pair: MarketPair) => void;
  onOpenAiTrader: () => void;
  onOpenPolymarket: () => void;
  onNavigateP2P: () => void;
  onOpenPriceAlerts?: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  marketPairs,
  onSelectPair,
  onOpenAiTrader,
  onOpenPolymarket,
  onNavigateP2P,
  onOpenPriceAlerts,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = marketPairs.filter(
    (p) =>
      p.symbol.toLowerCase().includes(query.toLowerCase()) ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.base.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-12">
      <div className="w-full max-w-md bg-[#0F1320] border border-white/10 rounded-3xl p-5 shadow-2xl animate-slideUp text-slate-100 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
          <div className="relative flex-1 mr-3">
            <input
              type="text"
              autoFocus
              placeholder="Search pairs, coins, AI bots, P2P..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-[#090C14] border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick feature shortcuts */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => {
              onClose();
              onOpenAiTrader();
            }}
            className="px-3 py-1 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-semibold whitespace-nowrap"
          >
            ⚡ AI Trader
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenPolymarket();
            }}
            className="px-3 py-1 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold whitespace-nowrap"
          >
            🔮 Polymarket
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigateP2P();
            }}
            className="px-3 py-1 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold whitespace-nowrap"
          >
            🤝 P2P Express
          </button>
          {onOpenPriceAlerts && (
            <button
              onClick={() => {
                onClose();
                onOpenPriceAlerts();
              }}
              className="px-3 py-1 rounded-xl bg-fuchsia-600/20 text-fuchsia-300 border border-fuchsia-500/30 text-xs font-semibold whitespace-nowrap"
            >
              🔔 Price Alerts
            </button>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          <span className="text-[11px] font-semibold text-slate-400 px-1 block mb-1">
            Markets & Tokens
          </span>
          {filtered.slice(0, 8).map((pair) => (
            <div
              key={pair.symbol}
              onClick={() => {
                onSelectPair(pair);
                onClose();
              }}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.05] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <CoinIcon symbol={pair.base} size={28} />
                <div>
                  <div className="text-xs font-bold text-white">{pair.symbol}</div>
                  <div className="text-[10px] text-slate-400">{pair.name}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono-num text-xs font-bold text-white">
                  ${pair.price >= 1 ? pair.price.toLocaleString() : pair.price.toFixed(4)}
                </div>
                <div
                  className={`text-[10px] font-mono-num ${
                    pair.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {pair.change24h >= 0 ? `+${pair.change24h}%` : `${pair.change24h}%`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
