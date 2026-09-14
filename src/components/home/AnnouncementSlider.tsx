import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Megaphone, Sparkles } from 'lucide-react';
import { GRAPHIC_ANNOUNCEMENTS, GraphicAnnouncement } from '../../data/promotionalGraphicBanners';

export interface AnnouncementSliderProps {
  onOpenDeposit?: () => void;
  onNavigateP2P?: () => void;
  onOpenAiTrader?: () => void;
  className?: string;
}

export const AnnouncementSlider: React.FC<AnnouncementSliderProps> = ({
  onOpenDeposit,
  onNavigateP2P,
  onOpenAiTrader,
  className = '',
}) => {
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const announcements = GRAPHIC_ANNOUNCEMENTS;

  // Auto-advance announcements slider every 4.5 seconds when not paused
  useEffect(() => {
    if (isPaused || announcements.length <= 1) return;

    timerRef.current = window.setInterval(() => {
      setDirection(1);
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, announcements.length]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(-1);
    setAnnouncementIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(1);
    setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
  };

  const currentAnnouncement: GraphicAnnouncement = announcements[announcementIndex] || announcements[0];

  const handleItemClick = () => {
    if (currentAnnouncement.category === 'NEW') onOpenDeposit?.();
    else if (currentAnnouncement.category === 'PROMO') onNavigateP2P?.();
    else if (currentAnnouncement.category === 'LISTING') onOpenAiTrader?.();
    else if (currentAnnouncement.category === 'SECURITY') onOpenDeposit?.();
  };

  const getCategoryStyles = (category: GraphicAnnouncement['category']) => {
    switch (category) {
      case 'NEW':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300/50 dark:border-emerald-500/30';
      case 'SECURITY':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-300/50 dark:border-indigo-500/30';
      case 'PROMO':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300/50 dark:border-amber-500/30';
      case 'LISTING':
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300/50 dark:border-purple-500/30';
    }
  };

  return (
    <div
      id="home-announcement-slider"
      className={`relative w-full ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        id="graphic-announcements-carousel"
        onClick={handleItemClick}
        className="group/ann flex items-center justify-between gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white dark:bg-[#0E141E]/90 border border-slate-200/90 dark:border-white/[0.08] shadow-xs hover:shadow-md hover:border-purple-300 dark:hover:border-purple-500/40 transition-all cursor-pointer backdrop-blur-md"
      >
        {/* Left: Speaker/Announcement Icon + 3D Thumbnail + Content */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          {/* Glowing Loudspeaker Indicator */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover/ann:scale-105 transition-transform shadow-2xs">
            <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
          </div>

          {/* 3D High-Gloss Icon Thumbnail */}
          {currentAnnouncement.thumbnailUrl ? (
            <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-white/15 shadow-2xs flex items-center justify-center bg-slate-900 ring-1 ring-purple-500/20 group-hover/ann:ring-purple-500/50 transition-all">
              <img
                src={currentAnnouncement.thumbnailUrl}
                alt={currentAnnouncement.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/ann:scale-110"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-xl bg-purple-900/60 flex items-center justify-center border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            </div>
          )}

          {/* Animated Announcement Text & Category */}
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
            <span
              className={`px-1.5 sm:px-2 py-0.5 shrink-0 rounded-md text-[9px] sm:text-[10px] font-black tracking-wider uppercase border shadow-2xs ${getCategoryStyles(
                currentAnnouncement.category
              )}`}
            >
              {currentAnnouncement.category}
            </span>

            <div className="relative min-w-0 flex-1 overflow-hidden h-5 flex items-center">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.p
                  key={currentAnnouncement.id}
                  custom={direction}
                  initial={{ opacity: 0, y: direction > 0 ? 12 : -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: direction > 0 ? -12 : 12 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 truncate transition-colors group-hover/ann:text-purple-600 dark:group-hover/ann:text-purple-400"
                >
                  {currentAnnouncement.title}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right: Timestamp & Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono font-medium hidden xs:inline">
            {currentAnnouncement.time}
          </span>

          <div className="flex items-center gap-0.5 bg-slate-100/80 dark:bg-white/[0.04] p-0.5 rounded-lg border border-slate-200/60 dark:border-white/[0.06]">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous announcement"
              className="p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next announcement"
              className="p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
