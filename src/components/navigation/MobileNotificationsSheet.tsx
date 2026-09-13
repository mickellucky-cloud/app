import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  CheckCircle2,
  ShieldAlert,
  Bot,
  BellRing,
  Info,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { AppNotification } from '../../types';

interface MobileNotificationsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onOpenPriceAlerts?: () => void;
  activeAlertsCount?: number;
}

export const MobileNotificationsSheet: React.FC<MobileNotificationsSheetProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenPriceAlerts,
  activeAlertsCount = 0,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'trading' | 'system'>('all');
  const [viewAll, setViewAll] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const currentDragY = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Reset states when opened
  useEffect(() => {
    if (isOpen) {
      setDragOffset(0);
      setIsDragging(false);
      // Prevent body scrolling while sheet is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Touch handlers for swipe-down to dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    currentDragY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - dragStartY.current;
    currentDragY.current = touchY;

    // Only allow dragging downwards
    if (deltaY > 0) {
      // Add slight resistance to drag
      setDragOffset(deltaY);
    } else {
      setDragOffset(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const deltaY = currentDragY.current - dragStartY.current;

    // If dragged down past 75px, close sheet; otherwise animate back to 0
    if (deltaY > 75) {
      onClose();
    }
    setDragOffset(0);
  };

  // Keyboard accessibility
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'unread') return !item.read;
    if (filter === 'trading') return item.category === 'trading' || item.category === 'alerts';
    if (filter === 'system') return item.category === 'system';
    return true;
  });

  const displayedNotifications = viewAll
    ? filteredNotifications
    : filteredNotifications.slice(0, 8);

  const getTypeIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'bot':
        return <Bot className="w-4 h-4 text-[#8B5CF6]" />;
      case 'security':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'alert':
        return <BellRing className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-[#06B6D4]" />;
    }
  };

  const getTypeBg = (type: AppNotification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'bot':
        return 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20';
      case 'security':
        return 'bg-rose-500/10 border-rose-500/20';
      case 'alert':
        return 'bg-amber-500/10 border-amber-500/20';
      default:
        return 'bg-[#06B6D4]/10 border-[#06B6D4]/20';
    }
  };

  return (
    <div
      id="mobile-notifications-sheet-backdrop"
      className="fixed inset-0 z-50 flex flex-col justify-end transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-notifications-title"
    >
      {/* Semi-transparent Dimmed Backdrop (Preserves top context of header and bell icon) */}
      <div
        className="absolute inset-0 bg-black/45 dark:bg-black/60 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet Container (60% to 80% screen height) */}
      <div
        ref={sheetRef}
        id="mobile-notifications-sheet-content"
        className="relative w-full max-w-lg mx-auto bg-white dark:bg-[#0E141B] rounded-t-3xl border-t border-x border-[#D7E0EB] dark:border-[#242E3B] shadow-[0_-16px_48px_rgba(0,0,0,0.3)] dark:shadow-[0_-20px_50px_rgba(0,0,0,0.85)] flex flex-col h-[74vh] max-h-[82vh] min-h-[58vh] overflow-hidden transition-transform duration-150 ease-out animate-in slide-in-from-bottom-full"
        style={{
          transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Swipe Handle Bar & Drag Zone */}
        <div
          className="pt-3 pb-1.5 px-4 flex flex-col items-center cursor-grab active:cursor-grabbing touch-none select-none shrink-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto" />
        </div>

        {/* Sheet Header */}
        <div
          className="px-4 py-2.5 border-b border-[#D7E0EB] dark:border-[#1E2633] flex items-center justify-between shrink-0 bg-white dark:bg-[#0E141B]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left: Title & Count Badge */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 border border-[#8B5CF6]/20 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <div>
              <h2
                id="mobile-notifications-title"
                className="font-bold text-base text-[#0F172A] dark:text-white leading-tight"
              >
                Notifications
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                {unreadCount > 0 ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6] text-[10px] font-extrabold font-mono-num">
                    {unreadCount} new unread
                  </span>
                ) : (
                  <span className="text-[11px] text-[#64748B] dark:text-[#8E98A6]">
                    All caught up
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Mark all as read & Close button */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-[#1A222D] dark:hover:bg-[#253041] text-[#8B5CF6] dark:text-[#A78BFA] text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
                title="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}

            <button
              type="button"
              id="mobile-notifications-close-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#1A222D] dark:hover:bg-[#253041] flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white active:scale-95 transition-all"
              aria-label="Close notifications sheet"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="px-3 py-2 flex items-center gap-1.5 border-b border-[#D7E0EB]/70 dark:border-[#1E2633]/70 bg-slate-50/50 dark:bg-[#0B0F15] shrink-0 overflow-x-auto no-scrollbar">
          {(['all', 'unread', 'trading', 'system'] as const).map((tab) => {
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#8B5CF6] text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] text-[#64748B] dark:text-[#8E98A6] hover:text-[#0F172A] dark:hover:text-white active:scale-95'
                }`}
              >
                {tab === 'unread' ? `Unread (${unreadCount})` : tab}
              </button>
            );
          })}
        </div>

        {/* Notifications Scrollable List */}
        <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-[#D7E0EB]/50 dark:divide-[#1E2633]/60 px-1 py-1">
          {displayedNotifications.length === 0 ? (
            <div className="py-16 px-4 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] text-[#64748B] dark:text-[#8E98A6] flex items-center justify-center mx-auto mb-3 shadow-xs">
                <Bell className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">
                No notifications found
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#8E98A6] mt-1 max-w-xs mx-auto">
                {filter === 'unread'
                  ? "You've read all your alerts and updates! Check back later."
                  : 'There are no active notifications in this category.'}
              </p>
            </div>
          ) : (
            displayedNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onMarkAsRead(notif.id)}
                className={`p-3.5 sm:p-4 rounded-2xl flex items-start gap-3.5 cursor-pointer transition-all active:scale-[0.99] my-0.5 ${
                  !notif.read
                    ? 'bg-[#8B5CF6]/[0.06] dark:bg-[#8B5CF6]/[0.1] border border-[#8B5CF6]/20'
                    : 'hover:bg-slate-50 dark:hover:bg-[#141B24]/70'
                }`}
              >
                {/* Type Badge / Icon */}
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${getTypeBg(
                    notif.type
                  )}`}
                >
                  {getTypeIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4
                      className={`text-xs sm:text-sm truncate ${
                        !notif.read
                          ? 'font-bold text-[#0F172A] dark:text-white'
                          : 'font-semibold text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-[#64748B] dark:text-[#8E98A6] font-mono shrink-0 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 inline" />
                      {notif.time}
                    </span>
                  </div>

                  <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed line-clamp-2">
                    {notif.desc}
                  </p>
                </div>

                {/* Unread Glow Indicator */}
                {!notif.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shrink-0 mt-2 shadow-[0_0_8px_rgba(139,92,246,0.9)]" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Actions (Safe Area Respected) */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-[#141B24] border-t border-[#D7E0EB] dark:border-[#1E2633] flex items-center justify-between gap-2 shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {onOpenPriceAlerts && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPriceAlerts();
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-[#64748B] dark:text-[#8E98A6] hover:text-[#8B5CF6] dark:hover:text-[#A78BFA] bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] flex items-center gap-1.5 transition-colors active:scale-95 shadow-2xs"
            >
              <BellRing className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Price Alerts ({activeAlertsCount})</span>
            </button>
          )}

          {filteredNotifications.length > 8 && (
            <button
              type="button"
              onClick={() => setViewAll(!viewAll)}
              className="ml-auto px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] flex items-center gap-1 transition-all active:scale-95 shadow-xs"
            >
              <span>{viewAll ? 'Show fewer' : 'View all notifications'}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${viewAll ? '-rotate-90' : ''}`} />
            </button>
          )}

          {filteredNotifications.length <= 8 && !onOpenPriceAlerts && (
            <div className="text-[11px] text-[#64748B] dark:text-[#8E98A6] text-center w-full">
              Pull down to close
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
