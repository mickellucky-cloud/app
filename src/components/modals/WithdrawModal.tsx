import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  DollarSign,
} from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableUsdt: number;
  onConfirmWithdraw: (amount: number, destination: string) => void;
}

type WithdrawMode = 'crypto' | 'fiat';

interface FiatWithdrawOption {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  fee: number;
  rateToUsdt: number; // 1 USDT = rate
}

const FIAT_OPTIONS: FiatWithdrawOption[] = [
  { code: 'USD', name: 'US Dollar (ACH / Wire)', symbol: '$', flag: '🇺🇸', fee: 0, rateToUsdt: 1.0 },
  { code: 'EUR', name: 'Euro (SEPA Instant)', symbol: '€', flag: '🇪🇺', fee: 0, rateToUsdt: 0.92 },
  { code: 'GBP', name: 'British Pound (Faster Payments)', symbol: '£', flag: '🇬🇧', fee: 0, rateToUsdt: 0.79 },
  { code: 'NGN', name: 'Nigerian Naira (Instant Bank)', symbol: '₦', flag: '🇳🇬', fee: 0, rateToUsdt: 1480 },
  { code: 'BRL', name: 'Brazilian Real (PIX)', symbol: 'R$', flag: '🇧🇷', fee: 0, rateToUsdt: 5.65 },
];

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  availableUsdt,
  onConfirmWithdraw,
}) => {
  const [mode, setMode] = useState<WithdrawMode>('crypto');

  // Crypto State
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('TRC20');
  const [amount, setAmount] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState({ title: '', desc: '' });
  const [formError, setFormError] = useState<string | null>(null);

  // Fiat State
  const [selectedFiat, setSelectedFiat] = useState<FiatWithdrawOption>(FIAT_OPTIONS[0]);
  const [fiatAmountUsdt, setFiatAmountUsdt] = useState('200');
  const [bankName, setBankName] = useState('JPMorgan Chase Bank');
  const [accountNumber, setAccountNumber] = useState('489201948291');
  const [accountHolder, setAccountHolder] = useState('Mickel Lucky');
  const [routingCode, setRoutingCode] = useState('021000021');

  if (!isOpen) return null;

  // Crypto calculations
  const numCryptoAmount = parseFloat(amount) || 0;
  const networkFee = network === 'TRC20' ? 1.0 : network === 'ERC20' ? 4.5 : 0.8;
  const receiveCryptoAmount = Math.max(0, numCryptoAmount - networkFee);

  // Fiat calculations
  const numFiatUsdt = parseFloat(fiatAmountUsdt) || 0;
  const fiatReceiveAmount = (numFiatUsdt * selectedFiat.rateToUsdt).toFixed(2);

  const handleCryptoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!address.trim()) {
      setFormError('Please enter a destination withdrawal address.');
      return;
    }
    if (numCryptoAmount <= networkFee) {
      setFormError(`Withdrawal amount must exceed network fee of $${networkFee}.`);
      return;
    }
    if (numCryptoAmount > availableUsdt) {
      setFormError('Withdrawal exceeds your available balance.');
      return;
    }

    onConfirmWithdraw(numCryptoAmount, address);
    setSuccessDetails({
      title: 'Crypto Withdrawal Submitted!',
      desc: `Your transfer of ${numCryptoAmount} USDT is processing on the blockchain.`,
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2200);
  };

  const handleFiatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (numFiatUsdt <= 10) {
      setFormError('Minimum fiat withdrawal is 10 USDT equivalent.');
      return;
    }
    if (numFiatUsdt > availableUsdt) {
      setFormError('Withdrawal exceeds your available balance.');
      return;
    }
    if (!accountNumber.trim() || !accountHolder.trim()) {
      setFormError('Please provide complete bank account details.');
      return;
    }

    onConfirmWithdraw(numFiatUsdt, `${selectedFiat.code} - ${bankName} (${accountNumber.slice(-4)})`);
    setSuccessDetails({
      title: 'Fiat Withdrawal Processing!',
      desc: `Your payout of ${selectedFiat.symbol}${fiatReceiveAmount} (${selectedFiat.code}) is en route to your bank.`,
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#0E141B] border-t sm:border border-[#D7E0EB] dark:border-[#242E3B] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl safe-area-bottom animate-slideUp text-[#0F172A] dark:text-[#EDF1F5] max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D7E0EB] dark:border-[#242E3B] mb-4">
          <div>
            <h3 className="font-bold text-lg text-[#0F172A] dark:text-[#EDF1F5]">Withdraw Funds</h3>
            <p className="text-xs text-[#64748B] dark:text-[#8E98A6]">Fast on-chain or direct bank payout</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#141B24] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-[#10B981] mx-auto animate-bounce" />
            <h4 className="font-bold text-[#0F172A] dark:text-[#EDF1F5] text-lg">{successDetails.title}</h4>
            <p className="text-xs text-[#64748B] dark:text-[#8E98A6] max-w-sm mx-auto">
              {successDetails.desc}
            </p>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-200 dark:border-emerald-500/20 text-xs text-[#10B981] font-mono">
              Status: Processing • ID: WTH-{Math.floor(100000 + Math.random() * 900000)}
            </div>
          </div>
        ) : (
          <div>
            {/* Mode Switcher */}
            <div className="flex rounded-xl p-1 bg-[#F8FAFC] dark:bg-[#0A0E13] border border-[#D7E0EB] dark:border-[#242E3B] mb-5">
              <button
                type="button"
                onClick={() => setMode('crypto')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  mode === 'crypto'
                    ? 'bg-[#8B5CF6] text-white shadow-xs'
                    : 'text-[#64748B] dark:text-[#8E98A6] hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                Withdraw Crypto
              </button>
              <button
                type="button"
                onClick={() => setMode('fiat')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'fiat'
                    ? 'bg-[#8B5CF6] text-white shadow-xs'
                    : 'text-[#64748B] dark:text-[#8E98A6] hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                <span>Fiat Currency Payout</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#10B981] text-white font-black">
                  Direct Bank
                </span>
              </button>
            </div>

            {/* -------------------- CRYPTO WITHDRAWAL -------------------- */}
            {mode === 'crypto' && (
              <form onSubmit={handleCryptoSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#64748B] dark:text-[#8E98A6] block mb-1">
                    Destination Address
                  </label>
                  <input
                    type="text"
                    placeholder="Paste TRC20 / ERC20 / BEP20 wallet address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] text-[#0F172A] dark:text-white font-mono-num text-xs focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#64748B] dark:text-[#8E98A6] block mb-1">
                    Select Network
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['TRC20', 'ERC20', 'BEP20'].map((net) => (
                      <button
                        key={net}
                        type="button"
                        onClick={() => setNetwork(net)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          network === net
                            ? 'bg-[#8B5CF6] text-white shadow-xs'
                            : 'bg-[#F8FAFC] dark:bg-[#141B24] text-[#475569] dark:text-[#8E98A6] border border-[#D7E0EB] dark:border-[#242E3B] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        {net}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-[#64748B] dark:text-[#8E98A6]">Amount (USDT)</span>
                    <span className="text-[#64748B] dark:text-[#8E98A6]">
                      Available: <strong className="text-[#0F172A] dark:text-white font-mono">{availableUsdt.toFixed(2)} USDT</strong>
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] focus-within:border-[#8B5CF6]">
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
                      className="text-[11px] font-bold text-[#8B5CF6] dark:text-[#8B5CF6] px-2 py-0.5 rounded bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/20 transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] space-y-1.5 text-xs font-mono-num">
                  <div className="flex justify-between text-[#64748B] dark:text-[#8E98A6]">
                    <span>Network Fee ({network})</span>
                    <span>{networkFee.toFixed(2)} USDT</span>
                  </div>
                  <div className="flex justify-between text-[#0F172A] dark:text-white font-bold">
                    <span>Receive Amount</span>
                    <span className="text-[#10B981]">{receiveCryptoAmount.toFixed(2)} USDT</span>
                  </div>
                </div>

                {formError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
                    {formError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-98 text-white font-bold text-xs shadow-md transition-all"
                >
                  Confirm Crypto Withdrawal
                </button>
              </form>
            )}

            {/* -------------------- FIAT CURRENCY WITHDRAWAL -------------------- */}
            {mode === 'fiat' && (
              <form onSubmit={handleFiatSubmit} className="space-y-4">
                {/* Fiat currency select */}
                <div>
                  <label className="text-xs font-semibold text-[#64748B] dark:text-[#8E98A6] block mb-1.5">
                    Select Target Currency
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {FIAT_OPTIONS.map((fiat) => (
                      <button
                        key={fiat.code}
                        type="button"
                        onClick={() => setSelectedFiat(fiat)}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          selectedFiat.code === fiat.code
                            ? 'bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#8B5CF6] dark:text-white'
                            : 'bg-[#F8FAFC] dark:bg-[#141B24] border-[#D7E0EB] dark:border-[#242E3B] text-[#475569] dark:text-[#8E98A6] hover:border-[#8B5CF6]/50'
                        }`}
                      >
                        <span className="text-base">{fiat.flag}</span>
                        <div>
                          <div className="text-xs font-bold leading-none">{fiat.code}</div>
                          <div className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">{fiat.symbol}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount to Convert & Withdraw */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-[#64748B] dark:text-[#8E98A6]">Amount (from USDT balance)</span>
                    <span className="text-[#64748B] dark:text-[#8E98A6]">
                      Available: <strong className="text-[#0F172A] dark:text-white font-mono">{availableUsdt.toFixed(2)} USDT</strong>
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] focus-within:border-[#8B5CF6]">
                    <input
                      type="number"
                      step="any"
                      placeholder="200"
                      value={fiatAmountUsdt}
                      onChange={(e) => setFiatAmountUsdt(e.target.value)}
                      className="bg-transparent text-[#0F172A] dark:text-white font-mono-num text-sm font-bold focus:outline-none w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setFiatAmountUsdt(availableUsdt.toString())}
                      className="text-[11px] font-bold text-[#8B5CF6] dark:text-[#8B5CF6] px-2 py-0.5 rounded bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/20 transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                {/* Destination Bank Account Information */}
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A] dark:text-white">
                    <Building2 className="w-4 h-4 text-[#8B5CF6]" />
                    <span>Destination Bank Account Details</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[#64748B] dark:text-[#8E98A6] block mb-1">Account Holder</label>
                      <input
                        type="text"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#64748B] dark:text-[#8E98A6] block mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[#64748B] dark:text-[#8E98A6] block mb-1">IBAN / Account #</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] text-xs font-mono font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#64748B] dark:text-[#8E98A6] block mb-1">Routing / SWIFT</label>
                      <input
                        type="text"
                        value={routingCode}
                        onChange={(e) => setRoutingCode(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] text-xs font-mono font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                  </div>
                </div>

                {/* Conversion & Payout summary */}
                <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] space-y-1 text-xs">
                  <div className="flex justify-between text-[#64748B] dark:text-[#8E98A6]">
                    <span>Withdrawal Fee</span>
                    <span className="text-[#10B981] font-bold">0.00% (Zero Fee)</span>
                  </div>
                  <div className="flex justify-between text-[#64748B] dark:text-[#8E98A6]">
                    <span>Exchange Rate</span>
                    <span className="font-mono text-[#0F172A] dark:text-slate-300">1 USDT ≈ {selectedFiat.symbol}{selectedFiat.rateToUsdt}</span>
                  </div>
                  <div className="flex justify-between text-[#0F172A] dark:text-white font-bold pt-1 border-t border-[#D7E0EB] dark:border-[#242E3B]">
                    <span>Estimated Payout to Bank</span>
                    <span className="text-[#10B981] text-sm font-extrabold font-mono">
                      {selectedFiat.symbol}{fiatReceiveAmount} {selectedFiat.code}
                    </span>
                  </div>
                </div>

                {formError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
                    {formError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-98 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Submit Direct Bank Withdrawal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
