import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  Award,
  ArrowRight,
  Flame,
  Coins,
  Bot,
  Play,
  Pause,
} from 'lucide-react';
import { PromotionalBanner } from '../../types';

interface PromotionalBannerCarouselProps {
  onNavigateP2P?: () => void;
  onOpenAiTrader?: () => void;
  onOpenPolymarket?: () => void;
  onNavigateMarkets?: () => void;
  onNavigateEarn?: () => void;
  onOpenDeposit?: () => void;
}

const BANNERS: (PromotionalBanner & {
  bgGradient: string;
  glowColor: string;
  illustration: 'ai_grid' | 'p2p_trophy' | 'token_vault' | 'arena' | 'prediction' | 'listing';
  icon: React.ComponentType<{ className?: string }>;
})[] = [
  {
    id: 'ai-bot-promo',
    tag: 'NEW FEATURE LAUNCH',
    headline: '24/7 AI Auto-Trader & Grid Pro',
    subheadline: 'Automate spot & futures arbitrage with institutional predictive strategies. Up to 128.4% backtested APY.',
    ctaText: 'Launch AI Bot',
    actionType: 'ai_trader',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    accentColor: '#A855F7',
    statsHighlight: '128.4% APY • 0% Bot Fees',
    artType: 'ai_grid',
    bgGradient: 'from-[#220B38] via-[#140C2E] to-[#0A0D1A]',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    illustration: 'ai_grid',
    icon: Bot,
  },
  {
    id: 'p2p-championship',
    tag: 'GLOBAL P2P CAMPAIGN',
    headline: 'Share 50,000 USDT in Escrow Rewards',
    subheadline: 'Zero maker and taker fees across 40+ local bank rails. Instant escrow release and arbitration protection.',
    ctaText: 'Trade P2P Now',
    actionType: 'p2p',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    accentColor: '#F59E0B',
    statsHighlight: '0% Fees • 50,000 USDT Pool',
    artType: 'p2p_trophy',
    bgGradient: 'from-[#331D08] via-[#1F150D] to-[#0B0E17]',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    illustration: 'p2p_trophy',
    icon: Award,
  },
  {
    id: 'okn-staking',
    tag: 'ECOSYSTEM VAULT',
    headline: '$OKN Governance Vault & VIP Booster',
    subheadline: 'Stake $OKN to unlock instant VIP fee discounts, exclusive launchpad allocations, and 28.5% APR yield.',
    ctaText: 'Stake $OKN',
    actionType: 'earn',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    accentColor: '#06B6D4',
    statsHighlight: '28.5% APR • VIP Booster',
    artType: 'token_vault',
    bgGradient: 'from-[#082736] via-[#091B29] to-[#080B14]',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    illustration: 'token_vault',
    icon: Coins,
  },
  {
    id: 'trading-competition',
    tag: 'GLOBAL ARENA 2026',
    headline: '500,000 USDT Futures Championship',
    subheadline: 'Compete against global traders for daily leaderboards, physical luxury rewards, and zero-slippage tier rebates.',
    ctaText: 'Join Arena',
    actionType: 'markets',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    accentColor: '#F43F5E',
    statsHighlight: '500K Pool • Top 100 Rewards',
    artType: 'arena',
    bgGradient: 'from-[#330A18] via-[#1E0B19] to-[#0A0D18]',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    illustration: 'arena',
    icon: Flame,
  },
  {
    id: 'polymarket-predict',
    tag: 'PREDICTION PROTOCOL',
    headline: 'Forecast Crypto & Macro Trends',
    subheadline: 'Trade probability tokens on Fed rate decisions, BTC all-time highs, and ETF approvals with zero gas fees.',
    ctaText: 'Explore Markets',
    actionType: 'polymarket',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    accentColor: '#10B981',
    statsHighlight: '1.85x Multiplier • Instant Win',
    artType: 'prediction',
    bgGradient: 'from-[#0A2E20] via-[#091D1A] to-[#070A14]',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    illustration: 'prediction',
    icon: TrendingUp,
  },
  {
    id: 'token-listing',
    tag: 'PRIMARY LISTING FIESTA',
    headline: 'Exclusive Launch: Aether AI ($AETH)',
    subheadline: 'Deposit USDT or stake OKN to earn guaranteed primary token allocation before global spot listings.',
    ctaText: 'Claim Allocation',
    actionType: 'deposit',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
    accentColor: '#D946EF',
    statsHighlight: '100,000 AETH Pool • Verified Only',
    artType: 'listing',
    bgGradient: 'from-[#2F0833] via-[#180A28] to-[#0A0D17]',
    glowColor: 'rgba(217, 70, 239, 0.25)',
    illustration: 'listing',
    icon: Zap,
  },
];

export const PromotionalBannerCarousel: React.FC<PromotionalBannerCarouselProps> = ({
  onNavigateP2P,
  onOpenAiTrader,
  onOpenPolymarket,
  onNavigateMarkets,
  onNavigateEarn,
  onOpenDeposit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeBanner = BANNERS[currentIndex];
  const IconComponent = activeBanner.icon;

  // Auto-rotation (every 5.5 seconds)
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const handleCtaClick = () => {
    switch (activeBanner.actionType) {
      case 'p2p':
        onNavigateP2P?.();
        break;
      case 'ai_trader':
        onOpenAiTrader?.();
        break;
      case 'polymarket':
        onOpenPolymarket?.();
        break;
      case 'markets':
        onNavigateMarkets?.();
        break;
      case 'earn':
        onNavigateEarn?.();
        break;
      case 'deposit':
        onOpenDeposit?.();
        break;
      default:
        onOpenAiTrader?.();
    }
  };

  return (
    <div
      id="home-promotional-flyer-carousel"
      className="relative mb-5 rounded-2xl md:rounded-3xl overflow-hidden group select-none shadow-xl border border-white/10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Background Banner Canvas */}
      <div
        className={`relative w-full min-h-[190px] sm:min-h-[210px] md:min-h-[220px] bg-gradient-to-br ${activeBanner.bgGradient} p-4 sm:p-6 md:p-7 flex flex-col justify-between transition-all duration-700`}
      >
        {/* Ambient Glow Orb */}
        <div
          className="absolute -right-16 -top-16 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-700 opacity-60"
          style={{ background: activeBanner.glowColor }}
        />
        <div
          className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full blur-2xl pointer-events-none transition-colors duration-700 opacity-40"
          style={{ background: activeBanner.glowColor }}
        />

        {/* Decorative Grid Mesh & Cyber Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

        {/* Top Header Badge & Live Status */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border shadow-sm ${activeBanner.badgeColor}`}
            >
              <Sparkles className="w-3 h-3 animate-pulse" />
              {activeBanner.tag}
            </span>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono-num font-semibold bg-white/[0.07] border border-white/10 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {activeBanner.statsHighlight}
            </span>
          </div>

          {/* Pause / Play Indicator & Index Count */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-num">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 rounded-md bg-white/[0.06] hover:bg-white/10 text-slate-300 transition-colors"
              title={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
              aria-label="Toggle banner autoplay"
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            </button>
            <span className="text-[11px] bg-black/40 px-2 py-0.5 rounded-full border border-white/10 text-slate-300">
              {currentIndex + 1} / {BANNERS.length}
            </span>
          </div>
        </div>

        {/* Central Graphic Flyer Content */}
        <div className="relative z-10 my-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
              {activeBanner.headline}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 sm:mt-1.5 line-clamp-2 md:line-clamp-none max-w-lg leading-relaxed">
              {activeBanner.subheadline}
            </p>

            {/* Mobile Stats Pill */}
            <div className="sm:hidden mt-2">
              <span className="inline-block text-[10px] font-mono-num font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                {activeBanner.statsHighlight}
              </span>
            </div>
          </div>

          {/* Right Floating Campaign Artwork & CTA */}
          <div className="flex items-center gap-3 sm:gap-4 self-start md:self-auto">
            {/* Geometric 3D-effect Campaign Badge */}
            <div className="relative hidden lg:flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/20 backdrop-blur-md shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
              <IconComponent className="w-9 h-9 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
              <div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-black animate-ping"
                style={{ backgroundColor: activeBanner.accentColor }}
              />
            </div>

            {/* Main Interactive CTA Button */}
            <button
              id={`banner-cta-${activeBanner.id}`}
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 transition-all shadow-lg shadow-purple-900/40 border border-purple-400/30 group/btn cursor-pointer whitespace-nowrap"
            >
              <span>{activeBanner.ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom Pagination Indicators & Controls */}
        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/[0.08]">
          {/* Progress Indicators */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {BANNERS.map((banner, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={banner.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative h-1.5 rounded-full transition-all duration-300 ${
                    isActive ? 'w-8 bg-purple-400' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {isActive && !isPaused && (
                    <span
                      className="absolute inset-0 bg-white rounded-full animate-[progress_5.5s_linear]"
                      style={{ animationDuration: '5.5s' }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Prev / Next Manual Navigation Arrows */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="w-7 h-7 rounded-lg bg-black/40 border border-white/10 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              aria-label="Previous promotional banner"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-7 h-7 rounded-lg bg-black/40 border border-white/10 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              aria-label="Next promotional banner"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
