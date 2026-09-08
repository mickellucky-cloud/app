import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react';
import { OKNexusLogo } from '../common/OKNexusLogo';

interface TermsPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy';
}

export const TermsPrivacyModal: React.FC<TermsPrivacyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
}) => {
  const [tab, setTab] = useState<'terms' | 'privacy'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0F1320] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 text-slate-100 max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2.5">
            <OKNexusLogo size={24} />
            <h3 className="font-bold text-base text-white">Legal & Compliance</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-[#090C16] p-1 border border-white/[0.06] mb-4">
          <button
            onClick={() => setTab('terms')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              tab === 'terms'
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Terms of Service
          </button>
          <button
            onClick={() => setTab('privacy')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              tab === 'privacy'
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Privacy Policy
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs text-slate-300 pr-1 leading-relaxed">
          {tab === 'terms' ? (
            <>
              <section className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <h4 className="font-bold text-sm text-white mb-1.5">1. Acceptance of Terms</h4>
                <p>
                  By accessing or using OKNexus Mobile Exchange, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms of Service and all applicable laws and regulations.
                </p>
              </section>

              <section className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <h4 className="font-bold text-sm text-white mb-1.5">2. Eligibility & Verification</h4>
                <p>
                  Users must be of legal age in their jurisdiction. To access spot trading, funding accounts,
                  and P2P services, you agree to complete our multi-tier identity verification and security measures.
                </p>
              </section>

              <section className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <h4 className="font-bold text-sm text-white mb-1.5">3. Digital Asset Risk Disclosure</h4>
                <p>
                  Cryptocurrency trading involves substantial risk of loss. OKNexus does not provide investment
                  advice. You are solely responsible for evaluating your risk tolerance and trading decisions.
                </p>
              </section>

              <section className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <h4 className="font-bold text-sm text-white mb-1.5">4. Account Security & 2FA</h4>
                <p>
                  You are responsible for safeguarding your login credentials, authentication codes, and private keys.
                  OKNexus provides biometric and two-factor authentication safeguards to protect your account.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <h4 className="font-bold text-sm text-white mb-1.5">1. Information We Collect</h4>
                <p>
                  We collect information necessary to provide exchange services, process orders, maintain security,
                  and fulfill regulatory compliance (AML/KYC).
                </p>
              </section>

              <section className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <h4 className="font-bold text-sm text-white mb-1.5">2. Data Encryption & Security</h4>
                <p>
                  All sensitive credentials, API keys, and transaction telemetry are encrypted at rest using AES-256
                  and in transit using TLS 1.3. We never sell your personal information to third parties.
                </p>
              </section>

              <section className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <h4 className="font-bold text-sm text-white mb-1.5">3. Your Data Rights</h4>
                <p>
                  You retain the right to request access, correction, or deletion of your personal information
                  in accordance with applicable data protection regulations.
                </p>
              </section>
            </>
          )}
        </div>

        <div className="pt-4 mt-2 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Last Updated: September 2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs active:scale-95 transition-all shadow-md"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
