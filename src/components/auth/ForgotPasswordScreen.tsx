import React, { useState } from 'react';
import { OKNexusLogo } from '../common/OKNexusLogo';
import { ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck, KeyRound } from 'lucide-react';
import { COUNTRY_CODES } from '../../data/mockData';

interface ForgotPasswordScreenProps {
  onStartVerification: (identifier: string, type: 'email' | 'phone') => void;
  onNavigateLogin: () => void;
  isVerified?: boolean; // Set to true after OTP verification
  onResetComplete: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onStartVerification,
  onNavigateLogin,
  isVerified = false,
  onResetComplete,
}) => {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(
    COUNTRY_CODES ? COUNTRY_CODES[0] : { code: '+234', country: 'Nigeria', flag: '🇳🇬', id: 'NG' }
  );

  // New Password State (after OTP)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [inlineError, setInlineError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError('');

    if (authMethod === 'email') {
      const emailTrimmed = email.trim();
      if (!emailTrimmed) {
        setInlineError('Please enter your registered email address.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        setInlineError('Please enter a valid email address.');
        return;
      }
      onStartVerification(emailTrimmed, 'email');
    } else {
      const phoneDigits = phone.replace(/\D/g, '');
      if (!phoneDigits) {
        setInlineError('Please enter your registered phone number.');
        return;
      }
      onStartVerification(`${selectedCountry.code} ${phone.trim()}`, 'phone');
    }
  };

  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError('');

    if (newPassword.length < 8) {
      setInlineError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setInlineError('Passwords do not match.');
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      onResetComplete();
    }, 1500);
  };

  return (
    <div id="forgot-password-screen" className="min-h-screen max-w-md mx-auto px-6 py-6 flex flex-col justify-between text-slate-100 animate-fadeIn">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onNavigateLogin}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors p-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>
          <OKNexusLogo size={28} showWordmark={true} />
        </div>

        {!isVerified ? (
          <>
            {/* Step 1: Identifier Entry */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Account Recovery</span>
              </div>
              <h1 className="text-2xl font-bold font-display tracking-tight text-white mb-2">
                Reset Password
              </h1>
              <p className="text-sm text-slate-400">
                Enter your registered email address or phone number to receive a verification code.
              </p>
            </div>

            {/* Method switch */}
            <div className="flex rounded-xl bg-[#0B0F19] p-1 border border-white/[0.08] mb-5">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('email');
                  setInlineError('');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  authMethod === 'email'
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('phone');
                  setInlineError('');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  authMethod === 'phone'
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Phone Number
              </button>
            </div>

            <form onSubmit={handleRequestOtp} className="space-y-4">
              {authMethod === 'email' ? (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setInlineError('');
                    }}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#0F1322] border border-white/10 text-white placeholder:text-slate-500 text-sm focus:border-purple-500/80 focus:bg-[#131828] outline-none transition-all"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 px-3 py-3 rounded-xl bg-[#0F1322] border border-white/10 text-white text-sm">
                      <span>{selectedCountry.flag}</span>
                      <span className="font-mono-num font-semibold">{selectedCountry.code}</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="801 234 5678"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setInlineError('');
                      }}
                      className="flex-1 px-3.5 py-3 rounded-xl bg-[#0F1322] border border-white/10 text-white placeholder:text-slate-500 text-sm focus:border-purple-500/80 focus:bg-[#131828] outline-none transition-all font-mono-num"
                    />
                  </div>
                </div>
              )}

              {inlineError && (
                <div className="flex items-center gap-1.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium animate-shake">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{inlineError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 hover:opacity-95 active:scale-[0.99] font-bold text-white text-sm shadow-[0_4px_20px_rgba(168,85,247,0.35)] transition-all"
              >
                Continue to Verification
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Step 2: Set New Password */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold font-display tracking-tight text-white mb-2">
                Create New Password
              </h1>
              <p className="text-sm text-slate-400">
                Your identity was verified. Choose a strong new password for your OKNexus account.
              </p>
            </div>

            {isSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center animate-fadeIn">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="font-bold text-base text-white mb-1">Password Reset Successfully</h3>
                <p className="text-xs text-slate-300">
                  Redirecting to login with your new credentials...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSetNewPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setInlineError('');
                      }}
                      className="w-full px-3.5 py-3 rounded-xl bg-[#0F1322] border border-white/10 text-white placeholder:text-slate-500 text-sm focus:border-purple-500/80 focus:bg-[#131828] outline-none transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setInlineError('');
                      }}
                      className="w-full px-3.5 py-3 rounded-xl bg-[#0F1322] border border-white/10 text-white placeholder:text-slate-500 text-sm focus:border-purple-500/80 focus:bg-[#131828] outline-none transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {inlineError && (
                  <div className="flex items-center gap-1.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium animate-shake">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{inlineError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 hover:opacity-95 active:scale-[0.99] font-bold text-white text-sm shadow-[0_4px_20px_rgba(168,85,247,0.35)] transition-all"
                >
                  Save New Password
                </button>
              </form>
            )}
          </>
        )}
      </div>

      <div className="text-center pt-6 pb-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>End-to-end encrypted recovery</span>
      </div>
    </div>
  );
};
