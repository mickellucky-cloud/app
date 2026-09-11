import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { ThemeMode } from '../../types';

interface ThemeToggleButtonProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  className?: string;
  id?: string;
  size?: 'sm' | 'md';
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  theme,
  onToggleTheme,
  className = '',
  id = 'theme-toggle-btn',
  size = 'md',
}) => {
  const isDark = theme === 'dark';

  return (
    <button
      id={id}
      type="button"
      onClick={onToggleTheme}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      className={`relative inline-flex items-center justify-center rounded-xl transition-all duration-200 active:scale-90 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] ${
        size === 'sm' ? 'w-8 h-8' : 'w-9 h-9'
      } bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0F172A] border border-[#D7E0EB] hover:border-[#8B5CF6]/40 dark:bg-[#141B24] dark:hover:bg-[#1A222D] dark:text-[#EDF1F5] dark:border-[#242E3B] dark:hover:border-[#8B5CF6]/40 ${className}`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -45, scale: 0.7, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 45, scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun className={`${size === 'sm' ? 'w-4 h-4' : 'w-4 h-4'} text-[#F59E0B] group-hover:text-[#FBBF24] group-hover:rotate-45 transition-transform duration-300`} />
        ) : (
          <Moon className={`${size === 'sm' ? 'w-4 h-4' : 'w-4 h-4'} text-[#8B5CF6] group-hover:text-[#7C3AED] group-hover:-rotate-12 transition-transform duration-300`} />
        )}
      </motion.div>
    </button>
  );
};
