import React, { useState } from 'react';
import { X, Copy, Check, QrCode, AlertTriangle } from 'lucide-react';
import { CoinIcon } from '../common/CoinIcon';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const [selectedAsset, setSelectedAsset] = useState('USDT');
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const depositAddress = 'TFw9KxL2P5v8XQeM3mN6J7yRt8Zb4C9Aa1';

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#0F1320] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
          <h3 className="font-bold text-base text-white">Deposit Crypto</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Asset Selection */}
        <div className="space-y-3 mb-4">
          <label className="text-xs font-semibold text-slate-400 block">Select Asset</label>
          <div className="grid grid-cols-4 gap-2">
            {['USDT', 'BTC', 'ETH', 'SOL'].map((coin) => (
              <button
                key={coin}
                onClick={() => setSelectedAsset(coin)}
                className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                  selectedAsset === coin
                    ? 'bg-purple-600/20 border-purple-500/50 text-white'
                    : 'bg-[#090C14] border-white/[0.06] text-slate-400 hover:text-slate-200'
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
          <label className="text-xs font-semibold text-slate-400 block">Choose Network</label>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['TRC20', 'ERC20', 'BEP20', 'SOLANA'].map((net) => (
              <button
                key={net}
                onClick={() => setSelectedNetwork(net)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                  selectedNetwork === net
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50'
                    : 'bg-[#090C14] text-slate-400 border border-white/[0.06]'
                }`}
              >
                {net}
              </button>
            ))}
          </div>
        </div>

        {/* QR Code & Address Box */}
        <div className="p-4 rounded-2xl bg-[#090C14] border border-white/[0.07] flex flex-col items-center text-center mb-4">
          {/* Stylized QR placeholder with authentic crypto look */}
          <div className="w-36 h-36 p-2 rounded-xl bg-white flex items-center justify-center mb-3 shadow-inner">
            <div className="w-full h-full bg-slate-900 rounded-lg flex flex-col items-center justify-center p-2">
              <QrCode className="w-24 h-24 text-white" />
            </div>
          </div>

          <span className="text-[11px] text-slate-400 mb-1">
            Deposit Address ({selectedNetwork})
          </span>
          <div className="flex items-center gap-2 w-full justify-between p-2 rounded-xl bg-[#111624] border border-white/10">
            <span className="font-mono-num text-xs text-white truncate max-w-[240px]">
              {depositAddress}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/40 active:scale-95 transition-all flex items-center gap-1 text-[11px] font-bold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] mb-4">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Send only {selectedAsset} via {selectedNetwork}. Sending other assets or across the wrong network will result in permanent loss.
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
        >
          Done
        </button>
      </div>
    </div>
  );
};
