/**
 * OKNexus Exchange - Centralized Backend API Endpoints & Contracts
 *
 * This file serves as the single source of truth for all REST endpoints,
 * WebSocket channels, and integration schemas. Backend developers can implement
 * services to match these structured paths.
 */

export const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) ||
  '';

export const WS_BASE_URL =
  (typeof process !== 'undefined' && process.env?.VITE_WS_BASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_WS_BASE_URL) ||
  'wss://api.oknexus.com/ws';

export const ENDPOINTS = {
  // ----------------------------------------------------
  // 1. AUTHENTICATION & SECURITY
  // ----------------------------------------------------
  AUTH: {
    LOGIN: '/api/auth/login',                           // POST { email, password, captchaToken }
    REGISTER: '/api/auth/register',                     // POST { email, password, referralCode }
    LOGOUT: '/api/auth/logout',                         // POST {}
    SESSION: '/api/auth/session',                       // GET -> { authenticated, user }
    SEND_OTP: '/api/auth/otp/send',                     // POST { target: email|phone, type: login|signup|recovery }
    VERIFY_OTP: '/api/auth/otp/verify',                 // POST { target, code }
    FORGOT_PASSWORD: '/api/auth/forgot-password',       // POST { email }
    RESET_PASSWORD: '/api/auth/reset-password',         // POST { token, newPassword }
    SOCIAL_LOGIN: '/api/auth/social',                   // POST { provider: google|apple|telegram|facebook, idToken }
    PUZZLE_CHALLENGE: '/api/auth/puzzle/challenge',     // GET -> { puzzleId, bgUrl, pieceUrl, y }
    PUZZLE_VERIFY: '/api/auth/puzzle/verify',           // POST { puzzleId, offsetPercent }
  },

  // ----------------------------------------------------
  // 2. USER PROFILE & PREFERENCES
  // ----------------------------------------------------
  USER: {
    PROFILE: '/api/user/profile',                       // GET, PUT { username, avatar, bio }
    SECURITY_SETTINGS: '/api/user/security',            // GET, PUT { twoFactorEnabled, antiPhishingCode }
    KYC_STATUS: '/api/user/kyc/status',                 // GET -> { tier: 0|1|2, status: verified|pending|none }
    KYC_SUBMIT: '/api/user/kyc/submit',                 // POST (multipart document upload)
    API_KEYS: '/api/user/api-keys',                     // GET, POST { label, permissions, ipWhitelist }, DELETE
    REFERRAL_STATS: '/api/user/referrals',              // GET -> { referralCode, totalInvited, commissionEarned }
  },

  // ----------------------------------------------------
  // 3. WALLET, DEPOSITS, WITHDRAWALS & TRANSFERS
  // ----------------------------------------------------
  WALLET: {
    BALANCES: '/api/wallet/balances',                   // GET -> { totalAssets, spotUsd, fundingUsd, earnUsd, assets: [...] }
    DEPOSIT_ADDRESS: '/api/wallet/deposit/address',     // GET ?currency=USDT&network=TRC20 -> { address, memo, minDeposit }
    WITHDRAW: '/api/wallet/withdraw',                   // POST { currency, network, amount, destinationAddress, twoFactorCode }
    TRANSFER: '/api/wallet/transfer',                   // POST { fromAccount, toAccount, currency, amount }
    CONVERT: '/api/wallet/convert',                     // POST { fromCurrency, toCurrency, amount }
    CONVERT_QUOTE: '/api/wallet/convert/quote',         // GET ?from=BTC&to=USDT&amount=0.5 -> { quoteId, rate, expiresAt }
    TRANSACTIONS: '/api/wallet/transactions',           // GET ?type=deposit|withdraw|transfer|convert&page=1&limit=20
  },

  // ----------------------------------------------------
  // 4. SPOT MARKETS & TRADING
  // ----------------------------------------------------
  SPOT: {
    MARKETS: '/api/spot/markets',                       // GET ?category=spot|hot|gainers -> MarketPair[]
    TICKER_24H: '/api/spot/ticker/24h',                 // GET ?symbol=BTC/USDT -> 24h stats
    ORDERBOOK: (symbol: string) => `/api/spot/orderbook/${encodeURIComponent(symbol)}`, // GET ?depth=20
    TRADES: (symbol: string) => `/api/spot/trades/${encodeURIComponent(symbol)}`,       // GET ?limit=50
    CANDLES: '/api/spot/candles',                       // GET ?symbol=BTC/USDT&interval=1m|5m|15m|1H|4H|1D&limit=100
    ORDERS: '/api/spot/orders',                         // POST { symbol, side, type, price, amount, slippageTolerance }
    ORDER_DETAILS: (id: string) => `/api/spot/orders/${encodeURIComponent(id)}`, // GET
    CANCEL_ORDER: (id: string) => `/api/spot/orders/${encodeURIComponent(id)}`,  // DELETE
    CANCEL_ALL_ORDERS: '/api/spot/orders/cancel-all',   // POST { symbol?: string }
    OPEN_ORDERS: '/api/spot/orders/open',               // GET ?symbol=BTC/USDT
    ORDER_HISTORY: '/api/spot/orders/history',         // GET ?symbol=BTC/USDT&status=all|filled|cancelled&limit=50
  },

  // ----------------------------------------------------
  // 5. P2P ESCROW MARKETPLACE
  // ----------------------------------------------------
  P2P: {
    ADS: '/api/p2p/ads',                                // GET ?fiat=USD&crypto=USDT&side=buy|sell&payment=Bank
    MY_ADS: '/api/p2p/my-ads',                          // GET, POST { side, crypto, fiat, price, amount, minLimit, maxLimit, paymentMethods }
    AD_DETAILS: (id: string) => `/api/p2p/ads/${encodeURIComponent(id)}`,        // GET, PUT, DELETE
    CREATE_ORDER: '/api/p2p/orders',                    // POST { adId, fiatAmount, paymentMethod }
    ORDER_DETAILS: (id: string) => `/api/p2p/orders/${encodeURIComponent(id)}`, // GET
    CONFIRM_PAYMENT: (id: string) => `/api/p2p/orders/${encodeURIComponent(id)}/confirm-payment`, // POST
    RELEASE_CRYPTO: (id: string) => `/api/p2p/orders/${encodeURIComponent(id)}/release-crypto`,   // POST { twoFactorCode }
    CANCEL_ORDER: (id: string) => `/api/p2p/orders/${encodeURIComponent(id)}/cancel`,             // POST { reason }
    OPEN_DISPUTE: (id: string) => `/api/p2p/orders/${encodeURIComponent(id)}/dispute`,           // POST { reason, evidenceUrls }
    CHAT_MESSAGES: (orderId: string) => `/api/p2p/orders/${encodeURIComponent(orderId)}/chat`,   // GET, POST { message, attachments }
  },

  // ----------------------------------------------------
  // 6. EARN & STAKING VAULTS
  // ----------------------------------------------------
  EARN: {
    PRODUCTS: '/api/earn/products',                     // GET ?category=flexible|fixed|launchpad
    PRODUCT_DETAILS: (id: string) => `/api/earn/products/${encodeURIComponent(id)}`, // GET
    SUBSCRIBE: '/api/earn/subscribe',                   // POST { productId, amount, autoReinvest: boolean }
    REDEEM: '/api/earn/redeem',                         // POST { subscriptionId, amount }
    MY_POSITIONS: '/api/earn/positions',                // GET -> active stakes & accrued yield
  },

  // ----------------------------------------------------
  // 7. REAL-TIME PRICE ALERTS
  // ----------------------------------------------------
  ALERTS: {
    LIST: '/api/alerts',                                // GET -> PriceAlert[]
    CREATE: '/api/alerts',                              // POST { symbol, targetPrice, condition: above|below, note }
    DELETE: (id: string) => `/api/alerts/${encodeURIComponent(id)}`, // DELETE
  },

  // ----------------------------------------------------
  // 8. VIP AI CONCIERGE & CRYPTO NEWS FEED
  // ----------------------------------------------------
  AI: {
    CHAT: '/api/support/chat',                          // POST { message, history, userContext }
    BOT_STRATEGIES: '/api/ai-bot/strategies',           // GET
    BOT_START: '/api/ai-bot/start',                     // POST { strategyId, investmentUsdt }
    BOT_STOP: '/api/ai-bot/stop',                       // POST { strategyId }
    CRYPTO_NEWS: '/api/crypto-news',                    // POST { assets: ['BTC', 'ETH', 'SOL', 'OKN'] }
  },
} as const;

export const WS_CHANNELS = {
  // Public Market Feeds
  TICKER: (symbol: string) => `ticker@${symbol.toLowerCase().replace('/', '_')}`,
  ORDERBOOK_DEPTH: (symbol: string) => `depth@${symbol.toLowerCase().replace('/', '_')}`,
  TRADES: (symbol: string) => `trade@${symbol.toLowerCase().replace('/', '_')}`,
  CANDLE: (symbol: string, interval: string) => `kline@${symbol.toLowerCase().replace('/', '_')}_${interval}`,

  // Authenticated User Feeds (requires JWT handshake)
  USER_BALANCES: 'user.balances',
  USER_ORDERS: 'user.orders',
  USER_NOTIFICATIONS: 'user.notifications',
  P2P_ORDER_STATUS: (orderId: string) => `p2p.order.${orderId}`,
  P2P_CHAT: (orderId: string) => `p2p.chat.${orderId}`,
} as const;
