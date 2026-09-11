import React, { useState } from 'react';
import {
  TrendingUp,
  Bot,
  Coins,
  Sparkles,
  Rocket,
  Gift,
  CreditCard,
  Globe,
  Code2,
  Smartphone,
  ArrowLeft,
  Check,
  Bell,
  ArrowRight,
  Compass,
  Search,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { ThemeMode } from '../../types';

interface ExploreScreenProps {
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  onSelectPairForTrade?: (symbol: string) => void;
  onOpenConvert?: () => void;
  onOpenAiTrader?: () => void;
  onOpenPolymarket?: () => void;
  onBack?: () => void;
}

interface UpcomingFeature {
  id: string;
  name: string;
  category: 'trade_earn' | 'payments_spending' | 'build_access';
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  description: string;
  badge: string;
  estimatedArrival?: string;
}

const UPCOMING_FEATURES: UpcomingFeature[] = [
  // Trade & earn more
  {
    id: 'margin_trading',
    name: 'Margin Trading',
    category: 'trade_earn',
    icon: TrendingUp,
    iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    description: 'Trade with up to 100x leverage on top crypto assets with deep liquidity.',
    badge: 'Coming soon',
    estimatedArrival: 'Q3 2026',
  },
  {
    id: 'ai_trading_agent',
    name: 'AI Trading Agent',
    category: 'trade_earn',
    icon: Bot,
    iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    description:
      'The trade bot scans the market around the clock and surfaces long and short opportunities with entry, target, stop and a confidence score.',
    badge: 'Coming soon',
    estimatedArrival: 'Beta Access Soon',
  },
  {
    id: 'staking_pools',
    name: 'Staking Pools',
    category: 'trade_earn',
    icon: Coins,
    iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    description: 'Earn passive income by delegating your tokens to secure proof-of-stake networks.',
    badge: 'Coming soon',
    estimatedArrival: 'High APY Vaults',
  },
  {
    id: 'prediction_markets',
    name: 'Prediction Markets',
    category: 'trade_earn',
    icon: Sparkles,
    iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    description:
      'Browse live prediction markets across Polymarket and other protocols, filter by category, and track volume, liquidity and probability in real time.',
    badge: 'Coming soon',
    estimatedArrival: 'Oracle Integrated',
  },
  {
    id: 'launchpad',
    name: 'Launchpad',
    category: 'trade_earn',
    icon: Rocket,
    iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    description: 'List and launch new or existing tokens with a straightforward path to market.',
    badge: 'Coming soon',
    estimatedArrival: 'Fair Launch Model',
  },

  // Payments & spending
  {
    id: 'gift_card_marketplace',
    name: 'Gift Card Marketplace',
    category: 'payments_spending',
    icon: Gift,
    iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    description: 'Buy and sell gift cards securely within the platform, with the same protections as any other trade.',
    badge: 'Coming soon',
    estimatedArrival: 'Over 500 Brands',
  },
  {
    id: 'crypto_cards',
    name: 'Crypto Cards',
    category: 'payments_spending',
    icon: CreditCard,
    iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    description: 'A modern way to spend digital assets in everyday transactions, wherever cards are accepted.',
    badge: 'Coming soon',
    estimatedArrival: 'Virtual & Metal Physical',
  },
  {
    id: 'borderless_payments',
    name: 'Borderless Payments',
    category: 'payments_spending',
    icon: Globe,
    iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    description: "Send and receive payments globally, with speed and security, wherever you're sending from or to.",
    badge: 'Coming soon',
    estimatedArrival: 'Zero FX Margin',
  },

  // Build & access
  {
    id: 'developer_api',
    name: 'Developer API',
    category: 'build_access',
    icon: Code2,
    iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    description: 'Build on top of the ecosystem — integrate trading, wallets, and rates directly into your own products.',
    badge: 'Coming soon',
    estimatedArrival: 'REST, WS & FIX',
  },
  {
    id: 'pro_mobile_app',
    name: 'Pro Mobile App',
    category: 'build_access',
    icon: Smartphone,
    iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    description: 'A native application for iOS and Android featuring advanced charting and order types.',
    badge: 'Coming soon',
    estimatedArrival: 'TestFlight & Play Store',
  },
];

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  theme = 'dark',
  onToggleTheme,
  onBack,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'trade_earn' | 'payments_spending' | 'build_access'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [notifiedFeatures, setNotifiedFeatures] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('oknexus_notified_features');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const toggleNotify = (id: string, name: string) => {
    setNotifiedFeatures((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem('oknexus_notified_features', JSON.stringify(next));

      if (!prev[id]) {
        setNotificationToast(`You're on the early access list for ${name}! We'll alert you as soon as it goes live.`);
      } else {
        setNotificationToast(`Notifications paused for ${name}.`);
      }

      setTimeout(() => {
        setNotificationToast(null);
      }, 3500);

      return next;
    });
  };

  const sections = [
    {
      category: 'trade_earn' as const,
      title: 'Trade & earn more',
      subtitle: 'New ways to find opportunity and put your assets to work.',
    },
    {
      category: 'payments_spending' as const,
      title: 'Payments & spending',
      subtitle: 'Move and spend digital assets as easily as everyday money.',
    },
    {
      category: 'build_access' as const,
      title: 'Build & access',
      subtitle: 'Take OKNexus with you and build on top of the ecosystem.',
    },
  ];

  const filteredFeatures = UPCOMING_FEATURES.filter((f) => {
    const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="explore-screen" className="min-h-[calc(100vh-4rem)] pb-24 px-4 sm:px-6 max-w-6xl mx-auto pt-3">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors"
                aria-label="Go Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Explore</h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  A look at what's next for OKNexus. These features are in active development.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Notification Toast */}
        {notificationToast && (
          <div className="mt-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-transparent border border-purple-300 dark:border-purple-500/30 text-purple-800 dark:text-purple-200 text-xs font-semibold flex items-center gap-2.5 shadow-xs animate-in fade-in slide-in-from-top-1">
            <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>{notificationToast}</span>
          </div>
        )}

        {/* Search & Category Filter */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search upcoming features or capabilities..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-[#0E121E] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#0E121E] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.08] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Features
            </button>
            <button
              onClick={() => setActiveCategory('trade_earn')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === 'trade_earn'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#0E121E] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.08] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Trade & Earn
            </button>
            <button
              onClick={() => setActiveCategory('payments_spending')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === 'payments_spending'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#0E121E] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.08] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Payments & Spending
            </button>
            <button
              onClick={() => setActiveCategory('build_access')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === 'build_access'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#0E121E] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.08] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Build & Access
            </button>
          </div>
        </div>
      </div>

      {/* Sections Content */}
      <div className="space-y-8">
        {sections.map((sec) => {
          const secFeatures = filteredFeatures.filter((f) => f.category === sec.category);
          if (secFeatures.length === 0) return null;

          return (
            <section key={sec.category} id={`explore-section-${sec.category}`}>
              <div className="mb-3.5">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{sec.title}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{sec.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {secFeatures.map((feat) => {
                  const Icon = feat.icon;
                  const isNotified = !!notifiedFeatures[feat.id];

                  return (
                    <div
                      key={feat.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#0D101C] border border-slate-200/80 dark:border-white/[0.07] hover:border-purple-300 dark:hover:border-purple-500/40 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${feat.iconBg}`}
                          >
                            <Icon className={`w-5 h-5 ${feat.iconColor}`} />
                          </div>

                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30">
                            {feat.badge}
                          </span>
                        </div>

                        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                          {feat.name}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed min-h-[3rem]">
                          {feat.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between">
                        {feat.estimatedArrival && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            {feat.estimatedArrival}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => toggleNotify(feat.id, feat.name)}
                          className={`ml-auto px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isNotified
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
                              : 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-transparent'
                          }`}
                        >
                          {isNotified ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Subscribed</span>
                            </>
                          ) : (
                            <>
                              <span>Notify me</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
