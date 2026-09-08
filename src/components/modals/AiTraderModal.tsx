import React, { useState } from 'react';
import { X, Cpu, Zap, CheckCircle2, ShieldCheck, Play, ArrowRight } from 'lucide-react';
import { OKNexusLogo } from '../common/OKNexusLogo';

interface AiTraderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateStrategy?: (name: string) => void;
}

export const AiTraderModal: React.FC<AiTraderModalProps> = ({
  isOpen,
  onClose,
  onActivateStrategy,
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<'grid' | 'dca' | 'momentum'>('grid');
  const [allocation, setAllocation] = useState('500');
  const [isActive, setIsActive] = useState(false);

  if (!isOpen) return null;

  const handleStartBot = () => {
    setIsActive(true);
    if (onActivateStrategy) onActivateStrategy(selectedStrategy);
    setTimeout(() => {
      setIsActive(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#0F1320] border-t sm:border border-purple-500/30 rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom max-h-[85vh] overflow-y-auto animate-slideUp text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Cpu className="w-4 h-4 text-fuchsia-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">AI Auto Trader 2.0</h3>
              <span className="text-[10px] text-fuchsia-400 font-semibold">
                Autonomous Quantum Trading Mesh
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isActive ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto animate-pulse">
              <Zap className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-white text-lg">AI Bot Deployed!</h4>
            <p className="text-xs text-slate-400">
              The {selectedStrategy.toUpperCase()} strategy is now executing 24/7 with ${allocation} allocated.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top Stat Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/30 to-[#121626] border border-purple-500/30 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="font-mono-num text-sm font-bold text-emerald-400">89.4%</div>
                <div className="text-[10px] text-slate-400">Win Rate</div>
              </div>
              <div>
                <div className="font-mono-num text-sm font-bold text-fuchsia-300">+48.2%</div>
                <div className="text-[10px] text-slate-400">30D Avg ROI</div>
              </div>
              <div>
                <div className="font-mono-num text-sm font-bold text-amber-400">24/7</div>
                <div className="text-[10px] text-slate-400">Uptime</div>
              </div>
            </div>

            {/* Select Strategy */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Select AI Algorithm</label>
              <div className="space-y-2">
                {[
                  {
                    id: 'grid',
                    name: 'Spot Grid Matrix',
                    desc: 'Captures volatility within $62,000 - $72,000 range with micro-arbitrage',
                    risk: 'Low Risk',
                    estApy: '32% APY',
                  },
                  {
                    id: 'momentum',
                    name: 'Momentum Trend Surfer',
                    desc: 'Follows EMA & RSI breakouts with automated trailing stop-loss',
                    risk: 'Medium Risk',
                    estApy: '64% APY',
                  },
                  {
                    id: 'dca',
                    name: 'Smart DCA Accumulator',
                    desc: 'Dollar-cost averages at local algorithmic dip support levels',
                    risk: 'Ultra-Low Risk',
                    estApy: '21% APY',
                  },
                ].map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStrategy(s.id as any)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedStrategy === s.id
                        ? 'bg-purple-600/15 border-purple-500 text-white shadow-sm'
                        : 'bg-[#090C14] border-white/[0.06] text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-white">{s.name}</span>
                      <span className="text-emerald-400 font-mono-num font-bold text-xs">
                        {s.estApy}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug mb-1.5">{s.desc}</p>
                    <div className="flex gap-2 text-[10px]">
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {s.risk}
                      </span>
                      <span className="text-purple-400 font-medium">OKNexus Verified ✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Allocation */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                USDT Capital Allocation
              </label>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#090C14] border border-white/10 focus-within:border-purple-500/50">
                <input
                  type="number"
                  value={allocation}
                  onChange={(e) => setAllocation(e.target.value)}
                  className="bg-transparent text-white font-mono-num text-sm font-bold focus:outline-none w-full"
                />
                <span className="text-xs font-bold text-purple-400">USDT</span>
              </div>
            </div>

            <button
              onClick={handleStartBot}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-display font-bold text-sm shadow-[0_4px_20px_rgba(168,85,247,0.35)] active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              Activate AI Trading Bot
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
