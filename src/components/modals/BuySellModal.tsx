import React, { useState } from 'react';
import { X, ArrowDownUp, CreditCard, Landmark, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import { CoinIcon } from '../common/CoinIcon';

interface BuySellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (type: 'buy' | 'sell', coin: string, fiatAmount: number, cryptoAmount: number) => void;
  onNavigateTrade?: () => void;
  onNavigateP2P?: () => void;
}

const FIAT_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rate: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rate: 0.78 },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬', rate: 1520.0 },
];

const CRYPTO_OPTIONS = [
  { symbol: 'USDT', name: 'Tether USD', price: 1.0 },
  { symbol: 'BTC', name: 'Bitcoin', price: 67214.5 },
  { symbol: 'ETH', name: 'Ethereum', price: 3421.8 },
  { symbol: 'OKN', name: 'OKNexus Token', price: 4.85 },
  { symbol: 'SOL', name: 'Solana', price: 184.2 },
];

export const BuySellModal: React.FC<BuySellModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onNavigateTrade,
  onNavigateP2P,
}) => {
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');
  const [fiatAmount, setFiatAmount] = useState('250');
  const [selectedFiat, setSelectedFiat] = useState(FIAT_CURRENCIES[0]);
  const [selectedCrypto, setSelectedCrypto] = useState(CRYPTO_OPTIONS[0]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'apple_pay'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const numFiat = parseFloat(fiatAmount) || 0;
  // Convert fiat to USD equivalent, then to crypto
  const usdVal = numFiat / selectedFiat.rate;
  const cryptoAmount = selectedCrypto.price > 0 ? usdVal / selectedCrypto.price : 0;

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (numFiat <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      if (onSuccess) {
        onSuccess(tab, selectedCrypto.symbol, numFiat, cryptoAmount);
      }
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1600);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#0F1320] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom text-slate-100 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <ArrowDownUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Instant Buy / Sell</h3>
              <p className="text-[11px] text-slate-400">Zero-fee express fiat gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Buy / Sell Tabs */}
        <div className="flex rounded-xl bg-[#090C16] p-1 border border-white/[0.06] mb-4">
          <button
            type="button"
            onClick={() => setTab('buy')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'buy'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Buy Crypto
          </button>
          <button
            type="button"
            onClick={() => setTab('sell')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'sell'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sell to Cash
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center animate-fadeIn">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-white mb-1">
              Order Processed Successfully!
            </h4>
            <p className="text-xs text-slate-300 mb-2">
              {tab === 'buy' ? 'Purchased' : 'Sold'}{' '}
              <span className="font-mono-num font-bold text-white">
                {cryptoAmount.toFixed(4)} {selectedCrypto.symbol}
              </span>{' '}
              for{' '}
              <span className="font-mono-num font-bold text-white">
                {selectedFiat.symbol}
                {numFiat.toLocaleString()}
              </span>
            </p>
            <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-semibold border border-emerald-500/25">
              Settled in Spot Wallet
            </span>
          </div>
        ) : (
          <form onSubmit={handleExecute} className="space-y-4">
            {/* Amount & Fiat Input */}
            <div className="p-3.5 rounded-2xl bg-[#080B14] border border-white/[0.08]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>{tab === 'buy' ? 'You Pay' : 'You Receive'}</span>
                <span className="text-[11px] text-purple-300 font-semibold">0% Fee Tier</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={fiatAmount}
                  onChange={(e) => setFiatAmount(e.target.value)}
                  className="w-1/2 bg-transparent text-xl font-mono-num font-bold text-white outline-none"
                />

                <select
                  value={selectedFiat.code}
                  onChange={(e) => {
                    const found = FIAT_CURRENCIES.find((f) => f.code === e.target.value);
                    if (found) setSelectedFiat(found);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#14192B] border border-white/10 text-xs font-bold text-white outline-none cursor-pointer"
                >
                  {FIAT_CURRENCIES.map((f) => (
                    <option key={f.code} value={f.code} className="bg-[#0F1320]">
                      {f.flag} {f.code} ({f.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Crypto Output Box */}
            <div className="p-3.5 rounded-2xl bg-[#080B14] border border-white/[0.08]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>{tab === 'buy' ? 'You Receive (Estimated)' : 'You Spend'}</span>
                <span className="text-[11px] text-slate-400 font-mono-num">
                  1 {selectedCrypto.symbol} ≈ ${selectedCrypto.price.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="font-mono-num font-extrabold text-xl text-emerald-400 truncate">
                  ≈ {cryptoAmount >= 1 ? cryptoAmount.toFixed(4) : cryptoAmount.toFixed(6)}
                </div>

                <div className="flex items-center gap-2">
                  <CoinIcon symbol={selectedCrypto.symbol} size={22} />
                  <select
                    value={selectedCrypto.symbol}
                    onChange={(e) => {
                      const found = CRYPTO_OPTIONS.find((c) => c.symbol === e.target.value);
                      if (found) setSelectedCrypto(found);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-[#14192B] border border-white/10 text-xs font-bold text-white outline-none cursor-pointer"
                  >
                    {CRYPTO_OPTIONS.map((c) => (
                      <option key={c.symbol} value={c.symbol} className="bg-[#0F1320]">
                        {c.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-purple-600/20 border-purple-500/50 text-white shadow-sm'
                      : 'bg-[#080B14] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-[11px]">Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'bg-purple-600/20 border-purple-500/50 text-white shadow-sm'
                      : 'bg-[#080B14] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-[11px]">Apple/Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'bank'
                      ? 'bg-purple-600/20 border-purple-500/50 text-white shadow-sm'
                      : 'bg-[#080B14] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-[11px]">Bank Wire</span>
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessing || numFiat <= 0}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                tab === 'buy'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-95 active:scale-[0.99]'
                  : 'bg-gradient-to-r from-rose-600 to-pink-500 hover:opacity-95 active:scale-[0.99]'
              }`}
            >
              {isProcessing ? (
                <span>Processing transaction...</span>
              ) : (
                <span>
                  {tab === 'buy' ? 'Confirm Buy' : 'Confirm Sell'} {selectedCrypto.symbol}
                </span>
              )}
            </button>

            {/* Alternative shortcuts */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-white/[0.06]">
              {onNavigateTrade && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateTrade();
                  }}
                  className="hover:text-purple-300 transition-colors"
                >
                  Go to Spot Trading &rarr;
                </button>
              )}
              {onNavigateP2P && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateP2P();
                  }}
                  className="hover:text-cyan-300 transition-colors"
                >
                  P2P Desk (0% Fee) &rarr;
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
