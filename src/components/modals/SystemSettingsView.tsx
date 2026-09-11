import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  X,
  Sun,
  Moon,
  Check,
  Zap,
  Sliders,
  Volume2,
  Cpu,
  Trash2,
  Wifi,
  Sparkles,
  BarChart2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { ThemeMode } from '../../types';

interface SystemSettingsViewProps {
  onBack: () => void;
  onClose: () => void;
  theme: ThemeMode;
  onToggleTheme?: () => void;
  onOpenSupport?: () => void;
}

export const SystemSettingsView: React.FC<SystemSettingsViewProps> = ({
  onBack,
  onClose,
  theme,
  onToggleTheme,
  onOpenSupport,
}) => {
  // Advanced Settings State with localStorage persistence
  const [oneClickTrading, setOneClickTrading] = useState<boolean>(() => {
    return localStorage.getItem('okn_one_click') === 'true';
  });

  const [orderbookSpeed, setOrderbookSpeed] = useState<'50ms' | '250ms' | '1000ms'>(() => {
    return (localStorage.getItem('okn_ob_speed') as '50ms' | '250ms' | '1000ms') || '250ms';
  });

  const [slippage, setSlippage] = useState<'0.1%' | '0.5%' | '1.0%'>(() => {
    return (localStorage.getItem('okn_slippage') as '0.1%' | '0.5%' | '1.0%') || '0.5%';
  });

  const [audioChimes, setAudioChimes] = useState<boolean>(() => {
    return localStorage.getItem('okn_audio') !== 'false';
  });

  const [haptics, setHaptics] = useState<boolean>(() => {
    return localStorage.getItem('okn_haptics') !== 'false';
  });

  const [gpuAccel, setGpuAccel] = useState<boolean>(() => {
    return localStorage.getItem('okn_gpu') !== 'false';
  });

  const [candleTheme, setCandleTheme] = useState<'classic' | 'pro'>(() => {
    return (localStorage.getItem('okn_candle_theme') as 'classic' | 'pro') || 'classic';
  });

  const [cacheSize, setCacheSize] = useState<string>('14.8 MB');
  const [cacheFeedback, setCacheFeedback] = useState<string>('');

  const handleToggleOneClick = () => {
    const next = !oneClickTrading;
    setOneClickTrading(next);
    localStorage.setItem('okn_one_click', String(next));
  };

  const handleSelectSpeed = (speed: '50ms' | '250ms' | '1000ms') => {
    setOrderbookSpeed(speed);
    localStorage.setItem('okn_ob_speed', speed);
  };

  const handleSelectSlippage = (val: '0.1%' | '0.5%' | '1.0%') => {
    setSlippage(val);
    localStorage.setItem('okn_slippage', val);
  };

  const handleToggleAudio = () => {
    const next = !audioChimes;
    setAudioChimes(next);
    localStorage.setItem('okn_audio', String(next));
  };

  const handleToggleHaptics = () => {
    const next = !haptics;
    setHaptics(next);
    localStorage.setItem('okn_haptics', String(next));
  };

  const handleToggleGpu = () => {
    const next = !gpuAccel;
    setGpuAccel(next);
    localStorage.setItem('okn_gpu', String(next));
  };

  const handleSelectCandleTheme = (style: 'classic' | 'pro') => {
    setCandleTheme(style);
    localStorage.setItem('okn_candle_theme', style);
  };

  const handleClearCache = () => {
    setCacheSize('0.0 MB');
    setCacheFeedback('Local cache and chart offline indices cleared!');
    setTimeout(() => setCacheFeedback(''), 3000);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D7E0EB] dark:border-[#242E3B]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141B24] transition-colors"
            title="Back to Profile"
            aria-label="Back to Profile"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                System Settings
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] dark:bg-[#8B5CF6]/20 border border-[#8B5CF6]/30">
                ADVANCED
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-[#8E98A6] mt-0.5">
              Theme modes, low latency, orderbook frequency & hardware acceleration
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#141B24] transition-colors"
          aria-label="Close Settings"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Cache feedback notification */}
      {cacheFeedback && (
        <div className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{cacheFeedback}</span>
        </div>
      )}

      {/* Section 1: Centralized Theme & Display System */}
      <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-sm text-[#0F172A] dark:text-white flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-[#F59E0B]" />
              <span>Display & Theme System</span>
            </div>
            <div className="text-[11px] text-[#64748B] dark:text-[#8E98A6] mt-0.5">
              Choose the appearance for OKNexus across all mobile and web screens
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-purple-500/10 text-[#8B5CF6] border border-[#8B5CF6]/20 capitalize">
            {theme} mode
          </span>
        </div>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* Light Mode Card */}
          <button
            type="button"
            id="system-settings-theme-light-btn"
            onClick={() => {
              if (theme !== 'light' && onToggleTheme) onToggleTheme();
            }}
            className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all relative ${
              theme === 'light'
                ? 'bg-[#F59E0B]/10 border-[#F59E0B] shadow-xs ring-1 ring-[#F59E0B]/30'
                : 'bg-white dark:bg-[#0E141B] border-[#D7E0EB] dark:border-[#242E3B] hover:border-[#F59E0B]/50'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#F59E0B] flex items-center justify-center shadow-2xs">
                <Sun className="w-4 h-4" />
              </div>
              {theme === 'light' ? (
                <span className="w-5 h-5 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-[11px] shadow-2xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              ) : (
                <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600" />
              )}
            </div>
            <span className="font-bold text-xs text-[#0F172A] dark:text-white">Light Mode</span>
            <span className="text-[10px] text-[#64748B] dark:text-[#8E98A6] mt-0.5 leading-snug">
              #F8FAFC daytime canvas with high contrast text
            </span>
          </button>

          {/* Dark Mode Card */}
          <button
            type="button"
            id="system-settings-theme-dark-btn"
            onClick={() => {
              if (theme !== 'dark' && onToggleTheme) onToggleTheme();
            }}
            className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all relative ${
              theme === 'dark'
                ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] shadow-xs ring-1 ring-[#8B5CF6]/30'
                : 'bg-white dark:bg-[#0E141B] border-[#D7E0EB] dark:border-[#242E3B] hover:border-[#8B5CF6]/50'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30 flex items-center justify-center shadow-2xs">
                <Moon className="w-4 h-4" />
              </div>
              {theme === 'dark' ? (
                <span className="w-5 h-5 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-[11px] shadow-2xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              ) : (
                <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600" />
              )}
            </div>
            <span className="font-bold text-xs text-[#0F172A] dark:text-white">Dark Mode</span>
            <span className="text-[10px] text-[#64748B] dark:text-[#8E98A6] mt-0.5 leading-snug">
              #07090E deep obsidian canvas, battery & eye-friendly
            </span>
          </button>
        </div>

        {/* Candlestick Palette Selection */}
        <div className="pt-2 border-t border-[#D7E0EB]/70 dark:border-[#242E3B]/70 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-[#0F172A] dark:text-white">Candle Color Palette</div>
            <div className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">Bullish & bearish market chart colors</div>
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/70 dark:bg-[#0D1219] border border-[#D7E0EB] dark:border-[#242E3B]">
            <button
              onClick={() => handleSelectCandleTheme('classic')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                candleTheme === 'classic'
                  ? 'bg-white dark:bg-[#1E2633] text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Classic (Grn/Red)
            </button>
            <button
              onClick={() => handleSelectCandleTheme('pro')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                candleTheme === 'pro'
                  ? 'bg-white dark:bg-[#1E2633] text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pro (Cyan/Magenta)
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Advanced Trading Preferences */}
      <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs space-y-3.5">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#8B5CF6]" />
          <div>
            <div className="font-bold text-sm text-[#0F172A] dark:text-white">Advanced Trading Preferences</div>
            <div className="text-[11px] text-[#64748B] dark:text-[#8E98A6]">Zero-latency execution & data stream controls</div>
          </div>
        </div>

        {/* 1-Click Fast Order Confirmation */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-xs font-semibold text-[#0F172A] dark:text-white">1-Click Fast Order Confirmation</div>
            <div className="text-[10px] text-[#64748B] dark:text-[#8E98A6] max-w-[260px]">
              Bypass confirmation modal for instant market and limit order execution
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleOneClick}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              oneClickTrading ? 'bg-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                oneClickTrading ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Orderbook Refresh Frequency */}
        <div className="flex items-center justify-between pt-2 border-t border-[#D7E0EB]/70 dark:border-[#242E3B]/70">
          <div>
            <div className="text-xs font-semibold text-[#0F172A] dark:text-white">Orderbook Refresh Frequency</div>
            <div className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">WebSocket book depth throttle</div>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-[#0D1219] border border-[#D7E0EB] dark:border-[#242E3B]">
            {(['50ms', '250ms', '1000ms'] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => handleSelectSpeed(spd)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  orderbookSpeed === spd
                    ? 'bg-[#8B5CF6] text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {spd === '50ms' ? 'Ultra (50ms)' : spd === '250ms' ? 'Standard' : 'Eco (1s)'}
              </button>
            ))}
          </div>
        </div>

        {/* Default Slippage Tolerance */}
        <div className="flex items-center justify-between pt-2 border-t border-[#D7E0EB]/70 dark:border-[#242E3B]/70">
          <div>
            <div className="text-xs font-semibold text-[#0F172A] dark:text-white">Default Slippage Tolerance</div>
            <div className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">Maximum acceptable price slippage</div>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-[#0D1219] border border-[#D7E0EB] dark:border-[#242E3B]">
            {(['0.1%', '0.5%', '1.0%'] as const).map((val) => (
              <button
                key={val}
                onClick={() => handleSelectSlippage(val)}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  slippage === val
                    ? 'bg-[#8B5CF6] text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Audio & Haptics */}
      <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#8B5CF6]" />
          <div>
            <div className="font-bold text-sm text-[#0F172A] dark:text-white">Sound & Feedback</div>
            <div className="text-[11px] text-[#64748B] dark:text-[#8E98A6]">Audio chimes and tactile response</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-xs font-semibold text-[#0F172A] dark:text-white">Order Fill Audio Chime</div>
            <div className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">Plays a subtle sound on trade match</div>
          </div>
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              audioChimes ? 'bg-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                audioChimes ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#D7E0EB]/70 dark:border-[#242E3B]/70">
          <div>
            <div className="text-xs font-semibold text-[#0F172A] dark:text-white">Tactile Haptics</div>
            <div className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">Haptic pulse for buttons on mobile</div>
          </div>
          <button
            type="button"
            onClick={handleToggleHaptics}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              haptics ? 'bg-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                haptics ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Section 4: Performance & Cache */}
      <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#8B5CF6]" />
          <div>
            <div className="font-bold text-sm text-[#0F172A] dark:text-white">Performance & Cache</div>
            <div className="text-[11px] text-[#64748B] dark:text-[#8E98A6]">Hardware acceleration & local storage</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-xs font-semibold text-[#0F172A] dark:text-white">Hardware GPU Acceleration</div>
            <div className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">Enables WebGL rendering for 60fps charts</div>
          </div>
          <button
            type="button"
            onClick={handleToggleGpu}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              gpuAccel ? 'bg-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                gpuAccel ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#D7E0EB]/70 dark:border-[#242E3B]/70">
          <div>
            <div className="text-xs font-semibold text-[#0F172A] dark:text-white">Clear Temporary Cache</div>
            <div className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">Current storage footprint: {cacheSize}</div>
          </div>
          <button
            onClick={handleClearCache}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Clear Cache</span>
          </button>
        </div>
      </div>

      {/* Section 5: Network Diagnostics & Build Info */}
      <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#64748B] dark:text-[#8E98A6] flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            Edge CDN Node:
          </span>
          <span className="font-mono text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Anycast (12ms • 99.99%)
          </span>
        </div>
        <div className="flex items-center justify-between text-xs pt-1 border-t border-[#D7E0EB]/60 dark:border-[#242E3B]/60">
          <span className="text-[#64748B] dark:text-[#8E98A6]">Application Build:</span>
          <span className="font-mono text-slate-800 dark:text-slate-200">OKNexus Pro v3.4.2</span>
        </div>
      </div>
    </div>
  );
};
