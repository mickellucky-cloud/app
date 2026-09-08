import React, { useState } from 'react';
import { X, Users, Copy, CheckCircle2, Share2, Award } from 'lucide-react';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const referralCode = 'OKN-VIP-88294';
  const referralLink = `https://oknexus.io/join?ref=${referralCode}`;

  const copyToClipboard = (text: string, isLink: boolean) => {
    navigator.clipboard.writeText(text);
    if (isLink) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1800);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#0F1320] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 text-slate-100 safe-area-bottom">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Referral Program</h3>
              <p className="text-[11px] text-slate-400">Earn up to 40% lifetime trading rebates</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1F1436] to-[#0D1222] border border-purple-500/30 mb-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <span className="text-[11px] text-slate-400">Total Referrals</span>
            <div className="font-mono-num font-extrabold text-xl text-white mt-0.5">14</div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">Commission Earned</span>
            <div className="font-mono-num font-extrabold text-xl text-emerald-400 mt-0.5">
              $842.30
            </div>
          </div>
        </div>

        {/* Referral Code & Link */}
        <div className="space-y-3 mb-5 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Your Referral Code</label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#080B14] border border-white/10">
              <span className="font-mono-num font-bold text-sm text-purple-300">
                {referralCode}
              </span>
              <button
                onClick={() => copyToClipboard(referralCode, false)}
                className="flex items-center gap-1 text-purple-400 hover:text-white transition-colors"
              >
                {copiedCode ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Invite Link</label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#080B14] border border-white/10">
              <span className="font-mono text-[11px] text-slate-300 truncate max-w-[220px]">
                {referralLink}
              </span>
              <button
                onClick={() => copyToClipboard(referralLink, true)}
                className="flex items-center gap-1 text-purple-400 hover:text-white transition-colors"
              >
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => copyToClipboard(referralLink, true)}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:opacity-95 font-bold text-white text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Invite Friends Now</span>
        </button>
      </div>
    </div>
  );
};
