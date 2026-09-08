import React, { useState } from 'react';
import {
  X,
  Users2,
  Building2,
  LineChart,
  Gift,
  Share2,
  Key,
  Compass,
  BellRing,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Zap,
  Sparkles,
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
  onOpenSettings: () => void;
  onOpenSupport: () => void;
  onSignOut: () => void;
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
  onOpenSupport,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'trade' | 'tools' | 'growth'>('all');

  if (!isOpen) return null;

  const services = [
    // Trade & Desks
    {
      id: 'p2p',
      title: 'P2P Trading',
      subtitle: 'Zero fee direct peer-to-peer desk',
      icon: Users2,
      category: 'trade',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/40 border-emerald-500/30',
      action: () => {
        onClose();
        onNavigateP2P();
      },
    },
    {
      id: 'otc',
      title: 'OTC Block Trading',
      subtitle: 'Institutional size execution ($25k+)',
      icon: Building2,
      category: 'trade',
      color: 'text-purple-400',
      bgColor: 'bg-purple-950/40 border-purple-500/30',
      action: () => {
        onClose();
        onOpenOTC();
      },
    },
    // Tools & Analytics
    {
      id: 'alerts',
      title: 'Price Alerts',
      subtitle: 'Target price triggers & push notices',
      icon: BellRing,
      category: 'tools',
      color: 'text-fuchsia-400',
      bgColor: 'bg-fuchsia-950/40 border-fuchsia-500/30',
      badge: 'PRO',
      action: () => {
        onClose();
        onOpenPriceAlerts();
      },
    },
    {
      id: 'api',
      title: 'API Management',
      subtitle: 'REST & WebSocket trading bot keys',
      icon: Key,
      category: 'tools',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/40 border-cyan-500/30',
      action: () => {
        onClose();
        onOpenApiManagement();
      },
    },
    {
      id: 'explore',
      title: 'Web3 Ecosystem',
      subtitle: 'Explore DeFi vaults & dApps',
      icon: Compass,
      category: 'tools',
      color: 'text-blue-400',
      bgColor: 'bg-blue-950/40 border-blue-500/30',
      action: () => {
        onClose();
        onOpenSettings(); // opens Web3 Explorer & Settings
      },
    },
    // Rewards & Growth
    {
      id: 'rewards',
      title: 'Rewards Hub',
      subtitle: 'Mystery boxes & daily trading tasks',
      icon: Gift,
      category: 'growth',
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/40 border-amber-500/30',
      badge: 'FREE',
      action: () => {
        onClose();
        onOpenRewards();
      },
    },
    {
      id: 'referrals',
      title: 'Referral Program',
      subtitle: 'Earn 40% lifetime trading rebates',
      icon: Share2,
      category: 'growth',
      color: 'text-rose-400',
      bgColor: 'bg-rose-950/40 border-rose-500/30',
      action: () => {
        onClose();
        onOpenReferrals();
      },
    },
    // System & Support
    {
      id: 'settings',
      title: 'Exchange Settings',
      subtitle: 'Preferences, 2FA, biometric auth',
      icon: Settings,
      category: 'tools',
      color: 'text-slate-300',
      bgColor: 'bg-slate-900/60 border-white/10',
      action: () => {
        onClose();
        onOpenSettings();
      },
    },
    {
      id: 'support',
      title: '24/7 AI Customer Support',
      subtitle: 'Gemini 3.8 AI & VIP Human Specialist',
      icon: Sparkles,
      category: 'tools',
      color: 'text-purple-300',
      bgColor: 'bg-purple-950/50 border-purple-500/40',
      action: () => {
        onClose();
        onOpenSupport();
      },
    },
  ];

  const filtered = services.filter((s) => activeTab === 'all' || s.category === activeTab);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#0E121E] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom text-slate-100 max-h-[88vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2.5">
            <OKNexusLogo size={28} />
            <div>
              <h3 className="font-bold text-base text-white">More Services</h3>
              <p className="text-[11px] text-slate-400">All OKNexus exchange capabilities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-3 border-b border-white/[0.05]">
          {(['all', 'trade', 'tools', 'growth'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                activeTab === cat
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {cat === 'all' ? 'All Services' : cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="space-y-2 mb-4">
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#080B14] border border-white/[0.06] hover:border-purple-500/40 hover:bg-[#111526] active:scale-[0.99] transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 shadow-sm ${item.bgColor}`}
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white group-hover:text-purple-300 transition-colors">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/30 text-purple-300 border border-purple-500/30">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{item.subtitle}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>
            );
          })}
        </div>

        {/* Sign Out Option */}
        <div className="pt-3 border-t border-white/[0.08]">
          <button
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="w-full py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of OKNexus</span>
          </button>
        </div>
      </div>
    </div>
  );
};
