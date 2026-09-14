import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  GRAPHIC_PROMOTIONAL_BANNERS,
  GRAPHIC_ANNOUNCEMENTS,
  GraphicFlyerBanner,
} from '../../data/promotionalGraphicBanners';

interface PromotionalBannerCarouselProps {
  onNavigateP2P?: () => void;
  onOpenAiTrader?: () => void;
  onOpenPolymarket?: () => void;
  onNavigateMarkets?: () => void;
  onNavigateEarn?: () => void;
  onOpenDeposit?: () => void;
}

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
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});
  const timerRef = useRef<number | null>(null);

  const banners = GRAPHIC_PROMOTIONAL_BANNERS;
  const announcements = GRAPHIC_ANNOUNCEMENTS;

  const handleAction = (banner: GraphicFlyerBanner) => {
    switch (banner.actionType) {
      case 'ai_trader':
        onOpenAiTrader?.();
        break;
      case 'p2p':
        onNavigateP2P?.();
        break;
      case 'earn':
        onNavigateEarn?.();
        break;
      case 'markets':
        onNavigateMarkets?.();
        break;
      case 'polymarket':
        onOpenPolymarket?.();
        break;
      case 'deposit':
        onOpenDeposit?.();
        break;
      default:
        break;
    }
  };

  // Autoplay banner cycle
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, banners.length]);

  // Autoplay announcements cycle
  useEffect(() => {
    const annInterval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(annInterval);
  }, [announcements.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const currentBanner = banners[currentIndex];
  const currentAnnouncement = announcements[announcementIndex];

  return (
    <div id="graphic-promotions-container" className="space-y-3 relative">
      {/* 1. Ultra High-Fidelity 3D Banner Showcase Slider */}
      <div className="relative">
        {/* Atmosphere / Dynamic Ambient Radial Backlight */}
        <div
          className="absolute -inset-1.5 rounded-3xl opacity-30 dark:opacity-45 blur-2xl transition-all duration-700 pointer-events-none -z-10"
          style={{ background: currentBanner.glowColor || 'rgba(168, 85, 247, 0.4)' }}
        />

        <div
          className="relative group rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-xl bg-slate-950 transition-all cursor-pointer aspect-[16/6] sm:aspect-[16/5.6] max-h-[320px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={() => handleAction(currentBanner)}
        >
          {/* Multi-slide cross-fade track */}
          <div className="relative w-full h-full overflow-hidden">
            {banners.map((banner, idx) => {
              const isActive = idx === currentIndex;
              const hasError = imageErrorMap[banner.id];
              const bannerGraphic = hasError && banner.fallbackSvgUrl ? banner.fallbackSvgUrl : banner.graphicUrl;

              return (
                <div
                  key={banner.id}
                  className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out ${
                    isActive
                      ? 'opacity-100 scale-100 pointer-events-auto z-10'
                      : 'opacity-0 scale-[1.03] pointer-events-none z-0'
                  }`}
                >
                  <img
                    src={bannerGraphic}
                    alt={banner.altText}
                    className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-[1.01]"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    onError={() => {
                      setImageErrorMap((prev) => ({ ...prev, [banner.id]: true }));
                    }}
                  />

                  {/* Subtle lighting vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent dark:from-[#06080F]/85 dark:via-black/15 dark:to-transparent pointer-events-none" />

                  {/* Contextual Typographic Overlay for Banner 1 (Open space on left) */}
                  {banner.id === 'graphic-ai-trader' && (
                    <div className="absolute inset-y-0 left-0 p-4 sm:p-7 md:p-8 flex flex-col justify-between max-w-[60%] sm:max-w-[55%] pointer-events-none z-10">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/25 border border-purple-400/40 backdrop-blur-md text-purple-200 text-[10px] sm:text-xs font-black tracking-wider uppercase mb-2 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          AI GRID PRO • 128.4% APY
                        </div>
                        <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none drop-shadow-md">
                          24/7 AI AUTO-TRADER
                        </h2>
                        <p className="hidden sm:block text-xs md:text-sm text-purple-200/90 font-medium mt-2 leading-relaxed">
                          Autonomous arbitrage & grid intelligence. Institutional micro-spread capture.
                        </p>
                      </div>

                      <div className="hidden sm:flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-xl bg-purple-950/70 border border-purple-500/30 backdrop-blur-md text-[11px] text-purple-100 font-bold shadow-xs">
                          Win Rate <span className="text-emerald-400 font-black">89.4%</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-purple-950/70 border border-purple-500/30 backdrop-blur-md text-[11px] text-purple-100 font-bold shadow-xs">
                          Maker Fee <span className="text-cyan-300 font-black">0.00%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Floating Action CTA Pill */}
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-6 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/75 hover:bg-white hover:text-black dark:bg-black/75 dark:hover:bg-white dark:hover:text-black backdrop-blur-md border border-white/20 text-white text-xs font-extrabold shadow-2xl transition-all duration-200 z-20 group/btn">
            <span>{currentBanner.ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1 text-current" />
          </div>

          {/* Navigation Arrows */}
          <div className="absolute inset-y-0 left-0 flex items-center px-2 sm:px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
            <button
              type="button"
              aria-label="Previous Graphic Flyer"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all shadow-lg active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center px-2 sm:px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
            <button
              type="button"
              aria-label="Next Graphic Flyer"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all shadow-lg active:scale-95"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Bottom Indicators & Autoplay Toggle */}
          <div
            className="absolute bottom-3 left-3 sm:bottom-4 sm:left-6 flex items-center gap-1.5 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {banners.map((b, idx) => (
              <button
                key={b.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-7 bg-white shadow-md'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}

            <button
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? 'Resume auto play' : 'Pause auto play'}
              className="ml-2 w-5 h-5 rounded-full bg-black/50 text-white/80 hover:text-white flex items-center justify-center text-[10px] backdrop-blur-xs"
            >
              {isPaused ? <Play className="w-2.5 h-2.5 ml-0.5" /> : <Pause className="w-2.5 h-2.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Upgraded 3D Announcements Ticker */}
      <div
        id="graphic-announcements-carousel"
        className="group/ann flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#0C0F19]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-sm hover:border-purple-300 dark:hover:border-purple-500/30 transition-all cursor-pointer backdrop-blur-md"
        onClick={() => {
          if (currentAnnouncement.category === 'NEW') onOpenDeposit?.();
          else if (currentAnnouncement.category === 'PROMO') onNavigateP2P?.();
          else if (currentAnnouncement.category === 'LISTING') onOpenAiTrader?.();
        }}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* 3D High-Gloss Icon Thumbnail */}
          <div className="w-8 h-8 shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-white/15 shadow-md flex items-center justify-center bg-slate-900 ring-1 ring-purple-500/20 group-hover/ann:ring-purple-500/50 transition-all">
            <img
              src={currentAnnouncement.thumbnailUrl}
              alt={currentAnnouncement.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover/ann:scale-110"
              loading="lazy"
            />
          </div>

          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              className={`px-2 py-0.5 shrink-0 rounded-md text-[9px] font-black tracking-wider uppercase ${
                currentAnnouncement.category === 'NEW'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-500/30'
                  : currentAnnouncement.category === 'SECURITY'
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-300/40 dark:border-indigo-500/30'
                  : currentAnnouncement.category === 'PROMO'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/40 dark:border-amber-500/30'
                  : 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300/40 dark:border-purple-500/30'
              }`}
            >
              {currentAnnouncement.category}
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate transition-colors group-hover/ann:text-purple-600 dark:group-hover/ann:text-purple-400">
              {currentAnnouncement.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium hidden sm:inline">
            {currentAnnouncement.time}
          </span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setAnnouncementIndex(
                  (prev) => (prev - 1 + announcements.length) % announcements.length
                );
              }}
              aria-label="Previous announcement"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
              }}
              aria-label="Next announcement"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
