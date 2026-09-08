import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableUsdt: number;
  onConfirmSend: (amount: number, recipient: string) => void;
}

export const SendModal: React.FC<SendModalProps> = ({
  isOpen,
  onClose,
  availableUsdt,
  onConfirmSend,
}) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) {
      alert('Please enter recipient OKNexus UID, email, or phone number.');
      return;
    }
    if (numAmount <= 0 || numAmount > availableUsdt) {
      alert('Invalid transfer amount.');
      return;
    }

    onConfirmSend(numAmount, recipient);
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
            <Send className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-base text-white">Send (Internal OKNexus)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-bold text-white text-base">Transfer Sent!</h4>
            <p className="text-xs text-slate-400">
              {numAmount} USDT was sent instantly to {recipient} with 0 fees.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
              ⚡ Instant settlement with 0 transaction fees between OKNexus users.
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Recipient (UID, Email, or Phone)
              </label>
              <input
                type="text"
                placeholder="e.g. UID: 8829410 or user@oknexus.com"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#090C14] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500/50"
              />
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

            <div className="p-3 rounded-xl bg-[#090C14] border border-white/[0.06] space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Fee</span>
                <span className="text-emerald-400 font-bold">0.00 USDT (FREE)</span>
              </div>
              <div className="flex justify-between text-white font-bold">
                <span>Total Deducted</span>
                <span>{numAmount.toFixed(2)} USDT</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-display font-bold text-sm shadow-md active:scale-98 transition-all"
            >
              Send Instantly
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
