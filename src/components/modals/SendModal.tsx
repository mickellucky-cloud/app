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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!recipient.trim()) {
      setErrorMsg('Please enter recipient OKNexus UID, email, or phone number.');
      return;
    }
    if (numAmount <= 0 || numAmount > availableUsdt) {
      setErrorMsg('Invalid transfer amount or insufficient available USDT.');
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
    <div className="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#0E141B] border-t sm:border border-[#D7E0EB] dark:border-[#242E3B] rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom animate-slideUp text-[#0F172A] dark:text-[#EDF1F5] shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#D7E0EB] dark:border-[#242E3B] mb-4">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-[#8B5CF6]" />
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">Send (Internal OKNexus)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6] dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto animate-bounce" />
            <h4 className="font-bold text-[#0F172A] dark:text-white text-base">Transfer Sent!</h4>
            <p className="text-xs text-[#64748B] dark:text-[#8E98A6]">
              {numAmount} USDT was sent instantly to {recipient} with 0 fees.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="p-2.5 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-xs text-[#8B5CF6]">
              ⚡ Instant settlement with 0 transaction fees between OKNexus users.
            </div>

            <div>
              <label className="text-xs font-semibold text-[#64748B] dark:text-[#8E98A6] block mb-1">
                Recipient (UID, Email, or Phone)
              </label>
              <input
                type="text"
                placeholder="e.g. UID: 8829410 or user@oknexus.com"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-[#64748B] dark:text-[#8E98A6]">Amount (USDT)</span>
                <span className="text-[#64748B] dark:text-[#8E98A6]">
                  Available: {availableUsdt.toFixed(2)} USDT
                </span>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] focus-within:border-[#8B5CF6]">
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent text-[#0F172A] dark:text-white font-mono-num text-sm font-bold focus:outline-none w-full"
                />
                <button
                  type="button"
                  onClick={() => setAmount(availableUsdt.toString())}
                  className="text-[10px] font-bold text-[#8B5CF6] px-2 py-0.5 rounded bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20"
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] space-y-1 text-xs">
              <div className="flex justify-between text-[#64748B] dark:text-[#8E98A6]">
                <span>Fee</span>
                <span className="text-[#10B981] font-bold">0.00 USDT (FREE)</span>
              </div>
              <div className="flex justify-between text-[#0F172A] dark:text-white font-bold">
                <span>Total Deducted</span>
                <span>{numAmount.toFixed(2)} USDT</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-sm shadow-md active:scale-98 transition-all"
            >
              Send Instantly
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
