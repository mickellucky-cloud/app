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
    <div className="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#0E141B] border-t sm:border border-[#D7E0EB] dark:border-[#242E3B] rounded-t-3xl sm:rounded-3xl p-5 text-[#0F172A] dark:text-[#EDF1F5] safe-area-bottom shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#D7E0EB] dark:border-[#242E3B] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">Referral Program</h3>
              <p className="text-[11px] text-[#64748B] dark:text-[#8E98A6]">Earn up to 40% lifetime trading rebates</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6] dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6]/10 via-[#F8FAFC] to-[#8B5CF6]/5 dark:from-[#8B5CF6]/20 dark:to-[#141B24] border border-[#8B5CF6]/20 dark:border-[#8B5CF6]/30 mb-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <span className="text-[11px] text-[#64748B] dark:text-[#8E98A6]">Total Referrals</span>
            <div className="font-mono-num font-extrabold text-xl text-[#0F172A] dark:text-white mt-0.5">14</div>
          </div>
          <div>
            <span className="text-[11px] text-[#64748B] dark:text-[#8E98A6]">Commission Earned</span>
            <div className="font-mono-num font-extrabold text-xl text-[#10B981] mt-0.5">
              $842.30
            </div>
          </div>
        </div>

        {/* Referral Code & Link */}
        <div className="space-y-3 mb-5 text-xs">
          <div>
            <label className="block text-[#64748B] dark:text-[#8E98A6] mb-1">Your Referral Code</label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B]">
              <span className="font-mono-num font-bold text-sm text-[#8B5CF6]">
                {referralCode}
              </span>
              <button
                onClick={() => copyToClipboard(referralCode, false)}
                className="flex items-center gap-1 text-[#8B5CF6] hover:text-[#7C3AED] transition-colors"
              >
                {copiedCode ? <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[#64748B] dark:text-[#8E98A6] mb-1">Invite Link</label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B]">
              <span className="font-mono text-[11px] text-[#0F172A] dark:text-slate-300 truncate max-w-[220px]">
                {referralLink}
              </span>
              <button
                onClick={() => copyToClipboard(referralLink, true)}
                className="flex items-center gap-1 text-[#8B5CF6] hover:text-[#7C3AED] transition-colors"
              >
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => copyToClipboard(referralLink, true)}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-95 font-bold text-white text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Invite Friends Now</span>
        </button>
      </div>
    </div>
  );
};
