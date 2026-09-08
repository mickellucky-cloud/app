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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#0F1320] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom animate-slideUp text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-4 h-4 text-purple-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
              )}
            </div>
            <h3 className="font-bold text-base text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-num font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && onMarkAllAsRead && (
              <button
                id="notifications-mark-all-read-btn"
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all"
                title="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white" aria-label="Close notifications">
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
            className="w-full mb-3 p-3 rounded-2xl bg-gradient-to-r from-purple-900/30 via-[#18122B] to-[#121626] border border-purple-500/30 hover:border-purple-500/60 flex items-center justify-between text-left group transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <BellRing className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                    Price Alerts Center
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-200">
                    {activeAlertsCount > 0 ? `${activeAlertsCount} ACTIVE` : 'MANAGE'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Configure real-time target price triggers</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
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
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'unread' ? `Unread (${unreadCount})` : cat}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-0.5">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Bell className="w-6 h-6 mx-auto mb-2 text-slate-500 opacity-50" />
              <p>No notifications in this category</p>
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && onMarkAsRead?.(n.id)}
                className={`p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                  !n.read
                    ? 'bg-[#121626] border-purple-500/30 hover:border-purple-500/50 shadow-[0_2px_12px_rgba(168,85,247,0.08)]'
                    : 'bg-[#090C14] border-white/[0.06] hover:border-white/10 opacity-75'
                }`}
              >
                <div className="relative p-2 rounded-xl bg-purple-500/10 text-purple-400 flex-shrink-0 mt-0.5">
                  {n.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : n.type === 'security' ? (
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                  ) : n.type === 'alert' ? (
                    <BellRing className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-fuchsia-400" />
                  )}
                  {!n.read && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-500 border border-[#0F1320] shadow-[0_0_6px_rgba(168,85,247,0.9)]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-semibold text-xs text-white">{n.title}</h4>
                      {!n.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{n.desc}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
