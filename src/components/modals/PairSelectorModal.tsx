import React, { useState } from 'react';
import { MarketPair } from '../../types';
import { CoinIcon } from '../common/CoinIcon';
import { X, Search } from 'lucide-react';

interface PairSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketPairs: MarketPair[];
  onSelectPair: (pair: MarketPair) => void;
}

export const PairSelectorModal: React.FC<PairSelectorModalProps> = ({
  isOpen,
  onClose,
  marketPairs,
  onSelectPair,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = marketPairs.filter(
    (p) =>
      p.symbol.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#0F1320] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom max-h-[80vh] flex flex-col animate-slideUp">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
          <h3 className="font-bold text-base text-white">Select Trading Pair</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search coin or pair..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs rounded-xl bg-[#090C14] border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Pair List */}
        <div className="overflow-y-auto space-y-1 flex-1 pr-1">
          {filtered.map((pair) => (
            <div
              key={pair.symbol}
              onClick={() => {
                onSelectPair(pair);
                onClose();
              }}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <CoinIcon symbol={pair.base} size={30} />
                <div>
                  <div className="font-bold text-xs text-white">{pair.symbol}</div>
                  <div className="text-[10px] text-slate-400">{pair.name}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono-num text-xs font-bold text-white">
                  ${pair.price.toLocaleString()}
                </div>
                <div
                  className={`text-[10px] font-mono-num font-semibold ${
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
