import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  QrCode,
  AlertTriangle,
  Building2,
  CreditCard,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { CoinIcon } from '../common/CoinIcon';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositSuccess?: (amount: number, currency: string, isFiat: boolean) => void;
}

type DepositMode = 'crypto' | 'fiat';
type FiatMethod = 'bank_transfer' | 'card' | 'instant';

interface FiatCurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  minDeposit: number;
  maxDeposit: number;
  fee: string;
  processingTime: string;
}

const FIAT_CURRENCIES: FiatCurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', minDeposit: 20, maxDeposit: 50000, fee: '0.00%', processingTime: 'Instant - 15 mins' },
  { code: 'EUR', name: 'Euro (SEPA)', symbol: '€', flag: '🇪🇺', minDeposit: 15, maxDeposit: 50000, fee: '0.00%', processingTime: 'Instant SEPA' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', minDeposit: 15, maxDeposit: 30000, fee: '0.00%', processingTime: 'Faster Payments' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', minDeposit: 5000, maxDeposit: 10000000, fee: '0.00%', processingTime: 'Instant Bank Pay' },
  { code: 'BRL', name: 'Brazilian Real (PIX)', symbol: 'R$', flag: '🇧🇷', minDeposit: 50, maxDeposit: 100000, fee: '0.00%', processingTime: 'Instant PIX' },
  { code: 'INR', name: 'Indian Rupee (UPI)', symbol: '₹', flag: '🇮🇳', minDeposit: 1000, maxDeposit: 500000, fee: '0.00%', processingTime: 'Instant IMPS' },
];

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onDepositSuccess }) => {
  const [mode, setMode] = useState<DepositMode>('crypto');

  // Crypto State
  const [selectedAsset, setSelectedAsset] = useState('USDT');
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [cryptoCopied, setCryptoCopied] = useState(false);

  // Fiat State
  const [selectedFiat, setSelectedFiat] = useState<FiatCurrencyInfo>(FIAT_CURRENCIES[0]);
  const [fiatMethod, setFiatMethod] = useState<FiatMethod>('bank_transfer');
  const [fiatAmount, setFiatAmount] = useState('500');
  const [fiatStep, setFiatStep] = useState<'form' | 'details' | 'success'>('form');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const cryptoAddress = 'TFw9KxL2P5v8XQeM3mN6J7yRt8Zb4C9Aa1';

  const handleCopyCrypto = () => {
    navigator.clipboard.writeText(cryptoAddress);
    setCryptoCopied(true);
    setTimeout(() => setCryptoCopied(false), 2000);
  };

  const handleCopyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmFiatDeposit = () => {
    setFiatStep('success');
    if (onDepositSuccess) {
      onDepositSuccess(parseFloat(fiatAmount) || 500, selectedFiat.code, true);
    }
    setTimeout(() => {
      setFiatStep('form');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#0E141B] border-t sm:border border-[#D7E0EB] dark:border-[#242E3B] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl safe-area-bottom animate-slideUp text-[#0F172A] dark:text-[#EDF1F5] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D7E0EB] dark:border-[#242E3B] mb-4">
          <div>
            <h3 className="font-bold text-lg text-[#0F172A] dark:text-[#EDF1F5]">Deposit Funds</h3>
            <p className="text-xs text-[#64748B] dark:text-[#8E98A6]">Zero-fee instant deposit gateway</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#141B24] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deposit Type Switcher: Crypto vs Fiat Currency */}
        <div className="flex rounded-xl p-1 bg-[#F8FAFC] dark:bg-[#0A0E13] border border-[#D7E0EB] dark:border-[#242E3B] mb-5">
          <button
            onClick={() => {
              setMode('crypto');
              setFiatStep('form');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === 'crypto'
                ? 'bg-[#8B5CF6] text-white shadow-sm'
                : 'text-[#64748B] dark:text-[#8E98A6] hover:text-[#0F172A] dark:hover:text-white'
            }`}
          >
            Deposit Crypto
          </button>
          <button
            onClick={() => setMode('fiat')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'fiat'
                ? 'bg-[#8B5CF6] text-white shadow-sm'
                : 'text-[#64748B] dark:text-[#8E98A6] hover:text-[#0F172A] dark:hover:text-white'
            }`}
          >
            <span>Fiat Currency</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#F59E0B] text-slate-950 font-black">
              0% Fee
            </span>
          </button>
        </div>

        {/* -------------------- CRYPTO DEPOSIT FLOW -------------------- */}
        {mode === 'crypto' && (
          <div>
            {/* Asset Selection */}
            <div className="space-y-2 mb-4">
              <label className="text-xs font-semibold text-[#64748B] dark:text-[#8E98A6] block">Select Asset</label>
              <div className="grid grid-cols-4 gap-2">
                {['USDT', 'BTC', 'ETH', 'SOL'].map((coin) => (
                  <button
                    key={coin}
                    onClick={() => setSelectedAsset(coin)}
                    className={`flex flex-col items-center p-2.5 rounded-xl border transition-all ${
                      selectedAsset === coin
                        ? 'bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#8B5CF6] dark:text-white shadow-xs'
                        : 'bg-[#F8FAFC] dark:bg-[#141B24] border-[#D7E0EB] dark:border-[#242E3B] text-[#475569] dark:text-[#8E98A6] hover:border-[#8B5CF6]/50'
                    }`}
                  >
                    <CoinIcon symbol={coin} size={28} />
                    <span className="text-xs font-bold mt-1">{coin}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Network Selection */}
            <div className="space-y-2 mb-4">
              <label className="text-xs font-semibold text-[#64748B] dark:text-[#8E98A6] block">Choose Network</label>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {['TRC20', 'ERC20', 'BEP20', 'SOLANA', 'POLYGON'].map((net) => (
                  <button
                    key={net}
                    onClick={() => setSelectedNetwork(net)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                      selectedNetwork === net
                        ? 'bg-[#8B5CF6] text-white shadow-xs'
                        : 'bg-[#F8FAFC] dark:bg-[#141B24] text-[#475569] dark:text-[#8E98A6] border border-[#D7E0EB] dark:border-[#242E3B] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {net}
                  </button>
                ))}
              </div>
            </div>

            {/* QR Code & Address Box */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] flex flex-col items-center text-center mb-4">
              <div className="w-36 h-36 p-2 rounded-xl bg-white border border-[#D7E0EB] dark:border-transparent flex items-center justify-center mb-3 shadow-inner">
                <div className="w-full h-full bg-slate-900 rounded-lg flex flex-col items-center justify-center p-2">
                  <QrCode className="w-24 h-24 text-white" />
                </div>
              </div>

              <span className="text-[11px] text-[#64748B] dark:text-[#8E98A6] mb-1">
                Deposit Address ({selectedNetwork})
              </span>
              <div className="flex items-center gap-2 w-full justify-between p-2.5 rounded-xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B]">
                <span className="font-mono-num text-xs text-[#0F172A] dark:text-white truncate max-w-[240px]">
                  {cryptoAddress}
                </span>
                <button
                  onClick={handleCopyCrypto}
                  className="p-1.5 rounded-lg bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 text-[#8B5CF6] dark:text-[#EDF1F5] hover:bg-[#8B5CF6]/20 active:scale-95 transition-all flex items-center gap-1 text-[11px] font-bold"
                >
                  {cryptoCopied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{cryptoCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Warning Callout */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs mb-4">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#F59E0B]" />
              <span className="text-[#0F172A] dark:text-[#EDF1F5]">
                Send only <strong className="text-[#8B5CF6]">{selectedAsset}</strong> via <strong>{selectedNetwork}</strong>. Sending any other tokens will result in permanent loss. Minimum deposit: 10 {selectedAsset}.
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-98 text-white font-bold text-xs shadow-md transition-all"
            >
              Done
            </button>
          </div>
        )}

        {/* -------------------- FIAT CURRENCY DEPOSIT FLOW -------------------- */}
        {mode === 'fiat' && (
          <div>
            {fiatStep === 'success' ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-14 h-14 text-[#10B981] mx-auto animate-bounce" />
                <h4 className="font-bold text-[#0F172A] dark:text-[#EDF1F5] text-lg">Deposit Order Initiated!</h4>
                <p className="text-xs text-[#64748B] dark:text-[#8E98A6] max-w-sm mx-auto">
                  Your deposit of <strong className="text-[#0F172A] dark:text-white">{selectedFiat.symbol}{fiatAmount} {selectedFiat.code}</strong> has been logged. Funds will automatically credit to your OKNexus cash wallet upon bank clearance.
                </p>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-200 dark:border-emerald-500/20 text-xs text-[#10B981] font-mono">
                  Ref ID: OKN-DEP-{Math.floor(100000 + Math.random() * 900000)}
                </div>
              </div>
            ) : fiatStep === 'details' ? (
              /* Bank Transfer Instruction Details */
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Please initiate a transfer from your bank account matching your verified legal name. You must include the reference code below.
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-[#D7E0EB] dark:border-[#242E3B]">
                    <span className="text-xs text-[#64748B] dark:text-[#8E98A6]">Amount to Send</span>
                    <span className="text-base font-extrabold font-mono text-[#8B5CF6]">
                      {selectedFiat.symbol}{fiatAmount} {selectedFiat.code}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#64748B] dark:text-[#8E98A6]">Beneficiary Name</span>
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="text-[#0F172A] dark:text-[#EDF1F5]">OKNexus Treasury EU Ltd</span>
                        <button
                          onClick={() => handleCopyText('OKNexus Treasury EU Ltd', 'name')}
                          className="text-[#8B5CF6] hover:opacity-80"
                        >
                          {copiedField === 'name' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#64748B] dark:text-[#8E98A6]">Bank Name</span>
                      <span className="font-semibold text-[#0F172A] dark:text-[#EDF1F5]">Barclays Clearing International</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#64748B] dark:text-[#8E98A6]">IBAN / Account #</span>
                      <div className="flex items-center gap-1.5 font-mono font-bold">
                        <span className="text-[#0F172A] dark:text-[#EDF1F5]">GB82BARC20201539284729</span>
                        <button
                          onClick={() => handleCopyText('GB82BARC20201539284729', 'iban')}
                          className="text-[#8B5CF6] hover:opacity-80"
                        >
                          {copiedField === 'iban' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#64748B] dark:text-[#8E98A6]">BIC / SWIFT</span>
                      <span className="font-mono font-bold text-[#0F172A] dark:text-[#EDF1F5]">BARCGB22XXX</span>
                    </div>

                    <div className="flex justify-between items-center p-2 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30">
                      <div>
                        <div className="text-[10px] text-[#F59E0B] font-bold uppercase tracking-wider">Required Reference / Memo</div>
                        <div className="font-mono font-black text-[#0F172A] dark:text-white text-sm">OKN-882947-USD</div>
                      </div>
                      <button
                        onClick={() => handleCopyText('OKN-882947-USD', 'ref')}
                        className="px-2 py-1 bg-[#F59E0B]/20 text-[#F59E0B] rounded text-xs font-bold flex items-center gap-1 hover:bg-[#F59E0B]/30"
                      >
                        {copiedField === 'ref' ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setFiatStep('form')}
                    className="flex-1 py-3 rounded-xl border border-[#D7E0EB] dark:border-[#242E3B] text-xs font-bold text-[#475569] dark:text-[#8E98A6] hover:bg-[#F8FAFC] dark:hover:bg-[#141B24] transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmFiatDeposit}
                    className="flex-2 py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs shadow-md transition-all"
                  >
                    I Have Transferred {selectedFiat.symbol}{fiatAmount}
                  </button>
                </div>
              </div>
            ) : (
              /* Fiat Deposit Form */
              <div className="space-y-4">
                {/* Currency Selector */}
                <div>
                  <label className="text-xs font-semibold text-[#64748B] dark:text-[#8E98A6] block mb-1.5">
                    Select Fiat Currency
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {FIAT_CURRENCIES.map((fiat) => (
                      <button
                        key={fiat.code}
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

                {/* Amount Input */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-[#64748B] dark:text-[#8E98A6]">
                      Deposit Amount
                    </label>
                    <span className="text-[11px] text-[#64748B] dark:text-[#8E98A6]">
                      Min: {selectedFiat.symbol}{selectedFiat.minDeposit} • Max: {selectedFiat.symbol}{selectedFiat.maxDeposit.toLocaleString()}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#64748B] dark:text-[#8E98A6] text-base">
                      {selectedFiat.symbol}
                    </span>
                    <input
                      type="number"
                      value={fiatAmount}
                      onChange={(e) => setFiatAmount(e.target.value)}
                      placeholder="500"
                      className="w-full pl-8 pr-16 py-2.5 rounded-xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] font-mono-num text-[#0F172A] dark:text-white font-bold text-base focus:outline-none focus:border-[#8B5CF6]"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B] dark:text-[#8E98A6]">
                      {selectedFiat.code}
                    </span>
                  </div>
                  {/* Preset amounts */}
                  <div className="flex gap-1.5 mt-2">
                    {['100', '500', '1000', '5000'].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setFiatAmount(preset)}
                        className="flex-1 py-1 rounded-lg bg-[#F8FAFC] dark:bg-[#141B24] hover:bg-[#F1F5F9] dark:hover:bg-[#1A222D] text-xs font-semibold text-[#475569] dark:text-[#8E98A6] border border-[#D7E0EB] dark:border-[#242E3B] transition-colors"
                      >
                        +{selectedFiat.symbol}{preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deposit Method Selection */}
                <div>
                  <label className="text-xs font-semibold text-[#64748B] dark:text-[#8E98A6] block mb-1.5">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    <div
                      onClick={() => setFiatMethod('bank_transfer')}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        fiatMethod === 'bank_transfer'
                          ? 'bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/15 border-[#8B5CF6]'
                          : 'bg-[#F8FAFC] dark:bg-[#141B24] border-[#D7E0EB] dark:border-[#242E3B] hover:border-[#8B5CF6]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center text-[#8B5CF6]">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0F172A] dark:text-[#EDF1F5] flex items-center gap-1.5">
                            <span>Bank Wire / SEPA Instant</span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-50 text-[#10B981] dark:bg-emerald-500/20 rounded font-black">
                              0% FEE
                            </span>
                          </div>
                          <div className="text-[11px] text-[#64748B] dark:text-[#8E98A6]">
                            Instant to 1 business hour • High limits
                          </div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        fiatMethod === 'bank_transfer' ? 'border-[#8B5CF6] bg-[#8B5CF6]' : 'border-slate-400'
                      }`}>
                        {fiatMethod === 'bank_transfer' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>

                    <div
                      onClick={() => setFiatMethod('card')}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        fiatMethod === 'card'
                          ? 'bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/15 border-[#8B5CF6]'
                          : 'bg-[#F8FAFC] dark:bg-[#141B24] border-[#D7E0EB] dark:border-[#242E3B] hover:border-[#8B5CF6]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/15 flex items-center justify-center text-[#06B6D4]">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0F172A] dark:text-[#EDF1F5] flex items-center gap-1.5">
                            <span>Visa / Mastercard</span>
                          </div>
                          <div className="text-[11px] text-[#64748B] dark:text-[#8E98A6]">
                            Instant credit • 3D Secure
                          </div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        fiatMethod === 'card' ? 'border-[#8B5CF6] bg-[#8B5CF6]' : 'border-slate-400'
                      }`}>
                        {fiatMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#64748B] dark:text-[#8E98A6]">
                    <span>Deposit Fee</span>
                    <span className="text-[#10B981] font-bold">0.00% (Free)</span>
                  </div>
                  <div className="flex justify-between text-[#64748B] dark:text-[#8E98A6]">
                    <span>Credited Amount</span>
                    <span className="font-bold text-[#0F172A] dark:text-[#EDF1F5]">
                      {selectedFiat.symbol}{fiatAmount || '0'} {selectedFiat.code}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#64748B] dark:text-[#8E98A6]">
                    <span>Est. Arrival</span>
                    <span className="font-medium text-[#0F172A] dark:text-[#EDF1F5]">{selectedFiat.processingTime}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  onClick={() => setFiatStep('details')}
                  className="w-full py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-98 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Continue to Bank Deposit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
