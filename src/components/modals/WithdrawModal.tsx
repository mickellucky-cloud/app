import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { CoinIcon } from '../common/CoinIcon';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableUsdt: number;
  onConfirmWithdraw: (amount: number, address: string) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  availableUsdt,
  onConfirmWithdraw,
}) => {
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('TRC20');
  const [amount, setAmount] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;
  const networkFee = network === 'TRC20' ? 1.0 : network === 'ERC20' ? 4.5 : 0.8;
  const receiveAmount = Math.max(0, numAmount - networkFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      alert('Please enter a destination withdrawal address.');
      return;
    }
    if (numAmount <= networkFee) {
      alert(`Withdrawal amount must exceed network fee of $${networkFee}.`);
      return;
    }
    if (numAmount > availableUsdt) {
      alert('Withdrawal exceeds your available balance.');
      return;
    }

    onConfirmWithdraw(numAmount, address);
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
          <h3 className="font-bold text-base text-white">Withdraw Crypto</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-bold text-white text-base">Withdrawal Submitted!</h4>
            <p className="text-xs text-slate-400">
              Your transfer of {numAmount} USDT is processing on the blockchain.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Destination Address
              </label>
              <input
                type="text"
                placeholder="Paste TRC20 / ERC20 wallet address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#090C14] border border-white/10 text-white font-mono-num text-xs focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Network
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['TRC20', 'ERC20', 'BEP20'].map((net) => (
                  <button
                    key={net}
                    type="button"
                    onClick={() => setNetwork(net)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      network === net
                        ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50'
                        : 'bg-[#090C14] text-slate-400 border border-white/[0.06]'
                    }`}
                  >
                    {net}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-400">Amount (USDT)</span>
                <span className="text-slate-400">
                  Available: {availableUsdt.toFixed(2)} USDT
                </span>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#090C14] border border-white/10 focus-within:border-purple-500/50">
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent text-white font-mono-num text-sm font-bold focus:outline-none w-full"
                />
                <button
                  type="button"
                  onClick={() => setAmount(availableUsdt.toString())}
                  className="text-[10px] font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-500/20"
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#090C14] border border-white/[0.06] space-y-1 text-xs font-mono-num">
              <div className="flex justify-between text-slate-400">
                <span>Network Fee</span>
                <span>{networkFee.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between text-white font-bold">
                <span>Receive Amount</span>
                <span className="text-emerald-400">{receiveAmount.toFixed(2)} USDT</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-display font-bold text-sm shadow-[0_4px_20px_rgba(168,85,247,0.35)] active:scale-98 transition-all"
            >
              Confirm Withdrawal
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
