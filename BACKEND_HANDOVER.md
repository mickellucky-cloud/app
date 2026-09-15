# OKNexus Mobile Exchange — Backend Engineering Handover Documentation

**Version:** 1.0.0  
**Target Environment:** Node.js 20+ / TypeScript / Express / PostgreSQL / Redis  
**Contact / Lead Developer:** `dev@nexus.com`  
**Repository:** [github.com/mickellucky-cloud/app](https://github.com/mickellucky-cloud/app)

---

## 1. Executive Summary & Architecture Overview

OKNexus is a high-performance Web3 cryptocurrency mobile trading exchange interface built with React 19, TypeScript, Tailwind CSS, Lucide icons, and an Express middleware layer.

```
┌────────────────────────────────────────────────────────┐
│                   Frontend (React 19)                  │
│       src/services/apiClient.ts (Typed SDK)            │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP REST / WebSocket JSON
┌───────────────────────────▼────────────────────────────┐
│              Express Server Gateway (server.ts)        │
├─────────────┬─────────────┬──────────────┬─────────────┤
│ /api/auth   │ /api/wallet │ /api/spot    │ /api/p2p    │
├─────────────┼─────────────┼──────────────┼─────────────┤
│ /api/earn   │ /api/alerts │ /api/ai-bot  │ /api/support│
└─────────────┴─────────────┴──────────────┴─────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│               Production Persistence Tier              │
│  PostgreSQL (ACID Wallets) │ TimescaleDB (Ticks/Trades)│
│  Redis (Matching Engine)   │ Gemini Flash 2.5 (AI)     │
└────────────────────────────────────────────────────────┘
```

All route handlers are organized in modular files under `server/routes/`, with working mock in-memory implementations. A matching TypeScript API client is located at `src/services/apiClient.ts`.

---

## 2. Directory Structure & Key Files

```
├── server.ts                    # Main Express server entrypoint & Vite middleware
├── server/
│   └── routes/
│       ├── auth.ts              # /api/auth (Login, register, session, logout)
│       ├── wallet.ts            # /api/wallet (Balances, deposit addresses, withdrawals, internal transfers, convert)
│       ├── spot.ts              # /api/spot (Markets, orderbook, trades, order placement & cancellation)
│       ├── p2p.ts               # /api/p2p (P2P ads, escrow order creation, payment confirmation, release)
│       ├── earn.ts              # /api/earn (Flexible/Fixed yield products, staking subscriptions)
│       ├── alerts.ts            # /api/alerts (Price alerts management)
│       └── aiBot.ts             # /api/ai-bot (Quantitative AI grid trading bot strategies)
├── src/
│   ├── services/
│   │   └── apiClient.ts         # Centralized frontend API client with JWT handling
│   ├── types.ts                 # Shared TypeScript data models
│   ├── data/mockData.ts         # High-fidelity sample exchange data
│   └── components/              # UI feature components
├── .env.example                 # Environment variables specification
└── package.json                 # Project dependencies & scripts
```

---

## 3. Endpoints & API Contract Reference

### 3.1 Authentication (`/api/auth`)

#### `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "dev@nexus.com",
    "password": "user_secret_password"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "token": "jwt_token_sample",
    "user": {
      "id": "usr_dev_01",
      "email": "dev@nexus.com",
      "vipTier": 2,
      "kycLevel": 2,
      "twoFactorEnabled": true
    }
  }
  ```

#### `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "email": "dev@nexus.com",
    "password": "secure_password",
    "referralCode": "NEXUSVIP"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "token": "jwt_token_sample",
    "user": { ... }
  }
  ```

#### `GET /api/auth/session`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
  ```json
  {
    "authenticated": true,
    "user": { "id": "usr_dev_01", "email": "dev@nexus.com", "vipTier": 2 }
  }
  ```

#### `POST /api/auth/logout`
- **Response (200 OK):** `{ "success": true, "message": "Logged out successfully" }`

---

### 3.2 Wallet & Balances (`/api/wallet`)

#### `GET /api/wallet/balances`
Returns user account valuation across sub-wallets (Spot, Funding, Earn, Futures) and breakdown by token.
- **Success Response (200 OK):**
  ```json
  {
    "totalAssets": 42318.65,
    "pnl24hUsd": 5420.50,
    "pnl24hPct": 14.82,
    "spotUsd": 28412.32,
    "fundingUsd": 8236.17,
    "earnUsd": 3670.16,
    "futuresUsd": 2000.00,
    "assets": [
      {
        "symbol": "USDT",
        "name": "Tether USD",
        "total": 18450.25,
        "available": 16200.00,
        "inOrders": 2250.25,
        "usdValue": 18450.25
      },
      {
        "symbol": "BTC",
        "name": "Bitcoin",
        "total": 0.285,
        "available": 0.235,
        "inOrders": 0.05,
        "usdValue": 24923.25
      }
    ]
  }
  ```

#### `GET /api/wallet/deposit/address?currency=USDT&network=TRC20`
- **Query Params:** `currency` (e.g. `USDT`, `BTC`), `network` (e.g. `TRC20`, `ERC20`, `Solana`)
- **Success Response (200 OK):**
  ```json
  {
    "currency": "USDT",
    "network": "TRC20",
    "address": "TLyqzVGLV1srkB7dToTAvZgYDoxAb58YZq",
    "minDeposit": 10
  }
  ```

#### `POST /api/wallet/withdraw`
- **Request Body:**
  ```json
  {
    "currency": "USDT",
    "network": "TRC20",
    "amount": 500,
    "destinationAddress": "TLyqzVGLV1srkB7dToTAvZgYDoxAb58YZq",
    "twoFactorCode": "847291"
  }
  ```
- **Success Response (202 Accepted):**
  ```json
  {
    "success": true,
    "message": "Withdrawal submitted for network verification",
    "transaction": {
      "id": "wd_1726410000000",
      "type": "withdraw",
      "currency": "USDT",
      "network": "TRC20",
      "amount": 500,
      "status": "processing",
      "destinationAddress": "TLyqzVGLV1srkB7dToTAvZgYDoxAb58YZq",
      "createdAt": "2026-09-15T14:30:00.000Z"
    }
  }
  ```

#### `POST /api/wallet/transfer`
Moves funds internally between Spot, Funding, Earn, and Futures accounts with 0 fees.
- **Request Body:**
  ```json
  {
    "fromAccount": "spot",
    "toAccount": "funding",
    "currency": "USDT",
    "amount": 1000
  }
  ```

#### `POST /api/wallet/convert`
Instant 0-slippage conversion at current spot or OTC benchmark rate.
- **Request Body:**
  ```json
  {
    "fromCurrency": "USDT",
    "toCurrency": "BTC",
    "amount": 1000
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "fromCurrency": "USDT",
    "toCurrency": "BTC",
    "fromAmount": 1000,
    "toAmount": 0.011435,
    "rate": 0.000011435,
    "timestamp": "2026-09-15T14:30:00.000Z"
  }
  ```

#### `GET /api/wallet/transactions?type=all`
Returns deposit and withdrawal ledger history.

---

### 3.3 Spot Market & Order Execution (`/api/spot`)

#### `GET /api/spot/markets?category=hot`
- **Query Params:** `category` (`hot`, `gainers`, `losers`, `new`)
- **Returns:** List of market pairs with 24h high/low, volume, 24h % change, and sparkline array.

#### `GET /api/spot/orderbook/:symbol`
- **Example:** `/api/spot/orderbook/BTC-USDT`
- **Success Response (200 OK):**
  ```json
  {
    "symbol": "BTC/USDT",
    "lastPrice": 87450.00,
    "bids": [
      { "price": 87440.00, "amount": 0.845, "total": 0.845, "depthPct": 85 }
    ],
    "asks": [
      { "price": 87455.00, "amount": 0.620, "total": 0.620, "depthPct": 62 }
    ]
  }
  ```

#### `GET /api/spot/trades/:symbol`
Returns latest matched trades (`id`, `price`, `amount`, `type`, `time`).

#### `POST /api/spot/orders`
Places a new limit or market order.
- **Request Body:**
  ```json
  {
    "symbol": "BTC/USDT",
    "side": "buy",
    "type": "limit",
    "price": 86500.00,
    "amount": 0.15
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "order": {
      "id": "ord_1726410000000",
      "symbol": "BTC/USDT",
      "side": "buy",
      "type": "limit",
      "price": 86500.00,
      "amount": 0.15,
      "filled": 0,
      "status": "open",
      "time": "14:30:00"
    }
  }
  ```

#### `DELETE /api/spot/orders/:id`
Cancels an active open order and unlocks reserved funds.

#### `GET /api/spot/orders/open?symbol=BTC/USDT`
Returns all open orders for the authenticated user.

---

### 3.4 P2P Escrow Trading (`/api/p2p`)

#### `GET /api/p2p/ads?fiat=USD&crypto=USDT&side=buy`
Returns verified merchant advertisements with trust scores, payment methods, and limits.

#### `POST /api/p2p/orders`
Initiates an escrow-locked P2P transaction.
- **Request Body:**
  ```json
  {
    "adId": "p2p-m1",
    "fiatAmount": 500,
    "paymentMethod": "Zelle"
  }
  ```
- **Response:** Creates order in `pending_payment` state; locks merchant crypto in escrow contract.

#### `POST /api/p2p/orders/:id/confirm-payment`
Buyer signals that fiat has been transferred to merchant's bank/account. State -> `payment_marked`.

#### `POST /api/p2p/orders/:id/release-crypto`
Seller confirms fiat receipt in external account; escrow releases crypto to buyer's funding wallet.

---

### 3.5 Earn & Staking (`/api/earn`)

#### `GET /api/earn/products?category=flexible`
Returns products with APY, lockup duration, min stakes, and accrued rewards.

#### `POST /api/earn/subscribe`
- **Request Body:**
  ```json
  {
    "productId": "earn-usdt-flex",
    "amount": 2500
  }
  ```

---

### 3.6 Price Alerts (`/api/alerts`)

- `GET /api/alerts`: List user's active alerts.
- `POST /api/alerts`: Create alert `{ "symbol": "BTC/USDT", "targetPrice": 90000, "condition": "above", "note": "Take profit" }`.
- `DELETE /api/alerts/:id`: Delete or dismiss alert.

---

### 3.7 Quantitative AI Grid Bot (`/api/ai-bot`)

- `GET /api/ai-bot/strategies`: Returns preset strategies (e.g., BTC Volatility Spot Grid, ETH Mean Reversion).
- `POST /api/ai-bot/start`: Start strategy with `{ "strategyId": "grid-btc-1", "investmentUsdt": 1000 }`.
- `POST /api/ai-bot/stop`: Stop active grid bot and return funds to spot balance.

---

### 3.8 Intelligent Concierge & Live News

#### `POST /api/support/chat`
Gemini-powered VIP AI Customer Support & Trading Concierge (`gemini-2.5-flash`).
- **Request Body:**
  ```json
  {
    "message": "How do I deposit USDT via TRC20?",
    "history": [],
    "userContext": {
      "email": "dev@nexus.com",
      "totalAssets": 42318.65,
      "vipTier": 2
    }
  }
  ```
- **Response:**
  ```json
  {
    "reply": "To deposit USDT via TRC20...",
    "source": "gemini-ai",
    "action": "open_deposit",
    "suggestions": ["Check deposit confirmation times", "Minimum deposit amounts"]
  }
  ```

#### `POST /api/crypto-news` & `GET /api/crypto-news`
Google Search Grounded live crypto news pipeline with in-memory caching and sentiment tags.

---

## 4. Recommended Database Schema (PostgreSQL DDL)

```sql
-- Core Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    vip_tier INT DEFAULT 1,
    kyc_level INT DEFAULT 0,
    two_factor_secret VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Wallet Balances
CREATE TABLE user_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_type VARCHAR(32) NOT NULL, -- 'spot', 'funding', 'earn', 'futures'
    currency VARCHAR(16) NOT NULL,
    total_balance NUMERIC(28, 8) DEFAULT 0,
    available_balance NUMERIC(28, 8) DEFAULT 0,
    in_orders NUMERIC(28, 8) DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, account_type, currency)
);

-- On-Chain & Internal Transactions
CREATE TABLE transactions (
    id VARCHAR(64) PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    type VARCHAR(32) NOT NULL, -- 'deposit', 'withdraw', 'transfer', 'convert'
    currency VARCHAR(16) NOT NULL,
    network VARCHAR(32),
    amount NUMERIC(28, 8) NOT NULL,
    fee NUMERIC(28, 8) DEFAULT 0,
    tx_hash VARCHAR(128),
    destination_address VARCHAR(128),
    status VARCHAR(32) NOT NULL, -- 'pending', 'processing', 'completed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spot Exchange Orders
CREATE TABLE spot_orders (
    id VARCHAR(64) PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    symbol VARCHAR(32) NOT NULL,
    side VARCHAR(8) NOT NULL, -- 'buy', 'sell'
    type VARCHAR(16) NOT NULL, -- 'limit', 'market'
    price NUMERIC(28, 8),
    amount NUMERIC(28, 8) NOT NULL,
    filled_amount NUMERIC(28, 8) DEFAULT 0,
    status VARCHAR(32) NOT NULL, -- 'open', 'partially_filled', 'filled', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- P2P Escrow Orders
CREATE TABLE p2p_orders (
    id VARCHAR(64) PRIMARY KEY,
    ad_id VARCHAR(64) NOT NULL,
    buyer_id UUID REFERENCES users(id),
    seller_id UUID REFERENCES users(id),
    crypto_symbol VARCHAR(16) NOT NULL,
    crypto_amount NUMERIC(28, 8) NOT NULL,
    fiat_currency VARCHAR(8) NOT NULL,
    fiat_amount NUMERIC(16, 2) NOT NULL,
    payment_method VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL, -- 'escrow_locked', 'payment_marked', 'completed', 'dispute'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 5. WebSocket Real-Time Specs

To replace frontend polling with real-time streaming, the backend should expose a WebSocket service at `ws://localhost:3000/ws`:

### Client Subscribe Message:
```json
{
  "action": "subscribe",
  "channels": [
    "orderbook:BTC/USDT",
    "trades:BTC/USDT",
    "ticker:all",
    "user_orders:usr_dev_01"
  ]
}
```

### Server Broadcast (Orderbook Delta):
```json
{
  "channel": "orderbook:BTC/USDT",
  "type": "update",
  "data": {
    "bids": [[87445.00, 1.250]],
    "asks": [[87450.00, 0.450]],
    "timestamp": 1726410000123
  }
}
```

---

## 6. Verification & Development Scripts

```bash
# Install dependencies
npm install

# Start local server with hot reloading (Vite + Express on Port 3000)
npm run dev

# Run TypeScript compilation checks
npm run lint

# Build production bundle
npm run build
```

---

*Handover document authored for OKNexus Exchange backend engineering team.*  
*Maintained by `dev@nexus.com`.*
