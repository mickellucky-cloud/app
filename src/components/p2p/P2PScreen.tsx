import React, { useState } from 'react';
import { P2PTab, P2PMerchant, P2POrder, P2PAd, P2PDisputeInfo, ThemeMode } from '../../types';
import { P2PBottomNav } from '../navigation/P2PBottomNav';
import { P2POrderDetailsModal } from './P2POrderDetailsModal';
import { P2PDisputeModal } from './P2PDisputeModal';
import { P2PTrustScoreCard } from './P2PTrustScoreCard';
import { P2PFilterSortBar, P2PSortOption } from './P2PFilterSortBar';
import { P2POrdersFilterBar, OrderStatusFilter, OrderSortOption } from './P2POrdersFilterBar';
import { formatFiat, getCurrencySymbol, FIAT_CURRENCIES } from './p2pHelpers';
import {
  ArrowLeft,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Filter,
  ChevronRight,
  Plus,
  Clock,
  CreditCard,
  UserCheck,
  HelpCircle,
  FileText,
  Radio,
  X,
  ShieldAlert,
  ExternalLink,
  Award,
  Crown,
  Zap,
  Sparkles,
  Check,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Shield,
  Target,
  TrendingUp,
  Star,
  Flame,
  Layers,
} from 'lucide-react';
import { P2PSkeleton } from '../skeletons/P2PSkeleton';

interface P2PScreenProps {
  merchants: P2PMerchant[];
  orders: P2POrder[];
  ads: P2PAd[];
  onExitP2P: () => void;
  onPlaceP2POrder: (order: P2POrder) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'alert' | 'info') => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  isLoading?: boolean;
}

export const P2PScreen: React.FC<P2PScreenProps> = ({
  merchants,
  orders,
  ads,
  onExitP2P,
  onPlaceP2POrder,
  onShowToast,
  theme = 'dark',
  onToggleTheme,
  isLoading = false,
}) => {
  const [activeP2PTab, setActiveP2PTab] = useState<P2PTab>('p2p_market');
  const [tradeSide, setTradeSide] = useState<'buy' | 'sell'>('buy');

  // Market Filter State
  const [selectedCrypto, setSelectedCrypto] = useState<'USDT' | 'BTC' | 'ETH' | 'SOL'>('USDT');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');
  const [filterPayment, setFilterPayment] = useState<string>('All');
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState<boolean>(false);
  const [marketFilterAmount, setMarketFilterAmount] = useState<string>('');
  const [marketSearchQuery, setMarketSearchQuery] = useState<string>('');
  const [marketSortBy, setMarketSortBy] = useState<P2PSortOption>('price_asc');

  // Orders Filter System State (filter by status, trade side, payment method, currency, search & sort)
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatusFilter>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | 'buy' | 'sell'>('all');
  const [orderCurrencyFilter, setOrderCurrencyFilter] = useState<string>('ALL');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<string>('All');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [orderSortBy, setOrderSortBy] = useState<OrderSortOption>('date_desc');

  // Active Orders & Ads Local State
  const [localOrders, setLocalOrders] = useState<P2POrder[]>(orders);
  const [localAds, setLocalAds] = useState<P2PAd[]>(ads);

  // Selected Order for Dedicated Order Details Modal
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<P2POrder | null>(null);

  // Selected Order for Dedicated Dispute Modal
  const [selectedOrderForDispute, setSelectedOrderForDispute] = useState<P2POrder | null>(null);

  // Trade Modal
  const [activeMerchant, setActiveMerchant] = useState<P2PMerchant | null>(null);
  const [fiatAmountInput, setFiatAmountInput] = useState('');
  const [tradeSuccess, setTradeSuccess] = useState(false);
  const [p2pError, setP2pError] = useState<string | null>(null);

  // New Ad Modal (Seller Flow)
  const [showCreateAdModal, setShowCreateAdModal] = useState(false);
  const [adSide, setAdSide] = useState<'buy' | 'sell'>('sell');
  const [adCryptoSymbol, setAdCryptoSymbol] = useState<'USDT' | 'BTC' | 'ETH'>('USDT');
  const [adPrice, setAdPrice] = useState('1585.00');
  const [adAmount, setAdAmount] = useState('1000');
  const [adMinLimit, setAdMinLimit] = useState('10000');
  const [adMaxLimit, setAdMaxLimit] = useState('1500000');
  const [adPaymentMethod, setAdPaymentMethod] = useState('Bank Transfer');

  // Become a Merchant & Merchant Profile Options
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [isMerchantActive, setIsMerchantActive] = useState(false);
  const [merchantTier, setMerchantTier] = useState<'standard' | 'pro' | 'block'>('pro');
  const [merchantDepositConfirmed, setMerchantDepositConfirmed] = useState(true);
  const [merchantAutoReply, setMerchantAutoReply] = useState(
    'Welcome! Please make the transfer from your own personal bank account. I release crypto within 3 minutes of confirmed alert.'
  );
  const [merchantPaymentWindow, setMerchantPaymentWindow] = useState<'15' | '20' | '30'>('15');
  const [merchantRequireKyc, setMerchantRequireKyc] = useState(true);
  const [merchantMinCompletedTrades, setMerchantMinCompletedTrades] = useState<number>(5);
  const [merchantNotificationAlerts, setMerchantNotificationAlerts] = useState(true);
  const [merchantSavedSuccess, setMerchantSavedSuccess] = useState(false);

  // Interactive Merchant Progress Bar & Verified Badges State
  const [targetTier, setTargetTier] = useState<'verified' | 'pro' | 'block'>('pro');
  const [baseVolume] = useState<number>(18450);
  const [simulatedVolumeDelta, setSimulatedVolumeDelta] = useState<number>(0);
  const effectiveVolume = baseVolume + simulatedVolumeDelta;
  const currentOrdersCount = 74;
  const currentCompletionRate = 98.5;
  const [selectedBadgeDetails, setSelectedBadgeDetails] = useState<string | null>(null);

  if (isLoading) {
    return <P2PSkeleton onExit={onExitP2P} />;
  }

  // Dynamic Merchant Verification Thresholds & Evaluation
  // Injects 'Verified' badge (checkmark icon) if tradeVolume >= 10,000 USDT or feedbackScore >= 98.0%
  const VERIFIED_THRESHOLDS = {
    MIN_TRADE_VOLUME_USDT: 10000, // 30-day trade volume >= $10,000 USDT
    MIN_FEEDBACK_SCORE: 98.0,      // Positive feedback score >= 98.0%
  };

  const getMerchantVerification = (m: P2PMerchant) => {
    const volume = m.tradeVolume ?? Math.round(m.ordersCount * 22);
    const feedback = m.feedbackScore ?? m.completionRate;
    const qualifiesByVolume = volume >= VERIFIED_THRESHOLDS.MIN_TRADE_VOLUME_USDT;
    const qualifiesByFeedback = feedback >= VERIFIED_THRESHOLDS.MIN_FEEDBACK_SCORE;
    const isVerified = Boolean(m.isVerified || qualifiesByVolume || qualifiesByFeedback);

    const reasons: string[] = [];
    if (qualifiesByVolume) reasons.push(`Trade Vol: $${volume.toLocaleString()} (≥$10K)`);
    if (qualifiesByFeedback) reasons.push(`Feedback: ${feedback.toFixed(1)}% (≥98%)`);
    if (m.isVerified && reasons.length === 0) reasons.push('Certified Partner');

    return {
      isVerified,
      qualifiesByVolume,
      qualifiesByFeedback,
      volume,
      feedback,
      tooltipText: isVerified
        ? `Verified Merchant • ${reasons.join(' & ')}`
        : 'Standard Trader (Thresholds not yet reached)',
    };
  };

  // Filter and Sort Merchants (Market Tab)
  const filteredMerchants = merchants
    .filter((m) => {
      // Currency filter
      if (selectedCurrency !== 'ALL' && m.fiatCurrency !== selectedCurrency) {
        return false;
      }
      // Crypto symbol filter
      if (m.cryptoSymbol !== selectedCrypto) {
        return false;
      }
      // Payment method filter
      if (filterPayment !== 'All') {
        const matchesPm = m.paymentMethods.some(
          (pm) =>
            pm.toLowerCase().includes(filterPayment.toLowerCase()) ||
            filterPayment.toLowerCase().includes(pm.toLowerCase())
        );
        if (!matchesPm) return false;
      }
      // Verified only
      if (filterVerifiedOnly) {
        const v = getMerchantVerification(m);
        if (!v.isVerified) return false;
      }
      // Amount filter
      if (marketFilterAmount.trim()) {
        const parsedAmount = parseFloat(marketFilterAmount);
        if (!isNaN(parsedAmount) && parsedAmount > 0) {
          if (parsedAmount < m.minLimit || parsedAmount > m.maxLimit) {
            return false;
          }
        }
      }
      // Search query
      if (marketSearchQuery.trim()) {
        const q = marketSearchQuery.toLowerCase().trim();
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesPayment = m.paymentMethods.some((pm) => pm.toLowerCase().includes(q));
        if (!matchesName && !matchesPayment) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (marketSortBy === 'price_asc') return a.pricePerUnit - b.pricePerUnit;
      if (marketSortBy === 'price_desc') return b.pricePerUnit - a.pricePerUnit;
      if (marketSortBy === 'completion_rate') return b.completionRate - a.completionRate;
      if (marketSortBy === 'trade_volume') return (b.tradeVolume || b.ordersCount * 22) - (a.tradeVolume || a.ordersCount * 22);
      if (marketSortBy === 'fastest_release') return a.avgReleaseMin - b.avgReleaseMin;
      return 0;
    });

  const activeMarketFiltersCount =
    (selectedCurrency !== 'ALL' ? 1 : 0) +
    (filterPayment !== 'All' ? 1 : 0) +
    (filterVerifiedOnly ? 1 : 0) +
    (marketFilterAmount.trim() ? 1 : 0) +
    (marketSortBy !== 'price_asc' ? 1 : 0);

  // Filter and Sort Orders (My Orders Tab)
  const filteredOrders = localOrders
    .filter((o) => {
      // Status filter
      if (orderStatusFilter !== 'all') {
        if (orderStatusFilter === 'disputed') {
          if (o.status !== 'disputed') return false;
        } else {
          if (o.status !== orderStatusFilter) return false;
        }
      }
      // Order Type (Buy / Sell)
      if (orderTypeFilter !== 'all' && o.type !== orderTypeFilter) {
        return false;
      }
      // Currency Type
      if (orderCurrencyFilter !== 'ALL' && o.fiatCurrency !== orderCurrencyFilter) {
        return false;
      }
      // Payment Method
      if (orderPaymentFilter !== 'All') {
        const matchesPm =
          o.paymentMethod.toLowerCase().includes(orderPaymentFilter.toLowerCase()) ||
          orderPaymentFilter.toLowerCase().includes(o.paymentMethod.toLowerCase());
        if (!matchesPm) return false;
      }
      // Search Query
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase().trim();
        const matchesId = o.id.toLowerCase().includes(q);
        const matchesMerchant = o.merchantName.toLowerCase().includes(q);
        if (!matchesId && !matchesMerchant) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (orderSortBy === 'amount_desc') return b.fiatAmount - a.fiatAmount;
      if (orderSortBy === 'amount_asc') return a.fiatAmount - b.fiatAmount;
      if (orderSortBy === 'crypto_desc') return b.cryptoAmount - a.cryptoAmount;
      if (orderSortBy === 'date_asc') return a.id.localeCompare(b.id);
      return b.id.localeCompare(a.id);
    });

  const handleOpenTrade = (m: P2PMerchant) => {
    setActiveMerchant(m);
    setFiatAmountInput('');
    setTradeSuccess(false);
    setP2pError(null);
  };

  const handleConfirmP2PTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMerchant) return;
    const fiatVal = parseFloat(fiatAmountInput) || 0;
    if (fiatVal < activeMerchant.minLimit || fiatVal > activeMerchant.maxLimit) {
      setP2pError(`Amount must be between ₦${activeMerchant.minLimit.toLocaleString()} and ₦${activeMerchant.maxLimit.toLocaleString()}`);
      return;
    }
    setP2pError(null);

    const cryptoVal = fiatVal / activeMerchant.pricePerUnit;
    const newOrder: P2POrder = {
      id: `P2P-${Math.floor(10000 + Math.random() * 90000)}`,
      type: tradeSide,
      merchantName: activeMerchant.name,
      cryptoAmount: parseFloat(cryptoVal.toFixed(2)),
      cryptoSymbol: activeMerchant.cryptoSymbol,
      fiatAmount: fiatVal,
      fiatCurrency: activeMerchant.fiatCurrency,
      unitPrice: activeMerchant.pricePerUnit,
      paymentMethod: activeMerchant.paymentMethods[0] || 'Bank Transfer',
      status: 'pending',
      createdAt: 'Just now',
      paymentDetails: {
        bankName: activeMerchant.paymentMethods.includes('Kuda') ? 'Kuda Microfinance Bank' : 'Access Bank Plc',
        accountNumber: '2008492019',
        accountName: activeMerchant.name,
        referenceMemo: `OKN-${Math.floor(100000 + Math.random() * 900000)}`,
      },
      timeline: [
        {
          id: `t-created-${Date.now()}`,
          status: 'pending',
          title: 'Escrow Order Initialized',
          description: `${parseFloat(cryptoVal.toFixed(2))} ${activeMerchant.cryptoSymbol} is safely reserved in smart escrow.`,
          timestamp: 'Just now',
          actor: 'buyer',
        },
      ],
      chatMessages: [
        {
          id: `msg-sys-${Date.now()}`,
          sender: 'system',
          senderName: 'OKNexus Escrow Protocol',
          text: `Escrow order created. Transfer exactly ₦${fiatVal.toLocaleString()} to the seller bank account within 15 minutes.`,
          timestamp: 'Just now',
        },
        {
          id: `msg-seller-${Date.now()}`,
          sender: 'seller',
          senderName: activeMerchant.name,
          text: 'Hello! I am active. Once you complete the bank transfer, tap "I Have Paid" and I will release immediately.',
          timestamp: 'Just now',
        },
      ],
    };

    setLocalOrders((prev) => [newOrder, ...prev]);
    onPlaceP2POrder(newOrder);
    setTradeSuccess(true);
    setTimeout(() => {
      setTradeSuccess(false);
      setActiveMerchant(null);
      setActiveP2PTab('p2p_orders');
      setSelectedOrderForDetails(newOrder);
      onShowToast?.('Order Created & Escrow Locked', `Order #${newOrder.id} active. Opening order details...`, 'success');
    }, 1000);
  };

  return (
    <div id="p2p-full-screen" className="min-h-screen bg-white dark:bg-[#07090E] text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Header */}
      <header className="px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between bg-white/95 dark:bg-[#090C14]/90 backdrop-blur-md sticky top-0 z-30 gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            id="p2p-back-btn"
            onClick={onExitP2P}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all text-xs font-semibold shrink-0"
            aria-label="Back to main exchange"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit P2P</span>
          </button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 sm:gap-2 truncate">
              <span>P2P</span>
              <span className="text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 shrink-0">
                0% FEES
              </span>
            </h1>
          </div>
        </div>

        {/* Desktop / Tablet Nav Tabs */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 text-xs font-semibold">
          {[
            { id: 'p2p_market', label: 'P2P' },
            { id: 'p2p_orders', label: 'My Orders' },
            { id: 'p2p_ads', label: 'My Ads' },
            { id: 'p2p_profile', label: 'User Center' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveP2PTab(item.id as P2PTab)}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeP2PTab === item.id
                  ? 'bg-purple-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setActiveP2PTab('p2p_profile')}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
            title="P2P Trust & Reputation"
          >
            <ShieldCheck className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </button>
          <button
            onClick={() => setActiveP2PTab('p2p_profile')}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
            title="User Center Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body per Tab */}
      <main className="flex-1 pb-28 md:pb-12 pt-4 px-4 sm:px-6 lg:px-8 max-w-md md:max-w-4xl lg:max-w-7xl mx-auto w-full">
        {/* TAB 1: P2P MARKETPLACE */}
        {activeP2PTab === 'p2p_market' && (
          <div className="space-y-4">
            {/* Top Bar: Multi-Currency & Payment Filter and Sort Component */}
            <P2PFilterSortBar
              tradeSide={tradeSide}
              onSelectTradeSide={setTradeSide}
              selectedCrypto={selectedCrypto}
              onSelectCrypto={(crypto) => setSelectedCrypto(crypto as any)}
              selectedFiat={selectedCurrency}
              onSelectFiat={setSelectedCurrency}
              selectedPayment={filterPayment}
              onSelectPayment={setFilterPayment}
              filterAmount={marketFilterAmount}
              onChangeFilterAmount={setMarketFilterAmount}
              sortBy={marketSortBy}
              onChangeSortBy={setMarketSortBy}
              verifiedOnly={filterVerifiedOnly}
              onToggleVerifiedOnly={() => setFilterVerifiedOnly(!filterVerifiedOnly)}
              onResetFilters={() => {
                setSelectedCurrency('ALL');
                setFilterPayment('All');
                setFilterVerifiedOnly(false);
                setMarketFilterAmount('');
                setMarketSortBy('price_asc');
              }}
              activeFiltersCount={activeMarketFiltersCount}
            />

            {/* Escrow Trust & Security Guarantee Bar */}
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1220] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-600 dark:text-slate-400 shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <strong className="text-slate-900 dark:text-white font-semibold">100% Escrow Protection:</strong>{' '}
                  <span className="text-slate-500 dark:text-slate-400">Zero fees, sub-2m settlement, and multi-currency banking rails.</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 shrink-0 pl-2">
                <span className="text-xs text-cyan-600 dark:text-cyan-400 font-mono-num font-bold">
                  {filteredMerchants.filter((m) => getMerchantVerification(m).isVerified).length} Verified Online
                </span>
              </div>
            </div>

            {/* Merchant Listings as Responsive Grid with High-Contrast Hierarchy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredMerchants.map((m) => {
                const vInfo = getMerchantVerification(m);

                return (
                  <div
                    key={m.id}
                    id={`p2p-merchant-${m.name}`}
                    className={`rounded-2xl bg-white dark:bg-[#0D111A] border p-4 space-y-3 shadow-2xs hover:shadow-md transition-all ${
                      vInfo.isVerified
                        ? 'border-slate-300 dark:border-white/[0.10] hover:border-cyan-400 dark:hover:border-cyan-500/40'
                        : 'border-slate-200 dark:border-white/[0.05]'
                    }`}
                  >
                    {/* Row 1: Merchant Identity & Trust Badges */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`relative w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border shadow-2xs ${
                            vInfo.isVerified
                              ? 'bg-cyan-100 dark:bg-cyan-500/15 border-cyan-300 dark:border-cyan-400/35 text-cyan-700 dark:text-cyan-300'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <span>{m.name.charAt(0).toUpperCase()}</span>
                          {vInfo.isVerified && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-cyan-500 text-white flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 fill-cyan-500 text-white" />
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {m.name}
                            </span>
                            {vInfo.isVerified && (
                              <span className="px-1.5 py-0.2 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-500/30 text-[9px] font-bold">
                                VERIFIED
                              </span>
                            )}
                            {(m.isVerified || vInfo.volume >= 25000) && (
                              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/30 text-[9px] font-bold">
                                PRO
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5 font-mono-num">
                            <span>{m.ordersCount.toLocaleString()} orders</span>
                            <span className="text-slate-300 dark:text-white/20">•</span>
                            <span>{m.completionRate}% complete</span>
                            <span className="text-slate-300 dark:text-white/20">•</span>
                            <span>~{m.avgReleaseMin}m avg</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                          {vInfo.feedback.toFixed(1)}% POSITIVE
                        </span>
                      </div>
                    </div>

                    {/* Row 2: Hero Price Banner */}
                    <div className="flex items-baseline justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200/80 dark:border-white/[0.05]">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Unit Price
                      </span>
                      <div className="text-right">
                        <span className="text-xl sm:text-2xl font-black font-mono-num text-slate-900 dark:text-white">
                          {formatFiat(m.pricePerUnit, m.fiatCurrency)}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-1 font-semibold">
                          / {m.cryptoSymbol}
                        </span>
                      </div>
                    </div>

                    {/* Row 3: Available Inventory & Order Limits */}
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono-num">
                      <div className="p-2 rounded-lg bg-slate-100/70 dark:bg-white/[0.02]">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Available Liquidity</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {m.availableCrypto.toLocaleString()} {m.cryptoSymbol}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-100/70 dark:bg-white/[0.02]">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Order Range</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {formatFiat(m.minLimit, m.fiatCurrency)} - {formatFiat(m.maxLimit, m.fiatCurrency)}
                        </span>
                      </div>
                    </div>

                    {/* Row 4: Supported Payment Rails & High-Contrast CTA Button */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {m.paymentMethods.map((pm) => (
                          <span
                            key={pm}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#131929] border border-slate-200 dark:border-white/[0.06] text-[10px] text-slate-700 dark:text-slate-300 flex items-center gap-1 shadow-2xs font-medium"
                          >
                            <CreditCard className="w-2.5 h-2.5 text-slate-400" />
                            {pm}
                          </span>
                        ))}
                      </div>

                      <button
                        id={`p2p-btn-${tradeSide}-${m.id}`}
                        onClick={() => handleOpenTrade(m)}
                        className={`px-4 py-2 rounded-xl font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1.5 ${
                          tradeSide === 'buy'
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold'
                            : 'bg-rose-500 hover:bg-rose-400 text-white font-extrabold'
                        }`}
                      >
                        <span>{tradeSide === 'buy' ? 'Buy' : 'Sell'} {m.cryptoSymbol}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State when no merchants match filters */}
            {filteredMerchants.length === 0 && (
              <div className="py-12 px-4 rounded-2xl bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.07] text-center space-y-3 shadow-2xs">
                <Filter className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-600" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">No Matching P2P Offers Found</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Try adjusting payment methods, switching currency, or resetting verified-only filter.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCurrency('ALL');
                    setFilterPayment('All');
                    setFilterVerifiedOnly(false);
                    setMarketSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Reset Market Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: P2P ORDERS */}
        {activeP2PTab === 'p2p_orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">P2P Orders</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Track, complete, or dispute escrow trades in real-time
                </p>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono-num px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08]">
                {filteredOrders.length} of {localOrders.length} Orders
              </span>
            </div>

            {/* Filter, Sort & Search System for Orders */}
            <P2POrdersFilterBar
              statusFilter={orderStatusFilter}
              onChangeStatusFilter={setOrderStatusFilter}
              typeFilter={orderTypeFilter}
              onChangeTypeFilter={setOrderTypeFilter}
              currencyFilter={orderCurrencyFilter}
              onChangeCurrencyFilter={setOrderCurrencyFilter}
              paymentFilter={orderPaymentFilter}
              onChangePaymentFilter={setOrderPaymentFilter}
              searchQuery={orderSearchQuery}
              onChangeSearchQuery={setOrderSearchQuery}
              sortBy={orderSortBy}
              onChangeSortBy={setOrderSortBy}
              totalOrdersCount={localOrders.length}
              filteredOrdersCount={filteredOrders.length}
              onResetFilters={() => {
                setOrderStatusFilter('all');
                setOrderTypeFilter('all');
                setOrderCurrencyFilter('ALL');
                setOrderPaymentFilter('All');
                setOrderSearchQuery('');
                setOrderSortBy('date_desc');
              }}
            />

            {/* Orders List Grid */}
            {filteredOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    id={`p2p-order-card-${order.id}`}
                    onClick={() => setSelectedOrderForDetails(order)}
                    className="p-4 rounded-2xl bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.07] hover:border-purple-400 dark:hover:border-purple-500/40 hover:bg-slate-50 dark:hover:bg-[#111624] transition-all cursor-pointer space-y-3 group shadow-2xs relative overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-extrabold text-xs px-2.5 py-0.5 rounded-lg border ${
                            order.type === 'buy'
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {order.type.toUpperCase()} {order.cryptoSymbol}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                            {order.merchantName}
                          </span>
                          {(() => {
                            const matched = merchants.find((m) => m.name === order.merchantName);
                            if (matched && getMerchantVerification(matched).isVerified) {
                              return (
                                <span className="inline-flex items-center gap-0.5 text-cyan-600 dark:text-cyan-400" title="Verified Counterparty Merchant">
                                  <CheckCircle2 className="w-3 h-3 text-cyan-600 dark:text-cyan-400 fill-cyan-400/20" />
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                          order.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                            : order.status === 'disputed'
                            ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30 animate-pulse'
                            : order.status === 'payment_submitted'
                            ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30'
                            : order.status === 'cancelled'
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/5'
                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {order.status === 'payment_submitted'
                          ? 'PAID (AWAITING RELEASE)'
                          : order.status === 'disputed'
                          ? 'IN ARBITRATION'
                          : order.status}
                      </span>
                    </div>

                    {/* Fiat & Crypto Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono-num p-2.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/[0.04]">
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Total Fiat</span>
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {formatFiat(order.fiatAmount, order.fiatCurrency)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Crypto Amount</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          {order.cryptoAmount} {order.cryptoSymbol}
                        </span>
                      </div>
                    </div>

                    {/* Payment Method & Unit Price */}
                    <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-[10px] font-medium">
                        <CreditCard className="w-2.5 h-2.5 text-slate-400" />
                        {order.paymentMethod}
                      </span>
                      <span className="font-mono-num text-[10px] text-slate-500">
                        @{formatFiat(order.unitPrice, order.fiatCurrency)}/{order.cryptoSymbol}
                      </span>
                    </div>

                    {/* Footer / Status Actions */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-white/[0.04]">
                      <span className="font-mono-num">#{order.id} • {order.createdAt}</span>
                      <span className="text-purple-600 dark:text-purple-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Manage & Details &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-14 px-4 text-center rounded-2xl bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.07] space-y-3 shadow-2xs">
                <FileText className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-600" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Orders Match Your Filters</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    No orders match the selected payment method, currency, or status criteria.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOrderStatusFilter('all');
                    setOrderTypeFilter('all');
                    setOrderCurrencyFilter('ALL');
                    setOrderPaymentFilter('All');
                    setOrderSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Reset Order Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: P2P ADS */}
        {activeP2PTab === 'p2p_ads' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-white/[0.08]">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>Merchant Order Advertisements</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                    {localAds.filter((a) => a.status === 'online').length} ACTIVE
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Manage your active market maker listings, pricing margins, and automated payment escrow terms.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCreateAdModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs active:scale-95 transition-all shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post New Ad</span>
                </button>
              </div>
            </div>

            {localAds.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.08]">
                <Radio className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-60" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Advertisements Found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Create a buy or sell advertisement to provide liquidity and earn spreads on P2P orders.
                </p>
                <button
                  onClick={() => setShowCreateAdModal(true)}
                  className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-xs hover:bg-purple-500 transition-all"
                >
                  Create First Ad
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {localAds.map((ad) => {
                  const isOnline = ad.status === 'online';
                  return (
                    <div
                      key={ad.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.08] space-y-3 shadow-2xs hover:shadow-md transition-all relative overflow-hidden"
                    >
                      {/* Top Hierarchy: Type, Symbol, Status Pill */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-black px-2.5 py-0.5 rounded-lg ${
                              ad.type === 'buy'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30'
                            }`}
                          >
                            {ad.type.toUpperCase()}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-sm text-slate-900 dark:text-white">{ad.cryptoSymbol}</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">/{ad.fiatCurrency || selectedCurrency || 'USD'}</span>
                          </div>
                        </div>

                        {/* Status Switch Badge */}
                        <button
                          onClick={() => {
                            setLocalAds((prev) =>
                              prev.map((item) =>
                                item.id === ad.id
                                  ? { ...item, status: item.status === 'online' ? 'offline' : 'online' }
                                  : item
                              )
                            );
                          }}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all flex items-center gap-1.5 ${
                            isOnline
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30'
                              : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-white/10'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                          <span>{isOnline ? 'ONLINE' : 'PAUSED'}</span>
                        </button>
                      </div>

                      {/* Hero Unit Price */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200/80 dark:border-white/[0.05] flex items-baseline justify-between">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Unit Price</span>
                        <div className="text-right">
                          <span className="text-xl font-black font-mono-num text-slate-900 dark:text-white">
                            {formatFiat(ad.price, ad.fiatCurrency || (selectedCurrency !== 'ALL' ? selectedCurrency : 'USD'))}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 ml-1 font-semibold">
                            / {ad.cryptoSymbol}
                          </span>
                        </div>
                      </div>

                      {/* Liquidity & Limit Metric Tiles */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono-num">
                        <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.04]">
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">Available Liquidity</span>
                          <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                            {ad.available} {ad.cryptoSymbol}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.04]">
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">Order Limits</span>
                          <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate block">
                            {formatFiat(ad.minLimit, ad.fiatCurrency || 'USD')} - {formatFiat(ad.maxLimit, ad.fiatCurrency || 'USD')}
                          </span>
                        </div>
                      </div>

                      {/* Payment Methods */}
                      {ad.paymentMethods && ad.paymentMethods.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          {ad.paymentMethods.map((pm) => (
                            <span
                              key={pm}
                              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] text-[10px] text-slate-700 dark:text-slate-300 font-medium border border-slate-200/80 dark:border-white/[0.05]"
                            >
                              {pm}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Quick Action Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-white/[0.06] text-xs">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono-num">
                          Ad ID: #{ad.id.slice(-6).toUpperCase()}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setLocalAds((prev) =>
                                prev.map((item) =>
                                  item.id === ad.id
                                    ? { ...item, status: item.status === 'online' ? 'offline' : 'online' }
                                    : item
                                )
                              );
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                          >
                            {isOnline ? 'Pause Ad' : 'Activate Ad'}
                          </button>
                          <button
                            onClick={() => {
                              setLocalAds((prev) => prev.filter((item) => item.id !== ad.id));
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: P2P PROFILE */}
        {activeP2PTab === 'p2p_profile' && (
          <div className="space-y-4">
            {/* User / Merchant Profile Header Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/80 via-white to-slate-50 dark:from-[#161224] dark:to-[#0D111A] border border-purple-200 dark:border-purple-500/30 shadow-2xs dark:shadow-lg">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md border border-amber-400/40">
                    {isMerchantActive ? '👑' : '₿'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">CryptoKing</h3>
                      {isMerchantActive ? (
                        <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5 text-amber-500 dark:text-amber-400" />
                          <span>{merchantTier.toUpperCase()} MERCHANT</span>
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-[10px] font-medium flex items-center gap-1">
                          <span>Standard Trader</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isMerchantActive ? 'Verified Market Maker Desk' : 'Individual P2P Trader'}
                    </p>
                  </div>
                </div>

                {/* Merchant Mode Toggle / Status Chip */}
                {isMerchantActive && (
                  <button
                    type="button"
                    onClick={() => setShowMerchantModal(true)}
                    className="px-2.5 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/25 text-[11px] font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Options</span>
                  </button>
                )}
              </div>

              {/* Active Verified Badges in Profile Header */}
              <div className="flex items-center gap-1.5 flex-wrap py-1.5 border-t border-slate-200 dark:border-white/[0.05]">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('p2p-trust-score-card');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/15 border border-cyan-300 dark:border-cyan-400/35 text-cyan-800 dark:text-cyan-300 text-[10px] font-bold hover:bg-cyan-200 dark:hover:bg-cyan-500/25 transition-all"
                  title="View algorithmic Trust Score breakdown"
                >
                  <ShieldCheck className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                  <span>Trust Score 97/100 (Elite)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBadgeDetails('gold_shield')}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/35 text-amber-800 dark:text-amber-300 text-[10px] font-bold hover:bg-amber-400/25 transition-all"
                >
                  <ShieldCheck className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                  <span>Gold Shield Verified</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBadgeDetails('fast_release')}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/15 border border-yellow-400/35 text-yellow-800 dark:text-yellow-300 text-[10px] font-bold hover:bg-yellow-400/25 transition-all"
                >
                  <Zap className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                  <span>Fast Release &lt;3m</span>
                </button>

                {isMerchantActive ? (
                  <button
                    type="button"
                    onClick={() => setSelectedBadgeDetails('pro_crown')}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-400/15 border border-purple-400/35 text-purple-800 dark:text-purple-300 text-[10px] font-bold hover:bg-purple-400/25 transition-all"
                  >
                    <Crown className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    <span>PRO Desk</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedBadgeDetails('pro_crown')}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 text-[10px] hover:border-slate-300 dark:hover:border-white/20 transition-all"
                  >
                    <Crown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    <span>PRO Crown (Locked)</span>
                  </button>
                )}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200 dark:border-white/[0.06] text-center font-mono-num">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">2,843</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Orders</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">98.5%</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Completion</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-200">2.4 min</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Avg. Release</div>
                </div>
                <div
                  onClick={() => {
                    const el = document.getElementById('p2p-trust-score-card');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="cursor-pointer group hover:bg-slate-100 dark:hover:bg-white/[0.03] rounded-lg transition-colors py-0.5"
                  title="Jump to P2P Trust & Reputation Score"
                >
                  <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400 flex items-center justify-center gap-0.5 group-hover:underline">
                    <span>97</span>
                    <span className="text-[10px] text-cyan-600/70 dark:text-cyan-300/70 font-normal">/100</span>
                  </div>
                  <div className="text-[10px] text-cyan-600 dark:text-cyan-300 font-semibold flex items-center justify-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>Trust Score</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DYNAMIC P2P TRUST SCORE (0-100) WITH COLOR-CODED GAUGE */}
            <P2PTrustScoreCard
              ordersCount={2843}
              completionRate={currentCompletionRate}
              tradeVolume={effectiveVolume}
              avgReleaseMin={2.4}
              initialGovIdVerified={true}
              initialBankVerified={true}
              initial2faEnabled={true}
              initialAddressVerified={true}
              initialFeedbackScore={99.2}
            />

            {/* "BECOME A MERCHANT" SECTION WITH INTERACTIVE LEVEL PROGRESS BAR */}
            <div className="space-y-4">
              {/* HERO BANNER */}
              {!isMerchantActive && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-purple-50/60 to-white dark:from-[#1E1435]/90 dark:via-[#131728]/95 dark:to-[#0A1020]/90 border border-amber-300/80 dark:border-amber-500/35 shadow-xs dark:shadow-[0_8px_30px_rgba(245,158,11,0.12)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold tracking-wider flex items-center gap-1 uppercase">
                        <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                        <span>OKNexus Maker Program</span>
                      </span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono-num">0% Maker Fees</span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white mb-1">
                      Become an OKNexus Merchant
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      Post public buy/sell advertisements, profit from market spreads, and unlock exclusive verified badges with institutional escrow limits.
                    </p>

                    {/* Highlights Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5">
                      <div className="p-2 rounded-xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
                        <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 mb-1" />
                        <div className="text-[10px] font-bold text-slate-900 dark:text-white">0% Maker Fee</div>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400">Zero commission</div>
                      </div>
                      <div className="p-2 rounded-xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
                        <Crown className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 mb-1" />
                        <div className="text-[10px] font-bold text-slate-900 dark:text-white">Verified Badge</div>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400">Gold & PRO shield</div>
                      </div>
                      <div className="p-2 rounded-xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
                        <Shield className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 mb-1" />
                        <div className="text-[10px] font-bold text-slate-900 dark:text-white">Priority Escrow</div>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400">24/7 dedicated desk</div>
                      </div>
                      <div className="p-2 rounded-xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
                        <CreditCard className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 mb-1" />
                        <div className="text-[10px] font-bold text-slate-900 dark:text-white">₦100M Limit</div>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400">Scalable liquidity</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setShowMerchantModal(true)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-bold text-xs shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                        <Crown className="w-4 h-4 text-slate-950 fill-current" />
                        <span>Become a Merchant</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowMerchantModal(true)}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs font-semibold transition-all"
                      >
                        Options & Rules
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIVE MERCHANT QUICK STATUS BAR */}
              {isMerchantActive && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-transparent border border-amber-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
                        <Crown className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{merchantTier.toUpperCase()} MERCHANT ACTIVE</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono-num">
                          Deposit locked: {merchantTier === 'standard' ? '500' : merchantTier === 'pro' ? '1,000' : '5,000'} USDT in smart escrow vault
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowMerchantModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-xs transition-all"
                    >
                      Merchant Options
                    </button>
                  </div>
                </div>
              )}

              {/* INTERACTIVE MERCHANT LEVEL PROGRESS BAR CARD */}
              {(() => {
                const targetConfig = {
                  verified: {
                    name: 'Tier 1: Verified Merchant',
                    shortName: 'Tier 1',
                    badgeName: 'Gold Shield',
                    volume: 5000,
                    orders: 20,
                    completion: 90,
                    deposit: 500,
                    adLimit: '₦20M',
                    theme: 'amber',
                  },
                  pro: {
                    name: 'Tier 2: PRO Merchant Desk',
                    shortName: 'Tier 2',
                    badgeName: 'PRO Crown',
                    volume: 25000,
                    orders: 100,
                    completion: 95,
                    deposit: 1000,
                    adLimit: '₦100M',
                    theme: 'purple',
                  },
                  block: {
                    name: 'Tier 3: VIP Block OTC Desk',
                    shortName: 'Tier 3',
                    badgeName: 'VIP Diamond',
                    volume: 100000,
                    orders: 500,
                    completion: 98,
                    deposit: 5000,
                    adLimit: '₦500M',
                    theme: 'cyan',
                  },
                }[targetTier];

                const progressPercent = Math.min(100, Math.round((effectiveVolume / targetConfig.volume) * 100));
                const volumeRemaining = Math.max(0, targetConfig.volume - effectiveVolume);
                const isVolumeMet = effectiveVolume >= targetConfig.volume;
                const isOrdersMet = currentOrdersCount >= targetConfig.orders;
                const isCompletionMet = currentCompletionRate >= targetConfig.completion;
                const isAllMet = isVolumeMet && isOrdersMet && isCompletionMet;

                return (
                  <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.08] space-y-4 shadow-2xs dark:shadow-lg">
                    {/* Progress Header */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>Merchant Level Progress Tracker</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-[10px] text-slate-600 dark:text-slate-300 font-mono-num">
                              30-Day Window
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Current trade volume vs requirements for next tier
                          </p>
                        </div>
                      </div>

                      {/* Current Status Pill */}
                      <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-500/15 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-[10px] font-bold flex items-center gap-1">
                        <Award className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        <span>Current: {isMerchantActive ? merchantTier.toUpperCase() : 'Level 1 (Standard)'}</span>
                      </span>
                    </div>

                    {/* Interactive Target Tier Switcher */}
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                        <span>Select Target Tier to Compare:</span>
                        <span className="text-purple-600 dark:text-purple-400 text-[10px] font-bold">Target: {targetConfig.name}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(['verified', 'pro', 'block'] as const).map((tierKey) => {
                          const isSelected = targetTier === tierKey;
                          const tierLabels = {
                            verified: { title: 'Verified', vol: '5K USDT' },
                            pro: { title: 'PRO Desk', vol: '25K USDT' },
                            block: { title: 'VIP Block', vol: '100K USDT' },
                          }[tierKey];

                          return (
                            <button
                              key={tierKey}
                              type="button"
                              onClick={() => setTargetTier(tierKey)}
                              className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                                isSelected
                                  ? 'bg-purple-100 dark:bg-purple-600/25 border-purple-500 text-purple-950 dark:text-white shadow-2xs dark:shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                  : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-white/15'
                              }`}
                            >
                              <div className="text-[11px] font-bold leading-tight">{tierLabels.title}</div>
                              <div className="text-[10px] font-mono-num text-slate-500 dark:text-slate-400">{tierLabels.vol}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* PROGRESS BAR DISPLAY */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-2.5">
                      {/* Metric & Percent Header */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">30d Trading Volume:</span>
                          <span className="font-mono-num font-bold text-slate-900 dark:text-white">
                            ${effectiveVolume.toLocaleString()}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500 font-mono-num">
                            / ${targetConfig.volume.toLocaleString()} USDT
                          </span>
                        </div>
                        <span
                          className={`font-mono-num font-bold px-2 py-0.5 rounded-md text-[11px] ${
                            progressPercent >= 100
                              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                              : 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30'
                          }`}
                        >
                          {progressPercent}% Complete
                        </span>
                      </div>

                      {/* Animated Progress Bar Track */}
                      <div className="relative w-full h-3.5 rounded-full bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-white/[0.08] overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            progressPercent >= 100
                              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                              : 'bg-gradient-to-r from-purple-600 via-indigo-500 to-amber-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      {/* Milestone Checkpoints */}
                      <div className="flex items-center justify-between text-[10px] font-mono-num text-slate-500 dark:text-slate-400 px-1">
                        <span>0% (Base)</span>
                        <span className={progressPercent >= 50 ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''}>
                          50% (${(targetConfig.volume / 2).toLocaleString()})
                        </span>
                        <span className={progressPercent >= 100 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                          100% (${targetConfig.volume.toLocaleString()})
                        </span>
                      </div>
                    </div>

                    {/* 4-PILLAR REQUIREMENTS MATRIX */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {/* 1. Volume Requirement */}
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">Volume (30d)</div>
                        <div className="font-mono-num font-bold text-slate-900 dark:text-white text-[11px]">
                          ${effectiveVolume.toLocaleString()}
                        </div>
                        <div className={`text-[9px] font-semibold mt-1 flex items-center gap-0.5 ${isVolumeMet ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {isVolumeMet ? <Check className="w-2.5 h-2.5" /> : null}
                          <span>{isVolumeMet ? 'Met ✓' : `${volumeRemaining.toLocaleString()} needed`}</span>
                        </div>
                      </div>

                      {/* 2. Orders Count */}
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">Orders Count</div>
                        <div className="font-mono-num font-bold text-slate-900 dark:text-white text-[11px]">
                          {currentOrdersCount} / {targetConfig.orders}
                        </div>
                        <div className={`text-[9px] font-semibold mt-1 flex items-center gap-0.5 ${isOrdersMet ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                          {isOrdersMet ? <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" /> : null}
                          <span>{isOrdersMet ? 'Met ✓' : `${targetConfig.orders - currentOrdersCount} remaining`}</span>
                        </div>
                      </div>

                      {/* 3. Completion Rate */}
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">Completion Rate</div>
                        <div className="font-mono-num font-bold text-slate-900 dark:text-white text-[11px]">
                          {currentCompletionRate}% (≥{targetConfig.completion}%)
                        </div>
                        <div className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" />
                          <span>Met ✓ (98.5%)</span>
                        </div>
                      </div>

                      {/* 4. Security Deposit */}
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">Security Escrow</div>
                        <div className="font-mono-num font-bold text-slate-900 dark:text-white text-[11px]">
                          {targetConfig.deposit} USDT
                        </div>
                        <div className="text-[9px] font-semibold text-cyan-600 dark:text-cyan-400 mt-1">
                          100% Refundable
                        </div>
                      </div>
                    </div>

                    {/* QUALIFICATION CTA BANNER */}
                    {isAllMet ? (
                      <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/35 flex items-center justify-between flex-wrap gap-2 animate-fadeIn">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          <div>
                            <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                              Requirements Met for {targetConfig.name}!
                            </div>
                            <div className="text-[10px] text-slate-600 dark:text-slate-300">
                              Your account is fully eligible to claim the {targetConfig.badgeName} verified badge.
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setIsMerchantActive(true);
                            setMerchantTier(targetTier === 'verified' ? 'standard' : targetTier);
                            onShowToast?.(
                              'Verified Badge Claimed!',
                              `Congratulations! You are now an active ${targetConfig.name} with the ${targetConfig.badgeName} badge!`,
                              'success'
                            );
                          }}
                          className="py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Claim {targetConfig.badgeName} Badge</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                          <span>
                            Complete <strong>${volumeRemaining.toLocaleString()} USDT</strong> in trades to unlock{' '}
                            <span className="text-purple-600 dark:text-purple-300 font-semibold">{targetConfig.badgeName}</span> badge.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveP2PTab('p2p_market')}
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-500 font-semibold text-[11px] underline"
                        >
                          Trade Now
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* OFFICIAL MERCHANT VERIFIED BADGES SHOWCASE */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.08] space-y-3.5 shadow-2xs dark:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      <span>Merchant Verified Badges</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Official trust credentials displayed on your advertisements and profile
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono-num">
                    4 Official Badges
                  </span>
                </div>

                {/* 4 Badges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Badge 1: Gold Shield Verified */}
                  <div
                    onClick={() => setSelectedBadgeDetails('gold_shield')}
                    className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] hover:bg-slate-100/80 dark:hover:bg-white/[0.04] border border-amber-200 dark:border-amber-500/25 hover:border-amber-400/40 cursor-pointer transition-all space-y-1.5 relative group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            <span>Gold Shield</span>
                            <span className="text-[9px] text-amber-600 dark:text-amber-300 font-normal">Tier 1</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Verified Market Maker</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold">
                        Earned ✓
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug">
                      Authenticated bank accounts, 0% maker fees, and verified shield on all P2P ads.
                    </p>
                    <div className="text-[9px] text-amber-600 dark:text-amber-400/80 font-medium group-hover:text-amber-500 transition-colors">
                      View criteria & privileges →
                    </div>
                  </div>

                  {/* Badge 2: PRO Merchant Crown */}
                  <div
                    onClick={() => setSelectedBadgeDetails('pro_crown')}
                    className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] hover:bg-slate-100/80 dark:hover:bg-white/[0.04] border border-purple-200 dark:border-purple-500/25 hover:border-purple-400/40 cursor-pointer transition-all space-y-1.5 relative group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                          <Crown className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            <span>PRO Crown</span>
                            <span className="text-[9px] text-purple-600 dark:text-purple-300 font-normal">Tier 2</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">High-Volume Desk</div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${isMerchantActive && merchantTier === 'pro' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300'}`}>
                        {isMerchantActive && merchantTier === 'pro' ? 'Active ✓' : 'In Progress (74%)'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug">
                      Featured top 3 ad placement, ₦100M ad limit, and 24/7 dedicated arbitration desk.
                    </p>
                    <div className="text-[9px] text-purple-600 dark:text-purple-400/80 font-medium group-hover:text-purple-500 transition-colors">
                      View criteria & privileges →
                    </div>
                  </div>

                  {/* Badge 3: Fast Release (<3m) */}
                  <div
                    onClick={() => setSelectedBadgeDetails('fast_release')}
                    className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] hover:bg-slate-100/80 dark:hover:bg-white/[0.04] border border-yellow-200 dark:border-yellow-500/25 hover:border-yellow-400/40 cursor-pointer transition-all space-y-1.5 relative group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-yellow-500/15 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            <span>Lightning Release</span>
                            <span className="text-[9px] text-yellow-600 dark:text-yellow-300 font-normal">Speed</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Avg. 2.4 min release</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold">
                        Active ✓
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug">
                      Awarded for releasing escrow within 3 minutes; gives 45% higher counterparty conversion.
                    </p>
                    <div className="text-[9px] text-yellow-600 dark:text-yellow-400/80 font-medium group-hover:text-yellow-500 transition-colors">
                      View criteria & privileges →
                    </div>
                  </div>

                  {/* Badge 4: VIP Block Desk Diamond */}
                  <div
                    onClick={() => setSelectedBadgeDetails('vip_diamond')}
                    className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] hover:bg-slate-100/80 dark:hover:bg-white/[0.04] border border-cyan-200 dark:border-cyan-500/25 hover:border-cyan-400/40 cursor-pointer transition-all space-y-1.5 relative group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            <span>VIP Block Desk</span>
                            <span className="text-[9px] text-cyan-600 dark:text-cyan-300 font-normal">Tier 3</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Institutional OTC Partner</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/[0.08] text-slate-700 dark:text-slate-400 text-[9px] font-medium">
                        Target (100K USDT)
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug">
                      High-net-worth OTC block trades, ₦500M limits, and dedicated 1-on-1 account executive.
                    </p>
                    <div className="text-[9px] text-cyan-600 dark:text-cyan-400/80 font-medium group-hover:text-cyan-500 transition-colors">
                      View criteria & privileges →
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu List */}
            <div className="rounded-2xl bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.07] divide-y divide-slate-100 dark:divide-white/[0.05] shadow-2xs">
              {/* Merchant Portal & Options Direct Menu Link */}
              <button
                onClick={() => setShowMerchantModal(true)}
                className="w-full flex items-center justify-between p-3.5 text-xs text-left hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Merchant Portal & Options</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${isMerchantActive ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-500/30'}`}>
                        {isMerchantActive ? 'ACTIVE' : 'APPLY (0% FEES)'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Configure auto-reply, timeout limits, and counterparty KYC filters
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveP2PTab('p2p_orders')}
                className="w-full flex items-center justify-between p-3.5 text-xs text-left hover:bg-slate-50 dark:hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">My Orders</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">View all transaction history</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveP2PTab('p2p_ads')}
                className="w-full flex items-center justify-between p-3.5 text-xs text-left hover:bg-slate-50 dark:hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">My Ads</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Manage your advertisement posts</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <div className="flex items-center justify-between p-3.5 text-xs">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Payment Methods</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Bank accounts & cards (2 Linked)</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="flex items-center justify-between p-3.5 text-xs">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Verification</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Tier 3 Verified (Unlimited)</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="flex items-center justify-between p-3.5 text-xs">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Help & Escrow Support</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">24/7 Dispute resolution</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* P2P Dedicated Bottom Nav */}
      <P2PBottomNav
        activeTab={activeP2PTab}
        onSelectTab={(t) => setActiveP2PTab(t)}
      />

      {/* Trade Execution Modal */}
      {activeMerchant && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#0F1320] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom animate-slideUp">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm text-white">
                    {tradeSide === 'buy' ? 'Buy USDT' : 'Sell USDT'} with {activeMerchant.name}
                  </h3>
                  {getMerchantVerification(activeMerchant).isVerified && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold"
                      title={getMerchantVerification(activeMerchant).tooltipText}
                    >
                      <CheckCircle2 className="w-3 h-3 text-cyan-400 fill-cyan-400/20" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs">
                  <span className="font-mono-num text-emerald-400 font-bold">
                    ₦{activeMerchant.pricePerUnit.toLocaleString()} / USDT
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="text-slate-400 font-mono-num">
                    {activeMerchant.completionRate}% completion
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="text-cyan-300 font-mono-num font-medium">
                    ${(activeMerchant.tradeVolume ?? Math.round(activeMerchant.ordersCount * 22)).toLocaleString()} 30d vol
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveMerchant(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {tradeSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-bold text-white text-base">Escrow Order Created!</h4>
                <p className="text-xs text-slate-400">
                  Funds locked safely in OKNexus Escrow. Redirecting to order details...
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmP2PTrade} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Enter Fiat Amount (₦ NGN)
                  </label>
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#090C14] border border-white/10 focus-within:border-emerald-500/50">
                    <input
                      type="number"
                      placeholder={`₦${activeMerchant.minLimit.toLocaleString()} - ₦${activeMerchant.maxLimit.toLocaleString()}`}
                      value={fiatAmountInput}
                      onChange={(e) => setFiatAmountInput(e.target.value)}
                      className="bg-transparent text-white font-mono-num text-sm font-bold focus:outline-none w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setFiatAmountInput(activeMerchant.minLimit.toString())}
                      className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/20"
                    >
                      MIN
                    </button>
                  </div>
                </div>

                {/* Calculation preview */}
                <div className="p-3 rounded-xl bg-[#090C14] border border-white/[0.06] space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>You will receive approx.</span>
                    <span className="text-emerald-400 font-mono-num font-bold">
                      {fiatAmountInput
                        ? (parseFloat(fiatAmountInput) / activeMerchant.pricePerUnit).toFixed(2)
                        : '0.00'}{' '}
                      USDT
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Payment Time Limit</span>
                    <span className="text-white font-medium">15 Minutes</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Escrow Guarantee</span>
                    <span className="text-emerald-400 font-medium">100% Protected</span>
                  </div>
                </div>

                {p2pError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                    {p2pError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.35)] active:scale-98 transition-all"
                >
                  Confirm & Lock Escrow
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Post Ad Modal (Production Seller Flow) */}
      {showCreateAdModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0F1322] border border-white/10 rounded-3xl p-6 space-y-4 animate-fade-in text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <h3 className="font-extrabold text-base text-white">Create P2P Merchant Advertisement</h3>
                <span className="text-[10px] text-purple-400 font-semibold">Seller & Liquidity Provider Protocol</span>
              </div>
              <button onClick={() => setShowCreateAdModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Buy or Sell choice */}
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Ad Type</label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-900 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setAdSide('buy')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      adSide === 'buy' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    I Want to Buy (Buyer Ad)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdSide('sell')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      adSide === 'sell' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    I Want to Sell (Seller Ad)
                  </button>
                </div>
              </div>

              {/* Crypto Asset choice */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Cryptocurrency</label>
                  <select
                    value={adCryptoSymbol}
                    onChange={(e) => setAdCryptoSymbol(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold focus:outline-none focus:border-purple-500"
                  >
                    <option value="USDT">USDT - Tether USD</option>
                    <option value="BTC">BTC - Bitcoin</option>
                    <option value="ETH">ETH - Ethereum</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Fixed Price (₦ NGN / {adCryptoSymbol})</label>
                  <input
                    type="number"
                    value={adPrice}
                    onChange={(e) => setAdPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold font-mono-num focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Amount and Limits */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Total Available</label>
                  <input
                    type="number"
                    value={adAmount}
                    onChange={(e) => setAdAmount(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold font-mono-num focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Min Limit (₦)</label>
                  <input
                    type="number"
                    value={adMinLimit}
                    onChange={(e) => setAdMinLimit(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold font-mono-num focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Max Limit (₦)</label>
                  <input
                    type="number"
                    value={adMaxLimit}
                    onChange={(e) => setAdMaxLimit(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold font-mono-num focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Payment Method Accepted</label>
                <select
                  value={adPaymentMethod}
                  onChange={(e) => setAdPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-semibold focus:outline-none focus:border-purple-500"
                >
                  <option value="Bank Transfer">Bank Transfer (Instant Electronic Funds)</option>
                  <option value="Kuda Bank">Kuda Microfinance Bank</option>
                  <option value="OPay">OPay Digital Services</option>
                  <option value="Chipper Cash">Chipper Cash</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateAdModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newAdItem: P2PAd = {
                      id: `AD-${Math.floor(1000 + Math.random() * 9000)}`,
                      type: adSide,
                      cryptoSymbol: adCryptoSymbol,
                      fiatCurrency: 'NGN',
                      price: parseFloat(adPrice) || 1585,
                      available: parseFloat(adAmount) || 1000,
                      minLimit: parseFloat(adMinLimit) || 10000,
                      maxLimit: parseFloat(adMaxLimit) || 1500000,
                      paymentMethods: [adPaymentMethod],
                      status: 'active',
                    };
                    setLocalAds((prev) => [newAdItem, ...prev]);
                    setShowCreateAdModal(false);
                    onShowToast?.('Ad Published', `Your ${adSide.toUpperCase()} ad for ${adCryptoSymbol} is now live on OKNexus Marketplace.`, 'success');
                  }}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md transition-all"
                >
                  Publish Advertisement &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* P2P Dedicated Order Details Modal */}
      {selectedOrderForDetails && (
        <P2POrderDetailsModal
          isOpen={Boolean(selectedOrderForDetails)}
          onClose={() => setSelectedOrderForDetails(null)}
          order={selectedOrderForDetails}
          onUpdateOrder={(updatedOrder) => {
            setSelectedOrderForDetails(updatedOrder);
            setLocalOrders((prev) =>
              prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
            );
          }}
          onOpenDispute={(orderToDispute) => {
            setSelectedOrderForDispute(orderToDispute);
          }}
          onShowToast={onShowToast}
        />
      )}

      {/* P2P Dedicated Dispute Arbitration Center Modal */}
      {selectedOrderForDispute && (
        <P2PDisputeModal
          isOpen={Boolean(selectedOrderForDispute)}
          onClose={() => setSelectedOrderForDispute(null)}
          order={selectedOrderForDispute}
          userRole={selectedOrderForDispute.type === 'buy' ? 'buyer' : 'seller'}
          onUpdateOrderDispute={(orderId, updatedDispute) => {
            const isResolved = updatedDispute.status === 'resolved';
            const updated: P2POrder = {
              ...selectedOrderForDispute,
              status: isResolved ? 'completed' : 'disputed',
              dispute: updatedDispute,
            };
            setSelectedOrderForDispute(updated);
            if (selectedOrderForDetails?.id === orderId) {
              setSelectedOrderForDetails(updated);
            }
            setLocalOrders((prev) =>
              prev.map((o) => (o.id === orderId ? updated : o))
            );
          }}
          onShowToast={onShowToast}
        />
      )}

      {/* BECOME A MERCHANT & MERCHANT OPTIONS MODAL */}
      {showMerchantModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0C101C] border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative max-h-[90vh] overflow-y-auto custom-scrollbar animate-scaleUp">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                    <span>OKNexus Merchant Portal</span>
                    {isMerchantActive && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        ACTIVE
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Institutional liquidity maker program & trade options
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowMerchantModal(false);
                  setMerchantSavedSuccess(false);
                }}
                className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Saved Notification Banner */}
            {merchantSavedSuccess && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>Merchant preferences and status successfully updated!</span>
              </div>
            )}

            <div className="space-y-5">
              {/* SECTION 1: MERCHANT TIER SELECTION */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  1. Select Merchant Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Standard Tier */}
                  <button
                    type="button"
                    onClick={() => setMerchantTier('standard')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      merchantTier === 'standard'
                        ? 'bg-purple-600/15 border-purple-500 text-white shadow-md'
                        : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">Standard</span>
                      {merchantTier === 'standard' && <Check className="w-3.5 h-3.5 text-purple-400" />}
                    </div>
                    <div className="text-[11px] text-purple-300 font-mono-num font-semibold mb-1.5">
                      500 USDT Deposit
                    </div>
                    <ul className="text-[10px] space-y-1 text-slate-300">
                      <li>• 0% Maker fee</li>
                      <li>• ₦20M ad limit</li>
                      <li>• Standard support</li>
                    </ul>
                  </button>

                  {/* PRO Tier (Highlighted) */}
                  <button
                    type="button"
                    onClick={() => setMerchantTier('pro')}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      merchantTier === 'pro'
                        ? 'bg-amber-500/15 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                        : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-orange-500 text-slate-950 font-extrabold text-[8px] px-2 py-0.5 rounded-bl-lg uppercase">
                      Popular
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-400" />
                        <span>PRO Desk</span>
                      </span>
                      {merchantTier === 'pro' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <div className="text-[11px] text-amber-300 font-mono-num font-semibold mb-1.5">
                      1,000 USDT Deposit
                    </div>
                    <ul className="text-[10px] space-y-1 text-slate-300">
                      <li>• Verified Gold Shield</li>
                      <li>• Top search ranking</li>
                      <li>• ₦100M ad limit</li>
                      <li>• 24/7 Priority Arbiter</li>
                    </ul>
                  </button>

                  {/* Block Desk */}
                  <button
                    type="button"
                    onClick={() => setMerchantTier('block')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      merchantTier === 'block'
                        ? 'bg-cyan-600/15 border-cyan-400 text-white shadow-md'
                        : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">VIP Block</span>
                      {merchantTier === 'block' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <div className="text-[11px] text-cyan-300 font-mono-num font-semibold mb-1.5">
                      5,000 USDT Deposit
                    </div>
                    <ul className="text-[10px] space-y-1 text-slate-300">
                      <li>• Institutional OTC</li>
                      <li>• ₦500M high limits</li>
                      <li>• 1-on-1 Account Exec</li>
                    </ul>
                  </button>
                </div>
              </div>

              {/* SECTION 2: MERCHANT OPERATIONAL OPTIONS & RULES */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    2. Merchant Trade Options & Rules
                  </span>
                  <span className="text-[11px] text-purple-400 font-semibold">Custom Config</span>
                </div>

                {/* Auto-reply Message */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Automated Counterparty Greeting (Auto-Reply)
                  </label>
                  <textarea
                    rows={2}
                    value={merchantAutoReply}
                    onChange={(e) => setMerchantAutoReply(e.target.value)}
                    placeholder="Message sent to buyer/seller instantly upon trade start..."
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                  />
                  <span className="text-[10px] text-slate-500">
                    Appears in the order chat immediately after buyer opens escrow.
                  </span>
                </div>

                {/* Payment Window Timeout */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Payment Window Timeout
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['15', '20', '30'] as const).map((window) => (
                      <button
                        key={window}
                        type="button"
                        onClick={() => setMerchantPaymentWindow(window)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                          merchantPaymentWindow === window
                            ? 'bg-purple-600/30 border-purple-500 text-white font-bold'
                            : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {window} Minutes
                      </button>
                    ))}
                  </div>
                </div>

                {/* Counterparty Safety Filters */}
                <div className="space-y-2.5 pt-1">
                  {/* Require KYC */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#080B14] border border-white/[0.06]">
                    <div>
                      <div className="text-xs font-semibold text-white">Require KYC Verification</div>
                      <div className="text-[10px] text-slate-400">Only verified users can place orders on your ads</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMerchantRequireKyc(!merchantRequireKyc)}
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {merchantRequireKyc ? (
                        <ToggleRight className="w-7 h-7 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-slate-600" />
                      )}
                    </button>
                  </div>

                  {/* Min Completed Orders */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#080B14] border border-white/[0.06]">
                    <div>
                      <div className="text-xs font-semibold text-white">Min. Counterparty Orders</div>
                      <div className="text-[10px] text-slate-400">Filter out new burner accounts with 0 trades</div>
                    </div>
                    <select
                      value={merchantMinCompletedTrades}
                      onChange={(e) => setMerchantMinCompletedTrades(Number(e.target.value))}
                      className="px-2 py-1 rounded-lg bg-[#141824] border border-white/[0.1] text-xs text-white focus:outline-none"
                    >
                      <option value={0}>0 (Any user)</option>
                      <option value={5}>At least 5 trades</option>
                      <option value={10}>At least 10 trades</option>
                      <option value={20}>At least 20 trades</option>
                    </select>
                  </div>

                  {/* Instant SMS / Telegram Alerts */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#080B14] border border-white/[0.06]">
                    <div>
                      <div className="text-xs font-semibold text-white">Instant Payment Push Alerts</div>
                      <div className="text-[10px] text-slate-400">Real-time alerts when counterparty clicks 'Paid'</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMerchantNotificationAlerts(!merchantNotificationAlerts)}
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {merchantNotificationAlerts ? (
                        <ToggleRight className="w-7 h-7 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 3: ESCROW SECURITY DEPOSIT CONFIRMATION */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="block text-white font-semibold">100% Refundable Security Deposit</strong>
                  Your merchant reserve ({merchantTier === 'standard' ? '500' : merchantTier === 'pro' ? '1,000' : '5,000'} USDT) remains safely held in the OKNexus smart escrow contract. You can deactivate merchant mode and withdraw 100% of your deposit at any time.
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMerchantActive(true);
                    setMerchantSavedSuccess(true);
                    onShowToast?.(
                      'Merchant Status Activated',
                      `You are now an active OKNexus ${merchantTier.toUpperCase()} Merchant with 0% maker fees!`,
                      'success'
                    );
                    setTimeout(() => {
                      setShowMerchantModal(false);
                      setMerchantSavedSuccess(false);
                    }, 1200);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4 fill-current" />
                  <span>
                    {isMerchantActive ? 'Save Merchant Options' : 'Confirm & Activate Merchant Status'}
                  </span>
                </button>

                {isMerchantActive && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMerchantActive(false);
                      onShowToast?.('Merchant Paused', 'Merchant status paused. You can reactivate anytime.', 'info');
                      setShowMerchantModal(false);
                    }}
                    className="py-3 px-3.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-semibold text-xs transition-all"
                  >
                    Pause Merchant
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Merchant Verified Badge Details Modal */}
      {selectedBadgeDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#0F1322] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl text-xs relative max-h-[90vh] overflow-y-auto">
            {(() => {
              const badgeInfo = {
                gold_shield: {
                  title: 'Gold Shield Verified',
                  subtitle: 'Tier 1 Certified Market Maker Badge',
                  icon: ShieldCheck,
                  iconColor: 'text-amber-400',
                  bgGlow: 'from-amber-500/20 to-orange-500/10',
                  borderColor: 'border-amber-500/40',
                  status: 'Earned & Active ✓',
                  statusBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                  criteria: [
                    'Completed KYC Level 2 Bank Identity Verification',
                    'Minimum 30-day trading volume of 5,000 USDT',
                    'At least 20 completed trades with ≥90% completion rate',
                    'Locked security escrow deposit of 500 USDT (Refundable)',
                  ],
                  benefits: [
                    '0% Maker fees on all buy/sell public advertisements',
                    'Gold verified shield displayed beside counterparty username',
                    'Increased buyer trust resulting in 30% faster order pickup',
                    'Standard priority in P2P escrow arbitration dispute queue',
                  ],
                  maintenance: 'Maintain at least 85% order completion rate. Dropping below 85% causes temporary badge pause.',
                },
                pro_crown: {
                  title: 'PRO Merchant Crown',
                  subtitle: 'Tier 2 High-Volume Desk Badge',
                  icon: Crown,
                  iconColor: 'text-purple-400',
                  bgGlow: 'from-purple-500/20 to-indigo-500/10',
                  borderColor: 'border-purple-500/40',
                  status: isMerchantActive && merchantTier === 'pro' ? 'Active ✓' : 'In Progress (74%)',
                  statusBg: isMerchantActive && merchantTier === 'pro' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                  criteria: [
                    'Minimum 30-day trading volume of 25,000 USDT',
                    'At least 100 completed orders with ≥95% completion rate',
                    'Zero unresolved fraud disputes in past 90 days',
                    'Locked security escrow deposit of 1,000 USDT (Refundable)',
                  ],
                  benefits: [
                    'Top 3 featured placement on the P2P marketplace tab',
                    'High liquidity ad limits up to ₦100,000,000 per order',
                    'Purple PRO badge and Crown icon on ads and in order chats',
                    '24/7 dedicated senior arbitration specialist with 15-min SLA',
                  ],
                  maintenance: 'Requires 25K USDT volume rolling every 30 days and average release time under 10 minutes.',
                },
                fast_release: {
                  title: 'Lightning Release (<3m)',
                  subtitle: 'Sub-3 Minute Speed Settlement Badge',
                  icon: Zap,
                  iconColor: 'text-yellow-400',
                  bgGlow: 'from-yellow-500/20 to-amber-500/10',
                  borderColor: 'border-yellow-500/40',
                  status: 'Active ✓ (Avg 2.4 min)',
                  statusBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                  criteria: [
                    'Average fiat confirmation & crypto release time under 3 minutes',
                    'Calculated dynamically over your last 50 completed orders',
                    'No delayed payment or seller timeout strikes',
                  ],
                  benefits: [
                    'Prominent yellow lightning bolt badge on all ads',
                    'Displayed at the top when buyers filter by "Fast Merchants"',
                    'Proven 45% higher click-through and completion velocity',
                    'Higher buyer loyalty and repeat customer order rates',
                  ],
                  maintenance: 'Automatically updated each time an escrow release completes. Keeps you distinguished as a rapid trader.',
                },
                vip_diamond: {
                  title: 'VIP Block Desk Diamond',
                  subtitle: 'Tier 3 Institutional OTC Partner Badge',
                  icon: Sparkles,
                  iconColor: 'text-cyan-400',
                  bgGlow: 'from-cyan-500/20 to-blue-500/10',
                  borderColor: 'border-cyan-500/40',
                  status: 'Target Requirement (100K USDT)',
                  statusBg: 'bg-slate-800 text-slate-300 border-white/10',
                  criteria: [
                    'Minimum 30-day trading volume of 100,000 USDT',
                    'At least 500 completed trades with ≥98% completion rate',
                    'Full corporate or enhanced institutional KYC clearance',
                    'Locked security escrow deposit of 5,000 USDT (Refundable)',
                  ],
                  benefits: [
                    '₦500,000,000 block trade advertisement limits',
                    'Private OTC order routing for high-net-worth buyers',
                    'Dedicated 1-on-1 VIP account manager and direct WhatsApp hotline',
                    'Zero latency settlement desk with institutional wire capabilities',
                  ],
                  maintenance: 'Requires 100,000 USDT monthly rolling volume and zero compliance strikes.',
                },
              }[selectedBadgeDetails];

              if (!badgeInfo) return null;
              const BadgeIcon = badgeInfo.icon;

              return (
                <div>
                  {/* Modal Header */}
                  <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${badgeInfo.bgGlow} border ${badgeInfo.borderColor} ${badgeInfo.iconColor} flex items-center justify-center shadow-lg`}>
                        <BadgeIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-white">{badgeInfo.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${badgeInfo.statusBg}`}>
                            {badgeInfo.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{badgeInfo.subtitle}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedBadgeDetails(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3.5 pt-3">
                    {/* Qualification Criteria */}
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-purple-400" />
                        <span>Qualification Criteria</span>
                      </div>
                      <div className="space-y-1.5 text-[11px] text-slate-300">
                        {badgeInfo.criteria.map((crit, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                            <span>{crit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Privileges & Benefits */}
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Privileges & Exclusive Perks</span>
                      </div>
                      <div className="space-y-1.5 text-[11px] text-slate-300">
                        {badgeInfo.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-purple-400 font-bold mt-0.5">★</span>
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Maintenance Policy */}
                    <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[10px] text-purple-200">
                      <strong className="block font-semibold mb-0.5">Badge Maintenance Policy:</strong>
                      {badgeInfo.maintenance}
                    </div>

                    {/* Modal Close CTA */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedBadgeDetails(null)}
                        className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all text-center"
                      >
                        Got It
                      </button>
                      {!isMerchantActive && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBadgeDetails(null);
                            setShowMerchantModal(true);
                          }}
                          className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs transition-all text-center"
                        >
                          Become Merchant
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
