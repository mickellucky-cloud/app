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
    <div className="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-12">
      <div className="w-full max-w-md bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] rounded-3xl p-5 shadow-2xl animate-slideUp text-[#0F172A] dark:text-[#EDF1F5] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-[#D7E0EB] dark:border-[#242E3B] mb-3">
          <div className="relative flex-1 mr-3">
            <input
              type="text"
              autoFocus
              placeholder="Search pairs, coins, AI bots, P2P..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] text-[#0F172A] dark:text-white placeholder-[#64748B] dark:placeholder-[#8E98A6] focus:outline-none focus:border-[#8B5CF6]"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-[#64748B] dark:text-[#8E98A6]" />
          </div>
          <button onClick={onClose} className="p-2 text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6] dark:hover:text-white">
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
            className="px-3 py-1 rounded-xl bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30 text-xs font-semibold whitespace-nowrap"
          >
            ⚡ AI Trader
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenPolymarket();
            }}
            className="px-3 py-1 rounded-xl bg-[#06B6D4]/10 hover:bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/30 text-xs font-semibold whitespace-nowrap"
          >
            🔮 Polymarket
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigateP2P();
            }}
            className="px-3 py-1 rounded-xl bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 text-xs font-semibold whitespace-nowrap"
          >
            🤝 P2P Express
          </button>
          {onOpenPriceAlerts && (
            <button
              onClick={() => {
                onClose();
                onOpenPriceAlerts();
              }}
              className="px-3 py-1 rounded-xl bg-[#EC4899]/10 hover:bg-[#EC4899]/20 text-[#EC4899] border border-[#EC4899]/30 text-xs font-semibold whitespace-nowrap"
            >
              🔔 Price Alerts
            </button>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#8E98A6] px-1 block mb-1">
            Markets & Tokens
          </span>
          {filtered.slice(0, 8).map((pair) => (
            <div
              key={pair.symbol}
              onClick={() => {
                onSelectPair(pair);
                onClose();
              }}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-[#141B24] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <CoinIcon symbol={pair.base} size={28} />
                <div>
                  <div className="text-xs font-bold text-[#0F172A] dark:text-white">{pair.symbol}</div>
                  <div className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">{pair.name}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono-num text-xs font-bold text-[#0F172A] dark:text-white">
                  ${pair.price >= 1 ? pair.price.toLocaleString() : pair.price.toFixed(4)}
                </div>
                <div
                  className={`text-[10px] font-mono-num ${
                    pair.change24h >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
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
