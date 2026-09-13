import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowLeft,
  ArrowUpRight,
  TrendingUp,
  Bot,
  Sparkles,
  LineChart,
  Gift,
  Share2,
  Key,
  BellRing,
  ShieldCheck,
  UserCheck,
  Settings,
  Headphones,
  Compass,
  ArrowLeftRight,
  CreditCard,
  QrCode,
  Download,
  Upload,
  Send,
  Coins,
  Building2,
  Sliders,
  CheckCircle2,
  ChevronRight,
  LayoutGrid,
} from 'lucide-react';
import { ThemeMode } from '../../types';

export interface MoreServicesScreenProps {
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  onBack?: () => void;
  onNavigateMarkets: () => void;
  onNavigateTrade: () => void;
  onNavigateEarn: () => void;
  onNavigateAssets: () => void;
  onNavigateP2P: () => void;
  onNavigateExplore?: () => void;
  onNavigateAnalytics?: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenSend: () => void;
  onOpenConvert: () => void;
  onOpenScanToPay: () => void;
  onOpenAiTrader: () => void;
  onOpenPolymarket: () => void;
  onOpenOTC: () => void;
  onOpenRewards: () => void;
  onOpenReferrals: () => void;
  onOpenApiManagement: () => void;
  onOpenPriceAlerts: () => void;
  onOpenProfile: (section?: string) => void;
  onOpenSettings: (tab?: any) => void;
  onOpenSupport: () => void;
  isLoading?: boolean;
}

interface ServiceCardItem {
  id: string;
  title: string;
  category: 'trading' | 'finance' | 'wallets' | 'security' | 'ecosystem';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  badge?: string;
  badgeType?: 'hot' | 'active' | 'free' | 'vip' | 'default';
  action: () => void;
}

export const MoreServicesScreen: React.FC<MoreServicesScreenProps> = ({
  theme = 'dark',
  onToggleTheme,
  onBack,
  onNavigateMarkets,
  onNavigateTrade,
  onNavigateEarn,
  onNavigateAssets,
  onNavigateP2P,
  onNavigateExplore,
  onNavigateAnalytics,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenSend,
  onOpenConvert,
  onOpenScanToPay,
  onOpenAiTrader,
  onOpenPolymarket,
  onOpenOTC,
  onOpenRewards,
  onOpenReferrals,
  onOpenApiManagement,
  onOpenPriceAlerts,
  onOpenProfile,
  onOpenSettings,
  onOpenSupport,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Comprehensive list of OKNexus services & tools
  const services: ServiceCardItem[] = useMemo(
    () => [
      // TRADING & MARKETS
      {
        id: 'spot-trading',
        title: 'Spot Exchange',
        category: 'trading',
        description: 'Trade top cryptocurrencies with ultra-low latency, real-time depth, and customizable chart tools.',
        icon: ArrowLeftRight,
        iconColor: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
        badge: 'ACTIVE',
        badgeType: 'active',
        action: onNavigateTrade,
      },
      {
        id: 'p2p-trading',
        title: 'P2P Escrow Market',
        category: 'trading',
        description: 'Zero-fee peer-to-peer fiat gateway with verified local bank transfers, Chipper Cash, and escrow safety.',
        icon: TrendingUp,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-500/30',
        badge: '0% FEES',
        badgeType: 'free',
        action: onNavigateP2P,
      },
      {
        id: 'ai-trader',
        title: 'AI Trading Auto-Pilot',
        category: 'trading',
        description: 'Algorithmic grid execution, automated DCA bots, and real-time smart sentiment analysis.',
        icon: Bot,
        iconColor: 'text-cyan-600 dark:text-cyan-400',
        iconBg: 'bg-cyan-100 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-500/30',
        badge: 'AI BOT',
        badgeType: 'hot',
        action: onOpenAiTrader,
      },
      {
        id: 'prediction-markets',
        title: 'Prediction Markets',
        category: 'trading',
        description: 'Trade decentralized prediction contracts on crypto price milestones, global elections, and macro events.',
        icon: Sparkles,
        iconColor: 'text-pink-600 dark:text-pink-400',
        iconBg: 'bg-pink-100 dark:bg-pink-950/60 border-pink-200 dark:border-pink-500/30',
        badge: 'HOT',
        badgeType: 'hot',
        action: onOpenPolymarket,
      },
      {
        id: 'otc-desk',
        title: 'OTC Institutional Desk',
        category: 'trading',
        description: 'Custom block execution with zero slippage, personalized quotes, and private settlement for high-volume orders.',
        icon: Building2,
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-100 dark:bg-blue-950/60 border-blue-200 dark:border-blue-500/30',
        badge: 'VIP DESK',
        badgeType: 'vip',
        action: onOpenOTC,
      },
      {
        id: 'quick-convert',
        title: 'Instant Convert & Swap',
        category: 'trading',
        description: 'One-click crypto swaps with zero gas fees and instant settlement into your spot portfolio balance.',
        icon: Sliders,
        iconColor: 'text-violet-600 dark:text-violet-400',
        iconBg: 'bg-violet-100 dark:bg-violet-950/60 border-violet-200 dark:border-violet-500/30',
        badge: 'ZERO FEE',
        badgeType: 'free',
        action: onOpenConvert,
      },
      {
        id: 'price-alerts',
        title: 'Price Alerts & Triggers',
        category: 'trading',
        description: 'Set custom threshold triggers with in-app sound and push alerts across any supported crypto pair.',
        icon: BellRing,
        iconColor: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-amber-100 dark:bg-amber-950/60 border-amber-200 dark:border-amber-500/30',
        action: onOpenPriceAlerts,
      },

      // FINANCE & EARN
      {
        id: 'earn-vaults',
        title: 'OKNexus Earn & Staking',
        category: 'finance',
        description: 'Earn high-yield passive returns on USDT, BTC, ETH, and SOL with flexible and locked deposit terms.',
        icon: Coins,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-500/30',
        badge: 'UP TO 18.5%',
        badgeType: 'hot',
        action: onNavigateEarn,
      },
      {
        id: 'portfolio-analytics',
        title: 'Portfolio Analytics',
        category: 'finance',
        description: 'Real-time P&L performance, win-rate metrics, strategy breakdown, and complete trade ledger journal.',
        icon: LineChart,
        iconColor: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
        badge: 'ANALYTICS',
        badgeType: 'active',
        action: () => {
          if (onNavigateAnalytics) onNavigateAnalytics();
          else onNavigateAssets();
        },
      },
      {
        id: 'rewards-hub',
        title: 'Rewards & Task Center',
        category: 'finance',
        description: 'Complete daily check-ins, unlock volume milestone rewards, and spin VIP mystery gift boxes.',
        icon: Gift,
        iconColor: 'text-pink-600 dark:text-pink-400',
        iconBg: 'bg-pink-100 dark:bg-pink-950/60 border-pink-200 dark:border-pink-500/30',
        badge: 'MYSTERY BOX',
        badgeType: 'hot',
        action: onOpenRewards,
      },
      {
        id: 'referrals-affiliate',
        title: 'Affiliates & Referrals',
        category: 'finance',
        description: 'Invite friends and partners to earn up to 40% lifetime trading fee commissions and cash rebates.',
        icon: Share2,
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        iconBg: 'bg-indigo-100 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-500/30',
        badge: '40% REBATE',
        badgeType: 'free',
        action: onOpenReferrals,
      },

      // WALLET & TRANSFERS
      {
        id: 'deposit-crypto',
        title: 'Deposit Crypto',
        category: 'wallets',
        description: 'Generate on-chain multi-network addresses and scan QR codes for fast crypto deposits.',
        icon: Download,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-500/30',
        action: onOpenDeposit,
      },
      {
        id: 'withdraw-crypto',
        title: 'Withdraw Assets',
        category: 'wallets',
        description: 'Fast, secure on-chain withdrawals with multi-chain network selection and address book whitelisting.',
        icon: Upload,
        iconColor: 'text-rose-600 dark:text-rose-400',
        iconBg: 'bg-rose-100 dark:bg-rose-950/60 border-rose-200 dark:border-rose-500/30',
        action: onOpenWithdraw,
      },
      {
        id: 'send-transfer',
        title: 'Send & Internal Transfer',
        category: 'wallets',
        description: 'Instant zero-fee off-chain transfers to any other OKNexus trader using email, phone, or UID.',
        icon: Send,
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-100 dark:bg-blue-950/60 border-blue-200 dark:border-blue-500/30',
        badge: 'ZERO FEE',
        badgeType: 'free',
        action: onOpenSend,
      },
      {
        id: 'scan-to-pay',
        title: 'Scan to Pay & Invoicing',
        category: 'wallets',
        description: 'Camera QR code reader for instant point-of-sale merchant checkouts and crypto bill settlements.',
        icon: QrCode,
        iconColor: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
        action: onOpenScanToPay,
      },

      // SECURITY & SYSTEM
      {
        id: 'security-center',
        title: 'Security Center',
        category: 'security',
        description: 'Configure Two-Factor Authentication (2FA), anti-phishing codes, biometric passkeys, and login alerts.',
        icon: ShieldCheck,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-500/30',
        badge: 'HARDENED',
        badgeType: 'active',
        action: () => onOpenSettings('security'),
      },
      {
        id: 'identity-kyc',
        title: 'Identity Verification (KYC)',
        category: 'security',
        description: 'Manage verification tier, government ID records, and unlock unlimited P2P fiat limits.',
        icon: UserCheck,
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-100 dark:bg-blue-950/60 border-blue-200 dark:border-blue-500/30',
        badge: 'TIER 3',
        badgeType: 'active',
        action: () => onOpenProfile('kyc'),
      },
      {
        id: 'api-management',
        title: 'API Credentials & Webhooks',
        category: 'security',
        description: 'Generate secure REST and WebSocket API keys with IP whitelisting for high-frequency trading.',
        icon: Key,
        iconColor: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-amber-100 dark:bg-amber-950/60 border-amber-200 dark:border-amber-500/30',
        action: onOpenApiManagement,
      },
      {
        id: 'system-settings',
        title: 'System Preferences',
        category: 'security',
        description: 'Customize settlement currency, interface language, display density, and notification channels.',
        icon: Settings,
        iconColor: 'text-slate-600 dark:text-slate-400',
        iconBg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
        action: () => onOpenSettings('account'),
      },

      // ECOSYSTEM & SUPPORT
      {
        id: 'vip-support',
        title: 'VIP 24/7 Concierge Support',
        category: 'ecosystem',
        description: 'Connect directly with live senior arbitrage support and trade desk concierges anytime.',
        icon: Headphones,
        iconColor: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30',
        badge: '24/7 LIVE',
        badgeType: 'vip',
        action: onOpenSupport,
      },
      {
        id: 'explore-web3',
        title: 'Explore Web3 & Ecosystem',
        category: 'ecosystem',
        description: 'Discover curated decentralized protocols, upcoming layer-2 networks, and emerging tokens.',
        icon: Compass,
        iconColor: 'text-cyan-600 dark:text-cyan-400',
        iconBg: 'bg-cyan-100 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-500/30',
        action: () => {
          if (onNavigateExplore) onNavigateExplore();
          else onNavigateMarkets();
        },
      },
    ],
    [
      onNavigateTrade,
      onNavigateP2P,
      onOpenAiTrader,
      onOpenPolymarket,
      onOpenOTC,
      onOpenConvert,
      onOpenPriceAlerts,
      onNavigateEarn,
      onNavigateAnalytics,
      onNavigateAssets,
      onOpenRewards,
      onOpenReferrals,
      onOpenDeposit,
      onOpenWithdraw,
      onOpenSend,
      onOpenScanToPay,
      onOpenSettings,
      onOpenProfile,
      onOpenApiManagement,
      onOpenSupport,
      onNavigateExplore,
      onNavigateMarkets,
    ]
  );

  // Filter categories
  const categories = [
    { id: 'all', label: 'All Services', count: services.length },
    { id: 'trading', label: 'Trading & Desks', count: services.filter((s) => s.category === 'trading').length },
    { id: 'finance', label: 'Earn & Finance', count: services.filter((s) => s.category === 'finance').length },
    { id: 'wallets', label: 'Wallets & Transfers', count: services.filter((s) => s.category === 'wallets').length },
    { id: 'security', label: 'Security & System', count: services.filter((s) => s.category === 'security').length },
    { id: 'ecosystem', label: 'Ecosystem & Support', count: services.filter((s) => s.category === 'ecosystem').length },
  ];

  // Filtered list based on search and category
  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategory, searchQuery]);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id="more-services-page" className="w-full min-h-screen pb-24 md:pb-12 animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* Desktop Breadcrumb & Title Section */}
        <div className="hidden md:flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  All Services & Tools
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                Explore the complete ecosystem of OKNexus exchange capabilities, trading desks, high-yield vaults, and platform tools.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              {services.length} Tools Available
            </span>
          </div>
        </div>

        {/* Featured Highlights Bento Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Highlight 1: P2P */}
          <button
            type="button"
            onClick={onNavigateP2P}
            className="p-4 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/[0.02] to-transparent dark:from-emerald-950/30 dark:to-transparent border border-emerald-500/20 hover:border-emerald-500/40 text-left transition-all group relative overflow-hidden shadow-2xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
                0% FEES • ESCROW
              </span>
              <ArrowUpRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              P2P Escrow Market
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
              Buy & sell crypto with verified local bank accounts and Chipper Cash.
            </p>
          </button>

          {/* Highlight 2: AI Bot */}
          <button
            type="button"
            onClick={onOpenAiTrader}
            className="p-4 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-cyan-500/[0.02] to-transparent dark:from-cyan-950/30 dark:to-transparent border border-cyan-500/20 hover:border-cyan-500/40 text-left transition-all group relative overflow-hidden shadow-2xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/25">
                SMART EXECUTION
              </span>
              <ArrowUpRight className="w-4 h-4 text-cyan-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              AI Trading Auto-Pilot
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
              24/7 algorithmic strategy scanner, automated DCA, and grid bots.
            </p>
          </button>

          {/* Highlight 3: Earn */}
          <button
            type="button"
            onClick={onNavigateEarn}
            className="p-4 rounded-3xl bg-gradient-to-br from-purple-500/10 via-purple-500/[0.02] to-transparent dark:from-purple-950/30 dark:to-transparent border border-purple-500/20 hover:border-purple-500/40 text-left transition-all group relative overflow-hidden shadow-2xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/25">
                UP TO 18.5% APY
              </span>
              <ArrowUpRight className="w-4 h-4 text-purple-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              OKNexus Staking & Yield
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
              Compound daily interest on USDT, Bitcoin, Ethereum, and Solana.
            </p>
          </button>

          {/* Highlight 4: Analytics */}
          <button
            type="button"
            onClick={() => {
              if (onNavigateAnalytics) onNavigateAnalytics();
              else onNavigateAssets();
            }}
            className="p-4 rounded-3xl bg-gradient-to-br from-pink-500/10 via-pink-500/[0.02] to-transparent dark:from-pink-950/30 dark:to-transparent border border-pink-500/20 hover:border-pink-500/40 text-left transition-all group relative overflow-hidden shadow-2xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-700 dark:text-pink-400 border border-pink-500/25">
                REAL-TIME P&L
              </span>
              <ArrowUpRight className="w-4 h-4 text-pink-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
              Portfolio Analytics
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
              Comprehensive win-rate charts, asset heatmaps, and journal breakdown.
            </p>
          </button>
        </div>

        {/* Search & Category Filter Section */}
        <div className="space-y-3">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, desks, tools, rewards..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#0E141B] border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const isCatActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isCatActive
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white dark:bg-[#0E141B] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isCatActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/[0.08] text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                type="button"
                id={`service-item-${service.id}`}
                onClick={service.action}
                className="p-4 rounded-3xl bg-white dark:bg-[#0E141B] border border-slate-200 dark:border-white/[0.08] hover:border-purple-500/40 dark:hover:border-purple-500/40 text-left transition-all group flex flex-col justify-between shadow-2xs hover:shadow-xs active:scale-[0.99]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`w-11 h-11 rounded-2xl ${service.iconBg} ${service.iconColor} border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {service.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          service.badgeType === 'hot'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25'
                            : service.badgeType === 'free'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                            : service.badgeType === 'vip'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25'
                            : 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25'
                        }`}
                      >
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {service.title}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  <span className="text-[11px] font-bold">Launch Feature</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredServices.length === 0 && (
          <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#0E141B] border border-slate-200 dark:border-white/[0.08] p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">No services found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              No features match "{searchQuery}". Try browsing by category or checking your spelling.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
