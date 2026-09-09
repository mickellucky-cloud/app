import React from 'react';
import { ThemeMode } from '../../types';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isCollapsed?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  size = 'md',
  isCollapsed = false,
  className = '',
}) => {
  const isLight = theme === 'light';

  // Scaled, compact size configurations to fit comfortably in mobile bars and headers
  const config = {
    xs: {
      width: 'w-[48px]',
      height: 'h-[22px]',
      knobSize: 'w-[16px] h-[16px]',
      knobTranslate: 'translate-x-[26px]',
      textSize: 'text-[5.5px]',
      iconSize: 'w-2.5 h-2.5',
      padding: 'p-[3px]',
      labelWidth: 'calc(100% - 18px)',
    },
    sm: {
      width: 'w-[56px]',
      height: 'h-[24px]',
      knobSize: 'w-[18px] h-[18px]',
      knobTranslate: 'translate-x-[32px]',
      textSize: 'text-[6px]',
      iconSize: 'w-3 h-3',
      padding: 'p-[3px]',
      labelWidth: 'calc(100% - 20px)',
    },
    md: {
      width: 'w-[66px]',
      height: 'h-[26px]',
      knobSize: 'w-[20px] h-[20px]',
      knobTranslate: 'translate-x-[40px]',
      textSize: 'text-[6.5px]',
      iconSize: 'w-3.5 h-3.5',
      padding: 'p-[3px]',
      labelWidth: 'calc(100% - 22px)',
    },
    lg: {
      width: 'w-[76px]',
      height: 'h-[28px]',
      knobSize: 'w-[22px] h-[22px]',
      knobTranslate: 'translate-x-[48px]',
      textSize: 'text-[7px]',
      iconSize: 'w-3.5 h-3.5',
      padding: 'p-[3px]',
      labelWidth: 'calc(100% - 24px)',
    },
  }[size];

  // If in a collapsed sidebar navigation, display a circular compact version
  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-label={isLight ? 'Switch to Night Mode' : 'Switch to Day Mode'}
        title={isLight ? 'Switch to Night Mode' : 'Switch to Day Mode'}
        className={`w-8 h-8 rounded-full relative flex items-center justify-center transition-all duration-300 shadow-sm ${
          isLight
            ? 'bg-gradient-to-r from-[#F59E0B] via-[#F97316] to-[#EC4899] text-white'
            : 'bg-gradient-to-r from-[#D946EF] via-[#8B5CF6] to-[#1E1B4B] text-white'
        } ${className}`}
      >
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-inner">
          {isLight ? (
            <SunWithRays className="w-3.5 h-3.5 text-[#F97316]" />
          ) : (
            <MoonWithStars className="w-3.5 h-3.5 text-[#4338CA]" />
          )}
        </div>
      </button>
    );
  }

  return (
    <button
      id="global-theme-toggle-btn"
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? 'Switch to Night Mode' : 'Switch to Day Mode'}
      title={isLight ? 'Switch to Night Mode' : 'Switch to Day Mode'}
      onClick={onToggle}
      className={`relative inline-flex items-center rounded-full select-none cursor-pointer transition-all duration-300 ease-out shadow-sm active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-purple-400 shrink-0 ${config.width} ${config.height} ${config.padding} ${
        isLight
          ? 'bg-gradient-to-r from-[#F59E0B] via-[#F97316] to-[#EC4899] shadow-[0_2px_10px_rgba(249,115,22,0.25)]'
          : 'bg-gradient-to-r from-[#C026D3] via-[#8B5CF6] to-[#1E1B4B] shadow-[0_2px_10px_rgba(139,92,246,0.25)]'
      } ${className}`}
    >
      {/* Label on Left (Day Mode text when light) */}
      <div
        className={`absolute left-0 top-0 bottom-0 flex flex-col justify-center items-center pl-2 transition-opacity duration-300 pointer-events-none ${
          isLight ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ width: config.labelWidth }}
      >
        <span className={`font-black uppercase tracking-wider text-white ${config.textSize} leading-none text-left w-full pl-0.5`}>
          DAY
        </span>
        <span className={`font-black uppercase tracking-wider text-white/90 ${config.textSize} leading-none text-left w-full pl-0.5 mt-0.5`}>
          MODE
        </span>
      </div>

      {/* Label on Right (Night Mode text when dark) */}
      <div
        className={`absolute right-0 top-0 bottom-0 flex flex-col justify-center items-center pr-2 transition-opacity duration-300 pointer-events-none ${
          !isLight ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ width: config.labelWidth }}
      >
        <span className={`font-black uppercase tracking-wider text-white ${config.textSize} leading-none text-right w-full pr-0.5`}>
          NIGHT
        </span>
        <span className={`font-black uppercase tracking-wider text-white/90 ${config.textSize} leading-none text-right w-full pr-0.5 mt-0.5`}>
          MODE
        </span>
      </div>

      {/* Sliding Circular White Knob */}
      <div
        className={`rounded-full bg-white flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.22)] transform transition-transform duration-300 ease-out z-10 shrink-0 ${config.knobSize} ${
          isLight ? config.knobTranslate : 'translate-x-0'
        }`}
      >
        {isLight ? (
          <SunWithRays className={`${config.iconSize} text-[#F97316] transition-transform duration-300 rotate-0`} />
        ) : (
          <MoonWithStars className={`${config.iconSize} text-[#312E81] transition-transform duration-300 rotate-0`} />
        )}
      </div>
    </button>
  );
};

// Custom Sun icon matching the reference image (central circle with radial burst rays)
const SunWithRays: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-[#F97316]' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4.5" />
    <line x1="12" y1="2" x2="12" y2="4.5" />
    <line x1="12" y1="19.5" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="6.7" y2="6.7" />
    <line x1="17.3" y1="17.3" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="4.5" y2="12" />
    <line x1="19.5" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="6.7" y2="17.3" />
    <line x1="17.3" y1="6.7" x2="19.07" y2="4.93" />
  </svg>
);

// Custom Moon + Stars icon matching the reference image (crescent moon with 2 sparkles)
const MoonWithStars: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-[#312E81]' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Crescent Moon */}
    <path d="M14.5 18A7.5 7.5 0 0 1 8 5.5a8.2 8.2 0 1 0 9.8 11.8 7.5 7.5 0 0 1-3.3.7z" />
    {/* Top Star sparkle */}
    <path
      d="M17 3v3m-1.5-1.5h3"
      strokeWidth="1.8"
    />
    {/* Secondary Star sparkle */}
    <path
      d="M20 9v2m-1-1h2"
      strokeWidth="1.8"
    />
  </svg>
);
