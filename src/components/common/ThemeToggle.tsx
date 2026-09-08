import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../../types';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  size = 'md',
  className = '',
}) => {
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      id="global-theme-toggle-btn"
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to daylight mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to daylight mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center justify-center rounded-xl border transition-all duration-200 active:scale-95 ${
        isDark
          ? 'bg-[#121726] border-[#1F263B] text-amber-300 hover:text-amber-200 hover:border-amber-500/40 hover:bg-[#182034]'
          : 'bg-white border-slate-200 text-purple-600 hover:text-purple-700 hover:border-purple-300 hover:bg-slate-50 shadow-sm'
      } ${sizeClasses[size]} ${className}`}
    >
      {isDark ? (
        <Sun className={`${iconSizes[size]} transition-transform duration-300 rotate-0 hover:rotate-45`} />
      ) : (
        <Moon className={`${iconSizes[size]} transition-transform duration-300 -rotate-12 hover:rotate-0`} />
      )}
    </button>
  );
};
