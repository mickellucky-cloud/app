import React, { useState } from 'react';
import { OKNexusLogo } from '../common/OKNexusLogo';
import { Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck, Sparkles, ChevronDown, RefreshCw } from 'lucide-react';
import { COUNTRY_CODES } from '../../data/mockData';
import { SocialProvider } from './LoginScreen';

interface CreateAccountScreenProps {
  onContinue: (identifier: string, type: 'email' | 'phone') => void;
  onNavigateLogin: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onSocialSuccess?: (provider: SocialProvider) => void;
}

export const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({
  onContinue,
  onNavigateLogin,
  onOpenTerms,
  onOpenPrivacy,
  onSocialSuccess,
}) => {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(
    COUNTRY_CODES ? COUNTRY_CODES[0] : { code: '+234', country: 'Nigeria', flag: '🇳🇬', id: 'NG' }
  );
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [inlineError, setInlineError] = useState('');

  // Password strength calculation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const strengthScore = [hasMinLength, hasNumber, hasLetter, hasSpecial].filter(Boolean).length;
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-purple-500', 'bg-emerald-500'];

  // Social Auth States
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const [socialSuccess, setSocialSuccess] = useState<SocialProvider | null>(null);

  const handleSocialLogin = (provider: SocialProvider) => {
    setSocialLoading(provider);
    setTimeout(() => {
      setSocialLoading(null);
      setSocialSuccess(provider);
      setTimeout(() => {
        onSocialSuccess?.(provider);
      }, 600);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError('');

    if (authMethod === 'email') {
      const emailTrimmed = email.trim();
      if (!emailTrimmed) {
        setInlineError('Please enter your email address.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        setInlineError('Please enter a valid email address.');
        return;
      }
    } else {
      const phoneDigits = phone.replace(/\D/g, '');
      if (!phoneDigits) {
        setInlineError('Please enter your phone number.');
        return;
      }
      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        setInlineError('Please enter a valid phone number (7-15 digits).');
        return;
      }
    }

    if (!hasMinLength) {
      setInlineError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setInlineError('Passwords do not match. Please check again.');
      return;
    }

    if (!agreedToTerms) {
      setInlineError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    const fullIdentifier =
      authMethod === 'email' ? email.trim() : `${selectedCountry.code} ${phone.trim()}`;
    onContinue(fullIdentifier, authMethod);
  };

  return (
    <div id="create-account-screen" className="min-h-screen max-w-md mx-auto px-6 py-6 flex flex-col justify-between text-slate-900 dark:text-slate-100 animate-fadeIn transition-colors">
      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onNavigateLogin}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors p-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>
          <OKNexusLogo size={28} showWordmark={true} />
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white mb-1.5">
            Create OKNexus Account
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Sign up to access Web3 spot trading, earn vaults, and 0% fee P2P.
          </p>
        </div>

        {/* Auth Method Switcher (Email vs Phone) */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-[#0B0F19] p-1 border border-slate-200 dark:border-white/[0.08] mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              setInlineError('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              authMethod === 'email'
                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
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
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Phone Number
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMethod === 'email' ? (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                id="signup-email-input"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setInlineError('');
                }}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-[#0F1322] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:border-purple-500/80 focus:bg-white dark:focus:bg-[#131828] outline-none transition-all"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Phone Number
              </label>
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-3 rounded-xl bg-slate-50 dark:bg-[#0F1322] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-sm hover:border-purple-500/40 transition-colors"
                  >
                    <span>{selectedCountry.flag}</span>
                    <span className="font-mono-num font-semibold">{selectedCountry.code}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isCountryDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 z-50 w-52 max-h-56 overflow-y-auto rounded-xl bg-white dark:bg-[#0D111D] border border-slate-200 dark:border-white/10 shadow-2xl p-1 text-xs">
                      {COUNTRY_CODES.map((c) => (
                        <button
                          key={c.code + c.id}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c);
                            setIsCountryDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-500/20 text-left text-slate-800 dark:text-slate-200"
                        >
                          <span className="flex items-center gap-2">
                            <span>{c.flag}</span>
                            <span className="truncate max-w-[90px]">{c.country}</span>
                          </span>
                          <span className="font-mono-num text-purple-600 dark:text-purple-300 font-semibold">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  id="signup-phone-input"
                  type="tel"
                  placeholder="801 234 5678"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setInlineError('');
                  }}
                  className="flex-1 px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-[#0F1322] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:border-purple-500/80 focus:bg-white dark:focus:bg-[#131828] outline-none transition-all font-mono-num"
                />
              </div>
            </div>
          )}

          {/* Password Input */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Set Password
            </label>
            <div className="relative">
              <input
                id="signup-password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setInlineError('');
                }}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-[#0F1322] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:border-purple-500/80 focus:bg-white dark:focus:bg-[#131828] outline-none transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength meter */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1 h-1">
                  {[0, 1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 rounded-full transition-all ${
                        step < strengthScore ? strengthColors[strengthScore - 1] : 'bg-slate-200 dark:bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                  <span>Password strength:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {strengthLabels[Math.max(0, strengthScore - 1)]}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="signup-confirm-password-input"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setInlineError('');
                }}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-[#0F1322] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:border-purple-500/80 focus:bg-white dark:focus:bg-[#131828] outline-none transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              id="terms-checkbox"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                setInlineError('');
              }}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-[#0F1322] text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
            />
            <label htmlFor="terms-checkbox" className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer">
              I agree to OKNexus{' '}
              <button
                type="button"
                onClick={onOpenTerms}
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline underline-offset-2 font-medium"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline underline-offset-2 font-medium"
              >
                Privacy Policy
              </button>
              .
            </label>
          </div>

          {/* Inline Error */}
          {inlineError && (
            <div className="flex items-center gap-1.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-medium animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{inlineError}</span>
            </div>
          )}

          {/* Submit CTA */}
          <button
            id="signup-continue-btn"
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 hover:opacity-95 active:scale-[0.99] font-bold text-white text-sm shadow-[0_4px_20px_rgba(168,85,247,0.35)] transition-all flex items-center justify-center gap-2"
          >
            <span>Continue</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white dark:bg-[#07090E] text-slate-500 text-[11px] font-medium uppercase tracking-wider">
              or sign up with
            </span>
          </div>
        </div>

        {/* Social Authentication Options */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Google Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={socialLoading !== null}
            className="py-2.5 px-2 rounded-2xl bg-white dark:bg-[#0E121E] border border-slate-200 dark:border-white/10 hover:border-purple-500/40 hover:bg-slate-50 dark:hover:bg-[#141B2E] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs"
          >
            {socialLoading === 'google' ? (
              <RefreshCw className="w-4 h-4 animate-spin text-purple-600 dark:text-purple-400" />
            ) : socialSuccess === 'google' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            <span className="truncate">Google</span>
          </button>

          {/* Apple Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('apple')}
            disabled={socialLoading !== null}
            className="py-2.5 px-2 rounded-2xl bg-white dark:bg-[#0E121E] border border-slate-200 dark:border-white/10 hover:border-purple-500/40 hover:bg-slate-50 dark:hover:bg-[#141B2E] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs"
          >
            {socialLoading === 'apple' ? (
              <RefreshCw className="w-4 h-4 animate-spin text-purple-600 dark:text-purple-400" />
            ) : socialSuccess === 'apple' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            ) : (
              <svg className="w-4 h-4 fill-slate-900 dark:fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.66-.99 1.73-.85 2.76 1.01.08 2.01-.51 2.56-1.26z" />
              </svg>
            )}
            <span className="truncate">Apple</span>
          </button>

          {/* Telegram Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('telegram')}
            disabled={socialLoading !== null}
            className="py-2.5 px-2 rounded-2xl bg-white dark:bg-[#0E121E] border border-slate-200 dark:border-white/10 hover:border-[#229ED9]/50 hover:bg-slate-50 dark:hover:bg-[#141B2E] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs"
          >
            {socialLoading === 'telegram' ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#229ED9]" />
            ) : socialSuccess === 'telegram' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            ) : (
              <img
                src="/icons/telegram.png"
                alt="Telegram"
                className="w-4 h-4 shrink-0 rounded-full object-contain"
              />
            )}
            <span className="truncate">Telegram</span>
          </button>

          {/* Facebook Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('facebook')}
            disabled={socialLoading !== null}
            className="py-2.5 px-2 rounded-2xl bg-white dark:bg-[#0E121E] border border-slate-200 dark:border-white/10 hover:border-[#1877F2]/50 hover:bg-slate-50 dark:hover:bg-[#141B2E] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs"
          >
            {socialLoading === 'facebook' ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#1877F2]" />
            ) : socialSuccess === 'facebook' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            ) : (
              <img
                src="/icons/facebook.png"
                alt="Facebook"
                className="w-4 h-4 shrink-0 rounded-full object-contain"
              />
            )}
            <span className="truncate">Facebook</span>
          </button>
        </div>

        {/* Switch back to Login */}
        <div className="mt-5 text-center text-xs text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateLogin}
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-bold underline underline-offset-4 transition-colors"
          >
            Log In
          </button>
        </div>
      </div>

      <div className="text-center pt-6 pb-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
        <span>Bank-grade 256-bit encryption</span>
      </div>
    </div>
  );
};
