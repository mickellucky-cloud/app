import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, KeyRound, CheckCircle2, AlertCircle, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';
import { OKNexusLogo } from '../common/OKNexusLogo';

interface AuthCodeScreenProps {
  identifier: string; // email or phone
  identifierType?: 'email' | 'phone';
  type?: 'email' | 'phone';
  onSuccess?: () => void;
  onComplete?: (code: string) => void;
  onChangeIdentifier?: () => void;
  onBack?: () => void;
  purpose?: 'login' | 'signup' | 'recovery';
}

export const AuthCodeScreen: React.FC<AuthCodeScreenProps> = ({
  identifier,
  identifierType,
  type,
  onSuccess,
  onComplete,
  onChangeIdentifier,
  onBack,
  purpose = 'login',
}) => {
  const actualType = identifierType || type || 'email';
  const handleBackAction = onBack || onChangeIdentifier || (() => {});
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown timer for code resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Masked identifier (e.g., m••••••@gmail.com)
  const maskedIdentifier = React.useMemo(() => {
    if (!identifier) return 'your account';
    if (actualType === 'email') {
      const [user, domain] = identifier.split('@');
      if (!domain) return identifier;
      const maskedUser =
        user.length > 2
          ? `${user[0]}${'•'.repeat(Math.min(user.length - 2, 6))}${user[user.length - 1]}`
          : user;
      return `${maskedUser}@${domain}`;
    } else {
      // Phone masking (e.g. +234 •••••• 5678)
      if (identifier.length <= 6) return identifier;
      const prefix = identifier.slice(0, 4);
      const suffix = identifier.slice(-4);
      return `${prefix} •••• ${suffix}`;
    }
  }, [identifier, actualType]);

  const handleDigitChange = (index: number, val: string) => {
    // Only accept numbers
    const cleanVal = val.replace(/\D/g, '');
    if (!cleanVal && val !== '') return;

    const newDigits = [...digits];
    newDigits[index] = cleanVal.slice(-1); // Only keep single digit
    setDigits(newDigits);
    setErrorMsg('');

    // Advance focus if digit was entered
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all 6 digits are filled
    if (cleanVal && index === 5 && newDigits.every((d) => d !== '')) {
      submitCode(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move back and clear previous
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Clipboard paste support
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (pastedData.length >= 6) {
      const codeArray = pastedData.slice(0, 6).split('');
      setDigits(codeArray);
      setErrorMsg('');
      inputRefs.current[5]?.focus();
      submitCode(codeArray.join(''));
    }
  };

  const submitCode = (code: string) => {
    setIsLoading(true);
    setErrorMsg('');

    // Verification check (dev test accepts '123456' or any 6 digit number)
    setTimeout(() => {
      // If code was entered
      if (code.length === 6) {
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => {
          if (onComplete) {
            onComplete(code);
          } else if (onSuccess) {
            onSuccess();
          }
        }, 600);
      } else {
        setIsLoading(false);
        setErrorMsg('Invalid verification code. Please check and try again.');
      }
    }, 600);
  };

  const handleResend = () => {
    if (!canResend) return;
    setCountdown(60);
    setCanResend(false);
    setErrorMsg('');
    setDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  // Quick fill development test OTP
  const handleAutoFillTest = () => {
    const testCode = ['1', '2', '3', '4', '5', '6'];
    setDigits(testCode);
    setErrorMsg('');
    inputRefs.current[5]?.focus();
    submitCode('123456');
  };

  return (
    <div id="auth-code-screen" className="min-h-screen max-w-md mx-auto px-6 py-6 flex flex-col justify-between text-slate-100 animate-fadeIn">
      {/* Top Bar with back button */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackAction}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors p-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Change {actualType}</span>
          </button>
          <OKNexusLogo size={28} showWordmark={true} />
        </div>

        {/* Title & Description */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Two-Step Verification</span>
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-white mb-2">
            Verify your account
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-sm font-semibold text-white font-mono-num mt-0.5">
            {maskedIdentifier}
          </p>
        </div>

        {/* 6-Digit OTP Input Grid */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-6">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isLoading || isSuccess}
              className={`w-12 h-14 text-center font-mono-num text-xl font-bold rounded-2xl bg-[#0F1322] border transition-all outline-none ${
                isSuccess
                  ? 'border-emerald-500/80 bg-emerald-950/20 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : errorMsg
                  ? 'border-rose-500/80 bg-rose-950/20 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                  : digit
                  ? 'border-purple-500/80 text-white shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                  : 'border-white/10 text-white focus:border-purple-500/70 focus:bg-[#121728]'
              }`}
            />
          ))}
        </div>

        {/* Inline Error or Loading feedback */}
        {errorMsg && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-medium mb-4 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-xs text-purple-300 font-medium mb-4">
            <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
            <span>Verifying code...</span>
          </div>
        )}

        {isSuccess && (
          <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-bold mb-4 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Authentication successful! Redirecting...</span>
          </div>
        )}

        {/* Resend Countdown */}
        <div className="text-center text-xs text-slate-400 mb-8">
          {canResend ? (
            <button
              onClick={handleResend}
              className="font-semibold text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors"
            >
              Resend verification code
            </button>
          ) : (
            <span>
              Resend code in{' '}
              <span className="font-mono-num font-semibold text-purple-300">
                {countdown}s
              </span>
            </span>
          )}
        </div>

        {/* Development Helper Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/30 via-[#101322] to-cyan-950/30 border border-purple-500/25 text-left mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Development Test Credentials
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono-num font-semibold">
              OTP: 123456
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2">
            Use test code <code className="text-purple-300 font-mono font-bold">123456</code> to complete the authentication journey instantly.
          </p>
          <button
            type="button"
            onClick={handleAutoFillTest}
            disabled={isLoading || isSuccess}
            className="w-full py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            ⚡ Auto-Fill Test Code (123456)
          </button>
        </div>
      </div>

      {/* Footer Security Badge */}
      <div className="text-center pt-4 pb-2 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Protected by OKNexus Quantum Shield Security</span>
      </div>
    </div>
  );
};
