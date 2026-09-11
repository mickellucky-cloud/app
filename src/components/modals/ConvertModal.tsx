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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const btcPrice = 67214.5;
  const numAmount = parseFloat(amount) || 0;

  const calculatedTo =
    fromCoin === 'USDT'
      ? numAmount / btcPrice
      : numAmount * btcPrice;

  const handleSwapCoins = () => {
    setErrorMsg(null);
    setFromCoin(toCoin);
    setToCoin(fromCoin);
    setAmount('');
  };

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (numAmount <= 0) {
      setErrorMsg('Please enter a valid conversion amount.');
      return;
    }

    const max = fromCoin === 'USDT' ? availableUsdt : availableBtc;
    if (numAmount > max) {
      setErrorMsg(`Insufficient ${fromCoin} balance.`);
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
    <div className="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#0E141B] border-t sm:border border-[#D7E0EB] dark:border-[#242E3B] rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom animate-slideUp text-[#0F172A] dark:text-[#EDF1F5] shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#D7E0EB] dark:border-[#242E3B] mb-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#8B5CF6]" />
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">Convert (0 Fee)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6] dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto animate-bounce" />
            <h4 className="font-bold text-[#0F172A] dark:text-white text-base">Conversion Completed!</h4>
            <p className="text-xs text-[#64748B] dark:text-[#8E98A6]">
              Successfully converted {numAmount} {fromCoin} to {calculatedTo.toFixed(5)} {toCoin}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConvert} className="space-y-3">
            {/* From Box */}
            <div className="p-3 rounded-2xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B]">
              <div className="flex justify-between items-center text-xs text-[#64748B] dark:text-[#8E98A6] mb-1.5">
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
                  className="bg-transparent text-[#0F172A] dark:text-white font-mono-num text-lg font-bold focus:outline-none w-full"
                />
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] flex-shrink-0">
                  <CoinIcon symbol={fromCoin} size={20} />
                  <span className="text-xs font-bold text-[#0F172A] dark:text-white">{fromCoin}</span>
                </div>
              </div>
            </div>

            {/* Swap Button Divider */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                type="button"
                onClick={handleSwapCoins}
                className="w-9 h-9 rounded-full bg-white dark:bg-[#141B24] border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] hover:bg-[#8B5CF6]/10 shadow-md active:scale-95 transition-all"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            {/* To Box */}
            <div className="p-3 rounded-2xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B]">
              <div className="flex justify-between items-center text-xs text-[#64748B] dark:text-[#8E98A6] mb-1.5">
                <span>To (Estimated)</span>
                <span className="text-[#10B981] font-bold">Guaranteed Rate</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-[#0F172A] dark:text-white font-mono-num text-lg font-bold">
                  {calculatedTo > 0 ? (calculatedTo < 1 ? calculatedTo.toFixed(6) : calculatedTo.toFixed(2)) : '0.00'}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] flex-shrink-0">
                  <CoinIcon symbol={toCoin} size={20} />
                  <span className="text-xs font-bold text-[#0F172A] dark:text-white">{toCoin}</span>
                </div>
              </div>
            </div>

            {/* Rate details */}
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] space-y-1 text-xs font-mono-num">
              <div className="flex justify-between text-[#64748B] dark:text-[#8E98A6]">
                <span>1 BTC</span>
                <span className="text-[#0F172A] dark:text-white font-bold">≈ {btcPrice.toLocaleString()} USDT</span>
              </div>
              <div className="flex justify-between text-[#64748B] dark:text-[#8E98A6]">
                <span>Fee</span>
                <span className="text-[#10B981] font-bold">0 Fee</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold text-sm shadow-md active:scale-98 transition-all"
            >
              Convert Now
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
