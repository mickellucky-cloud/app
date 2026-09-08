import React from 'react';

export interface OKNexusLogoProps {
  size?: number | 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
  showGlow?: boolean;
}

export const OKNexusLogo: React.FC<OKNexusLogoProps> = ({
  size = 32,
  showWordmark = false,
  className = '',
  showGlow = true,
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
      <svg
        width={numericSize}
        height={numericSize}
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`flex-shrink-0 ${
          showGlow ? 'drop-shadow-[0_4px_16px_rgba(168,85,247,0.4)]' : ''
        }`}
      >
        <defs>
          {/* Top-Left Gold Gradients */}
          <linearGradient id="okn-gold-tl-bevel" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#FFF59D" />
            <stop offset="25%" stopColor="#FBC02D" />
            <stop offset="60%" stopColor="#F57F17" />
            <stop offset="100%" stopColor="#9A3412" />
          </linearGradient>

          <linearGradient id="okn-gold-tl-surf" x1="35%" y1="15%" x2="65%" y2="85%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="20%" stopColor="#FDE047" />
            <stop offset="55%" stopColor="#F59E0B" />
            <stop offset="85%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Right Gold Gradients */}
          <linearGradient id="okn-gold-r-bevel" x1="10%" y1="25%" x2="90%" y2="75%">
            <stop offset="0%" stopColor="#FFF59D" />
            <stop offset="30%" stopColor="#FBC02D" />
            <stop offset="70%" stopColor="#F57F17" />
            <stop offset="100%" stopColor="#9A3412" />
          </linearGradient>

          <linearGradient id="okn-gold-r-surf" x1="20%" y1="30%" x2="80%" y2="70%">
            <stop offset="0%" stopColor="#FFFDE7" />
            <stop offset="25%" stopColor="#FDE047" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Magenta to Deep Purple 3D Gradient (Main Chevron) */}
          <linearGradient id="okn-purple-body" x1="88%" y1="12%" x2="15%" y2="85%">
            <stop offset="0%" stopColor="#FF2EA6" />
            <stop offset="15%" stopColor="#F024B2" />
            <stop offset="42%" stopColor="#B814DE" />
            <stop offset="72%" stopColor="#6F00DE" />
            <stop offset="100%" stopColor="#3D0099" />
          </linearGradient>

          <linearGradient id="okn-purple-bevel" x1="88%" y1="10%" x2="15%" y2="90%">
            <stop offset="0%" stopColor="#FFB3EA" />
            <stop offset="30%" stopColor="#E879F9" />
            <stop offset="65%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>

          {/* Cyan Lower Bar 3D Gradient */}
          <linearGradient id="okn-cyan-body" x1="30%" y1="55%" x2="85%" y2="92%">
            <stop offset="0%" stopColor="#38E8FF" />
            <stop offset="25%" stopColor="#00D2FF" />
            <stop offset="65%" stopColor="#0099E6" />
            <stop offset="100%" stopColor="#0066B3" />
          </linearGradient>

          <linearGradient id="okn-cyan-bevel" x1="25%" y1="50%" x2="85%" y2="95%">
            <stop offset="0%" stopColor="#CFF9FE" />
            <stop offset="35%" stopColor="#38BDF8" />
            <stop offset="75%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#034E7B" />
          </linearGradient>

          {/* Drop Shadow Filter */}
          <filter id="okn-3d-shadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#000000" floodOpacity="0.45" />
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        <g filter="url(#okn-3d-shadow)">
          {/* 1. TOP-LEFT GOLDEN ARC */}
          <path
            d="M 515 130 C 375 138 245 230 178 358 C 145 420 148 480 152 516 C 153 525 163 530 171 526 C 205 508 238 472 268 418 C 322 320 412 245 508 234 C 520 232 525 218 518 208 L 515 130 Z"
            fill="url(#okn-gold-tl-bevel)"
          />
          <path
            d="M 512 142 C 382 152 260 240 196 364 C 168 420 166 470 168 506 C 196 488 226 454 254 408 C 304 322 390 252 485 240 L 512 142 Z"
            fill="url(#okn-gold-tl-surf)"
          />
          {/* Specular Ridge on Top-Left Gold Arc */}
          <path
            d="M 505 146 C 385 158 270 245 208 368 C 185 412 178 456 174 488"
            stroke="#FFF9C4"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />

          {/* 2. MAIN PURPLE/MAGENTA FOLDED CHEVRON (K-STEM) */}
          {/* Extruded Bevel Base */}
          <path
            d="M 778 135 L 782 148 L 182 642 L 434 894 L 575 870 L 346 642 L 638 182 Z"
            fill="#1A003E"
            opacity="0.55"
          />
          {/* Beveled Outer Rim */}
          <path
            d="M 622 128 L 778 138 C 785 139 788 147 784 153 L 180 638 C 174 644 176 654 184 660 L 434 888 C 440 894 450 894 456 888 L 568 876 C 576 875 580 866 575 860 L 358 634 C 354 630 354 624 358 620 L 634 142 C 638 138 634 130 626 128 Z"
            fill="url(#okn-purple-bevel)"
          />
          {/* Front Face */}
          <path
            d="M 632 140 L 766 148 C 772 149 775 155 771 160 L 188 634 C 184 638 185 645 190 650 L 430 876 C 434 880 442 880 446 876 L 558 865 C 564 864 566 857 562 853 L 348 628 C 344 624 344 618 348 614 L 642 152 C 646 148 642 141 636 140 Z"
            fill="url(#okn-purple-body)"
          />
          {/* Specular Gloss Sheen along top rim */}
          <path
            d="M 764 152 L 202 630 L 194 644"
            stroke="#FFD6F8"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          <path
            d="M 194 646 L 438 870"
            stroke="#E9D5FF"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />

          {/* 3. CYAN LOWER-RIGHT PILL BAR */}
          {/* Extruded Bevel Base */}
          <path
            d="M 444 634 L 512 568 C 518 562 528 562 534 568 L 812 854 C 818 860 818 870 812 876 L 672 890 C 664 891 658 886 654 880 L 444 648 C 440 644 440 638 444 634 Z"
            fill="url(#okn-cyan-bevel)"
          />
          {/* Front Face */}
          <path
            d="M 454 638 L 518 578 C 522 574 528 574 532 578 L 798 852 C 802 856 802 862 798 866 L 678 880 C 672 881 668 878 664 874 L 454 648 C 450 644 450 640 454 638 Z"
            fill="url(#okn-cyan-body)"
          />
          {/* Specular Top Rim on Cyan Bar */}
          <path
            d="M 524 582 L 794 856"
            stroke="#E0F7FA"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity="0.92"
          />

          {/* 4. RIGHT GOLDEN ARC */}
          <path
            d="M 730 292 C 738 290 746 295 750 302 C 806 410 815 550 778 680 C 774 694 766 708 752 718 C 742 724 730 718 728 706 C 722 668 732 600 748 518 C 762 446 754 374 722 312 C 718 304 722 294 730 292 Z"
            fill="url(#okn-gold-r-bevel)"
          />
          <path
            d="M 734 304 C 790 412 798 546 764 670 C 756 700 744 712 734 706 C 730 670 740 606 756 524 C 770 450 762 382 730 322 C 726 314 728 308 734 304 Z"
            fill="url(#okn-gold-r-surf)"
          />
          {/* Specular Ridge on Right Gold Arc */}
          <path
            d="M 746 318 C 796 422 804 546 770 664"
            stroke="#FFF9C4"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
        </g>
      </svg>

      {showWordmark && (
        <span className="font-display font-bold tracking-tight text-white flex items-center gap-1 text-base">
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
      className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#24133A]/90 via-[#161427]/95 to-[#0C0F17] border border-purple-500/35 shadow-[0_8px_24px_rgba(168,85,247,0.25)] ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent pointer-events-none" />
      <OKNexusLogo size={size * 0.72} showGlow={false} />
      {/* Gloss reflection shine */}
      <div className="absolute top-1 left-2 right-2 h-1/3 rounded-t-xl bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
    </div>
  );
};

