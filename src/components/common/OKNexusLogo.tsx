import React from 'react';

export interface OKNexusLogoProps {
  size?: number | 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
  showGlow?: boolean;
  wordmarkClassName?: string;
}

export const OKNexusLogo: React.FC<OKNexusLogoProps> = ({
  size = 32,
  showWordmark = false,
  className = '',
  showGlow = true,
  wordmarkClassName = '',
}) => {
  const numericSize =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 24
      : size === 'lg'
      ? 48
      : 32;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src="/logo.png"
        alt="OKNexus Logo"
        width={numericSize}
        height={numericSize}
        className={`flex-shrink-0 object-contain select-none pointer-events-none transition-transform duration-200 ${
          showGlow ? 'drop-shadow-[0_4px_16px_rgba(168,85,247,0.45)]' : ''
        }`}
        style={{ width: `${numericSize}px`, height: `${numericSize}px` }}
        loading="eager"
      />

      {showWordmark && (
        <span
          className={`font-display font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1 text-base ${wordmarkClassName}`}
        >
          OKNEXUS
        </span>
      )}
    </div>
  );
};

export const OKNexusBadge3D: React.FC<{ size?: number; className?: string }> = ({
  size = 56,
  className = '',
}) => {
  return (
    <div
      className={`oknexus-3d-badge relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 via-fuchsia-50 to-indigo-100 dark:from-[#24133A]/90 dark:via-[#161427]/95 dark:to-[#0C0F17] border border-purple-300/80 dark:border-purple-500/35 shadow-[0_4px_16px_rgba(168,85,247,0.18)] dark:shadow-[0_8px_24px_rgba(168,85,247,0.25)] ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/15 dark:from-purple-500/20 via-transparent to-transparent pointer-events-none" />
      <OKNexusLogo size={size * 0.72} showGlow={false} />
      {/* Gloss reflection shine */}
      <div className="absolute top-1 left-2 right-2 h-1/3 rounded-t-xl bg-gradient-to-b from-white/40 dark:from-white/15 to-transparent pointer-events-none" />
    </div>
  );
};

