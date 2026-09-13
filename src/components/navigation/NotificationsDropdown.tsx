import React, { useRef, useEffect, useState } from 'react';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  ShieldAlert,
  Bot,
  BellRing,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Clock,
  Filter,
} from 'lucide-react';
import { AppNotification } from '../../types';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onOpenPriceAlerts?: () => void;
  activeAlertsCount?: number;
  align?: 'right' | 'left';
  className?: string;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenPriceAlerts,
  activeAlertsCount = 0,
  align = 'right',
  className = '',
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'trading' | 'system'>('all');
  const [viewAll, setViewAll] = useState(false);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'unread') return !item.read;
    if (filter === 'trading') return item.category === 'trading';
    if (filter === 'system') return item.category === 'system';
    return true;
  });

  const displayedNotifications = viewAll
    ? filteredNotifications
    : filteredNotifications.slice(0, 6);

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
      ref={dropdownRef}
      id="notifications-dropdown-panel"
      role="dialog"
      aria-label="Notifications panel"
      className={`absolute ${
        align === 'right' ? 'right-0' : 'left-0'
      } top-full mt-2 w-[calc(100vw-32px)] sm:w-96 max-w-sm rounded-2xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] shadow-[0_12px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.7)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 transition-colors ${className}`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#D7E0EB] dark:border-[#1E2633] flex items-center justify-between bg-slate-50/70 dark:bg-[#141B24]/70 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-[#0F172A] dark:text-white">
            Notifications
          </span>
          {unreadCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6] text-[10px] font-extrabold font-mono-num animate-in zoom-in-90">
              {unreadCount} new
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-[#1C2533] text-[#64748B] dark:text-[#8E98A6] text-[10px] font-semibold">
              All read
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="text-[11px] font-semibold text-[#8B5CF6] hover:text-[#7C3AED] dark:text-[#A78BFA] dark:hover:text-white flex items-center gap-1 active:scale-95 transition-all"
            title="Mark all notifications as read"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="px-3 pt-2 pb-1.5 flex items-center gap-1 border-b border-[#D7E0EB]/70 dark:border-[#1E2633]/70 bg-white dark:bg-[#0E141B]">
        {(['all', 'unread', 'trading', 'system'] as const).map((tab) => {
          const isActive = filter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                isActive
                  ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] dark:bg-[#8B5CF6]/20 dark:text-[#EDF1F5] font-bold'
                  : 'text-[#64748B] dark:text-[#8E98A6] hover:text-[#0F172A] dark:hover:text-white'
              }`}
            >
              {tab === 'unread' ? `Unread (${unreadCount})` : tab}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-[#D7E0EB]/50 dark:divide-[#1E2633]/60 overscroll-contain">
        {displayedNotifications.length === 0 ? (
          <div className="py-10 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#141B24] text-[#64748B] dark:text-[#8E98A6] flex items-center justify-center mx-auto mb-2">
              <Bell className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-[#0F172A] dark:text-white">
              No notifications
            </p>
            <p className="text-[11px] text-[#64748B] dark:text-[#8E98A6] mt-0.5">
              {filter === 'unread'
                ? "You're all caught up with alerts!"
                : 'No notifications in this category.'}
            </p>
          </div>
        ) : (
          displayedNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onMarkAsRead(notif.id)}
              className={`group p-3 flex items-start gap-3 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-[#141B24]/80 ${
                !notif.read
                  ? 'bg-[#8B5CF6]/[0.04] dark:bg-[#8B5CF6]/[0.08]'
                  : 'opacity-85 hover:opacity-100'
              }`}
            >
              {/* Type Badge / Icon */}
              <div
                className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${getTypeBg(
                  notif.type
                )}`}
              >
                {getTypeIcon(notif.type)}
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4
                    className={`text-xs truncate ${
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

                <p className="text-[11px] text-[#64748B] dark:text-[#8E98A6] line-clamp-2 leading-relaxed">
                  {notif.desc}
                </p>
              </div>

              {/* Unread Glow Dot */}
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-[#8B5CF6] shrink-0 mt-2 shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-2.5 bg-slate-50 dark:bg-[#141B24] border-t border-[#D7E0EB] dark:border-[#1E2633] flex items-center justify-between gap-2">
        {onOpenPriceAlerts && (
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPriceAlerts();
            }}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#64748B] dark:text-[#8E98A6] hover:text-[#8B5CF6] dark:hover:text-[#A78BFA] flex items-center gap-1.5 transition-colors"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Alerts ({activeAlertsCount})</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setViewAll(!viewAll)}
          className="ml-auto px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#8B5CF6] dark:text-[#A78BFA] hover:underline flex items-center gap-1 transition-colors"
        >
          <span>{viewAll ? 'Show less' : 'View all notifications'}</span>
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${viewAll ? '-rotate-90' : ''}`} />
        </button>
      </div>
    </div>
  );
};
