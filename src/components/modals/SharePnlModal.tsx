import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2, Copy, Check, Download, Sparkles, TrendingUp, ShieldCheck, QrCode } from 'lucide-react';
import { OKNexusBadge3D } from '../common/OKNexusLogo';

export interface SharePnlModalProps {
  isOpen: boolean;
  onClose: () => void;
  pnlPct: number;
  pnlUsd: number;
  totalAssets: number;
  timeframe?: string;
}

export const SharePnlModal: React.FC<SharePnlModalProps> = ({
  isOpen,
  onClose,
  pnlPct,
  pnlUsd,
  totalAssets,
  timeframe = '24H',
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const isPositive = pnlPct >= 0;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/70 dark:bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-md bg-white dark:bg-[#0A0D14] border border-slate-200 dark:border-white/[0.12] rounded-3xl p-5 sm:p-6 text-slate-900 dark:text-white shadow-2xl overflow-hidden transition-colors"
        >
          {/* Ambient Spotlight Background */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-purple-600/20 dark:bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-emerald-500/15 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/40 text-purple-700 dark:text-purple-400 flex items-center justify-center">
                <Share2 className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-sm tracking-wide text-slate-900 dark:text-white">Share Portfolio Performance</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* The Luxury Glassmorphic Brag Card */}
          <div
            id="pnl-brag-card"
            className="relative z-10 overflow-hidden rounded-2xl bg-gradient-to-br from-[#121624] via-[#0E121E] to-[#160F2B] border border-purple-500/30 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] mb-5"
          >
            {/* Top Card Row: Brand & Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <OKNexusBadge3D size={36} />
                <div>
                  <div className="text-xs font-black tracking-wider uppercase text-white">OKNexus</div>
                  <div className="text-[10px] text-purple-300/80 font-mono">Institutional Spot & Futures</div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Return
              </span>
            </div>

            {/* P&L Performance Numbers */}
            <div className="my-3">
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {timeframe} Return on Capital
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`font-mono-num text-4xl sm:text-5xl font-black tracking-tight ${
                    isPositive
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400'
                      : 'text-rose-400'
                  }`}
                >
                  {isPositive ? `+${pnlPct.toFixed(2)}%` : `${pnlPct.toFixed(2)}%`}
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  PRO
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1 text-xs font-mono text-slate-300">
                <span>P&L Value:</span>
                <span className="font-bold text-emerald-400">
                  {isPositive ? `+$${pnlUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : `-$${Math.abs(pnlUsd).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                </span>
              </div>
            </div>

            {/* Glowing Mini Sparkline Visual */}
            <div className="h-12 w-full my-3">
              <svg className="w-full h-full overflow-visible select-none" viewBox="0 0 300 48" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="brag-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,40 Q40,35 80,38 T160,25 T240,15 T300,5 L300,48 L0,48 Z"
                  fill="url(#brag-grad)"
                />
                <path
                  d="M0,40 Q40,35 80,38 T160,25 T240,15 T300,5"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="300" cy="5" r="3.5" fill="#10B981" className="animate-ping" />
              </svg>
            </div>

            {/* Bottom Card Row: QR & Security Seal */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold text-slate-300">Trader: 0x9f...4a2b (VIP 2)</div>
                <div className="text-[9px] text-slate-500 font-mono">oknexus.exchange/portfolio</div>
              </div>

              {/* Verified Mini QR Mockup */}
              <div className="w-9 h-9 rounded-lg bg-white/95 p-1 flex items-center justify-center shadow-xs">
                <QrCode className="w-full h-full text-slate-950" />
              </div>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="relative z-10 grid grid-cols-2 gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 active:scale-95 border border-slate-200 dark:border-white/15 text-xs font-bold text-slate-800 dark:text-white transition-all shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span>Copied Link!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500 dark:text-slate-300" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-xs font-bold text-white transition-all shadow-[0_4px_16px_rgba(139,92,246,0.35)]"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Saved Image!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-white" />
                  <span>Save Brag Card</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
