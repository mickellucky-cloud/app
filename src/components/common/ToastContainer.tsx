import React, { useEffect, useState } from 'react';
import { ToastNotificationItem } from '../../types';
import { CoinIcon } from './CoinIcon';
import { BellRing, X, ArrowUpRight, TrendingUp, TrendingDown, CheckCircle2, Info } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastNotificationItem[];
  onDismiss: (id: string) => void;
  onTradePair?: (symbol: string) => void;
  onOpenAlertsModal?: () => void;
}

interface ToastCardProps {
  toast: ToastNotificationItem;
  onDismiss: (id: string) => void;
  onTradePair?: (symbol: string) => void;
  onOpenAlertsModal?: () => void;
}

const ToastCard: React.FC<ToastCardProps> = ({
  toast,
  onDismiss,
  onTradePair,
  onOpenAlertsModal,
}) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const duration = 7000; // 7 seconds

  const startTimeRef = React.useRef(Date.now());
  const remainingRef = React.useRef(duration);

  useEffect(() => {
    if (isPaused) return;

    startTimeRef.current = Date.now();
    const currentRemaining = remainingRef.current;

    // Timer to trigger dismiss outside of any React render/state updater phase
    const dismissTimer = setTimeout(() => {
      onDismiss(toast.id);
    }, currentRemaining);

    const intervalTime = 50;
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const timeLeft = Math.max(0, currentRemaining - elapsed);
      setProgress((timeLeft / duration) * 100);
    }, intervalTime);

    return () => {
      clearTimeout(dismissTimer);
      clearInterval(progressInterval);
      const elapsed = Date.now() - startTimeRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    };
  }, [isPaused, toast.id, onDismiss, duration]);

  const isAlert = toast.type === 'alert' || !toast.type;
  const isRise = toast.direction === 'above';

  return (
    <div
      id={`toast-${toast.id}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className="w-full relative overflow-hidden bg-[#0D111E]/95 border border-purple-500/40 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_24px_rgba(168,85,247,0.25)] backdrop-blur-xl p-3.5 text-slate-100 transition-all animate-slideDown"
    >
      {/* Top row: Icon, title, close button */}
      <div className="flex items-start gap-3">
        {/* Visual Badge Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {toast.symbol ? (
            <div className="relative">
              <CoinIcon symbol={toast.symbol.split('/')[0]} size={32} />
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white shadow-md ${
                  isRise ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              >
                {isRise ? (
                  <TrendingUp className="w-2.5 h-2.5" />
                ) : (
                  <TrendingDown className="w-2.5 h-2.5" />
                )}
              </div>
            </div>
          ) : toast.type === 'success' ? (
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <BellRing className="w-4 h-4 text-purple-400 animate-pulse" />
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-bold text-xs text-white tracking-tight flex items-center gap-1">
                {toast.title}
              </h4>
              {toast.symbol && (
                <span className="font-mono-num font-bold text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {toast.symbol}
                </span>
              )}
            </div>
            <span className="text-[9px] font-mono-num text-slate-400 flex-shrink-0">
              {toast.timestamp}
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-snug break-words">
            {toast.message}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 mt-2.5">
            {toast.symbol && onTradePair && (
              <button
                type="button"
                onClick={() => {
                  onTradePair(toast.symbol!);
                  onDismiss(toast.id);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-[10px] font-bold shadow-sm active:scale-95 transition-all"
              >
                <span>Trade {toast.symbol}</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}

            {onOpenAlertsModal && (
              <button
                type="button"
                onClick={() => {
                  onOpenAlertsModal();
                  onDismiss(toast.id);
                }}
                className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-[10px] font-medium border border-white/10 active:scale-95 transition-all"
              >
                Manage Alerts
              </button>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0 -mt-1 -mr-1"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress countdown bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/[0.06]">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  onTradePair,
  onOpenAlertsModal,
}) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-3 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-md z-[100] flex flex-col gap-2 pointer-events-auto"
    >
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
          onTradePair={onTradePair}
          onOpenAlertsModal={onOpenAlertsModal}
        />
      ))}
    </div>
  );
};
