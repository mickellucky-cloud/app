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
    <div className="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#0E141B] border-t sm:border border-[#D7E0EB] dark:border-[#242E3B] rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom max-h-[80vh] flex flex-col animate-slideUp text-[#0F172A] dark:text-[#EDF1F5] shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#D7E0EB] dark:border-[#242E3B] mb-3">
          <h3 className="font-bold text-base text-[#0F172A] dark:text-white">Select Trading Pair</h3>
          <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6] dark:hover:text-white">
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
            className="w-full h-9 pl-9 pr-3 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] text-[#0F172A] dark:text-white placeholder-[#64748B] dark:placeholder-[#8E98A6] focus:outline-none focus:border-[#8B5CF6]"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#64748B] dark:text-[#8E98A6] pointer-events-none" />
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
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-[#141B24] active:bg-[#F1F5F9] dark:active:bg-[#1A222F] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <CoinIcon symbol={pair.base} size={30} />
                <div>
                  <div className="font-bold text-xs text-[#0F172A] dark:text-white">{pair.symbol}</div>
                  <div className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">{pair.name}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono-num text-xs font-bold text-[#0F172A] dark:text-white">
                  ${pair.price.toLocaleString()}
                </div>
                <div
                  className={`text-[10px] font-mono-num font-semibold ${
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
