import React from 'react';
import { ThemeMode } from '../../types';
import { ThemeToggle } from './ThemeToggle';

interface ThemeToggleButtonProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  className?: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
  isCollapsed?: boolean;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  theme,
  onToggleTheme,
  className = '',
  size = 'sm',
  isCollapsed = false,
}) => {
  return (
    <ThemeToggle
      theme={theme}
      onToggle={onToggleTheme}
      size={size}
      className={className}
      isCollapsed={isCollapsed}
    />
  );
};

export { ThemeToggle };
