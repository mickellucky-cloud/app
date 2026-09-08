import React, { useState, useEffect, useRef } from 'react';
import {
  ScanFace,
  Fingerprint,
  ShieldCheck,
  Lock,
  Unlock,
  AlertCircle,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OKNexusLogo } from '../common/OKNexusLogo';
import { playBiometricChime } from '../../utils/audio';

export type BiometricMode = 'face_id' | 'fingerprint';

interface BiometricUnlockScreenProps {
  userEmail: string;
  defaultMode?: BiometricMode;
  onSuccess: () => void;
  onCancel: () => void;
  onSwitchAccount?: () => void;
}

export const BiometricUnlockScreen: React.FC<BiometricUnlockScreenProps> = ({
  userEmail,
  defaultMode = 'face_id',
  onSuccess,
  onCancel,
  onSwitchAccount,
}) => {
  const [mode, setMode] = useState<BiometricMode>(() => {
    const saved = localStorage.getItem('oknexus_biometric_type');
    return (saved as BiometricMode) || defaultMode;
  });

  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [autoPromptStarted, setAutoPromptStarted] = useState<boolean>(false);
  const [attemptCount, setAttemptCount] = useState<number>(0);

  const scanTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  // Save preferred biometric mode
  const handleModeChange = (newMode: BiometricMode) => {
    setMode(newMode);
    localStorage.setItem('oknexus_biometric_type', newMode);
    setScanState('idle');
    setErrorMessage('');
    clearTimers();
  };

  // Perform Simulated Biometric Scan
  const startBiometricScan = (shouldSimulateFailure: boolean = false) => {
    if (scanState === 'scanning') return;
    clearTimers();
    setScanState('scanning');
    setErrorMessage('');
    setScanProgress(0);

    const startTime = Date.now();
    const duration = 1200; // 1.2s realistic scan duration

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setScanProgress(pct);
    }, 40);

    scanTimerRef.current = setTimeout(() => {
      clearTimers();
      setScanProgress(100);

      if (shouldSimulateFailure) {
        setScanState('failed');
        setAttemptCount((prev) => prev + 1);
        setErrorMessage(
          mode === 'face_id'
            ? 'Face not recognized. Keep your face centered.'
            : 'Fingerprint sensor mismatch. Try scanning again.'
        );
        playBiometricChime(false);
      } else {
        setScanState('success');
        playBiometricChime(true);

        // Transition to dashboard after brief confirmation display
        setTimeout(() => {
          onSuccess();
        }, 700);
      }
    }, duration);
  };

  // Initial Auto-scan after 450ms for authentic iOS/Android mobile biometric prompt experience
  useEffect(() => {
    if (!autoPromptStarted) {
      setAutoPromptStarted(true);
      const autoTimer = setTimeout(() => {
        startBiometricScan(false);
      }, 500);
      return () => clearTimeout(autoTimer);
    }
  }, [autoPromptStarted]);

  // Handle PIN Unlock Fallback
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length < 4) {
      setPinError('Enter at least 4 digits');
      return;
    }

    // Accept dev PIN or standard 6 digits
    if (pinCode === '123456' || pinCode === '000000' || pinCode.length >= 4) {
      playBiometricChime(true);
      setShowPinModal(false);
      setScanState('success');
      setTimeout(() => {
        onSuccess();
      }, 500);
    } else {
      setPinError('Invalid backup passcode. Try 123456.');
      playBiometricChime(false);
    }
  };

  const handlePinKey = (val: string) => {
    if (pinCode.length < 6) {
      const next = pinCode + val;
      setPinCode(next);
      setPinError('');
      if (next.length === 6) {
        // Auto-verify when 6 digits are typed
        setTimeout(() => {
          playBiometricChime(true);
          setShowPinModal(false);
          setScanState('success');
          setTimeout(() => {
            onSuccess();
          }, 450);
        }, 200);
      }
    }
  };

  const handlePinBackspace = () => {
    setPinCode((prev) => prev.slice(0, -1));
    setPinError('');
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08] text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <OKNexusLogo size="sm" />

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Biometric Protected</span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 w-full max-w-sm mx-auto my-auto py-6 flex flex-col items-center text-center">
        {/* User Identity Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6 shadow-sm"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-amber-400 p-[1.5px]">
            <div className="w-full h-full rounded-full bg-[#0B0F1B] flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">MK</span>
            </div>
          </div>
          <div className="text-left">
            <span className="text-xs font-semibold text-slate-200 block truncate max-w-[170px]">
              {userEmail}
            </span>
          </div>
          <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold border border-purple-500/30">
            VIP 2
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black text-white tracking-tight mb-1.5 flex items-center justify-center gap-2"
        >
          <span>Unlock with Biometrics</span>
          {scanState === 'success' ? (
            <Unlock className="w-5 h-5 text-emerald-400" />
          ) : (
            <Lock className="w-5 h-5 text-purple-400" />
          )}
        </motion.h1>

        <p className="text-xs text-slate-400 max-w-[280px] mb-6 leading-relaxed">
          {mode === 'face_id'
            ? 'Align your face within the scanner frame to authorize entry.'
            : 'Touch and hold the fingerprint sensor below to authorize entry.'}
        </p>

        {/* Biometric Modality Switcher (Face ID vs Fingerprint) */}
        <div className="flex p-1 rounded-xl bg-[#090C16] border border-white/[0.08] mb-6 w-full max-w-[260px]">
          <button
            type="button"
            onClick={() => handleModeChange('face_id')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'face_id'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ScanFace className="w-3.5 h-3.5" />
            <span>Face ID</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('fingerprint')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'fingerprint'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>Touch ID</span>
          </button>
        </div>

        {/* Central Interactive Biometric Scanner Target */}
        <div className="relative my-2">
          {/* Outer Pulsing Aura */}
          <div
            className={`absolute -inset-4 rounded-3xl transition-opacity duration-700 blur-xl ${
              scanState === 'scanning'
                ? 'bg-purple-500/25 opacity-100 animate-pulse'
                : scanState === 'success'
                ? 'bg-emerald-500/35 opacity-100'
                : scanState === 'failed'
                ? 'bg-rose-500/30 opacity-100'
                : 'bg-transparent opacity-0'
            }`}
          />

          {/* Scanner Card / Frame */}
          <motion.div
            id="biometric-scanner-pad"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => startBiometricScan(false)}
            className={`relative w-48 h-48 rounded-3xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-xl overflow-hidden ${
              scanState === 'scanning'
                ? 'bg-[#0B1020] border-purple-500 ring-4 ring-purple-500/20'
                : scanState === 'success'
                ? 'bg-[#081814] border-emerald-500 ring-4 ring-emerald-500/30 shadow-[0_0_35px_rgba(16,185,129,0.35)]'
                : scanState === 'failed'
                ? 'bg-[#180A10] border-rose-500 ring-4 ring-rose-500/20'
                : 'bg-[#0A0E1A] border-white/10 hover:border-purple-500/50 hover:bg-[#0E1324]'
            }`}
          >
            {/* Mode: Face ID Visualizer */}
            {mode === 'face_id' && (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                {/* 4 Optical Corner Brackets */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-purple-400/80 rounded-tl" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-purple-400/80 rounded-tr" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-purple-400/80 rounded-bl" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-purple-400/80 rounded-br" />

                {/* Laser Scanning Beam Line */}
                {scanState === 'scanning' && (
                  <motion.div
                    animate={{ y: [-48, 48, -48] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                    className="absolute w-36 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(34,211,238,0.9)] z-20"
                  />
                )}

                {/* Center Icon */}
                <div className="relative z-10 flex flex-col items-center">
                  {scanState === 'success' ? (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center text-emerald-400"
                    >
                      <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </motion.div>
                  ) : scanState === 'failed' ? (
                    <motion.div
                      animate={{ x: [-6, 6, -4, 4, 0] }}
                      transition={{ duration: 0.4 }}
                      className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/60 flex items-center justify-center text-rose-400"
                    >
                      <AlertCircle className="w-10 h-10 text-rose-400" />
                    </motion.div>
                  ) : (
                    <div
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors ${
                        scanState === 'scanning'
                          ? 'text-cyan-300'
                          : 'text-purple-400'
                      }`}
                    >
                      <ScanFace
                        id="biometric-icon-face"
                        className={`w-16 h-16 stroke-[1.5] transition-transform ${
                          scanState === 'scanning' || scanState === 'idle' ? 'animate-pulse' : ''
                        }`}
                      />
                    </div>
                  )}

                  {/* Circular scan progress indicator */}
                  {scanState === 'scanning' && (
                    <div className="mt-2 text-[10px] font-mono-num font-bold text-cyan-400 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>{scanProgress}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mode: Fingerprint Visualizer */}
            {mode === 'fingerprint' && (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                {/* Concentric Ring Grid */}
                <div className="absolute inset-4 rounded-full border border-white/[0.04] pointer-events-none" />
                <div className="absolute inset-8 rounded-full border border-white/[0.04] pointer-events-none" />

                {scanState === 'success' ? (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center text-emerald-400"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </motion.div>
                ) : scanState === 'failed' ? (
                  <motion.div
                    animate={{ x: [-6, 6, -4, 4, 0] }}
                    transition={{ duration: 0.4 }}
                    className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/60 flex items-center justify-center text-rose-400"
                  >
                    <AlertCircle className="w-10 h-10 text-rose-400" />
                  </motion.div>
                ) : (
                  <div
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                      scanState === 'scanning'
                        ? 'text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                        : 'text-purple-400 hover:text-purple-300'
                    }`}
                  >
                    <Fingerprint
                      id="biometric-icon-fingerprint"
                      className={`w-16 h-16 stroke-[1.5] transition-transform ${
                        scanState === 'scanning' || scanState === 'idle' ? 'animate-pulse' : ''
                      }`}
                    />
                  </div>
                )}

                {scanState === 'scanning' && (
                  <div className="mt-2 text-[10px] font-mono-num font-bold text-emerald-400 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Verifying {scanProgress}%</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Live Status Messaging */}
        <div className="min-h-[28px] mt-4 mb-2 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {scanState === 'scanning' ? (
              <motion.span
                key="status-scanning"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>
                  {mode === 'face_id'
                    ? 'Scanning facial biometric vectors...'
                    : 'Reading biometric ridge points...'}
                </span>
              </motion.span>
            ) : scanState === 'success' ? (
              <motion.span
                key="status-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs font-bold text-emerald-400 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {mode === 'face_id' ? 'Face ID Confirmed! ✓' : 'Fingerprint Verified! ✓'}
                </span>
              </motion.span>
            ) : scanState === 'failed' ? (
              <motion.span
                key="status-failed"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs font-semibold text-rose-400 flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMessage || 'Verification failed. Try again.'}</span>
              </motion.span>
            ) : (
              <motion.span
                key="status-idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-slate-400"
              >
                Tap the frame or click below to authenticate
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Main CTA Button */}
        <div className="w-full space-y-2.5 mt-2">
          <button
            type="button"
            id="biometric-authenticate-btn"
            disabled={scanState === 'scanning' || scanState === 'success'}
            onClick={() => startBiometricScan(false)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {scanState === 'scanning' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Biometric Key...</span>
              </>
            ) : scanState === 'success' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Unlocking Dashboard...</span>
              </>
            ) : (
              <>
                {mode === 'face_id' ? (
                  <ScanFace
                    className={`w-4 h-4 ${
                      scanState === 'scanning' || scanState === 'idle' ? 'animate-pulse' : ''
                    }`}
                  />
                ) : (
                  <Fingerprint
                    className={`w-4 h-4 ${
                      scanState === 'scanning' || scanState === 'idle' ? 'animate-pulse' : ''
                    }`}
                  />
                )}
                <span>
                  {scanState === 'failed'
                    ? 'Retry Biometric Scan'
                    : mode === 'face_id'
                    ? 'Scan Face ID'
                    : 'Scan Fingerprint'}
                </span>
              </>
            )}
          </button>

          {/* Secondary Actions */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              id="biometric-pin-fallback-btn"
              onClick={() => setShowPinModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-purple-400" />
              <span>Use Backup PIN</span>
            </button>

            {/* Simulated Error Test Trigger for thorough testing */}
            <button
              type="button"
              onClick={() => startBiometricScan(true)}
              className="text-[11px] text-slate-500 hover:text-rose-400/80 transition-colors px-2 py-1 rounded"
              title="Test how the system behaves on an un-recognized scan"
            >
              Test Mismatch
            </button>
          </div>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="relative z-10 text-center pb-2">
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          <button
            type="button"
            onClick={onCancel}
            className="hover:text-slate-300 transition-colors"
          >
            Cancel & Return to Login
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={onSwitchAccount || onCancel}
            className="hover:text-slate-300 transition-colors"
          >
            Switch Account
          </button>
        </div>
      </footer>

      {/* Backup PIN / Passcode Modal */}
      <AnimatePresence>
        {showPinModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-sm bg-[#0E121E] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl safe-area-bottom"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-purple-400" />
                  <h3 className="font-bold text-sm text-white">Enter Backup Passcode</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowPinModal(false);
                    setPinCode('');
                    setPinError('');
                  }}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-slate-400 mb-4">
                Enter your 6-digit security PIN to bypass biometric verification.
              </p>

              {/* PIN Dots Display */}
              <div className="flex justify-center gap-3 my-4">
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const hasDigit = pinCode.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-full border transition-all ${
                        hasDigit
                          ? 'bg-purple-500 border-purple-400 scale-110 shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                          : 'bg-white/[0.04] border-white/20'
                      }`}
                    />
                  );
                })}
              </div>

              {pinError && (
                <p className="text-center text-xs text-rose-400 font-semibold mb-3">
                  {pinError}
                </p>
              )}

              {/* Number Keypad */}
              <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto mb-4">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handlePinKey(digit)}
                    className="h-12 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-purple-600/30 font-mono-num font-bold text-base text-white border border-white/[0.06] transition-colors"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    // Quick autofill dev helper
                    setPinCode('123456');
                    setTimeout(() => {
                      playBiometricChime(true);
                      setShowPinModal(false);
                      setScanState('success');
                      setTimeout(() => {
                        onSuccess();
                      }, 450);
                    }, 200);
                  }}
                  className="h-12 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/20"
                >
                  Demo PIN
                </button>
                <button
                  type="button"
                  onClick={() => handlePinKey('0')}
                  className="h-12 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-purple-600/30 font-mono-num font-bold text-base text-white border border-white/[0.06] transition-colors"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handlePinBackspace}
                  className="h-12 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white font-bold text-xs border border-white/[0.06] flex items-center justify-center transition-colors"
                >
                  ⌫
                </button>
              </div>

              <div className="text-center">
                <span className="text-[11px] text-slate-500">
                  Demo hint: Tap <strong>Demo PIN</strong> or any 6 digits
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
