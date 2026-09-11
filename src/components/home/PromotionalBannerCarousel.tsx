import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Bell,
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
  const [annThumbnailErrorMap, setAnnThumbnailErrorMap] = useState<Record<string, boolean>>({});
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
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, banners.length]);

  // Autoplay announcements cycle
  useEffect(() => {
    const annInterval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
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
    <div id="graphic-promotions-container" className="space-y-2.5">
      {/* 1. Graphic Slider Ads Banner (Pure <img> graphic flyer, no code mockup) */}
      <div
        className="relative group rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg bg-slate-950 transition-all cursor-pointer aspect-[16/6] sm:aspect-[16/5.6] max-h-[300px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={() => handleAction(currentBanner)}
      >
        {/* Render pure graphic image flyer with graceful fallback */}
        {!imageErrorMap[currentBanner.id] ? (
          <img
            src={currentBanner.graphicUrl}
            alt={currentBanner.altText}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01] select-none"
            loading="eager"
            decoding="async"
            onError={() => {
              setImageErrorMap((prev) => ({ ...prev, [currentBanner.id]: true }));
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 flex flex-col justify-between text-white select-none">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/30 text-purple-200 border border-purple-400/40">
                {currentBanner.tag}
              </span>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-1">
                {currentBanner.headline}
              </h3>
              <p className="text-xs text-purple-200/80">{currentBanner.altText}</p>
            </div>
          </div>
        )}

        {/* Floating Quick Action CTA pill on hover */}
        <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-6 hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-xl transition-all group-hover:bg-purple-600 group-hover:border-purple-400">
          <span>{currentBanner.ctaText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>

        {/* Carousel Navigation Arrow Overlays */}
        <div className="absolute inset-y-0 left-0 flex items-center px-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            aria-label="Previous Graphic Flyer"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-black/80 transition-all shadow-md active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center px-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            aria-label="Next Graphic Flyer"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-black/80 transition-all shadow-md active:scale-95"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Bottom Carousel Indicator Pills & Play/Pause */}
        <div
          className="absolute bottom-2.5 left-3 sm:bottom-4 sm:left-6 flex items-center gap-1.5 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {banners.map((b, idx) => (
            <button
              key={b.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === idx
                  ? 'w-6 bg-white shadow-xs'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}

          <button
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? 'Resume auto play' : 'Pause auto play'}
            className="ml-2 w-5 h-5 rounded-full bg-black/50 text-white/80 hover:text-white flex items-center justify-center text-[10px]"
          >
            {isPaused ? <Play className="w-2.5 h-2.5 ml-0.5" /> : <Pause className="w-2.5 h-2.5" />}
          </button>
        </div>
      </div>

      {/* 2. Graphic Announcements Carousel (Real Graphic Image Thumbnails + Ticker) */}
      <div
        id="graphic-announcements-carousel"
        className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0C0F19] border border-slate-200 dark:border-white/[0.08] shadow-2xs hover:border-slate-300 dark:hover:border-white/15 transition-all cursor-pointer"
        onClick={() => {
          if (currentAnnouncement.category === 'NEW') onOpenDeposit?.();
          else if (currentAnnouncement.category === 'PROMO') onNavigateP2P?.();
          else if (currentAnnouncement.category === 'LISTING') onOpenAiTrader?.();
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Announcement Graphic Image Thumbnail with robust fallback */}
          <div className="w-7 h-7 shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xs flex items-center justify-center bg-purple-950/60">
            {!annThumbnailErrorMap[currentAnnouncement.id] ? (
              <img
                src={currentAnnouncement.thumbnailUrl}
                alt={currentAnnouncement.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => {
                  setAnnThumbnailErrorMap((prev) => ({ ...prev, [currentAnnouncement.id]: true }));
                }}
              />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            )}
          </div>

          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span
              className={`px-1.5 py-0.2 shrink-0 rounded text-[9px] font-extrabold tracking-wider ${
                currentAnnouncement.category === 'NEW'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : currentAnnouncement.category === 'SECURITY'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400'
                  : currentAnnouncement.category === 'PROMO'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                  : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
              }`}
            >
              {currentAnnouncement.category}
            </span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {currentAnnouncement.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono-num hidden sm:inline">
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
              className="p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
              }}
              aria-label="Next announcement"
              className="p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
