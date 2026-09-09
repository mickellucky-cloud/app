import React, { useState } from 'react';
import { OKNexusLogo } from '../common/OKNexusLogo';
import { ThemeToggle } from '../common/ThemeToggle';
import { ThemeMode } from '../../types';
import {
  AlertCircle,
  ChevronDown,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Zap,
  TrendingUp,
  Globe2,
  Shield,
} from 'lucide-react';
import { COUNTRY_CODES, DEV_TEST_ACCOUNT, CountryCodeItem } from '../../data/mockData';

interface LoginScreenProps {
  onContinue: (identifier: string, type: 'email' | 'phone') => void;
  onNavigateCreateAccount: () => void;
  onNavigateForgotPassword: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onSocialSuccess: (provider: 'google' | 'apple') => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onContinue,
  onNavigateCreateAccount,
  onNavigateForgotPassword,
  onOpenTerms,
  onOpenPrivacy,
  onSocialSuccess,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCodeItem>(COUNTRY_CODES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  // States
  const [inlineError, setInlineError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Social Auth States
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);
  const [socialSuccess, setSocialSuccess] = useState<'google' | 'apple' | null>(null);
  const [socialError, setSocialError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError('');

    if (authMethod === 'email') {
      const emailTrimmed = email.trim();
      if (!emailTrimmed) {
        setInlineError('Email address cannot be empty.');
        return;
      }
      // Standard email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        setInlineError('Please enter a valid email address (e.g., name@example.com).');
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onContinue(emailTrimmed, 'email');
      }, 350);
    } else {
      const phoneDigits = phone.replace(/\D/g, '');
      if (!phoneDigits) {
        setInlineError('Phone number cannot be empty.');
        return;
      }
      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        setInlineError('Please enter a valid phone number (7 to 15 digits).');
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        const fullPhone = `${selectedCountry.code} ${phone.trim()}`;
        onContinue(fullPhone, 'phone');
      }, 350);
    }
  };

  // Quick fill development test account
  const handleUseTestAccount = (type: 'email' | 'phone' = 'email') => {
    setInlineError('');
    if (type === 'email') {
      setAuthMethod('email');
      setEmail(DEV_TEST_ACCOUNT.email);
    } else {
      setAuthMethod('phone');
      const nigeria = COUNTRY_CODES.find((c) => c.code === '+234') || COUNTRY_CODES[0];
      setSelectedCountry(nigeria);
      setPhone('801 234 5678');
    }
  };

  // Social OAuth (Mock flow for preview)
  const handleSocialLogin = (provider: 'google' | 'apple') => {
    setSocialError(null);
    setSocialLoading(provider);

    // Development-safe mock OAuth flow
    setTimeout(() => {
      // 95% deterministic success for testability
      setSocialLoading(null);
      setSocialSuccess(provider);
      setTimeout(() => {
        onSocialSuccess(provider);
      }, 600);
    }, 1000);
  };

  return (
    <div
      id="oknexus-login-screen"
      className="min-h-screen w-full flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 text-slate-100 animate-fadeIn relative overflow-x-hidden"
    >
      {/* Background ambient accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Top Header Bar with Brand & Theme Toggle */}
      <div className="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-between pb-2 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30">
            <OKNexusLogo size={24} showWordmark={false} />
          </div>
          <div>
            <span className="font-display font-extrabold text-base tracking-tight text-white block leading-none">
              OKNEXUS
            </span>
            <span className="text-[10px] text-purple-400 font-semibold tracking-wider">
              INSTITUTIONAL DESK
            </span>
          </div>
        </div>

        {onToggleTheme && (
          <ThemeToggle
            theme={theme}
            onToggle={onToggleTheme}
            size="sm"
          />
        )}
      </div>

      {/* Main Responsive Grid Layout (Web & Tablet dual-column, Mobile single-column) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto my-auto grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-stretch py-3">
        {/* Left Column: Exchange Showcase (Visible on Tablet and Web) */}
        <div className="hidden md:flex md:col-span-6 lg:col-span-7 flex-col justify-between p-7 lg:p-9 rounded-3xl bg-gradient-to-br from-[#120F24]/90 via-[#0A0D18]/95 to-[#0D1222]/90 border border-purple-500/25 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next-Gen Digital Asset Infrastructure</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-extrabold font-display text-white tracking-tight leading-tight mb-3">
              Trade With Precision.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400">
                Institutional Speed.
              </span>
            </h2>

            <p className="text-xs lg:text-sm text-slate-400 leading-relaxed max-w-md mb-6">
              Access deep liquidity order books, zero-fee P2P escrow, automated crypto savings, and millisecond trade execution on OKNexus.
            </p>

            {/* Platform Highlights */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-white">100,000 TPS</div>
                <div className="text-[11px] text-slate-400">Sub-millisecond engine</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-white">1:1 Reserve Proof</div>
                <div className="text-[11px] text-slate-400">Verifiable Merkle vault</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-white">Global P2P</div>
                <div className="text-[11px] text-slate-400">0% Maker fee escrow</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-white">High-Yield Earn</div>
                <div className="text-[11px] text-slate-400">Up to 18.5% Staking APY</div>
              </div>
            </div>
          </div>

          {/* Live Trust Banner */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SOC2 Type II Certified</span>
            </div>
          </div>
        </div>

        {/* Right Column: Form Container (Mobile, Tablet, Desktop) */}
        <div className="w-full md:col-span-6 lg:col-span-5 max-w-md mx-auto p-5 sm:p-7 rounded-3xl bg-[#0A0D18]/95 border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {/* Mobile Only Brand Presence */}
          <div className="flex md:hidden flex-col items-center justify-center mb-5 text-center">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#1E1433] via-[#121626] to-[#0A0D18] border border-purple-500/30 shadow-md mb-2">
              <OKNexusLogo size={40} showWordmark={false} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-lg tracking-tight text-white">
                OKNEXUS
              </span>
              <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold border border-purple-500/30 tracking-wider">
                EXCHANGE
              </span>
            </div>
          </div>

          {/* Welcome Back & Subtitle */}
          <div className="mb-4 text-center md:text-left">
            <h1 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white mb-1">
              Welcome back
            </h1>
            <p className="text-xs text-slate-400">
              Enter your credentials to access your OKNexus trading desk
            </p>
          </div>

        {/* Development Test Helper Banner */}
        <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-[#1E1435]/70 via-[#101424]/90 to-[#0A1A28]/70 border border-purple-500/30 shadow-sm text-left">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Dev Test Account
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono-num font-semibold">
              Ready to test
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span className="font-mono-num text-slate-400 truncate max-w-[190px]">
              {DEV_TEST_ACCOUNT.email}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleUseTestAccount('email')}
                className="px-2 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-[10px] font-bold active:scale-95 transition-all"
              >
                Use Email
              </button>
              <button
                type="button"
                onClick={() => handleUseTestAccount('phone')}
                className="px-2 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold active:scale-95 transition-all"
              >
                Use Phone
              </button>
            </div>
          </div>
        </div>

        {/* Authentication Switcher (Email vs Phone) */}
        <div className="flex rounded-2xl bg-[#090C16] p-1 border border-white/[0.08] mb-4">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              setInlineError('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              authMethod === 'email'
                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_2px_12px_rgba(168,85,247,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone');
              setInlineError('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              authMethod === 'phone'
                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_2px_12px_rgba(168,85,247,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone</span>
          </button>
        </div>

        {/* Primary Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authMethod === 'email' ? (
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setInlineError('');
                }}
                disabled={isSubmitting}
                className={`w-full px-3.5 py-3 rounded-2xl bg-[#0F1322] border text-white placeholder:text-slate-500 text-sm outline-none transition-all ${
                  inlineError
                    ? 'border-rose-500/80 bg-rose-950/20 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                    : 'border-white/10 focus:border-purple-500/80 focus:bg-[#131828]'
                }`}
                autoComplete="email"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="login-phone" className="block text-xs font-medium text-slate-300 mb-1.5">
                Phone Number
              </label>
              <div className="flex gap-2">
                {/* Country Code Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-3 rounded-2xl bg-[#0F1322] border border-white/10 text-white text-sm hover:border-purple-500/40 transition-colors"
                  >
                    <span>{selectedCountry.flag}</span>
                    <span className="font-mono-num font-semibold text-xs">{selectedCountry.code}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isCountryDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 z-50 w-56 max-h-56 overflow-y-auto rounded-2xl bg-[#0D111D] border border-white/10 shadow-2xl p-1 text-xs">
                      {COUNTRY_CODES.map((c) => (
                        <button
                          key={c.code + c.id}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c);
                            setIsCountryDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-purple-500/20 text-left text-slate-200"
                        >
                          <span className="flex items-center gap-2">
                            <span>{c.flag}</span>
                            <span className="truncate max-w-[100px]">{c.country}</span>
                          </span>
                          <span className="font-mono-num text-purple-300 font-semibold">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  id="login-phone"
                  type="tel"
                  placeholder="801 234 5678"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setInlineError('');
                  }}
                  disabled={isSubmitting}
                  className={`flex-1 px-3.5 py-3 rounded-2xl bg-[#0F1322] border text-white placeholder:text-slate-500 text-sm outline-none transition-all font-mono-num ${
                    inlineError
                      ? 'border-rose-500/80 bg-rose-950/20 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                      : 'border-white/10 focus:border-purple-500/80 focus:bg-[#131828]'
                  }`}
                  autoComplete="tel"
                />
              </div>
            </div>
          )}

          {/* Inline Feedback (No browser alerts!) */}
          {inlineError && (
            <div className="flex items-center gap-1.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{inlineError}</span>
            </div>
          )}

          {/* Primary CTA: Continue */}
          <button
            id="login-continue-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 hover:opacity-95 active:scale-[0.99] font-bold text-white text-sm shadow-[0_4px_24px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Checking security...</span>
              </>
            ) : (
              <span>Continue</span>
            )}
          </button>
        </form>

        {/* Secondary Actions (Forgot password & Create account) */}
        <div className="flex items-center justify-between pt-3 pb-4 text-xs">
          <button
            type="button"
            onClick={onNavigateForgotPassword}
            className="text-slate-400 hover:text-purple-300 transition-colors"
          >
            Forgot password?
          </button>
          <button
            type="button"
            onClick={onNavigateCreateAccount}
            className="font-bold text-purple-400 hover:text-purple-300 transition-colors"
          >
            Create account
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.08]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-[#07090E] text-slate-500 text-[11px] font-medium uppercase tracking-wider">
              or connect with
            </span>
          </div>
        </div>

        {/* Social Authentication Options */}
        <div className="space-y-2.5 mt-4">
          {/* Google Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={socialLoading !== null}
            className="w-full py-3 px-4 rounded-2xl bg-[#0E121E] border border-white/10 hover:border-purple-500/40 active:scale-[0.99] transition-all flex items-center justify-center gap-3 text-xs font-semibold text-slate-200"
          >
            {socialLoading === 'google' ? (
              <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
            ) : socialSuccess === 'google' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Apple Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('apple')}
            disabled={socialLoading !== null}
            className="w-full py-3 px-4 rounded-2xl bg-[#0E121E] border border-white/10 hover:border-purple-500/40 active:scale-[0.99] transition-all flex items-center justify-center gap-3 text-xs font-semibold text-slate-200"
          >
            {socialLoading === 'apple' ? (
              <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
            ) : socialSuccess === 'apple' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <svg className="w-4 h-4 fill-white" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.07-7.69-7.85-12-14.34-6.42-9.65-11.45-20.67-15.09-33.05-3.64-12.39-5.46-24.16-5.46-35.34 0-16.14 4.14-29.35 12.43-39.63 8.28-10.28 18.59-15.48 30.93-15.6 5.86 0 12.18 1.54 18.96 4.62 6.78 3.08 10.97 4.62 12.57 4.62 1.34 0 5.48-1.54 12.43-4.62 6.94-3.08 13.06-4.43 18.35-4.04 13.9.67 24.96 5.56 33.19 14.67-12.15 7.37-18.11 17.58-17.88 30.64.23 10.28 4.19 18.84 11.88 25.68 7.69 6.84 16.89 10.74 27.6 11.7-2.34 7.15-5.25 14.52-8.72 22.1zM119.22 33.74c0-7.37 2.68-14.28 8.04-20.73 5.36-6.45 12.01-10.68 19.95-12.69.22 1.23.34 2.35.34 3.36 0 7.37-2.79 14.39-8.38 21.05-5.59 6.66-12.45 10.76-20.57 12.3-.34-1.12-.51-2.22-.51-3.29z" />
              </svg>
            )}
            <span>Continue with Apple</span>
          </button>
        </div>

        {/* Social error feedback */}
        {socialError && (
          <div className="mt-3 flex items-center gap-1.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{socialError}</span>
          </div>
        )}
        </div>
      </div>

      {/* Footer: Legal Links & Security Assurance */}
      <div className="relative z-10 pt-6 text-center">
        <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
          By continuing, you agree to OKNexus{' '}
          <button
            type="button"
            onClick={onOpenTerms}
            className="text-purple-400 hover:text-purple-300 underline underline-offset-2"
          >
            Terms of Service
          </button>{' '}
          and acknowledge our{' '}
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="text-purple-400 hover:text-purple-300 underline underline-offset-2"
          >
            Privacy Policy
          </button>
          .
        </p>
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>OKNexus Quantum 256-bit Institutional Guard</span>
        </div>
      </div>
    </div>
  );
};
