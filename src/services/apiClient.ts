/**
 * OKNexus Exchange - Centralized Frontend API Client
 *
 * This client provides clean, typed wrappers around all backend endpoints.
 * Backend developers can reference or extend this client when connecting live microservices.
 */

import { MarketPair, OrderBookItem, TradeHistoryItem, OpenOrder, EarnProduct, P2PMerchant, PriceAlert } from '../types';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    // Load stored token in browser environment
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('oknexus_token');
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('oknexus_token', token);
      } else {
        localStorage.removeItem('oknexus_token');
      }
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: string | null; status: number }> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(url, {
        ...options,
        headers,
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        return {
          data: null,
          error: json.error || json.message || `Request failed with status ${res.status}`,
          status: res.status,
        };
      }

      return {
        data: json as T,
        error: null,
        status: res.status,
      };
    } catch (err: any) {
      return {
        data: null,
        error: err?.message || 'Network request failed',
        status: 0,
      };
    }
  }

  // ==========================================
  // AUTHENTICATION & SESSION
  // ==========================================

  async login(email: string, passwordHashOrPlain: string) {
    const res = await this.request<{ success: boolean; token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: passwordHashOrPlain }),
    });
    if (res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  async register(email: string, password: string, referralCode?: string) {
    const res = await this.request<{ success: boolean; token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, referralCode }),
    });
    if (res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  async getSession() {
    return this.request<{ authenticated: boolean; user: any }>('/api/auth/session', {
      method: 'GET',
    });
  }

  async logout() {
    this.setToken(null);
    return this.request('/api/auth/logout', { method: 'POST' });
  }

  // ==========================================
  // WALLET & BALANCES
  // ==========================================

  async getBalances() {
    return this.request<{
      totalAssets: number;
      pnl24hUsd: number;
      pnl24hPct: number;
      spotUsd: number;
      fundingUsd: number;
      earnUsd: number;
      futuresUsd: number;
      assets: Array<{
        symbol: string;
        name: string;
        total: number;
        available: number;
        inOrders: number;
        usdValue: number;
      }>;
    }>('/api/wallet/balances');
  }

  async getDepositAddress(currency: string, network: string) {
    return this.request<{ currency: string; network: string; address: string; memo?: string; minDeposit: number }>(
      `/api/wallet/deposit/address?currency=${encodeURIComponent(currency)}&network=${encodeURIComponent(network)}`
    );
  }

  async withdraw(data: { currency: string; network: string; amount: number; destinationAddress: string; twoFactorCode?: string }) {
    return this.request<{ success: boolean; message: string; transaction: any }>('/api/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async transfer(data: { fromAccount: string; toAccount: string; currency: string; amount: number }) {
    return this.request<{ success: boolean; message: string; transfer: any }>('/api/wallet/transfer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async convert(data: { fromCurrency: string; toCurrency: string; amount: number }) {
    return this.request<{ success: boolean; fromCurrency: string; toCurrency: string; fromAmount: number; toAmount: number; rate: number }>(
      '/api/wallet/convert',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async getTransactions(type?: 'all' | 'deposit' | 'withdraw') {
    const query = type && type !== 'all' ? `?type=${type}` : '';
    return this.request<any[]>(`/api/wallet/transactions${query}`);
  }

  // ==========================================
  // SPOT MARKET & TRADING
  // ==========================================

  async getMarkets(category?: string) {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.request<MarketPair[]>(`/api/spot/markets${query}`);
  }

  async getOrderBook(symbol: string) {
    return this.request<{ symbol: string; bids: OrderBookItem[]; asks: OrderBookItem[]; lastPrice: number }>(
      `/api/spot/orderbook/${encodeURIComponent(symbol)}`
    );
  }

  async getRecentTrades(symbol: string) {
    return this.request<TradeHistoryItem[]>(`/api/spot/trades/${encodeURIComponent(symbol)}`);
  }

  async placeOrder(order: {
    symbol: string;
    side: 'buy' | 'sell';
    type: 'limit' | 'market';
    price?: number;
    amount: number;
  }) {
    return this.request<{ success: boolean; order: OpenOrder }>('/api/spot/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async cancelOrder(orderId: string) {
    return this.request<{ success: boolean; cancelledId: string }>(`/api/spot/orders/${encodeURIComponent(orderId)}`, {
      method: 'DELETE',
    });
  }

  async getOpenOrders(symbol?: string) {
    const query = symbol ? `?symbol=${encodeURIComponent(symbol)}` : '';
    return this.request<OpenOrder[]>(`/api/spot/orders/open${query}`);
  }

  // ==========================================
  // P2P ESCROW TRADING
  // ==========================================

  async getP2PAds(params?: { fiat?: string; crypto?: string; side?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<P2PMerchant[]>(`/api/p2p/ads${query ? `?${query}` : ''}`);
  }

  async createP2POrder(data: { adId: string; fiatAmount: number; paymentMethod: string }) {
    return this.request<{ success: boolean; order: any }>('/api/p2p/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async confirmP2PPayment(orderId: string) {
    return this.request<{ success: boolean; order: any }>(`/api/p2p/orders/${encodeURIComponent(orderId)}/confirm-payment`, {
      method: 'POST',
    });
  }

  async releaseP2PCrypto(orderId: string) {
    return this.request<{ success: boolean; order: any }>(`/api/p2p/orders/${encodeURIComponent(orderId)}/release-crypto`, {
      method: 'POST',
    });
  }

  // ==========================================
  // EARN & STAKING PRODUCTS
  // ==========================================

  async getEarnProducts(category?: string) {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.request<EarnProduct[]>(`/api/earn/products${query}`);
  }

  async subscribeEarn(productId: string, amount: number) {
    return this.request<{ success: boolean; message: string; subscription: any }>('/api/earn/subscribe', {
      method: 'POST',
      body: JSON.stringify({ productId, amount }),
    });
  }

  // ==========================================
  // PRICE ALERTS
  // ==========================================

  async getAlerts() {
    return this.request<PriceAlert[]>('/api/alerts');
  }

  async createAlert(data: { symbol: string; targetPrice: number; condition: 'above' | 'below'; note?: string }) {
    return this.request<{ success: boolean; alert: PriceAlert }>('/api/alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteAlert(alertId: string) {
    return this.request<{ success: boolean; deletedId: string }>(`/api/alerts/${encodeURIComponent(alertId)}`, {
      method: 'DELETE',
    });
  }

  // ==========================================
  // QUANT & AI GRID BOTS
  // ==========================================

  async getAiBotStrategies() {
    return this.request<any[]>('/api/ai-bot/strategies');
  }

  async startAiBot(strategyId: string, investmentUsdt: number) {
    return this.request<{ success: boolean; message: string; strategy: any }>('/api/ai-bot/start', {
      method: 'POST',
      body: JSON.stringify({ strategyId, investmentUsdt }),
    });
  }

  async stopAiBot(strategyId: string) {
    return this.request<{ success: boolean; message: string; strategy: any }>('/api/ai-bot/stop', {
      method: 'POST',
      body: JSON.stringify({ strategyId }),
    });
  }

  // ==========================================
  // AI SUPPORT CHAT
  // ==========================================

  async sendSupportChat(message: string, history: Array<{ role: 'user' | 'model'; content: string }>, userContext?: any) {
    return this.request<{
      reply: string;
      source: string;
      action?: string | null;
      suggestions?: string[];
      timestamp: string;
    }>('/api/support/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history, userContext }),
    });
  }

  // ==========================================
  // LIVE CRYPTO NEWS (GROUNDED FEED)
  // ==========================================

  async getCryptoNews(assets?: string[]) {
    return this.request<{
      headlines: any[];
      source: string;
      searchedAssets: string[];
      lastUpdated: string;
    }>('/api/crypto-news', {
      method: 'POST',
      body: JSON.stringify({ assets: assets || ['BTC', 'ETH', 'SOL', 'OKN'] }),
    });
  }
}

export const api = new ApiClient();
export default api;
