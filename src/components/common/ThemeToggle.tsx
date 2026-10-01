import React from 'react';
import { motion } from 'motion/react';
import { ThemeMode } from '../../types';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme?: ThemeMode;
  onToggle?: () => void;
  size?: 'sm' | 'md' | 'lg';
  isCollapsed?: boolean;
  className?: string;
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme = 'dark',
  onToggle,
  size = 'sm',
  isCollapsed = false,
  className = '',
  showLabels = false,
}) => {
  const isDark = theme === 'dark';

  // Sizing tokens for tactical header integration & settings cards
  const dims = {
    sm: {
      track: 'w-[52px] h-[26px]',
      knob: 'w-[20px] h-[20px]',
      xDark: 27,
      xLight: 2,
      icon: 'w-3 h-3',
      trackIcon: 'w-2.5 h-2.5',
    },
    md: {
      track: 'w-[64px] h-[32px]',
      knob: 'w-[24px] h-[24px]',
      xDark: 34,
      xLight: 3,
      icon: 'w-3.5 h-3.5',
      trackIcon: 'w-3 h-3',
    },
    lg: {
      track: 'w-[74px] h-[36px]',
      knob: 'w-[28px] h-[28px]',
      xDark: 40,
      xLight: 3,
      icon: 'w-4 h-4',
      trackIcon: 'w-3.5 h-3.5',
    },
  }[size];

  // Collapsed circular icon button variant for tight rails
  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className={`w-9 h-9 rounded-xl relative flex items-center justify-center transition-all duration-200 outline-none cursor-pointer bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] hover:border-purple-500/40 text-slate-700 dark:text-slate-200 shadow-xs active:scale-95 ${className}`}
      >
        <motion.div
          key={isDark ? 'moon' : 'sun'}
          initial={{ rotate: -45, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 45, scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-purple-400 fill-purple-400/20" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          )}
        </motion.div>
      </button>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {showLabels && (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        onClick={onToggle}
        className={`relative inline-flex items-center rounded-full p-[2px] transition-colors duration-300 outline-none cursor-pointer group focus-visible:ring-2 focus-visible:ring-purple-500 ${dims.track} ${
          isDark
            ? 'bg-[#0B0D14] border border-white/[0.14] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6),0_1px_2px_rgba(255,255,255,0.05)]'
            : 'bg-slate-200/90 border border-slate-300 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.04)]'
        }`}
      >
        {/* Track Dual Optical Indicator Symbols */}
        <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
          {/* Sun icon placeholder on left */}
          <Sun
            className={`${dims.trackIcon} transition-opacity duration-300 ${
              isDark ? 'opacity-30 text-slate-400' : 'opacity-0 text-amber-600'
            }`}
          />
          {/* Moon icon placeholder on right */}
          <Moon
            className={`${dims.trackIcon} transition-opacity duration-300 ${
              isDark ? 'opacity-0 text-purple-400' : 'opacity-30 text-slate-500'
            }`}
          />
        </div>

        {/* Sliding Tactile Glass Knob with Spring Physics */}
        <motion.div
          animate={{
            x: isDark ? dims.xDark : dims.xLight,
          }}
          transition={{
            type: 'spring',
            stiffness: 460,
            damping: 28,
            mass: 0.75,
          }}
          className={`relative rounded-full flex items-center justify-center transition-colors duration-200 z-10 ${dims.knob} ${
            isDark
              ? 'bg-gradient-to-b from-[#24173D] to-[#161226] border border-purple-400/40 text-purple-300 shadow-[0_2px_8px_rgba(124,58,237,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)]'
              : 'bg-white border border-amber-300/60 text-amber-500 shadow-[0_2px_6px_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.9)]'
          }`}
        >
          {/* Knob Specular Reflection Sheen */}
          <div className="absolute top-0.5 inset-x-1 h-[1px] bg-gradient-to-r from-transparent via-white/70 dark:via-white/40 to-transparent rounded-full pointer-events-none" />

          {/* Active Icon in Knob */}
          <motion.div
            key={isDark ? 'active-moon' : 'active-sun'}
            initial={{ scale: 0.7, rotate: isDark ? -30 : 30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? (
              <Moon className={`${dims.icon} fill-purple-300/30 text-purple-300`} />
            ) : (
              <Sun className={`${dims.icon} fill-amber-500/30 text-amber-500`} />
            )}
          </motion.div>
        </motion.div>
      </button>
    </div>
  );
};
