export type MainTab = 'home' | 'market' | 'trade' | 'earn' | 'assets';
export type P2PTab = 'p2p_market' | 'p2p_orders' | 'p2p_ads' | 'p2p_profile';

export interface CryptoAsset {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  price: number;
  change24h: number;
  sparkline: number[];
  color: string;
}

export interface MarketPair {
  symbol: string;
  base: string;
  quote: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  volumeQuote: number;
  sparkline: number[];
  isFavorite: boolean;
  category: 'hot' | 'gainers' | 'new' | 'losers';
}

export interface OrderBookItem {
  price: number;
  amount: number;
  total: number;
  depthPct: number;
}

export interface TradeHistoryItem {
  id: string;
  price: number;
  amount: number;
  time: string;
  type: 'buy' | 'sell';
}

export interface OpenOrder {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market' | 'stop_limit';
  price: number;
  amount: number;
  filled: number;
  time: string;
  status: 'open' | 'partial' | 'completed' | 'cancelled';
}

export interface EarnProduct {
  id: string;
  asset: string;
  name: string;
  category: 'flexible' | 'fixed' | 'launchpad';
  apy: number;
  durationDays?: number;
  minAmount: number;
  userStaked: number;
  earnedToday: number;
}

export interface P2PMerchant {
  id: string;
  name: string;
  isVerified: boolean;
  ordersCount: number;
  completionRate: number;
  avgReleaseMin: number;
  pricePerUnit: number;
  fiatCurrency: string;
  availableCrypto: number;
  cryptoSymbol: string;
  minLimit: number;
  maxLimit: number;
  paymentMethods: string[];
  tradeVolume?: number; // 30-day trade volume in USDT
  feedbackScore?: number; // Positive feedback score percentage (e.g. 99.2%)
  trustScore?: number; // Dynamic Trust Score (0-100)
}

export interface P2PTrustScoreData {
  totalScore: number; // 0 - 100
  tier: 'Exceptional' | 'High Trust' | 'Moderate Trust' | 'Low Trust';
  tierColor: string;
  badgeLabel: string;
  tradeHistoryScore: {
    total: number; // Max 40
    completionRateScore: number; // Max 18
    volumeScore: number; // Max 14
    ordersCountScore: number; // Max 8
    ordersCount: number;
    completionRate: number;
    volume: number;
  };
  identityScore: {
    total: number; // Max 35
    govIdScore: number; // Max 18
    bankScore: number; // Max 9
    twoFactorScore: number; // Max 5
    addressScore: number; // Max 3
    isGovIdVerified: boolean;
    isBankVerified: boolean;
    is2faEnabled: boolean;
    isAddressVerified: boolean;
  };
  feedbackScore: {
    total: number; // Max 25
    positiveRateScore: number; // Max 15
    disputeFreeScore: number; // Max 6
    speedScore: number; // Max 4
    positivePercent: number;
    disputeCount: number;
    avgReleaseMin: number;
  };
}

export type P2POrderStatus =
  | 'pending_payment'
  | 'payment_submitted'
  | 'payment_verification'
  | 'crypto_released'
  | 'completed'
  | 'cancelled'
  | 'expired'
  | 'disputed';

export interface P2PPaymentDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  referenceCode?: string;
  referenceMemo?: string;
  paymentWindowMinutes?: number;
  paymentDeadline?: string;
}

export interface P2PChatMessage {
  id: string;
  sender: 'buyer' | 'seller' | 'system' | 'arbiter';
  senderName: string;
  text: string;
  timestamp: string;
  attachmentUrl?: string;
  attachmentName?: string;
  isEvidence?: boolean;
}

export interface P2POrderTimelineItem {
  id: string;
  status: string;
  title: string;
  description: string;
  timestamp: string;
  actor: 'buyer' | 'seller' | 'system' | 'arbiter';
}

export interface P2PDisputeTimelineItem {
  id: string;
  status: 'dispute_opened' | 'evidence_collection' | 'under_review' | 'decision_made' | 'resolved';
  title: string;
  description: string;
  timestamp: string;
  actor: 'buyer' | 'seller' | 'system' | 'arbiter';
}

export interface P2PDisputeInfo {
  id: string;
  orderId: string;
  openedBy: 'buyer' | 'seller';
  reason: string;
  description: string;
  status: 'opened' | 'evidence_collection' | 'under_review' | 'decision_made' | 'resolved';
  createdAt: string;
  evidenceBuyer: string[];
  evidenceSeller: string[];
  timeline: P2PDisputeTimelineItem[];
  resolution?: {
    decision: 'release_to_buyer' | 'refund_to_seller' | 'mutual_cancellation';
    reason: string;
    releasedAmount: number;
    cryptoSymbol: string;
    fiatAmount: number;
    fiatCurrency: string;
    resolvedAt: string;
    arbiterId: string;
  };
}

export interface P2POrder {
  id: string;
  type: 'buy' | 'sell';
  merchantName: string;
  merchantId?: string;
  buyerName?: string;
  cryptoAmount: number;
  cryptoSymbol: string;
  fiatAmount: number;
  fiatCurrency: string;
  unitPrice: number;
  paymentMethod: string;
  status: P2POrderStatus | 'pending'; // backwards compatible with 'pending'
  createdAt: string;
  paymentDetails?: P2PPaymentDetails;
  chatMessages?: P2PChatMessage[];
  timeline?: P2POrderTimelineItem[];
  paymentProofUrl?: string;
  paidAt?: string;
  releasedAt?: string;
  dispute?: P2PDisputeInfo;
}

export interface PromotionalBanner {
  id: string;
  tag: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  actionType: 'p2p' | 'ai_trader' | 'polymarket' | 'markets' | 'earn' | 'deposit';
  badgeColor: string;
  accentColor: string;
  statsHighlight: string;
  artType: 'ai_grid' | 'p2p_trophy' | 'token_vault' | 'arena' | 'prediction' | 'listing';
}

export interface UserDeviceSession {
  id: string;
  deviceName: string;
  browser: string;
  os: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
  status: 'active' | 'terminated';
}

export interface UserLoginRecord {
  id: string;
  deviceName: string;
  location: string;
  ipAddress: string;
  timestamp: string;
  status: 'success' | 'blocked' | 'suspicious';
}

export interface UserSecurityProfile {
  twoFactorEnabled: boolean;
  twoFactorSecretKey: string;
  backupCodes: string[];
  antiPhishingCode: string;
  withdrawalWhitelistOnly: boolean;
  withdrawalLockOnSecChange: boolean;
  newDeviceAlertsEnabled: boolean;
  passwordLastChanged: string;
  sessions: UserDeviceSession[];
  loginHistory: UserLoginRecord[];
}

export interface P2PAd {
  id: string;
  type: 'buy' | 'sell';
  cryptoSymbol: string;
  price: number;
  fiatCurrency: string;
  available: number;
  minLimit: number;
  maxLimit: number;
  paymentMethods: string[];
  status: 'active' | 'paused';
}

export interface Announcement {
  id: string;
  title: string;
  tag: string;
  desc: string;
  time: string;
  linkText?: string;
  action?: () => void;
}

export type PriceAlertDirection = 'above' | 'below';
export type PriceAlertFrequency = 'once' | 'recurring';
export type PriceAlertStatus = 'active' | 'triggered' | 'paused';

export interface PriceAlert {
  id: string;
  symbol: string; // e.g. "BTC/USDT"
  base: string; // e.g. "BTC"
  quote: string; // e.g. "USDT"
  targetPrice: number;
  direction: PriceAlertDirection; // 'above' | 'below'
  frequency: PriceAlertFrequency; // 'once' | 'recurring'
  status: PriceAlertStatus; // 'active' | 'triggered' | 'paused'
  currentPriceAtCreation: number;
  notes?: string;
  createdAt: string;
  triggeredAt?: string;
}

export interface ToastNotificationItem {
  id: string;
  title: string;
  message: string;
  symbol?: string;
  targetPrice?: number;
  currentPrice?: number;
  direction?: PriceAlertDirection;
  type?: 'alert' | 'success' | 'info';
  timestamp: string;
  onAction?: () => void;
  actionLabel?: string;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  time: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdraw' | 'transfer';
  status: 'completed' | 'pending';
}

export type ThemeMode = 'dark' | 'light';

export interface AppNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'success' | 'bot' | 'security' | 'alert';
  category: 'trading' | 'system' | 'alerts';
  read: boolean;
  actionPairSymbol?: string;
}

export type SupportAgentMode = 'ai' | 'human';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  action?: 'open_deposit' | 'open_withdraw' | 'open_trade' | 'open_p2p' | 'open_ai_trader' | 'open_alerts' | 'open_security' | 'open_earn' | string;
  actionLabel?: string;
  suggestions?: string[];
  feedback?: 'up' | 'down';
  source?: 'gemini-ai' | 'nexus-knowledgebase' | 'human-agent';
}

export interface SupportFaqItem {
  id: string;
  category: 'deposit' | 'security' | 'trading' | 'bot' | 'p2p' | 'earn';
  question: string;
  answer: string;
  action?: string;
  actionLabel?: string;
}

export interface CryptoNewsItem {
  id: string;
  title: string;
  summary: string;
  coinSymbol: string;
  publisher: string;
  timeAgo: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  category: 'ETF' | 'Ecosystem' | 'Market' | 'Regulation' | 'Tech';
  url?: string;
  sourceDomain?: string;
  impact?: 'High' | 'Medium' | 'Trending';
  relatedPair?: string;
}


