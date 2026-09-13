/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MainTab, MarketPair, P2POrder, EarnProduct, CryptoAsset, PriceAlert, ToastNotificationItem, AppNotification, ThemeMode } from './types';
import {
  INITIAL_MARKET_PAIRS,
  INITIAL_ASSETS,
  INITIAL_P2P_MERCHANTS,
  INITIAL_P2P_ORDERS,
  INITIAL_P2P_ADS,
  INITIAL_RECENT_ACTIVITY,
  INITIAL_EARN_PRODUCTS,
  INITIAL_PRICE_ALERTS,
} from './data/mockData';

// Screens
import { HomeScreen } from './components/home/HomeScreen';
import { MarketsScreen } from './components/markets/MarketsScreen';
import { SpotTradeScreen } from './components/trade/SpotTradeScreen';
import { EarnScreen } from './components/earn/EarnScreen';
import { AssetsScreen } from './components/assets/AssetsScreen';
import { P2PScreen } from './components/p2p/P2PScreen';
import { AnalyticsScreen } from './components/analytics/AnalyticsScreen';
import { ExploreScreen } from './components/explore/ExploreScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { SupportCenterScreen } from './components/support/SupportCenterScreen';

// Navigation
import { BottomNav } from './components/navigation/BottomNav';
import { LeftNav } from './components/navigation/LeftNav';
import { DesktopTopBar } from './components/navigation/DesktopTopBar';

// Common
import { ToastContainer } from './components/common/ToastContainer';
import { playAlertChime } from './utils/audio';
import { safeStorage } from './utils/safeStorage';

// Authentication Screens & Modals
import { LoginScreen } from './components/auth/LoginScreen';
import { CreateAccountScreen } from './components/auth/CreateAccountScreen';
import { ForgotPasswordScreen } from './components/auth/ForgotPasswordScreen';
import { PuzzleVerificationModal } from './components/auth/PuzzleVerificationModal';
import { AuthCodeScreen } from './components/auth/AuthCodeScreen';
import { TermsPrivacyModal } from './components/auth/TermsPrivacyModal';

// Modals
import { DepositModal } from './components/modals/DepositModal';
import { WithdrawModal } from './components/modals/WithdrawModal';
import { SendModal } from './components/modals/SendModal';
import { ConvertModal } from './components/modals/ConvertModal';
import { BuySellModal } from './components/modals/BuySellModal';
import { MoreServicesModal } from './components/modals/MoreServicesModal';
import { OTCModal } from './components/modals/OTCModal';
import { RewardsModal } from './components/modals/RewardsModal';
import { ReferralModal } from './components/modals/ReferralModal';
import { ApiManagementModal } from './components/modals/ApiManagementModal';
import { PairSelectorModal } from './components/modals/PairSelectorModal';
import { AiTraderModal } from './components/modals/AiTraderModal';
import { PolymarketModal } from './components/modals/PolymarketModal';
import { MobileNotificationsSheet } from './components/navigation/MobileNotificationsSheet';
import { SettingsScreen, SettingsCategory } from './components/settings/SettingsScreen';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { PriceAlertsModal } from './components/modals/PriceAlertsModal';
import { CustomerSupportModal } from './components/support/CustomerSupportModal';
import { ScanToPayModal } from './components/modals/ScanToPayModal';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return safeStorage.getItem('oknexus_authenticated') === 'true';
  });
  const [userEmail, setUserEmail] = useState<string>('mickel.lucky@gmail.com');
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot_password'>('login');
  const [showPuzzleModal, setShowPuzzleModal] = useState<boolean>(false);
  const [showOtpScreen, setShowOtpScreen] = useState<boolean>(false);
  const [authIdentifier, setAuthIdentifier] = useState<string>('mickel.lucky@gmail.com');
  const [authType, setAuthType] = useState<'email' | 'phone'>('email');
  const [authPurpose, setAuthPurpose] = useState<'login' | 'signup' | 'recovery'>('login');
  const [isForgotVerified, setIsForgotVerified] = useState<boolean>(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);
  const [termsModalTab, setTermsModalTab] = useState<'terms' | 'privacy'>('terms');
  const [isHomeLoading, setIsHomeLoading] = useState<boolean>(true);
  const [tabLoading, setTabLoading] = useState<Record<string, boolean>>({
    home: false,
    market: false,
    trade: false,
    earn: false,
    assets: false,
    explore: false,
    analytics: false,
    p2p: false,
    profile: false,
    settings: false,
    support: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHomeLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Daylight / High-Contrast Theme State
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (safeStorage.getItem('oknexus_theme') as ThemeMode) || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    safeStorage.setItem('oknexus_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Custom User Profile State (Username & NFT/OKN/Custom Avatar)
  const [username, setUsername] = useState<string>(() => {
    return safeStorage.getItem('oknexus_username') || 'Mickel_Lucky';
  });
  const [userAvatar, setUserAvatar] = useState<string>(() => {
    return safeStorage.getItem('oknexus_avatar') || '';
  });

  const handleUpdateUsername = (newUsername: string) => {
    setUsername(newUsername);
    safeStorage.setItem('oknexus_username', newUsername);
  };

  const handleUpdateAvatar = (newAvatar: string) => {
    setUserAvatar(newAvatar);
    safeStorage.setItem('oknexus_avatar', newAvatar);
  };

  // Route URL Mapping for Dedicated Pages
  const ROUTE_MAP: Record<string, MainTab | 'p2p'> = {
    '/': 'home',
    '/home': 'home',
    '/market': 'market',
    '/markets': 'market',
    '/trade': 'trade',
    '/earn': 'earn',
    '/assets': 'assets',
    '/explore': 'explore',
    '/analytics': 'analytics',
    '/p2p': 'p2p',
    '/profile': 'profile',
    '/settings': 'settings',
    '/support': 'support',
  };

  const getInitialTab = (): MainTab | 'p2p' => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    if (ROUTE_MAP[path]) return ROUTE_MAP[path];
    const hash = window.location.hash.toLowerCase().replace('#', '').replace('/', '');
    if (hash && (ROUTE_MAP['/' + hash] || ROUTE_MAP[hash])) {
      return ROUTE_MAP['/' + hash] || ROUTE_MAP[hash];
    }
    return 'home';
  };

  // Navigation State
  const [activeTab, setActiveTab] = useState<MainTab | 'p2p'>(getInitialTab);
  const [previousTab, setPreviousTab] = useState<MainTab | 'p2p'>('home');
  const [isLeftNavCollapsed, setIsLeftNavCollapsed] = useState<boolean>(false);

  // Sync browser popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
      const target = ROUTE_MAP[path] || (window.location.hash.replace('#', '').replace('/', '') as MainTab) || 'home';
      setActiveTab(target);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTab = (targetTab: MainTab | 'p2p', updateHistory = true) => {
    if (activeTab === targetTab) return;
    setPreviousTab(activeTab);
    setActiveTab(targetTab);

    if (updateHistory && typeof window !== 'undefined') {
      const newPath = targetTab === 'home' ? '/' : `/${targetTab}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState({ tab: targetTab }, '', newPath);
      }
      const titleMap: Record<string, string> = {
        home: 'OK Nexus | Smart Crypto Exchange',
        profile: 'OK Nexus | User Profile & Verification',
        settings: 'OK Nexus | System & Security Settings',
        support: 'OK Nexus | 24/7 VIP Customer Support',
        market: 'OK Nexus | Markets',
        trade: 'OK Nexus | Spot Trading',
        earn: 'OK Nexus | Earn & Yield',
        assets: 'OK Nexus | Assets & Portfolio',
        p2p: 'OK Nexus | P2P Trading',
        explore: 'OK Nexus | Explore Web3',
        analytics: 'OK Nexus | Portfolio Analytics',
      };
      if (titleMap[targetTab]) {
        document.title = titleMap[targetTab];
      }
    }

    // Trigger skeleton loading state on page transition
    setTabLoading((prev) => ({ ...prev, [targetTab]: true }));
    setTimeout(() => {
      setTabLoading((prev) => ({ ...prev, [targetTab]: false }));
    }, 380);
  };

  // Balances
  const [balances, setBalances] = useState({
    totalAssets: 42318.65,
    pnl24hUsd: 1208.45,
    pnl24hPct: 2.93,
    spotUsd: 28412.32,
    spotUsdtEquiv: 423.14,
    fundingUsd: 8236.17,
    fundingUsdtEquiv: 122.45,
    earnUsd: 3670.16,
    earnUsdtEquiv: 54.81,
    futuresUsd: 0.0,
    futuresUsdtEquiv: 0.0,
  });

  const [showBalances, setShowBalances] = useState(true);

  // Exchange Data State
  const [marketPairs, setMarketPairs] = useState<MarketPair[]>(INITIAL_MARKET_PAIRS);
  const [assets, setAssets] = useState<CryptoAsset[]>(INITIAL_ASSETS);
  const [recentActivities, setRecentActivities] = useState(INITIAL_RECENT_ACTIVITY);
  const [earnProducts, setEarnProducts] = useState<EarnProduct[]>(INITIAL_EARN_PRODUCTS);

  // Selected Spot Pair
  const [selectedPair, setSelectedPair] = useState<MarketPair>(INITIAL_MARKET_PAIRS[0]);

  // P2P State
  const [merchants] = useState(INITIAL_P2P_MERCHANTS);
  const [p2pOrders, setP2pOrders] = useState<P2POrder[]>(INITIAL_P2P_ORDERS);
  const [p2pAds] = useState(INITIAL_P2P_ADS);

  // Modals visibility
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [isBuySellOpen, setIsBuySellOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isOtcOpen, setIsOtcOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isReferralsOpen, setIsReferralsOpen] = useState(false);
  const [isApiManagementOpen, setIsApiManagementOpen] = useState(false);
  const [isPairSelectorOpen, setIsPairSelectorOpen] = useState(false);
  const [isAiTraderOpen, setIsAiTraderOpen] = useState(false);
  const [isPolymarketOpen, setIsPolymarketOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [settingsInitialCategory, setSettingsInitialCategory] = useState<SettingsCategory>('account');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPriceAlertsOpen, setIsPriceAlertsOpen] = useState(false);
  const [alertTargetPair, setAlertTargetPair] = useState<MarketPair | undefined>(undefined);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isScanToPayOpen, setIsScanToPayOpen] = useState(false);

  const handleConfirmScanPayment = (amount: number, recipient: string) => {
    setBalances((b) => ({
      ...b,
      totalAssets: Math.max(0, b.totalAssets - amount),
      spotUsd: Math.max(0, b.spotUsd - amount),
    }));
    setRecentActivities((act) => [
      {
        id: `act-${Date.now()}`,
        type: 'withdraw',
        title: `Scan & Pay: ${recipient}`,
        subtitle: 'OKNexus Pay • 0% fee',
        amount: `-${amount.toFixed(2)} USDT`,
        time: 'Just now',
      },
      ...act,
    ]);
    setToasts((prev) => [
      {
        id: `toast-${Date.now()}`,
        title: 'Payment Sent Successfully! ⚡',
        message: `${amount.toFixed(2)} USDT transferred to ${recipient}`,
        type: 'success',
        timestamp: 'Just now',
      },
      ...prev,
    ]);
  };

  // Dedicated Page Navigators (Profile and Settings have their own dedicated page views)
  const handleOpenProfile = () => {
    navigateTab('profile');
  };

  const handleOpenSettings = (category: SettingsCategory = 'account') => {
    setSettingsInitialCategory(category);
    navigateTab('settings');
  };

  // Check if any modal / overlay is currently active
  const isAnyModalOpen =
    isDepositOpen ||
    isWithdrawOpen ||
    isSendOpen ||
    isConvertOpen ||
    isBuySellOpen ||
    isMoreOpen ||
    isOtcOpen ||
    isRewardsOpen ||
    isReferralsOpen ||
    isApiManagementOpen ||
    isPairSelectorOpen ||
    isAiTraderOpen ||
    isPolymarketOpen ||
    isNotificationsOpen ||
    isSearchOpen ||
    isPriceAlertsOpen ||
    isSupportOpen ||
    isScanToPayOpen;

  // Price Alerts & Toasts State
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(INITIAL_PRICE_ALERTS);
  const [toasts, setToasts] = useState<ToastNotificationItem[]>([]);

  // Unified App Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([
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
  ]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Open Price Alerts Modal pre-configured for a pair
  const handleOpenPriceAlerts = (pair?: MarketPair) => {
    setAlertTargetPair(pair || selectedPair);
    setIsPriceAlertsOpen(true);
  };

  // Create new price alert
  const handleCreateAlert = (alertData: Omit<PriceAlert, 'id' | 'createdAt' | 'status'>): PriceAlert => {
    const newAlert: PriceAlert = {
      ...alertData,
      id: `alt-${Date.now()}`,
      status: 'active',
      createdAt: 'Just now',
    };
    setPriceAlerts((prev) => [newAlert, ...prev]);

    // Add to unified notifications stream
    setNotifications((prev) => [
      {
        id: `notif-alt-${Date.now()}`,
        title: `Target Alert Active: ${newAlert.symbol}`,
        desc: `Alert set for when ${newAlert.symbol} price ${
          newAlert.direction === 'above' ? 'surpasses' : 'drops below'
        } $${newAlert.targetPrice.toLocaleString()}`,
        time: 'Just now',
        type: 'alert',
        category: 'alerts',
        read: false,
      },
      ...prev,
    ]);

    // Push feedback toast
    setToasts((prev) => [
      {
        id: `toast-${Date.now()}`,
        title: 'Price Alert Set! 🎯',
        message: `${newAlert.symbol} will alert when price ${
          newAlert.direction === 'above' ? 'rises above' : 'falls below'
        } $${newAlert.targetPrice.toLocaleString()}`,
        symbol: newAlert.symbol,
        targetPrice: newAlert.targetPrice,
        direction: newAlert.direction,
        type: 'success',
        timestamp: 'Just now',
      },
      ...prev.slice(0, 2),
    ]);

    return newAlert;
  };

  // Toggle active/paused status
  const handleToggleAlertStatus = (id: string) => {
    setPriceAlerts((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const next = a.status === 'active' ? 'paused' : 'active';
          return { ...a, status: next };
        }
        return a;
      })
    );
  };

  // Delete alert
  const handleDeleteAlert = (id: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== id));
    setToasts((prev) => [
      {
        id: `toast-${Date.now()}`,
        title: 'Alert Removed',
        message: 'Price target alert was deleted.',
        type: 'info',
        timestamp: 'Just now',
      },
      ...prev.slice(0, 2),
    ]);
  };

  // Edit target price or notes
  const handleEditAlert = (id: string, newTarget: number, newNotes?: string) => {
    setPriceAlerts((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            targetPrice: newTarget,
            notes: newNotes,
            status: 'active',
          };
        }
        return a;
      })
    );
    setToasts((prev) => [
      {
        id: `toast-${Date.now()}`,
        title: 'Alert Updated',
        message: `Target price updated to $${newTarget.toLocaleString()}`,
        type: 'success',
        timestamp: 'Just now',
      },
      ...prev.slice(0, 2),
    ]);
  };

  // Simulate Trigger (for testing or real-time event)
  const handleSimulateTrigger = (alert: PriceAlert) => {
    playAlertChime();
    const pair = marketPairs.find((p) => p.symbol === alert.symbol) || {
      price: alert.targetPrice,
    };

    setPriceAlerts((prev) =>
      prev.map((a) =>
        a.id === alert.id
          ? {
              ...a,
              status: alert.frequency === 'once' ? 'triggered' : 'active',
              triggeredAt: 'Just now',
            }
          : a
      )
    );

    setToasts((prev) => [
      {
        id: `toast-${Date.now()}-${alert.id}`,
        title: '🎯 Price Alert Triggered!',
        message: `${alert.symbol} reached $${pair.price.toLocaleString()} (${
          alert.direction === 'above' ? '↗ Rises Above' : '↘ Falls Below'
        } target of $${alert.targetPrice.toLocaleString()})${
          alert.notes ? ` • "${alert.notes}"` : ''
        }`,
        symbol: alert.symbol,
        targetPrice: alert.targetPrice,
        currentPrice: pair.price,
        direction: alert.direction,
        type: 'alert',
        timestamp: 'Just now',
      },
      ...prev.slice(0, 2),
    ]);

    // Push into unified notifications list as unread
    setNotifications((prev) => [
      {
        id: `notif-trig-${Date.now()}`,
        title: `🎯 ${alert.symbol} Target Price Hit!`,
        desc: `${alert.symbol} reached $${pair.price.toLocaleString()} (${alert.direction === 'above' ? 'Crossed Above' : 'Dropped Below'} target $${alert.targetPrice.toLocaleString()})`,
        time: 'Just now',
        type: 'alert',
        category: 'alerts',
        read: false,
      },
      ...prev,
    ]);

    setRecentActivities((act) => [
      {
        id: `act-${Date.now()}`,
        type: 'transfer',
        title: `Target Hit: ${alert.symbol}`,
        subtitle: `Triggered at $${alert.targetPrice.toLocaleString()}`,
        amount: `$${alert.targetPrice.toLocaleString()}`,
        time: 'Just now',
      },
      ...act,
    ]);
  };

  // Simulate market price move and evaluate active alerts
  const handleSimulatePriceMove = (symbol: string, pctDelta: number) => {
    const current = marketPairs.find((p) => p.symbol === symbol);
    if (!current) return;

    const newPrice = Math.round(current.price * (1 + pctDelta / 100) * 100) / 100;
    const newChange = Math.round((current.change24h + pctDelta) * 100) / 100;
    const updated: MarketPair = {
      ...current,
      price: newPrice,
      change24h: newChange,
      high24h: Math.max(current.high24h, newPrice),
      low24h: Math.min(current.low24h, newPrice),
      sparkline: [...current.sparkline.slice(1), newPrice],
    };

    setMarketPairs((prevPairs) =>
      prevPairs.map((pair) => (pair.symbol === symbol ? updated : pair))
    );

    if (selectedPair.symbol === symbol) {
      setSelectedPair(updated);
    }

    // Check alerts
    priceAlerts.forEach((alert) => {
      if (alert.symbol === symbol && alert.status === 'active') {
        const hitAbove = alert.direction === 'above' && updated.price >= alert.targetPrice;
        const hitBelow = alert.direction === 'below' && updated.price <= alert.targetPrice;
        if (hitAbove || hitBelow) {
          handleSimulateTrigger(alert);
        }
      }
    });
  };

  // Count active alerts
  const activeAlertsForCurrentPair = priceAlerts.filter(
    (a) => a.symbol === selectedPair.symbol && a.status === 'active'
  ).length;
  const totalActiveAlerts = priceAlerts.filter((a) => a.status === 'active').length;

  // Favorite toggle
  const handleToggleFavorite = (symbol: string) => {
    setMarketPairs((prev) =>
      prev.map((p) => (p.symbol === symbol ? { ...p, isFavorite: !p.isFavorite } : p))
    );
    if (selectedPair.symbol === symbol) {
      setSelectedPair((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
    }
  };

  // Pair Selection for Trade
  const handleSelectPairForTrade = (pair: MarketPair) => {
    setSelectedPair(pair);
    navigateTab('trade');
  };

  // Select Asset from Assets screen to trade
  const handleSelectAssetForTrade = (symbol: string) => {
    const pair = marketPairs.find((p) => p.base === symbol) || marketPairs[0];
    handleSelectPairForTrade(pair);
  };

  // Transaction Handlers
  const handleConfirmWithdraw = (amount: number, address: string) => {
    setBalances((b) => ({
      ...b,
      totalAssets: Math.max(0, b.totalAssets - amount),
      spotUsd: Math.max(0, b.spotUsd - amount),
    }));
    setRecentActivities((act) => [
      {
        id: `act-${Date.now()}`,
        type: 'withdraw',
        title: 'Withdraw USDT',
        subtitle: `To: ${address.slice(0, 6)}...${address.slice(-4)}`,
        amount: `-${amount.toFixed(2)} USDT`,
        time: 'Just now',
      },
      ...act,
    ]);
  };

  const handleConfirmSend = (amount: number, recipient: string) => {
    setBalances((b) => ({
      ...b,
      totalAssets: Math.max(0, b.totalAssets - amount),
      spotUsd: Math.max(0, b.spotUsd - amount),
    }));
    setRecentActivities((act) => [
      {
        id: `act-${Date.now()}`,
        type: 'transfer',
        title: 'Sent USDT',
        subtitle: `To: ${recipient}`,
        amount: `-${amount.toFixed(2)} USDT`,
        time: 'Just now',
      },
      ...act,
    ]);
  };

  const handleConfirmConvert = (from: string, to: string, fromAmt: number, toAmt: number) => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.symbol === from) {
          return { ...a, balance: Math.max(0, a.balance - fromAmt) };
        }
        if (a.symbol === to) {
          return { ...a, balance: a.balance + toAmt };
        }
        return a;
      })
    );
    setRecentActivities((act) => [
      {
        id: `act-${Date.now()}`,
        type: 'buy',
        title: `Converted ${from} to ${to}`,
        subtitle: 'Instant Swap 0% Fee',
        amount: `+${toAmt.toFixed(4)} ${to}`,
        time: 'Just now',
      },
      ...act,
    ]);
  };

  const handleStakeProduct = (product: EarnProduct, amount: number) => {
    setBalances((b) => ({
      ...b,
      earnUsd: b.earnUsd + amount,
    }));
    setRecentActivities((act) => [
      {
        id: `act-${Date.now()}`,
        type: 'deposit',
        title: `Staked ${product.asset}`,
        subtitle: `${product.name} @ ${product.apy}% APY`,
        amount: `+${amount} ${product.asset}`,
        time: 'Just now',
      },
      ...act,
    ]);
  };

  const handlePlaceP2POrder = (order: P2POrder) => {
    setP2pOrders((prev) => [order, ...prev]);
    setRecentActivities((act) => [
      {
        id: `act-${Date.now()}`,
        type: order.type === 'buy' ? 'buy' : 'sell',
        title: `P2P ${order.type.toUpperCase()} ${order.cryptoSymbol}`,
        subtitle: `Merchant: ${order.merchantName}`,
        amount: `${order.type === 'buy' ? '+' : '-'}${order.cryptoAmount} ${order.cryptoSymbol}`,
        time: 'Just now',
      },
      ...act,
    ]);
  };

  // Helper values for Spot screen
  const usdtAsset = assets.find((a) => a.symbol === 'USDT')?.balance || 10540.22;
  const currentBaseAsset =
    assets.find((a) => a.symbol === selectedPair.base)?.balance || 0.452;
  const btcAsset = assets.find((a) => a.symbol === 'BTC')?.balance || 0.452;

  // Authentication Handlers
  const handleStartAuthFlow = (
    identifier: string,
    type: 'email' | 'phone',
    purpose: 'login' | 'signup' | 'recovery'
  ) => {
    setAuthIdentifier(identifier);
    setAuthType(type);
    setAuthPurpose(purpose);
    setShowPuzzleModal(true);
  };

  const handlePuzzleSuccess = () => {
    setShowPuzzleModal(false);
    setShowOtpScreen(true);
  };

  const handleOtpComplete = (code: string) => {
    setShowOtpScreen(false);
    if (authPurpose === 'recovery') {
      setIsForgotVerified(true);
      return;
    }

    // Login or Signup Complete!
    setIsAuthenticated(true);
    safeStorage.setItem('oknexus_authenticated', 'true');
    setUserEmail(authIdentifier);
    setIsHomeLoading(true);
    setTimeout(() => {
      setIsHomeLoading(false);
    }, 800);

    setToasts((prev) => [
      {
        id: `toast-${Date.now()}`,
        title: authPurpose === 'signup' ? 'Account Created! 🚀' : 'Welcome Back to OKNexus! 👋',
        message: `Signed in as ${authIdentifier}. Your mobile trading desk is ready.`,
        type: 'success',
        timestamp: 'Just now',
      },
      ...prev,
    ]);
  };

  const handleSocialSuccess = (provider: 'google' | 'apple') => {
    const socialAccount = provider === 'google' ? 'mickel.lucky@gmail.com' : 'apple.trader@icloud.com';

    setIsAuthenticated(true);
    safeStorage.setItem('oknexus_authenticated', 'true');
    setUserEmail(socialAccount);
    setIsHomeLoading(true);
    setTimeout(() => {
      setIsHomeLoading(false);
    }, 800);

    setToasts((prev) => [
      {
        id: `toast-${Date.now()}`,
        title: `Signed in with ${provider === 'google' ? 'Google' : 'Apple'} ✓`,
        message: `Connected via ${socialAccount}`,
        type: 'success',
        timestamp: 'Just now',
      },
      ...prev,
    ]);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    safeStorage.removeItem('oknexus_authenticated');
    setAuthView('login');
    setShowPuzzleModal(false);
    setShowOtpScreen(false);
    setIsForgotVerified(false);
    setActiveTab('home');

    setToasts((prev) => [
      {
        id: `toast-${Date.now()}`,
        title: 'Signed Out',
        message: 'You have been safely signed out of OKNexus.',
        type: 'info',
        timestamp: 'Just now',
      },
      ...prev,
    ]);
  };

  // Render Authentication Flow if not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-purple-500 selection:text-white relative">
        {showOtpScreen ? (
          <AuthCodeScreen
            identifier={authIdentifier}
            type={authType}
            identifierType={authType}
            onComplete={handleOtpComplete}
            onSuccess={() => handleOtpComplete('123456')}
            onBack={() => setShowOtpScreen(false)}
            onChangeIdentifier={() => setShowOtpScreen(false)}
            purpose={authPurpose}
          />
        ) : authView === 'login' ? (
          <LoginScreen
            onContinue={(id, type) => handleStartAuthFlow(id, type, 'login')}
            onNavigateCreateAccount={() => setAuthView('signup')}
            onNavigateForgotPassword={() => {
              setIsForgotVerified(false);
              setAuthView('forgot_password');
            }}
            onOpenTerms={() => {
              setTermsModalTab('terms');
              setIsTermsModalOpen(true);
            }}
            onOpenPrivacy={() => {
              setTermsModalTab('privacy');
              setIsTermsModalOpen(true);
            }}
            onSocialSuccess={handleSocialSuccess}
            theme={theme}
            onToggleTheme={handleToggleTheme}
          />
        ) : authView === 'signup' ? (
          <CreateAccountScreen
            onContinue={(id, type) => handleStartAuthFlow(id, type, 'signup')}
            onNavigateLogin={() => setAuthView('login')}
            onOpenTerms={() => {
              setTermsModalTab('terms');
              setIsTermsModalOpen(true);
            }}
            onOpenPrivacy={() => {
              setTermsModalTab('privacy');
              setIsTermsModalOpen(true);
            }}
          />
        ) : (
          <ForgotPasswordScreen
            onStartVerification={(id, type) => handleStartAuthFlow(id, type, 'recovery')}
            onNavigateLogin={() => setAuthView('login')}
            isVerified={isForgotVerified}
            onResetComplete={() => {
              setIsForgotVerified(false);
              setAuthView('login');
            }}
          />
        )}

        {/* Human Verification Slider Puzzle Modal */}
        <PuzzleVerificationModal
          isOpen={showPuzzleModal}
          onSuccess={handlePuzzleSuccess}
          onClose={() => setShowPuzzleModal(false)}
        />

        {/* Legal & Privacy Policy Modal */}
        <TermsPrivacyModal
          isOpen={isTermsModalOpen}
          initialTab={termsModalTab}
          onClose={() => setIsTermsModalOpen(false)}
        />

        {/* Global Toast Stack in Auth */}
        <ToastContainer
          toasts={toasts}
          onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#07090E] text-slate-900 dark:text-slate-100 selection:bg-purple-500 selection:text-white flex overflow-hidden transition-colors">
      {/* Left Navigation Menu (for Web and Tablet) */}
      <LeftNav
        activeTab={activeTab}
        onSelectTab={(tab) => navigateTab(tab)}
        balances={balances}
        showBalances={showBalances}
        onToggleShowBalances={() => setShowBalances(!showBalances)}
        onOpenDeposit={() => setIsDepositOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenPriceAlerts={() => handleOpenPriceAlerts()}
        activeAlertsCount={totalActiveAlerts}
        onOpenAiTrader={() => setIsAiTraderOpen(true)}
        onOpenPolymarket={() => setIsPolymarketOpen(true)}
        onOpenRewards={() => setIsRewardsOpen(true)}
        onOpenSupport={() => navigateTab('support')}
        onOpenProfile={handleOpenProfile}
        onOpenSettings={handleOpenSettings}
        userEmail={userEmail}
        username={username}
        userAvatar={userAvatar}
        isCollapsed={isLeftNavCollapsed}
        onToggleCollapse={() => setIsLeftNavCollapsed(!isLeftNavCollapsed)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto overflow-x-hidden relative bg-white dark:bg-[#07090E] transition-colors">
        {/* Desktop Top Utility Bar */}
        {activeTab !== 'p2p' && (
          <DesktopTopBar
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenDeposit={() => setIsDepositOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            unreadNotificationsCount={unreadNotificationsCount}
            notifications={notifications}
            onMarkNotificationAsRead={handleMarkNotificationAsRead}
            onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
            onOpenPriceAlerts={() => handleOpenPriceAlerts()}
            activeAlertsCount={totalActiveAlerts}
            onOpenSupport={() => navigateTab('support')}
            onOpenProfile={handleOpenProfile}
            onOpenSettings={handleOpenSettings}
            userEmail={userEmail}
            username={username}
            userAvatar={userAvatar}
            selectedPair={selectedPair}
            theme={theme}
            onToggleTheme={handleToggleTheme}
          />
        )}

        {/* Active Screen View (Direct Navigation - No horizontal swipe gestures) */}
        <main id="main-content" className="flex-1 w-full min-h-screen">
          {activeTab === 'home' && (
            <HomeScreen
              balances={balances}
              marketPairs={marketPairs}
              recentActivities={recentActivities}
              showBalances={showBalances}
              onToggleShowBalances={() => setShowBalances(!showBalances)}
              onOpenDeposit={() => setIsDepositOpen(true)}
              onOpenWithdraw={() => setIsWithdrawOpen(true)}
              onOpenSend={() => setIsSendOpen(true)}
              onOpenConvert={() => setIsConvertOpen(true)}
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              unreadNotificationsCount={unreadNotificationsCount}
              notifications={notifications}
              onMarkNotificationAsRead={handleMarkNotificationAsRead}
              onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
              onOpenProfile={handleOpenProfile}
              onOpenScanToPay={() => setIsScanToPayOpen(true)}
              onOpenAiTrader={() => setIsAiTraderOpen(true)}
              onOpenPolymarket={() => setIsPolymarketOpen(true)}
              onOpenPriceAlerts={() => handleOpenPriceAlerts()}
              activeAlertsCount={totalActiveAlerts}
              onSelectPair={handleSelectPairForTrade}
              onNavigateMarkets={() => navigateTab('market')}
              onNavigateTrade={() => navigateTab('trade')}
              onNavigateWallet={() => navigateTab('assets')}
              onNavigateEarn={() => navigateTab('earn')}
              onNavigateP2P={() => navigateTab('p2p')}
              onNavigateExplore={() => navigateTab('explore')}
              onNavigateAnalytics={() => navigateTab('analytics')}
              onOpenBuySell={() => setIsBuySellOpen(true)}
              onOpenMore={() => setIsMoreOpen(true)}
              onOpenSupport={() => navigateTab('support')}
              isLoading={isHomeLoading || tabLoading['home']}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              username={username}
              userAvatar={userAvatar}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreScreen
              theme={theme}
              onToggleTheme={handleToggleTheme}
              onSelectPairForTrade={(symbol) => {
                const pair = marketPairs.find((p) => p.symbol === symbol) || marketPairs[0];
                handleSelectPairForTrade(pair);
              }}
              onOpenConvert={() => setIsConvertOpen(true)}
              onOpenAiTrader={() => setIsAiTraderOpen(true)}
              onOpenPolymarket={() => setIsPolymarketOpen(true)}
              onBack={() => navigateTab(previousTab === 'explore' ? 'home' : previousTab)}
              isLoading={tabLoading['explore']}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsScreen
              theme={theme}
              onToggleTheme={handleToggleTheme}
              onNavigateTrade={() => navigateTab('trade')}
              onNavigateMarkets={() => navigateTab('market')}
              onOpenDeposit={() => setIsDepositOpen(true)}
              onBack={() => navigateTab(previousTab === 'analytics' ? 'home' : previousTab)}
              isLoading={tabLoading['analytics']}
            />
          )}

          {activeTab === 'market' && (
            <MarketsScreen
              marketPairs={marketPairs}
              onSelectPair={handleSelectPairForTrade}
              onToggleFavorite={handleToggleFavorite}
              onOpenPriceAlerts={(pair) => handleOpenPriceAlerts(pair)}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              isLoading={tabLoading['market']}
            />
          )}

          {activeTab === 'trade' && (
            <SpotTradeScreen
              selectedPair={selectedPair}
              availableUsdt={usdtAsset}
              availableCrypto={currentBaseAsset}
              onOpenPairSelector={() => setIsPairSelectorOpen(true)}
              onOpenDeposit={() => setIsDepositOpen(true)}
              onToggleFavorite={handleToggleFavorite}
              onOpenPriceAlerts={(pair) => handleOpenPriceAlerts(pair)}
              activeAlertsCount={activeAlertsForCurrentPair}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              isLoading={tabLoading['trade']}
            />
          )}

          {activeTab === 'earn' && (
            <EarnScreen
              products={earnProducts}
              totalEarnedUsd={balances.earnUsd}
              onStakeProduct={handleStakeProduct}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              isLoading={tabLoading['earn']}
            />
          )}

          {activeTab === 'assets' && (
            <AssetsScreen
              balances={balances}
              assets={assets}
              showBalances={showBalances}
              onToggleShowBalances={() => setShowBalances(!showBalances)}
              onOpenDeposit={() => setIsDepositOpen(true)}
              onOpenWithdraw={() => setIsWithdrawOpen(true)}
              onOpenSend={() => setIsSendOpen(true)}
              onOpenConvert={() => setIsConvertOpen(true)}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onSelectAssetForTrade={handleSelectAssetForTrade}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              isLoading={tabLoading['assets']}
            />
          )}

          {activeTab === 'p2p' && (
            <P2PScreen
              merchants={merchants}
              orders={p2pOrders}
              ads={p2pAds}
              onExitP2P={() => navigateTab('home')}
              onPlaceP2POrder={handlePlaceP2POrder}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              isLoading={tabLoading['p2p']}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              userEmail={userEmail}
              uid="8829410"
              username={username}
              onUpdateUsername={handleUpdateUsername}
              userAvatar={userAvatar}
              onUpdateAvatar={handleUpdateAvatar}
              onSignOut={handleSignOut}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              onOpenSupport={() => navigateTab('support')}
              onOpenAnalytics={() => navigateTab('analytics')}
              onOpenApiManagement={() => setIsApiManagementOpen(true)}
              onOpenSettings={(cat) => handleOpenSettings(cat)}
              onBack={() => navigateTab(previousTab === 'profile' ? 'home' : previousTab)}
              isLoading={tabLoading['profile']}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen
              userEmail={userEmail}
              uid="8829410"
              username={username}
              onUpdateUsername={handleUpdateUsername}
              userAvatar={userAvatar}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              onOpenSupport={() => navigateTab('support')}
              onOpenProfile={handleOpenProfile}
              onBack={() => navigateTab(previousTab === 'settings' ? 'home' : previousTab)}
              initialCategory={settingsInitialCategory}
              isLoading={tabLoading['settings']}
            />
          )}

          {activeTab === 'support' && (
            <SupportCenterScreen
              onBack={() => navigateTab(previousTab === 'support' ? 'home' : previousTab)}
              onOpenDeposit={() => setIsDepositOpen(true)}
              onOpenWithdraw={() => setIsWithdrawOpen(true)}
              onOpenTrade={() => navigateTab('trade')}
              onOpenP2P={() => navigateTab('p2p')}
              onOpenAiTrader={() => setIsAiTraderOpen(true)}
              onOpenSecurity={() => handleOpenSettings('security')}
              userEmail={userEmail}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              isLoading={tabLoading['support']}
            />
          )}
        </main>

        {/* Global Mobile Bottom Navigation Bar */}
        {activeTab !== 'p2p' && (
          <BottomNav
            activeTab={activeTab as MainTab}
            onSelectTab={(tab) => navigateTab(tab)}
          />
        )}
      </div>

      {/* Modals & Bottom Sheets */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onDepositSuccess={(amount, currency, isFiat) => {
          setBalances((b) => ({
            ...b,
            totalAssets: b.totalAssets + amount,
            spotUsd: b.spotUsd + amount,
          }));
          setRecentActivities((act) => [
            {
              id: `act-${Date.now()}`,
              type: 'deposit',
              title: `${isFiat ? 'Fiat' : 'Crypto'} Deposit: ${currency}`,
              subtitle: 'Instant credit • 0% fee',
              amount: `+${amount.toLocaleString()} ${currency}`,
              time: 'Just now',
            },
            ...act,
          ]);
          setToasts((prev) => [
            {
              id: `toast-${Date.now()}`,
              title: `${currency} Deposit Received`,
              message: `+${amount.toLocaleString()} ${currency} credited to your wallet balance.`,
              type: 'success',
              timestamp: 'Just now',
            },
            ...prev,
          ]);
        }}
      />

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        availableUsdt={usdtAsset}
        onConfirmWithdraw={handleConfirmWithdraw}
      />

      <SendModal
        isOpen={isSendOpen}
        onClose={() => setIsSendOpen(false)}
        availableUsdt={usdtAsset}
        onConfirmSend={handleConfirmSend}
      />

      <ConvertModal
        isOpen={isConvertOpen}
        onClose={() => setIsConvertOpen(false)}
        availableUsdt={usdtAsset}
        availableBtc={btcAsset}
        onConfirmConvert={handleConfirmConvert}
      />

      <PairSelectorModal
        isOpen={isPairSelectorOpen}
        onClose={() => setIsPairSelectorOpen(false)}
        marketPairs={marketPairs}
        onSelectPair={handleSelectPairForTrade}
      />

      <AiTraderModal
        isOpen={isAiTraderOpen}
        onClose={() => setIsAiTraderOpen(false)}
        onActivateStrategy={(s) => {
          setRecentActivities((act) => [
            {
              id: `act-${Date.now()}`,
              type: 'transfer',
              title: `AI Bot Activated: ${s.toUpperCase()}`,
              subtitle: '24/7 Grid Algorithm Active',
              amount: 'Active',
              time: 'Just now',
            },
            ...act,
          ]);
        }}
      />

      <PolymarketModal
        isOpen={isPolymarketOpen}
        onClose={() => setIsPolymarketOpen(false)}
      />

      {/* Mobile Notifications Bottom Sheet */}
      <MobileNotificationsSheet
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onOpenPriceAlerts={() => handleOpenPriceAlerts()}
        activeAlertsCount={totalActiveAlerts}
      />

      {/* Instant Buy / Sell Modal */}
      <BuySellModal
        isOpen={isBuySellOpen}
        onClose={() => setIsBuySellOpen(false)}
        onNavigateTrade={() => {
          setIsBuySellOpen(false);
          navigateTab('trade');
        }}
        onNavigateP2P={() => {
          setIsBuySellOpen(false);
          navigateTab('p2p');
        }}
        onSuccess={(type, coin, fiat, crypto) => {
          setRecentActivities((act) => [
            {
              id: `act-${Date.now()}`,
              type: type === 'buy' ? 'deposit' : 'withdraw',
              title: `${type === 'buy' ? 'Bought' : 'Sold'} ${coin}`,
              subtitle: `Zero-fee express order`,
              amount: `${type === 'buy' ? '+' : '-'}${crypto.toFixed(4)} ${coin}`,
              time: 'Just now',
            },
            ...act,
          ]);
          setToasts((prev) => [
            {
              id: `toast-${Date.now()}`,
              title: `${type === 'buy' ? 'Bought' : 'Sold'} ${coin} Successfully! 🎉`,
              message: `${crypto.toFixed(4)} ${coin} processed via Express Gateway.`,
              type: 'success',
              timestamp: 'Just now',
            },
            ...prev,
          ]);
        }}
      />

      {/* Secondary Services Hub (More Tile) */}
      <MoreServicesModal
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        onNavigateP2P={() => navigateTab('p2p')}
        onNavigateExplore={() => {
          setIsMoreOpen(false);
          navigateTab('explore');
        }}
        onNavigateAnalytics={() => {
          setIsMoreOpen(false);
          navigateTab('analytics');
        }}
        onOpenOTC={() => setIsOtcOpen(true)}
        onOpenRewards={() => setIsRewardsOpen(true)}
        onOpenReferrals={() => setIsReferralsOpen(true)}
        onOpenApiManagement={() => setIsApiManagementOpen(true)}
        onOpenPriceAlerts={() => handleOpenPriceAlerts()}
        onOpenSettings={(cat) => {
          setIsMoreOpen(false);
          handleOpenSettings(cat || 'account');
        }}
        onOpenProfile={() => {
          setIsMoreOpen(false);
          handleOpenProfile();
        }}
        onOpenSupport={() => {
          setIsMoreOpen(false);
          navigateTab('support');
        }}
        onSignOut={handleSignOut}
      />

      {/* OTC Block Trading Modal */}
      <OTCModal
        isOpen={isOtcOpen}
        onClose={() => setIsOtcOpen(false)}
      />

      {/* Rewards Hub Modal */}
      <RewardsModal
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
      />

      {/* Referral Program Modal */}
      <ReferralModal
        isOpen={isReferralsOpen}
        onClose={() => setIsReferralsOpen(false)}
      />

      {/* API Key Management Modal */}
      <ApiManagementModal
        isOpen={isApiManagementOpen}
        onClose={() => setIsApiManagementOpen(false)}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        marketPairs={marketPairs}
        onSelectPair={handleSelectPairForTrade}
        onOpenAiTrader={() => setIsAiTraderOpen(true)}
        onOpenPolymarket={() => setIsPolymarketOpen(true)}
        onNavigateP2P={() => navigateTab('p2p')}
        onOpenPriceAlerts={() => handleOpenPriceAlerts()}
      />

      {/* Price Alert Management Modal */}
      <PriceAlertsModal
        isOpen={isPriceAlertsOpen}
        onClose={() => setIsPriceAlertsOpen(false)}
        alerts={priceAlerts}
        marketPairs={marketPairs}
        initialPair={alertTargetPair || selectedPair}
        onCreateAlert={handleCreateAlert}
        onToggleStatus={handleToggleAlertStatus}
        onDeleteAlert={handleDeleteAlert}
        onEditAlert={handleEditAlert}
        onTradePair={(symbol) => {
          const pair = marketPairs.find((p) => p.symbol === symbol) || marketPairs[0];
          handleSelectPairForTrade(pair);
        }}
        onSimulateTrigger={handleSimulateTrigger}
        onSimulatePriceMove={handleSimulatePriceMove}
      />

      {/* Instant Scan to Pay Modal */}
      <ScanToPayModal
        isOpen={isScanToPayOpen}
        onClose={() => setIsScanToPayOpen(false)}
        availableUsdt={balances.spotUsd}
        username={username}
        onConfirmPayment={handleConfirmScanPayment}
      />

      {/* 24/7 AI VIP Customer Support Modal */}
      <CustomerSupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        onOpenDeposit={() => {
          setIsSupportOpen(false);
          setIsDepositOpen(true);
        }}
        onOpenWithdraw={() => {
          setIsSupportOpen(false);
          setIsWithdrawOpen(true);
        }}
        onOpenTrade={() => {
          setIsSupportOpen(false);
          navigateTab('trade');
        }}
        onOpenP2P={() => {
          setIsSupportOpen(false);
          navigateTab('p2p');
        }}
        onOpenAiTrader={() => {
          setIsSupportOpen(false);
          setIsAiTraderOpen(true);
        }}
        onOpenPriceAlerts={() => {
          setIsSupportOpen(false);
          handleOpenPriceAlerts();
        }}
        onOpenSecurity={() => {
          setIsSupportOpen(false);
          handleOpenSettings('security');
        }}
        onOpenEarn={() => {
          setIsSupportOpen(false);
          navigateTab('earn');
        }}
        userEmail={userEmail}
        balances={{
          totalAssets: balances.totalAssets,
          spotUsd: balances.spotUsd,
          fundingUsd: balances.fundingUsd,
          earnUsd: balances.earnUsd,
        }}
      />

      {/* Global In-App Toast Notification Stack */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
        onTradePair={(symbol) => {
          const pair = marketPairs.find((p) => p.symbol === symbol) || marketPairs[0];
          handleSelectPairForTrade(pair);
        }}
        onOpenAlertsModal={() => setIsPriceAlertsOpen(true)}
      />
    </div>
  );
}

