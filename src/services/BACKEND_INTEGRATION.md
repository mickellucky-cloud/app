# OKNexus Backend Integration Guide

This document outlines the API contracts, endpoint structures, authentication protocols, and WebSocket subscriptions implemented in the OKNexus frontend client.

---

## 1. Base Configuration

- **Environment Variable**: Set `VITE_API_BASE_URL` in your `.env` file (e.g. `VITE_API_BASE_URL=https://api.oknexus.com`).
- **WebSocket URL**: Set `VITE_WS_BASE_URL` (e.g. `VITE_WS_BASE_URL=wss://api.oknexus.com/ws`).
- **Centralized Dictionary**: Import endpoints and WebSocket channels from:
  ```ts
  import { ENDPOINTS, WS_CHANNELS } from '@/services/endpoints';
  import { api } from '@/services/apiClient';
  ```

---

## 2. Authentication & Authorization

All authenticated requests include the JWT Bearer header:
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Endpoints
| Method | Endpoint | Description | Request Body / Query |
|---|---|---|---|
| `POST` | `/api/auth/login` | Email / Phone login | `{ email, password, captchaToken }` |
| `POST` | `/api/auth/register` | New account registration | `{ email, password, referralCode? }` |
| `POST` | `/api/auth/social` | Social login (Google, Telegram, Facebook, Apple) | `{ provider, idToken }` |
| `GET`  | `/api/auth/session` | Validate session token | None |
| `POST` | `/api/auth/logout` | Invalidate token | None |
| `POST` | `/api/auth/otp/send` | Send SMS / Email 2FA OTP | `{ target, type }` |
| `POST` | `/api/auth/otp/verify` | Verify OTP code | `{ target, code }` |
| `GET`  | `/api/auth/puzzle/challenge` | Fetch slide puzzle challenge | None |
| `POST` | `/api/auth/puzzle/verify` | Verify slide puzzle offset | `{ puzzleId, offsetPercent }` |

---

## 3. Spot Trading & Market Data

### Endpoints
| Method | Endpoint | Description | Request Body / Query |
|---|---|---|---|
| `GET` | `/api/spot/markets` | List all active market pairs | `?category=spot\|hot\|gainers` |
| `GET` | `/api/spot/ticker/24h` | 24h rolling price ticker | `?symbol=BTC/USDT` |
| `GET` | `/api/spot/orderbook/:symbol` | Live L2/L3 orderbook depth | `?depth=20` |
| `GET` | `/api/spot/trades/:symbol` | Recent executed public trades | `?limit=50` |
| `GET` | `/api/spot/candles` | Candlestick / Kline history | `?symbol=BTC/USDT&interval=1m\|5m\|15m\|1H\|4H\|1D&limit=100` |
| `POST`| `/api/spot/orders` | Place new Limit / Market / Stop order | `{ symbol, side: 'buy'\|'sell', type: 'limit'\|'market', price?, amount, slippageTolerance? }` |
| `DELETE` | `/api/spot/orders/:orderId` | Cancel single open order | None |
| `POST` | `/api/spot/orders/cancel-all` | Cancel all active open orders | `{ symbol? }` |
| `GET`  | `/api/spot/orders/open` | Fetch current user's open orders | `?symbol=BTC/USDT` |
| `GET`  | `/api/spot/orders/history` | Historical orders & executions | `?symbol=BTC/USDT&status=all\|filled\|cancelled` |

---

## 4. Wallet, Balances & Transfers

### Endpoints
| Method | Endpoint | Description | Request Body / Query |
|---|---|---|---|
| `GET`  | `/api/wallet/balances` | Multi-wallet balance overview | None |
| `GET`  | `/api/wallet/deposit/address` | Generate on-chain deposit address | `?currency=USDT&network=TRC20` |
| `POST` | `/api/wallet/withdraw` | Submit crypto withdrawal | `{ currency, network, amount, destinationAddress, twoFactorCode }` |
| `POST` | `/api/wallet/transfer` | Internal transfer (Spot <-> Funding <-> Earn) | `{ fromAccount, toAccount, currency, amount }` |
| `POST` | `/api/wallet/convert` | Zero-fee instant swap execution | `{ fromCurrency, toCurrency, amount }` |
| `GET`  | `/api/wallet/transactions` | Deposit & withdrawal ledger history | `?type=deposit\|withdraw&page=1` |

---

## 5. P2P Escrow Marketplace

### Endpoints
| Method | Endpoint | Description | Request Body / Query |
|---|---|---|---|
| `GET`  | `/api/p2p/ads` | Public peer-to-peer ads list | `?fiat=USD&crypto=USDT&side=buy\|sell&payment=Bank` |
| `POST` | `/api/p2p/orders` | Initiate escrow trade with merchant | `{ adId, fiatAmount, paymentMethod }` |
| `GET`  | `/api/p2p/orders/:id` | Fetch live order state & escrow status | None |
| `POST` | `/api/p2p/orders/:id/confirm-payment` | Buyer confirms fiat payment was sent | None |
| `POST` | `/api/p2p/orders/:id/release-crypto` | Seller releases crypto from smart escrow | `{ twoFactorCode }` |
| `POST` | `/api/p2p/orders/:id/dispute` | Escalate order to human arbitrator | `{ reason, evidenceUrls: [] }` |
| `GET`  | `/api/p2p/orders/:id/chat` | Order encrypted chat history | None |
| `POST` | `/api/p2p/orders/:id/chat` | Send message to trade counterparty | `{ message, attachments? }` |

---

## 6. Earn & Staking Vaults

### Endpoints
| Method | Endpoint | Description | Request Body / Query |
|---|---|---|---|
| `GET`  | `/api/earn/products` | Yield products & staking pools | `?category=flexible\|fixed\|launchpad` |
| `POST` | `/api/earn/subscribe` | Stake assets into yield vault | `{ productId, amount, autoReinvest: boolean }` |
| `POST` | `/api/earn/redeem` | Instant capital redemption | `{ subscriptionId, amount }` |
| `GET`  | `/api/earn/positions` | User's active staking positions & yield | None |

---

## 7. WebSocket Streaming Specification

Connect to `wss://<HOST>/ws` and send JSON subscription frames:

```json
{
  "action": "subscribe",
  "channels": [
    "ticker@btc_usdt",
    "depth@btc_usdt",
    "trade@btc_usdt",
    "kline@btc_usdt_1H"
  ]
}
```

For authenticated private channels (orders, balances, p2p chat):
```json
{
  "action": "auth",
  "token": "<JWT_TOKEN>"
}
```
Subscribed channels:
- `user.balances`
- `user.orders`
- `p2p.order.<orderId>`
- `p2p.chat.<orderId>`
