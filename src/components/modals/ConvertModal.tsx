import React, { useState } from 'react';
import { X, RefreshCw, ArrowDown, CheckCircle2 } from 'lucide-react';
import { CoinIcon } from '../common/CoinIcon';

interface ConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableUsdt: number;
  availableBtc: number;
  onConfirmConvert: (from: string, to: string, fromAmt: number, toAmt: number) => void;
}

export const ConvertModal: React.FC<ConvertModalProps> = ({
  isOpen,
  onClose,
  availableUsdt,
  availableBtc,
  onConfirmConvert,
}) => {
  const [fromCoin, setFromCoin] = useState('USDT');
  const [toCoin, setToCoin] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const btcPrice = 67214.5;
  const numAmount = parseFloat(amount) || 0;

  const calculatedTo =
    fromCoin === 'USDT'
      ? numAmount / btcPrice
      : numAmount * btcPrice;

  const handleSwapCoins = () => {
    setFromCoin(toCoin);
    setToCoin(fromCoin);
    setAmount('');
  };

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;

    const max = fromCoin === 'USDT' ? availableUsdt : availableBtc;
    if (numAmount > max) {
      alert(`Insufficient ${fromCoin} balance.`);
      return;
    }

    onConfirmConvert(fromCoin, toCoin, numAmount, calculatedTo);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#0F1320] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom animate-slideUp">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-base text-white">Convert (0 Fee)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-bold text-white text-base">Conversion Completed!</h4>
            <p className="text-xs text-slate-400">
              Successfully converted {numAmount} {fromCoin} to {calculatedTo.toFixed(5)} {toCoin}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConvert} className="space-y-3">
            {/* From Box */}
            <div className="p-3 rounded-2xl bg-[#090C14] border border-white/10">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
                <span>From</span>
                <span>
                  Available: {fromCoin === 'USDT' ? availableUsdt.toFixed(2) : availableBtc.toFixed(4)} {fromCoin}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent text-white font-mono-num text-lg font-bold focus:outline-none w-full"
                />
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#141A29] border border-white/10 flex-shrink-0">
                  <CoinIcon symbol={fromCoin} size={20} />
                  <span className="text-xs font-bold text-white">{fromCoin}</span>
                </div>
              </div>
            </div>

            {/* Swap Button Divider */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                type="button"
                onClick={handleSwapCoins}
                className="w-9 h-9 rounded-full bg-[#1A142E] border border-purple-500/40 flex items-center justify-center text-purple-300 hover:text-white shadow-md active:scale-95 transition-all"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            {/* To Box */}
            <div className="p-3 rounded-2xl bg-[#090C14] border border-white/10">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
                <span>To (Estimated)</span>
                <span className="text-emerald-400 font-bold">Guaranteed Rate</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-white font-mono-num text-lg font-bold">
                  {calculatedTo > 0 ? (calculatedTo < 1 ? calculatedTo.toFixed(6) : calculatedTo.toFixed(2)) : '0.00'}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#141A29] border border-white/10 flex-shrink-0">
                  <CoinIcon symbol={toCoin} size={20} />
                  <span className="text-xs font-bold text-white">{toCoin}</span>
                </div>
              </div>
            </div>

            {/* Rate details */}
            <div className="p-3 rounded-xl bg-[#090C14] border border-white/[0.06] space-y-1 text-xs font-mono-num">
              <div className="flex justify-between text-slate-400">
                <span>1 BTC</span>
                <span>≈ {btcPrice.toLocaleString()} USDT</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fee</span>
                <span className="text-emerald-400 font-bold">0 Fee</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-display font-bold text-sm shadow-md active:scale-98 transition-all"
            >
              Convert Now
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
