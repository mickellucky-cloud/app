import React, { useState } from 'react';
import { X, Layers, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

interface PolymarketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PolymarketModal: React.FC<PolymarketModalProps> = ({ isOpen, onClose }) => {
  const [selectedMarket, setSelectedMarket] = useState<number>(0);
  const [betSide, setBetSide] = useState<'yes' | 'no'>('yes');
  const [betAmount, setBetAmount] = useState('50');
  const [isPlaced, setIsPlaced] = useState(false);

  if (!isOpen) return null;

  const markets = [
    {
      id: 0,
      question: 'Will Bitcoin surpass $100,000 before end of year?',
      volume: '$14.2M Vol',
      yesPct: 78,
      noPct: 22,
    },
    {
      id: 1,
      question: 'Will Ethereum achieve spot ETF inflows over $15B in 2026?',
      volume: '$8.7M Vol',
      yesPct: 64,
      noPct: 36,
    },
    {
      id: 2,
      question: 'Will Solana TVL flip Ethereum L2 combined TVL?',
      volume: '$4.1M Vol',
      yesPct: 41,
      noPct: 59,
    },
  ];

  const curr = markets[selectedMarket];

  const handlePlacePrediction = () => {
    setIsPlaced(true);
    setTimeout(() => {
      setIsPlaced(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#0F1320] border-t sm:border border-cyan-500/30 rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom max-h-[85vh] overflow-y-auto animate-slideUp text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Polymarket Web3</h3>
              <span className="text-[10px] text-cyan-400 font-semibold">
                Decentralized Prediction Protocol
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isPlaced ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto animate-bounce" />
            <h4 className="font-bold text-white text-base">Prediction Submitted!</h4>
            <p className="text-xs text-slate-400">
              Bought ${betAmount} of {betSide.toUpperCase()} shares on "{curr.question}".
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Markets List */}
            <div className="space-y-2.5">
              {markets.map((m, idx) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMarket(idx)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedMarket === idx
                      ? 'bg-cyan-950/20 border-cyan-500/60 text-white shadow-sm'
                      : 'bg-[#090C14] border-white/[0.06] text-slate-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-xs text-white leading-snug flex-1 pr-2">
                      {m.question}
                    </p>
                    <span className="text-[10px] font-mono-num text-slate-400 whitespace-nowrap">
                      {m.volume}
                    </span>
                  </div>

                  {/* Yes/No Probability Bar */}
                  <div className="w-full h-2 rounded-full bg-rose-500/40 overflow-hidden flex mb-2">
                    <div
                      className="h-full bg-cyan-400"
                      style={{ width: `${m.yesPct}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] font-mono-num font-bold">
                    <span className="text-cyan-400">Yes {m.yesPct}%</span>
                    <span className="text-rose-400">No {m.noPct}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bet Entry */}
            <div className="p-3.5 rounded-2xl bg-[#090C14] border border-white/[0.08] space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBetSide('yes')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    betSide === 'yes'
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Buy YES ({curr.yesPct}¢)
                </button>
                <button
                  type="button"
                  onClick={() => setBetSide('no')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    betSide === 'no'
                      ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                      : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Buy NO ({curr.noPct}¢)
                </button>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Amount (USDT)</label>
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#0E1322] border border-white/10">
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="bg-transparent text-white font-mono-num text-sm font-bold focus:outline-none w-full"
                  />
                  <span className="text-xs text-slate-400">USDT</span>
                </div>
              </div>

              <div className="flex justify-between text-xs text-slate-400 pt-1">
                <span>Potential Payout</span>
                <span className="text-emerald-400 font-mono-num font-bold">
                  ${(parseFloat(betAmount) * (100 / (betSide === 'yes' ? curr.yesPct : curr.noPct))).toFixed(2)} USDT
                </span>
              </div>
            </div>

            <button
              onClick={handlePlacePrediction}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-display font-bold text-sm shadow-[0_4px_20px_rgba(6,182,212,0.3)] active:scale-98 transition-all"
            >
              Place Prediction
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
