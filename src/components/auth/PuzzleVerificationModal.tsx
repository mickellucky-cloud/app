import React, { useState, useRef, useEffect } from 'react';
import { X, RefreshCw, CheckCircle2, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { OKNexusLogo } from '../common/OKNexusLogo';

interface PuzzleVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetIdentifier?: string; // e.g. email or phone
}

export const PuzzleVerificationModal: React.FC<PuzzleVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetIdentifier,
}) => {
  // Puzzle target position in percentage (e.g. 68%)
  const [targetPos, setTargetPos] = useState(68);
  const [sliderValue, setSliderValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Pick a reasonable deterministic target between 55% and 75%
      setTargetPos(66);
      setSliderValue(0);
      setStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'success') return;
    setSliderValue(Number(e.target.value));
    if (status === 'failed') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleVerify = () => {
    if (status === 'success') return;

    // Tolerance ±5%
    const diff = Math.abs(sliderValue - targetPos);
    if (diff <= 5.5) {
      setStatus('success');
      setErrorMessage('');
      // Auto-transition to OTP after brief success feedback
      setTimeout(() => {
        onSuccess();
      }, 700);
    } else {
      setStatus('failed');
      setErrorMessage('Verification failed. Align the piece inside the slot.');
      setTimeout(() => {
        setSliderValue(0);
        setStatus('idle');
      }, 1200);
    }
  };

  const handleRefreshPuzzle = () => {
    // Regenerate target position slightly
    const newTarget = 58 + Math.floor(Math.random() * 18);
    setTargetPos(newTarget);
    setSliderValue(0);
    setStatus('idle');
    setErrorMessage('');
  };

  // Deterministic dev quick verify
  const handleDevQuickVerify = () => {
    setSliderValue(targetPos);
    setStatus('success');
    setErrorMessage('');
    setTimeout(() => {
      onSuccess();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-[#0E121E] border border-purple-500/30 rounded-3xl p-5 shadow-[0_16px_48px_rgba(0,0,0,0.7)] text-slate-100 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-500/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Security Verification</h3>
              <p className="text-[11px] text-slate-400">Complete the puzzle to continue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label="Close verification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Puzzle Canvas Graphic */}
        <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-[#07090F] border border-white/[0.1] select-none shadow-inner mb-4">
          {/* Stylized OKNexus Web3 Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#130E26] via-[#091124] to-[#081726]">
            {/* Grid lines */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            />

            {/* Glowing crypto asset circles */}
            <div className="absolute top-4 left-6 w-16 h-16 rounded-full bg-purple-600/25 blur-xl" />
            <div className="absolute bottom-4 right-8 w-20 h-20 rounded-full bg-cyan-500/25 blur-xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-30">
              <OKNexusLogo size={56} />
              <span className="font-display font-bold text-xs tracking-widest text-slate-400 mt-1">
                OKNEXUS SHIELD
              </span>
            </div>

            {/* Futuristic cyber circuit overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <path d="M 10 30 L 70 30 L 90 50 L 180 50" stroke="#A855F7" strokeWidth="1" fill="none" />
              <path d="M 40 120 L 110 120 L 140 90 L 260 90" stroke="#06B6D4" strokeWidth="1" fill="none" />
              <circle cx="70" cy="30" r="2.5" fill="#A855F7" />
              <circle cx="140" cy="90" r="2.5" fill="#06B6D4" />
            </svg>
          </div>

          {/* Missing Target Slot (Cutout) */}
          <div
            className="absolute top-[38px] w-12 h-12 rounded-xl border-2 border-dashed border-purple-400/70 bg-black/60 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] flex items-center justify-center pointer-events-none transition-transform"
            style={{ left: `calc(${targetPos}% - 24px)` }}
          >
            <div className="w-5 h-5 rounded-lg bg-purple-500/20 border border-purple-500/30 animate-pulse" />
          </div>

          {/* Movable Puzzle Piece */}
          <div
            className={`absolute top-[38px] w-12 h-12 rounded-xl border border-purple-300 bg-gradient-to-br from-purple-500 via-fuchsia-600 to-cyan-500 shadow-[0_4px_16px_rgba(168,85,247,0.6)] flex items-center justify-center transition-all ${
              status === 'success'
                ? 'scale-105 border-emerald-400 shadow-[0_0_20px_#10B981]'
                : status === 'failed'
                ? 'border-rose-400 shadow-[0_0_16px_#F43F5E]'
                : ''
            }`}
            style={{
              left: `calc(${sliderValue}% - ${sliderValue * 0.48}px)`,
              cursor: 'grab',
            }}
          >
            {status === 'success' ? (
              <CheckCircle2 className="w-6 h-6 text-white animate-bounce" />
            ) : (
              <div className="w-6 h-6 rounded-md bg-black/30 flex items-center justify-center">
                <OKNexusLogo size={14} />
              </div>
            )}
          </div>

          {/* Status Overlay */}
          {status === 'success' && (
            <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] flex items-center justify-center gap-2 text-emerald-300 font-bold text-sm animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Verification complete!</span>
            </div>
          )}

          {/* Refresh puzzle button */}
          <button
            onClick={handleRefreshPuzzle}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-slate-300 hover:text-white hover:bg-black/70 border border-white/10 transition-colors"
            title="Refresh puzzle"
            aria-label="Refresh puzzle"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Feedback message */}
        {errorMessage ? (
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium mb-2.5 px-1 animate-shake">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : (
          <p className="text-xs text-slate-400 mb-2.5 px-1 flex items-center justify-between">
            <span>Drag the slider to fit the puzzle piece</span>
            <span className="font-mono-num text-[11px] text-purple-300 font-semibold">{sliderValue}%</span>
          </p>
        )}

        {/* Interactive Slider Track */}
        <div className="relative mb-4" ref={sliderRef}>
          <input
            id="puzzle-slider"
            type="range"
            min="0"
            max="100"
            step="1"
            value={sliderValue}
            onChange={handleSliderChange}
            onMouseUp={handleVerify}
            onTouchEnd={handleVerify}
            disabled={status === 'success'}
            className="w-full h-11 appearance-none bg-[#090C16] border border-white/10 rounded-2xl cursor-pointer outline-none transition-all px-1.5
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-9 [&::-webkit-slider-thumb]:h-9 [&::-webkit-slider-thumb]:rounded-xl [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-fuchsia-500 [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/40 [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(168,85,247,0.7)] [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
            aria-label="Puzzle verification slider"
          />

          {/* Subtle track placeholder text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium tracking-wide">
            {status === 'success' ? (
              <span className="text-emerald-400 font-bold">✓ Verified</span>
            ) : (
              <span>Slide right to complete &rarr;</span>
            )}
          </div>
        </div>

        {/* Development test helper banner */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            Dev Mode Active
          </span>
          <button
            type="button"
            onClick={handleDevQuickVerify}
            className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 font-semibold hover:bg-purple-500/25 active:scale-95 transition-all"
          >
            ⚡ Quick Verify (Dev)
          </button>
        </div>
      </div>
    </div>
  );
};
