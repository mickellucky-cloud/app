import React, { useState } from 'react';
import {
  X,
  ScanLine,
  QrCode,
  Camera,
  Upload,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface ScanToPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableUsdt: number;
  userUid?: string;
  username?: string;
  onConfirmPayment: (amount: number, recipient: string) => void;
}

export const ScanToPayModal: React.FC<ScanToPayModalProps> = ({
  isOpen,
  onClose,
  availableUsdt,
  userUid = 'OKN-88392019',
  username = 'Mickel_Lucky',
  onConfirmPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'myCode'>('scan');
  const [isScanning, setIsScanning] = useState(true);
  const [detectedRecipient, setDetectedRecipient] = useState<{
    uid: string;
    name: string;
    avatar: string;
  } | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);

  if (!isOpen) return null;

  const handleSimulateQRScan = (sampleUid: string, sampleName: string) => {
    setIsSimulatingScan(true);
    setTimeout(() => {
      setIsSimulatingScan(false);
      setDetectedRecipient({
        uid: sampleUid,
        name: sampleName,
        avatar: sampleName.charAt(0).toUpperCase(),
      });
    }, 800);
  };

  const handleConfirmPay = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payAmount);
    if (!detectedRecipient) return;
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > availableUsdt) return;

    onConfirmPayment(amountNum, `${detectedRecipient.name} (${detectedRecipient.uid})`);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setDetectedRecipient(null);
      setPayAmount('');
      setPaymentNote('');
      onClose();
    }, 1800);
  };

  const handleCopyUid = () => {
    navigator.clipboard?.writeText(userUid);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 dark:bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#0E141B] border-t sm:border border-[#D7E0EB] dark:border-[#242E3B] rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom text-[#0F172A] dark:text-[#EDF1F5] shadow-2xl transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D7E0EB] dark:border-[#242E3B] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#8B5CF6]/15 dark:bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
              <ScanLine className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white leading-tight">
                Scan to Pay
              </h3>
              <p className="text-[11px] text-[#64748B] dark:text-[#8E98A6]">
                Instant 0-gas peer settlement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6] dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex rounded-xl bg-[#F1F5F9] dark:bg-[#141B24] p-1 mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('scan');
              setDetectedRecipient(null);
            }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'scan'
                ? 'bg-white dark:bg-[#1C2533] text-[#8B5CF6] font-bold shadow-xs'
                : 'text-[#64748B] dark:text-[#8E98A6]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan QR Code</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('myCode')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'myCode'
                ? 'bg-white dark:bg-[#1C2533] text-[#8B5CF6] font-bold shadow-xs'
                : 'text-[#64748B] dark:text-[#8E98A6]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>My Receive QR</span>
          </button>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-lg text-[#0F172A] dark:text-white">
              Payment Successful!
            </h4>
            <p className="text-xs text-[#64748B] dark:text-[#8E98A6]">
              Sent <span className="font-bold text-[#8B5CF6]">{payAmount} USDT</span> to {detectedRecipient?.name}
            </p>
          </div>
        ) : activeTab === 'scan' ? (
          <div>
            {!detectedRecipient ? (
              <div className="space-y-4">
                {/* Simulated Camera Viewfinder */}
                <div className="relative aspect-square max-h-56 mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-purple-500/30 flex items-center justify-center shadow-inner">
                  {/* Glowing Laser Scan Bar */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#EC4899] to-transparent animate-pulse top-1/2 -translate-y-1/2 shadow-[0_0_12px_#EC4899]" />

                  {/* Corner Reticles */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#8B5CF6] rounded-tl" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#8B5CF6] rounded-tr" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#8B5CF6] rounded-bl" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#8B5CF6] rounded-br" />

                  {/* Center Hint */}
                  <div className="text-center px-4 relative z-10 space-y-1.5">
                    {isSimulatingScan ? (
                      <div className="flex flex-col items-center gap-2 text-purple-300">
                        <RefreshCw className="w-6 h-6 animate-spin text-[#8B5CF6]" />
                        <span className="text-xs font-semibold">Reading QR Code...</span>
                      </div>
                    ) : (
                      <>
                        <ScanLine className="w-8 h-8 mx-auto text-purple-400/80 animate-pulse" />
                        <p className="text-xs text-slate-300 font-medium">
                          Align OKNexus Pay QR code within frame
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Camera active • Auto-detects OKNexus UID
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Simulation Presets for Testing */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-[#64748B] dark:text-[#8E98A6]">
                    Demo Quick Scan:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSimulateQRScan('OKN-99481230', 'Alex_Vault')}
                      className="py-2 px-2.5 rounded-xl border border-[#D7E0EB] dark:border-[#242E3B] bg-[#F8FAFC] dark:bg-[#141B24] hover:border-[#8B5CF6] text-left text-xs transition-colors"
                    >
                      <div className="font-bold text-[#0F172A] dark:text-white truncate">@Alex_Vault</div>
                      <div className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">UID: OKN-99481230</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSimulateQRScan('OKN-55210948', 'Elena_Crypto')}
                      className="py-2 px-2.5 rounded-xl border border-[#D7E0EB] dark:border-[#242E3B] bg-[#F8FAFC] dark:bg-[#141B24] hover:border-[#8B5CF6] text-left text-xs transition-colors"
                    >
                      <div className="font-bold text-[#0F172A] dark:text-white truncate">@Elena_Crypto</div>
                      <div className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">UID: OKN-55210948</div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Scanned Recipient Payment Form */
              <form onSubmit={handleConfirmPay} className="space-y-3.5">
                <div className="p-3 rounded-2xl bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] flex items-center justify-center font-bold text-white text-sm">
                      {detectedRecipient.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#0F172A] dark:text-white">
                        {detectedRecipient.name}
                      </div>
                      <div className="text-[10px] text-[#8B5CF6] font-mono-num font-semibold">
                        UID: {detectedRecipient.uid}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetectedRecipient(null)}
                    className="text-xs text-[#8B5CF6] hover:underline"
                  >
                    Rescan
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <label className="font-semibold text-[#64748B] dark:text-[#8E98A6]">
                      Amount (USDT)
                    </label>
                    <span className="text-[11px] text-[#64748B] dark:text-[#8E98A6]">
                      Avail: <span className="font-mono-num font-bold text-[#0F172A] dark:text-white">{availableUsdt.toFixed(2)}</span>
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      max={availableUsdt}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7E0EB] dark:border-[#242E3B] bg-white dark:bg-[#141B24] font-mono-num text-sm text-[#0F172A] dark:text-white outline-none focus:border-[#8B5CF6]"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setPayAmount(availableUsdt.toString())}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8B5CF6] hover:text-[#EC4899]"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#64748B] dark:text-[#8E98A6] mb-1">
                    Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Dinner, Coffee, OTC"
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D7E0EB] dark:border-[#242E3B] bg-white dark:bg-[#141B24] text-xs text-[#0F172A] dark:text-white outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] text-[11px]">
                  <span className="text-[#64748B] dark:text-[#8E98A6]">Network Fee</span>
                  <span className="font-bold text-[#10B981]">0.00 USDT (Internal)</span>
                </div>

                <button
                  type="submit"
                  disabled={!payAmount || parseFloat(payAmount) <= 0 || parseFloat(payAmount) > availableUsdt}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-95 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
                >
                  Confirm & Pay Now
                </button>
              </form>
            )}
          </div>
        ) : (
          /* My Receive QR Code */
          <div className="text-center space-y-4 py-2">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 inline-block shadow-lg">
              {/* Stylized QR Code Preview */}
              <div className="w-48 h-48 bg-slate-900 rounded-xl p-3 flex flex-col items-center justify-between relative overflow-hidden">
                <div className="w-full flex justify-between">
                  <div className="w-12 h-12 border-4 border-white rounded-md p-1">
                    <div className="w-full h-full bg-[#8B5CF6]" />
                  </div>
                  <div className="w-12 h-12 border-4 border-white rounded-md p-1">
                    <div className="w-full h-full bg-[#EC4899]" />
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] p-1 flex items-center justify-center text-white font-black text-xs shadow-md">
                  OKN
                </div>
                <div className="w-full flex justify-between">
                  <div className="w-12 h-12 border-4 border-white rounded-md p-1">
                    <div className="w-full h-full bg-[#F59E0B]" />
                  </div>
                  <div className="w-12 h-12 border-2 border-dashed border-white/60 flex items-center justify-center text-[8px] text-white font-mono">
                    PAY
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-sm text-[#0F172A] dark:text-white">@{username}</div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748B] dark:text-[#8E98A6]">
                <span className="font-mono-num font-semibold">{userUid}</span>
                <button
                  type="button"
                  onClick={handleCopyUid}
                  className="p-1 rounded text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-colors"
                  title="Copy UID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] text-xs text-[#64748B] dark:text-[#8E98A6] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
              <span className="text-left">Supports USDT, BTC, ETH, and OKN zero-fee instant deposit</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
