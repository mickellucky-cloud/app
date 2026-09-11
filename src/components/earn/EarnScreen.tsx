import React, { useState } from 'react';
import { EarnProduct, ThemeMode } from '../../types';
import { CoinIcon } from '../common/CoinIcon';
import { Percent, Search, Coins, CheckCircle2, X } from 'lucide-react';

interface EarnScreenProps {
  products: EarnProduct[];
  totalEarnedUsd: number;
  onStakeProduct: (product: EarnProduct, amount: number) => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}

export const EarnScreen: React.FC<EarnScreenProps> = ({
  products,
  totalEarnedUsd,
  onStakeProduct,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'flexible' | 'fixed' | 'launchpad'>('all');
  const [selectedProduct, setSelectedProduct] = useState<EarnProduct | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakeSuccess, setStakeSuccess] = useState(false);

  const filteredProducts = products.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  const handleConfirmStake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const num = parseFloat(stakeAmount) || 0;
    if (num <= 0) return;

    onStakeProduct(selectedProduct, num);
    setStakeSuccess(true);
    setTimeout(() => {
      setStakeSuccess(false);
      setSelectedProduct(null);
      setStakeAmount('');
    }, 1800);
  };

  return (
    <div id="earn-screen" className="pb-32 md:pb-12 pt-3 px-4 sm:px-6 lg:px-8 max-w-md md:max-w-4xl lg:max-w-7xl mx-auto min-h-screen text-slate-900 dark:text-slate-100 bg-white dark:bg-[#07090E] transition-colors">
      {/* Header */}
      <header className="flex items-center justify-between py-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 dark:text-amber-400 font-bold shadow-xs">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">OKNexus Earn</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Put your crypto to work with flexible savings, fixed staking, and launchpools</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Top Section: Banner + Portfolio Stats (Responsive Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        {/* Featured Banner: Flexible Savings with Gold Coins graphic */}
        <section
          id="earn-featured-banner"
          className="lg:col-span-7 relative overflow-hidden rounded-2xl bg-amber-50/70 dark:bg-gradient-to-br dark:from-[#291E0A]/90 dark:via-[#1C150A]/90 dark:to-[#0F111A] border border-amber-300/80 dark:border-amber-500/30 p-5 shadow-xs dark:shadow-[0_8px_32px_rgba(245,158,11,0.12)] flex items-center justify-between"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xs sm:max-w-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30">
              FEATURED VAULT
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white mt-2 leading-tight">
              Flexible Savings
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">Grow your crypto with automated daily payouts & zero lockup period</p>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Up to</span>
              <span className="font-mono-num text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                12.5%
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">APY</span>
            </div>
          </div>

          {/* 3D Gold Coins Graphic */}
          <div className="relative flex-shrink-0 w-28 h-28 hidden sm:flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
            <div className="relative flex flex-col items-center">
              <div className="w-16 h-7 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 border border-amber-200 shadow-md transform -rotate-6" />
              <div className="w-20 h-8 rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-amber-700 border border-amber-300 shadow-md -mt-2 transform rotate-3" />
              <div className="w-20 h-9 rounded-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-800 border border-amber-200 shadow-lg -mt-2 flex items-center justify-center">
                <Coins className="w-5 h-5 text-amber-950 font-bold" />
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Earnings Summary */}
        <section className="lg:col-span-5 grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.07] flex flex-col justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Earning Balance</div>
            <div className="font-mono-num text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              ${totalEarnedUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-500 mt-2">Principal safely earning yield</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.07] flex flex-col justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Cumulative Interest</div>
            <div className="font-mono-num text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
              +$128.40
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400/80 mt-2">Compound daily interest</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.07] flex flex-col justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Est. 30D Yield</div>
            <div className="font-mono-num text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-300">
              +$34.20 USDT
            </div>
            <div className="text-[10px] text-slate-500 mt-2">Based on current rates</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.07] flex flex-col justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Positions</div>
            <div className="font-mono-num text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-300">
              3 Assets
            </div>
            <div className="text-[10px] text-slate-500 mt-2">USDT, BTC, ETH</div>
          </div>
        </section>
      </div>

      {/* Categories Filter Pills */}
      <section className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-4">
        {(['all', 'flexible', 'fixed', 'launchpad'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              activeCategory === cat
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#101422] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.06] hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {cat === 'all' ? 'All Products' : cat}
          </button>
        ))}
      </section>

      {/* Product List as Responsive Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="flex flex-col justify-between p-4 rounded-2xl bg-slate-50 dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.06] hover:border-purple-500/40 transition-all group shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <CoinIcon symbol={p.asset} size={38} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">{p.asset}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/25 font-semibold">
                        {p.durationDays ? `${p.durationDays}d Locked` : 'Flexible'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{p.name}</div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 mb-4">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Annual Percentage Yield</span>
                  <span className="font-mono-num text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {p.apy}% APY
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Minimum Stake</span>
                  <span className="font-mono text-slate-800 dark:text-slate-300 font-semibold">{p.minAmount} {p.asset}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedProduct(p)}
              className="w-full py-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white border border-purple-200 dark:bg-purple-600/25 dark:hover:bg-purple-600 dark:border-purple-500/40 dark:text-purple-200 dark:hover:text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Stake Now
            </button>
          </div>
        ))}
      </section>

      {/* Staking Sheet Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0F1320] border-t sm:border border-slate-200 dark:border-white/10 rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom animate-slideUp shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.06] mb-4">
              <div className="flex items-center gap-2">
                <CoinIcon symbol={selectedProduct.asset} size={28} />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Stake {selectedProduct.asset}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {stakeSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 dark:text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Staked Successfully!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your funds have been deposited to {selectedProduct.name} at {selectedProduct.apy}% APY.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmStake} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#090C14] border border-slate-200 dark:border-white/[0.06] space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Product</span>
                    <span className="text-slate-900 dark:text-white font-medium">{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Est. Annual Yield</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono-num font-bold">{selectedProduct.apy}% APY</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Redemption</span>
                    <span className="text-slate-900 dark:text-white font-medium">{selectedProduct.durationDays ? `${selectedProduct.durationDays} Days` : 'Instant Anytime'}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Stake Amount ({selectedProduct.asset})
                  </label>
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090C14] border border-slate-200 dark:border-white/10 focus-within:border-purple-500">
                    <input
                      type="number"
                      step="any"
                      placeholder={`Min ${selectedProduct.minAmount}`}
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="bg-transparent text-slate-900 dark:text-white font-mono-num text-sm font-bold focus:outline-none w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setStakeAmount('100')}
                      className="text-[10px] font-bold text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-display font-bold text-sm shadow-[0_4px_20px_rgba(168,85,247,0.35)] active:scale-98 transition-all"
                >
                  Confirm Subscription
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
