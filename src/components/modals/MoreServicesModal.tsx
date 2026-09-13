import React, { useState } from 'react';
import {
  X,
  Share2,
  Gift,
  ShieldCheck,
  CreditCard,
  Headphones,
  Key,
  Ticket,
  Receipt,
  Landmark,
  LineChart,
  Compass,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Settings,
} from 'lucide-react';
import { OKNexusLogo } from '../common/OKNexusLogo';

interface MoreServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateP2P: () => void;
  onOpenOTC: () => void;
  onOpenRewards: () => void;
  onOpenReferrals: () => void;
  onOpenApiManagement: () => void;
  onOpenPriceAlerts: () => void;
  onOpenSettings: (tab?: any) => void;
  onOpenProfile?: (section?: string) => void;
  onOpenSupport: () => void;
  onNavigateExplore?: () => void;
  onNavigateAnalytics?: () => void;
}

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'Active' | 'Coming soon';
  category: 'active' | 'upcoming';
  iconColor: string;
  iconBg: string;
  action: () => void;
}

export const MoreServicesModal: React.FC<MoreServicesModalProps> = ({
  isOpen,
  onClose,
  onNavigateP2P,
  onOpenOTC,
  onOpenRewards,
  onOpenReferrals,
  onOpenApiManagement,
  onOpenPriceAlerts,
  onOpenSettings,
  onOpenProfile,
  onOpenSupport,
  onNavigateExplore,
  onNavigateAnalytics,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming'>('all');
  const [comingSoonToast, setComingSoonToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleComingSoonClick = (featureName: string) => {
    setComingSoonToast(`${featureName} is in active development. You will receive an alert upon launch!`);
    setTimeout(() => {
      setComingSoonToast(null);
    }, 3200);
  };

  const services: ServiceItem[] = [
    {
      id: 'analytics',
      title: 'Portfolio Analytics',
      subtitle: 'Real-time P&L performance, win-rate metrics, strategy breakdown & trade history.',
      icon: LineChart,
      status: 'Active',
      category: 'active',
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
      action: () => {
        onClose();
        if (onNavigateAnalytics) {
          onNavigateAnalytics();
        }
      },
    },
    {
      id: 'affiliates',
      title: 'Affiliates & Referrals',
      subtitle: "Share your referral link and earn a share of your friends' trading fees.",
      icon: Share2,
      status: 'Active',
      category: 'active',
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
      action: () => {
        onClose();
        onOpenReferrals();
      },
    },
    {
      id: 'rewards',
      title: 'Rewards Hub',
      subtitle: 'Bonuses, campaigns, and task-based rewards for active users.',
      icon: Gift,
      status: 'Active',
      category: 'active',
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
      action: () => {
        onClose();
        onOpenRewards();
      },
    },
    {
      id: 'system_settings',
      title: 'System Settings',
      subtitle: 'Light/Dark themes, orderbook frequency & advanced controls.',
      icon: Settings,
      status: 'Active',
      category: 'active',
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
      action: () => {
        onClose();
        onOpenSettings('preferences');
      },
    },
    {
      id: 'verification',
      title: 'Verification & Limits',
      subtitle: 'Check your KYC level and unlock higher deposit, withdrawal, and P2P limits.',
      icon: ShieldCheck,
      status: 'Active',
      category: 'active',
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
      action: () => {
        onClose();
        if (onOpenProfile) {
          onOpenProfile('kyc');
        } else {
          onOpenSettings('account');
        }
      },
    },
    {
      id: 'payment_methods',
      title: 'Payment Methods',
      subtitle: 'Manage saved bank accounts, cards, and mobile money for fiat and P2P.',
      icon: CreditCard,
      status: 'Active',
      category: 'active',
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
      action: () => {
        onClose();
        onOpenSettings('payments');
      },
    },
    {
      id: 'support',
      title: 'Help Center & Support',
      subtitle: 'Browse FAQs or submit a ticket to our support team.',
      icon: Headphones,
      status: 'Active',
      category: 'active',
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
      action: () => {
        onClose();
        onOpenSupport();
      },
    },
    {
      id: 'api',
      title: 'API Management',
      subtitle: 'Create and manage API keys for automated trading and portfolio tools.',
      icon: Key,
      status: 'Active',
      category: 'active',
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
      action: () => {
        onClose();
        onOpenApiManagement();
      },
    },
    {
      id: 'gift_cards',
      title: 'Gift Cards',
      subtitle: 'Buy and redeem crypto gift cards for friends and family.',
      icon: Ticket,
      status: 'Coming soon',
      category: 'upcoming',
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
      action: () => handleComingSoonClick('Gift Cards'),
    },
    {
      id: 'bills',
      title: 'Bills Payment',
      subtitle: 'Pay for airtime, data, electricity, and more directly with crypto.',
      icon: Receipt,
      status: 'Coming soon',
      category: 'upcoming',
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
      action: () => handleComingSoonClick('Bills Payment'),
    },
    {
      id: 'institutional',
      title: 'Institutional Services',
      subtitle: 'Dedicated infrastructure, credit lines, and support for institutions.',
      icon: Landmark,
      status: 'Coming soon',
      category: 'upcoming',
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
      action: () => handleComingSoonClick('Institutional Services'),
    },
  ];

  const filtered = services.filter((s) => {
    if (filter === 'all') return true;
    return s.category === filter;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-[#0E141B] border-t sm:border border-[#D7E0EB] dark:border-[#242E3B] rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom text-[#0F172A] dark:text-[#EDF1F5] max-h-[88vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D7E0EB] dark:border-[#242E3B] mb-3">
          <div className="flex items-center gap-2.5">
            <OKNexusLogo size={28} />
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">More</h3>
              <p className="text-[11px] text-[#64748B] dark:text-[#8E98A6]">Additional OKNexus services.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#141B24] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Coming soon feedback notification */}
        {comingSoonToast && (
          <div className="mb-3 px-3.5 py-2.5 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <Sparkles className="w-4 h-4 text-[#8B5CF6] shrink-0" />
            <span>{comingSoonToast}</span>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-1.5 pb-2.5 mb-3 border-b border-[#D7E0EB] dark:border-[#242E3B]">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filter === 'all'
                  ? 'bg-[#8B5CF6] text-white shadow-xs'
                  : 'bg-[#F8FAFC] dark:bg-[#141B24] text-[#64748B] dark:text-[#8E98A6] hover:text-[#0F172A] dark:hover:text-white border border-[#D7E0EB] dark:border-[#242E3B]'
              }`}
            >
              All ({services.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                filter === 'active'
                  ? 'bg-[#10B981] text-white shadow-xs'
                  : 'bg-[#F8FAFC] dark:bg-[#141B24] text-[#64748B] dark:text-[#8E98A6] hover:text-[#0F172A] dark:hover:text-white border border-[#D7E0EB] dark:border-[#242E3B]'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Active (7)</span>
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                filter === 'upcoming'
                  ? 'bg-[#8B5CF6] text-white shadow-xs'
                  : 'bg-[#F8FAFC] dark:bg-[#141B24] text-[#64748B] dark:text-[#8E98A6] hover:text-[#0F172A] dark:hover:text-white border border-[#D7E0EB] dark:border-[#242E3B]'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Coming soon (3)</span>
            </button>
          </div>

          {onNavigateExplore && (
            <button
              onClick={() => {
                onClose();
                onNavigateExplore();
              }}
              className="text-xs font-bold text-[#8B5CF6] hover:underline flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Roadmap</span>
            </button>
          )}
        </div>

        {/* Services List */}
        <div className="space-y-2 mb-4 overflow-y-auto pr-0.5">
          {filtered.map((item) => {
            const Icon = item.icon;
            const isActive = item.status === 'Active';

            return (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] hover:border-[#8B5CF6]/50 hover:bg-slate-100/70 dark:hover:bg-[#1A222F] active:scale-[0.99] transition-all group text-left shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                  <div
                    className="w-10 h-10 rounded-xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                  >
                    <Icon className="w-5 h-5 text-[#8B5CF6]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-[#0F172A] dark:text-white group-hover:text-[#8B5CF6] transition-colors">
                        {item.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${
                          isActive
                            ? 'bg-emerald-50 text-[#10B981] border-emerald-200 dark:bg-emerald-500/15 dark:border-emerald-500/30'
                            : 'bg-purple-50 text-[#8B5CF6] border-purple-200 dark:bg-purple-500/15 dark:border-purple-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] dark:text-[#8E98A6] mt-0.5 leading-snug line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-[#64748B] dark:text-[#8E98A6] group-hover:text-[#8B5CF6] group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
