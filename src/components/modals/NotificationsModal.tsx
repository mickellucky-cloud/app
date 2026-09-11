import React, { useState } from 'react';
import { X, Bell, CheckCircle2, ShieldAlert, Sparkles, BellRing, ChevronRight, CheckCheck } from 'lucide-react';
import { AppNotification } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: AppNotification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onOpenPriceAlerts?: () => void;
  activeAlertsCount?: number;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Deposit Confirmed',
    desc: '1,500.00 USDT has been credited to your Spot wallet.',
    time: '12m ago',
    type: 'success',
    category: 'trading',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'AI Auto Trader Execution',
    desc: 'Grid buy order filled: 0.05 BTC @ $66,950.00',
    time: '45m ago',
    type: 'bot',
    category: 'trading',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Security Alert',
    desc: 'New login detected from Mobile Safari (Lagos, NG).',
    time: '2h ago',
    type: 'security',
    category: 'system',
    read: true,
  },
];

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications = DEFAULT_NOTIFICATIONS,
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenPriceAlerts,
  activeAlertsCount = 0,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'trading' | 'system'>('all');
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'trading') return n.category === 'trading' || n.category === 'alerts';
    if (filter === 'system') return n.category === 'system';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#0E141B] border-t sm:border border-[#D7E0EB] dark:border-[#242E3B] rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom animate-slideUp text-[#0F172A] dark:text-[#EDF1F5] shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#D7E0EB] dark:border-[#242E3B] mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-4 h-4 text-[#8B5CF6]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#8B5CF6]" />
              )}
            </div>
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-num font-bold bg-[#8B5CF6]/10 text-[#8B5CF6] dark:bg-[#8B5CF6]/20 border border-[#8B5CF6]/30">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && onMarkAllAsRead && (
              <button
                id="notifications-mark-all-read-btn"
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-[#8B5CF6] hover:text-[#7C3AED] bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 border border-[#8B5CF6]/20 transition-all"
                title="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6] dark:hover:text-white" aria-label="Close notifications">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Price Alerts Action Banner */}
        {onOpenPriceAlerts && (
          <button
            id="notifications-open-alerts-banner"
            onClick={() => {
              onClose();
              onOpenPriceAlerts();
            }}
            className="w-full mb-3 p-3 rounded-2xl bg-gradient-to-r from-[#8B5CF6]/10 via-[#F8FAFC] to-[#8B5CF6]/5 dark:from-[#8B5CF6]/20 dark:via-[#141B24] dark:to-[#0A0E13] border border-[#8B5CF6]/20 dark:border-[#8B5CF6]/30 hover:border-[#8B5CF6]/60 flex items-center justify-between text-left group transition-all shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center">
                <BellRing className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-white group-hover:text-[#8B5CF6] transition-colors">
                    Price Alerts Center
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#8B5CF6]/20 text-[#8B5CF6]">
                    {activeAlertsCount > 0 ? `${activeAlertsCount} ACTIVE` : 'MANAGE'}
                  </span>
                </div>
                <p className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">Configure real-time target price triggers</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B] dark:text-[#8E98A6] group-hover:text-[#8B5CF6] transition-colors" />
          </button>
        )}

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mb-3">
          {(['all', 'unread', 'trading', 'system'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === cat
                  ? 'bg-[#8B5CF6] text-white'
                  : 'bg-[#F8FAFC] dark:bg-[#141B24] text-[#64748B] dark:text-[#8E98A6] hover:text-[#0F172A] dark:hover:text-white border border-[#D7E0EB] dark:border-[#242E3B]'
              }`}
            >
              {cat === 'unread' ? `Unread (${unreadCount})` : cat}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-0.5">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-[#64748B] dark:text-[#8E98A6] text-xs">
              <Bell className="w-6 h-6 mx-auto mb-2 text-[#64748B] dark:text-[#8E98A6] opacity-50" />
              <p>No notifications in this category</p>
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && onMarkAsRead?.(n.id)}
                className={`p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                  !n.read
                    ? 'bg-[#F8FAFC] dark:bg-[#141B24] border-[#8B5CF6]/40 hover:border-[#8B5CF6] shadow-xs'
                    : 'bg-white dark:bg-[#0A0E13] border-[#D7E0EB] dark:border-[#242E3B] opacity-75'
                }`}
              >
                <div className="relative p-2 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex-shrink-0 mt-0.5">
                  {n.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  ) : n.type === 'security' ? (
                    <ShieldAlert className="w-4 h-4 text-[#F59E0B]" />
                  ) : n.type === 'alert' ? (
                    <BellRing className="w-4 h-4 text-[#8B5CF6]" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-[#EC4899]" />
                  )}
                  {!n.read && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#8B5CF6] border-2 border-white dark:border-[#0E141B]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-semibold text-xs text-[#0F172A] dark:text-white">{n.title}</h4>
                      {!n.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                      )}
                    </div>
                    <span className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#8E98A6] leading-snug">{n.desc}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
