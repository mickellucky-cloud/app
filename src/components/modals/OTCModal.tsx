import React, { useState } from 'react';
import { X, Building2, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { OKNexusLogo } from '../common/OKNexusLogo';

interface OTCModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OTCModal: React.FC<OTCModalProps> = ({ isOpen, onClose }) => {
  const [asset, setAsset] = useState('USDT');
  const [amount, setAmount] = useState('50000');
  const [fiat, setFiat] = useState('USD');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#0F1320] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 text-slate-100 safe-area-bottom">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">OTC Block Trading Desk</h3>
              <p className="text-[11px] text-slate-400">Institutional depth & personalized execution</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center animate-fadeIn">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-3" />
            <h4 className="font-bold text-base text-white mb-1">Quote Request Dispatched</h4>
            <p className="text-xs text-slate-300">
              Your OKNexus Institutional VIP Account Executive will contact you within 5 minutes with a tailored RFQ quote.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#080B14] border border-white/[0.06] text-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span>Minimum Order Size</span>
                <span className="font-mono-num text-purple-300 font-bold">$25,000 USD</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Slippage Guarantee</span>
                <span className="text-emerald-400 font-bold">0.00% Fixed Spread</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Asset
              </label>
              <select
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1322] border border-white/10 text-white text-sm outline-none cursor-pointer"
              >
                <option value="USDT">USDT (Tether USD)</option>
                <option value="BTC">BTC (Bitcoin)</option>
                <option value="ETH">ETH (Ethereum)</option>
                <option value="OKN">OKN (OKNexus Institutional)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Estimated Volume ({fiat})
              </label>
              <input
                type="number"
                min="25000"
                step="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1322] border border-white/10 text-white font-mono-num text-sm outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:opacity-95 font-bold text-white text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Request OTC Dedicated Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full Escrow & SOC 2 Institutional Custody</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
