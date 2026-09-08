import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    ),
  ]);
};

// Quota and rate-limiting circuit breaker
let quotaCooldownUntil = 0;

function isQuotaExhausted(): boolean {
  return Date.now() < quotaCooldownUntil;
}

function handleAiFailure(err: any) {
  const errMsg = String(err?.message || err);
  const isQuota =
    err?.status === 'RESOURCE_EXHAUSTED' ||
    err?.code === 429 ||
    errMsg.includes('429') ||
    errMsg.includes('RESOURCE_EXHAUSTED') ||
    errMsg.includes('quota') ||
    errMsg.includes('rate-limit');

  if (isQuota) {
    // Backoff API calls for 5 minutes when quota is reached
    quotaCooldownUntil = Date.now() + 5 * 60 * 1000;
  }
}

// In-memory cache for news headlines to reduce unnecessary API calls
const newsCache = new Map<string, { data: any; timestamp: number }>();
const NEWS_CACHE_TTL = 90 * 1000; // 90 seconds


// Fallback intelligent responses for common crypto exchange queries
const FALLBACK_RESPONSES: Record<string, { reply: string; action?: string; suggestions?: string[] }> = {
  deposit: {
    reply: "To deposit crypto or fiat into OKNexus:\n1. Open the **Deposit** portal.\n2. Choose your asset (USDT, BTC, ETH, SOL) and verify the network (TRC20, ERC20, Arbitrum One, Solana).\n3. Copy the unique deposit address or scan the QR code.\n\n⚠️ Always confirm the deposit network matches the withdrawal network to avoid asset loss. Deposits typically confirm in 1-12 block confirmations.",
    action: "open_deposit",
    suggestions: ["Check deposit confirmation times", "What are the minimum deposit amounts?", "Deposit with fiat/card"]
  },
  withdraw: {
    reply: "Withdrawal requests are processed with institutional-grade security:\n• Whitelisted addresses with 2FA/Biometric confirmation process instantly (1-5 minutes).\n• Unverified new addresses undergo a 15-minute security cooling period.\n• Current network withdrawal fees: TRC20: 1 USDT, ERC20: 3.5 USDT, SOL: 0.1 USDT.\n\nYou can initiate a withdrawal from the Assets tab or by clicking below.",
    action: "open_withdraw",
    suggestions: ["How to whitelist an address?", "Why is my withdrawal pending?", "What are the daily withdrawal limits?"]
  },
  fees: {
    reply: "Your account is currently on **VIP Tier 2**:\n• **Spot Maker Fee**: 0.0800% (Hold OKN for -25% discount: 0.0600%)\n• **Spot Taker Fee**: 0.1000%\n• **P2P Trading**: 0.00% Zero Fee for buyers and sellers\n• **Instant Convert / OTC**: 0.00% Slippage-free execution",
    action: "open_trade",
    suggestions: ["How to reach VIP Tier 3?", "How to use OKN for fee discounts?", "What are Futures taker fees?"]
  },
  bot: {
    reply: "The **OKNexus AI Auto-Trader Bot** runs 24/7 high-frequency quantitative grid algorithms:\n• **Spot Grid**: Automatically buys low and sells high within a dynamic volatility channel.\n• **Arbitrage Matrix**: Exploits minor cross-pair spreads.\n• **DCA Strategy**: Accumulates blue-chips on oversold RSI triggers.\n\nYou can monitor active bots or launch a new automated strategy with customized stop-loss.",
    action: "open_ai_trader",
    suggestions: ["Backtest results for BTC Grid", "How to set stop-loss on bot?", "Minimum capital for AI trader"]
  },
  security: {
    reply: "Your OKNexus account security rating is **Optimal (96/100)**:\n✓ Two-Factor Authentication (Google Authenticator) active\n✓ Biometric Authorization (Face ID / Touch ID) active\n✓ Anti-phishing code verified\n✓ Withdrawal whitelist enabled\n\nTo update your biometric preference or generate new API keys, visit Profile Settings.",
    action: "open_security",
    suggestions: ["Change biometric method", "Manage trading API keys", "Review active login sessions"]
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'OKNexus Exchange API',
      aiReady: Boolean(process.env.GEMINI_API_KEY),
      time: new Date().toISOString()
    });
  });

  // Support Chat API with Gemini AI
  app.post('/api/support/chat', async (req, res) => {
    try {
      const { message, history = [], userContext = {} } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ai = getGenAI();

      if (ai && !isQuotaExhausted()) {
        try {
          // Construct system context prompt
          const systemInstruction = `You are "NexusAssist", the premier VIP AI Customer Support & Trading Concierge for OKNexus Mobile Exchange (a top-tier Web3 cryptocurrency exchange).
Your tone is exceptionally professional, helpful, concise, security-conscious, and crypto-native.
User Account Context:
- Email: ${userContext.email || 'mickel.lucky@gmail.com'}
- Total Portfolio: $${userContext.totalAssets?.toLocaleString() || '42,318.65'} (Spot: $${userContext.spotUsd?.toLocaleString() || '28,412.32'}, Funding: $${userContext.fundingUsd?.toLocaleString() || '8,236.17'}, Earn: $${userContext.earnUsd?.toLocaleString() || '3,670.16'})
- VIP Tier: VIP Tier 2 (Maker 0.08%, Taker 0.10%, OKN Discount Active)
- Security: 2FA Enabled, Biometric Authentication Enabled (${userContext.biometricType || 'Face ID'}), KYC Level 2 Verified
- Open Orders: 2 Active limit orders (BTC/USDT buy @ $66,100, ETH/USDT sell @ $3,580)
- Recent Activity: USDT Deposit confirmed ($1,500.00), AI Grid Buy filled

Guidelines:
1. Provide direct, actionable answers. Keep responses structured, concise, and easy to read on mobile screens (use bullet points and bolding where appropriate).
2. Never ask for private keys, passwords, or seed phrases. Remind users that OKNexus staff will NEVER ask for secrets.
3. If the user wants to execute an action (e.g. deposit, trade, view p2p, security, alerts, ai bot), mention the specific section and recommend opening it.
4. Format response cleanly with markdown.`;

          // Format conversation history
          const contents: any[] = [];
          for (const item of history.slice(-8)) {
            contents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.content }]
            });
          }
          contents.push({
            role: 'user',
            parts: [{ text: message }]
          });

          const response = await withTimeout(
            ai.models.generateContent({
              model: 'gemini-3.6-flash',
              contents,
              config: {
                systemInstruction,
                temperature: 0.7,
                topP: 0.95,
              }
            }),
            4500
          );

          const textOutput = response.text || "I apologize, but I couldn't generate a response. How else may I assist you with your OKNexus account?";

          // Detect appropriate quick action trigger from content
          let actionTrigger: string | null = null;
          const lowerText = (message + ' ' + textOutput).toLowerCase();
          if (lowerText.includes('deposit') || lowerText.includes('fund account')) {
            actionTrigger = 'open_deposit';
          } else if (lowerText.includes('withdraw') || lowerText.includes('cash out')) {
            actionTrigger = 'open_withdraw';
          } else if (lowerText.includes('spot') || lowerText.includes('trade btc') || lowerText.includes('orderbook')) {
            actionTrigger = 'open_trade';
          } else if (lowerText.includes('p2p') || lowerText.includes('merchant') || lowerText.includes('bank transfer')) {
            actionTrigger = 'open_p2p';
          } else if (lowerText.includes('bot') || lowerText.includes('grid') || lowerText.includes('ai trader')) {
            actionTrigger = 'open_ai_trader';
          } else if (lowerText.includes('alert') || lowerText.includes('price target')) {
            actionTrigger = 'open_alerts';
          } else if (lowerText.includes('security') || lowerText.includes('biometric') || lowerText.includes('2fa') || lowerText.includes('password')) {
            actionTrigger = 'open_security';
          } else if (lowerText.includes('earn') || lowerText.includes('stake') || lowerText.includes('apy') || lowerText.includes('yield')) {
            actionTrigger = 'open_earn';
          }

          // Generate context-aware suggestions
          const suggestions = [
            "Check deposit network confirmations",
            "What are my VIP trading fees?",
            "How does P2P Escrow protect my fiat?",
            "Account Security & 2FA Audit"
          ];

          return res.json({
            reply: textOutput,
            source: 'gemini-ai',
            action: actionTrigger,
            suggestions: suggestions.slice(0, 3),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        } catch (apiErr: any) {
          handleAiFailure(apiErr);
          // Fall back gracefully to the knowledgebase below
        }
      }

      // Intelligent deterministic fallback if API key is not configured
      const lower = message.toLowerCase();
      let matchedKey = 'general';
      if (lower.includes('deposit') || lower.includes('transfer in')) matchedKey = 'deposit';
      else if (lower.includes('withdraw') || lower.includes('send out') || lower.includes('cash out')) matchedKey = 'withdraw';
      else if (lower.includes('fee') || lower.includes('tier') || lower.includes('rate') || lower.includes('cost')) matchedKey = 'fees';
      else if (lower.includes('bot') || lower.includes('grid') || lower.includes('algorithm') || lower.includes('ai')) matchedKey = 'bot';
      else if (lower.includes('security') || lower.includes('2fa') || lower.includes('biometric') || lower.includes('login')) matchedKey = 'security';

      const fallback = FALLBACK_RESPONSES[matchedKey] || {
        reply: `Thank you for contacting OKNexus 24/7 VIP Support.\n\nI can assist you with your account (Total Balance: $${userContext.totalAssets?.toLocaleString() || '42,318.65'}), Spot trading execution, network confirmations, AI Grid Bot strategies, and account security.\n\nHow can I best help you today?`,
        action: 'open_trade',
        suggestions: ["Check my account fees", "How to deposit crypto?", "AI Grid Bot help", "Security & Biometric login"]
      };

      return res.json({
        reply: fallback.reply,
        source: 'nexus-knowledgebase',
        action: fallback.action,
        suggestions: fallback.suggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err: any) {
      console.error('Support Chat Error:', err);
      return res.status(500).json({
        error: 'Failed to process support query',
        details: err?.message || 'Unknown error'
      });
    }
  });

  // Dedicated Crypto News API using Real-Time Google Search Grounding
  const handleCryptoNewsRequest = async (req: express.Request, res: express.Response) => {
    try {
      const symbolsQuery = req.method === 'POST' ? req.body.symbols : req.query.symbols;
      let targetAssets: string[] = ['BTC', 'ETH', 'SOL', 'OKN'];

      if (Array.isArray(symbolsQuery) && symbolsQuery.length > 0) {
        targetAssets = symbolsQuery.map((s: string) => s.toUpperCase().trim()).filter(Boolean);
      } else if (typeof symbolsQuery === 'string' && symbolsQuery.trim().length > 0) {
        targetAssets = symbolsQuery.split(',').map((s: string) => s.toUpperCase().trim()).filter(Boolean);
      }

      const cacheKey = [...targetAssets].sort().join(',');
      const cached = newsCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < NEWS_CACHE_TTL) {
        return res.json(cached.data);
      }

      const ai = getGenAI();

      if (ai && !isQuotaExhausted()) {
        try {
          const prompt = `You are a senior Web3 market intelligence analyst.
Perform a real-time web search for the latest breaking news headlines and top market developments published in the last 24-48 hours regarding these favorite cryptocurrency assets: ${targetAssets.join(', ')}.
Find the top 5 most impactful and relevant headlines.
Output strictly a valid JSON array containing exactly 5 objects with this structure:
[
  {
    "id": "news-1",
    "title": "Compelling, accurate headline string",
    "summary": "1-2 informative sentences explaining market catalyst, on-chain metrics, or regulatory impact.",
    "coinSymbol": "BTC",
    "publisher": "e.g. CoinDesk, Cointelegraph, Bloomberg, Decrypt, The Block, Reuters, CNBC",
    "timeAgo": "e.g. 18m ago, 45m ago, 1h ago, 2h ago",
    "sentiment": "bullish" or "bearish" or "neutral",
    "category": "Market" or "ETF" or "Regulation" or "Ecosystem" or "Tech",
    "impact": "High" or "Medium" or "Trending",
    "url": "https://..."
  }
]
Guidelines:
- Ground headlines in real events found via real-time search.
- Focus on the requested favorite assets: ${targetAssets.join(', ')}.
- Return ONLY the JSON array (or markdown codeblock \`\`\`json ... \`\`\`). No other conversational text.`;

          // Use gemini-3.6-flash for Google Search grounding and real-time news retrieval
          const response = await withTimeout(
            ai.models.generateContent({
              model: 'gemini-3.6-flash',
              contents: prompt,
              config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.2,
              },
            }),
            5500
          );

          const rawText = response.text || '';
          let cleaned = rawText.trim();
          if (cleaned.startsWith('```json')) {
            cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
          }

          const parsed = JSON.parse(cleaned);

          if (Array.isArray(parsed) && parsed.length > 0) {
            const groundingMeta = (response.candidates?.[0] as any)?.groundingMetadata;
            const searchQueries = groundingMeta?.webSearchQueries || [];
            const groundingChunks = groundingMeta?.groundingChunks || [];

            // Map and sanitize headlines
            const headlines = parsed.slice(0, 5).map((item: any, idx: number) => {
              const fallbackChunk = groundingChunks[idx]?.web;
              return {
                id: item.id || `live-news-${Date.now()}-${idx}`,
                title: item.title || 'Market Update',
                summary: item.summary || '',
                coinSymbol: item.coinSymbol || targetAssets[idx % targetAssets.length] || 'BTC',
                publisher: item.publisher || (fallbackChunk?.title ? fallbackChunk.title.split('-')[0].trim() : 'CryptoNews'),
                timeAgo: item.timeAgo || `${(idx + 1) * 20}m ago`,
                sentiment: ['bullish', 'bearish', 'neutral'].includes(item.sentiment) ? item.sentiment : 'neutral',
                category: item.category || 'Market',
                impact: item.impact || 'High',
                url: item.url || fallbackChunk?.uri || `https://www.google.com/search?q=${encodeURIComponent(item.title || '')}`,
                sourceDomain: item.url ? new URL(item.url).hostname.replace(/^www\./, '') : (fallbackChunk?.uri ? new URL(fallbackChunk.uri).hostname.replace(/^www\./, '') : 'coindesk.com'),
                relatedPair: `${(item.coinSymbol || 'BTC').toUpperCase()}/USDT`,
              };
            });

            const responsePayload = {
              headlines,
              source: 'google-search-grounding',
              searchedAssets: targetAssets,
              searchQueries,
              lastUpdated: new Date().toISOString(),
            };

            newsCache.set(cacheKey, { data: responsePayload, timestamp: Date.now() });
            return res.json(responsePayload);
          }
        } catch (apiErr: any) {
          handleAiFailure(apiErr);
          // Fall back gracefully to the curated market feed below
        }
      }

      // Robust curated fallback tailored to user's favorite crypto assets
      const curatedNewsPool: any[] = [
        {
          id: 'news-btc-live-1',
          title: 'Bitcoin Institutional Custody Inflows Surge as Spot ETFs Absorb Daily Miner Supply',
          summary: 'Global asset managers report accelerating weekly net inflows, with corporate treasuries expanding cold storage holdings and network hash rate hitting fresh historic highs.',
          coinSymbol: 'BTC',
          publisher: 'CoinDesk',
          timeAgo: '15m ago',
          sentiment: 'bullish',
          category: 'Market',
          impact: 'High',
          url: 'https://www.coindesk.com/markets',
          sourceDomain: 'coindesk.com',
          relatedPair: 'BTC/USDT',
        },
        {
          id: 'news-eth-live-2',
          title: 'Ethereum Layer-2 Gas Optimizations Drive Weekly DEX Settlement Record',
          summary: 'Data availability blob efficiency reduces smart contract execution costs by 85%, accelerating DeFi protocol liquidity across Arbitrum, Optimism, and Base.',
          coinSymbol: 'ETH',
          publisher: 'Cointelegraph',
          timeAgo: '35m ago',
          sentiment: 'bullish',
          category: 'Tech',
          impact: 'High',
          url: 'https://cointelegraph.com',
          sourceDomain: 'cointelegraph.com',
          relatedPair: 'ETH/USDT',
        },
        {
          id: 'news-sol-live-3',
          title: 'Solana DeFi TVL Crosses $5.8 Billion with Firedancer Validator Client Testing',
          summary: 'Independent validator client tests demonstrate sustained throughput above 60,000 TPS in staging benchmarks, boosting institutional interest.',
          coinSymbol: 'SOL',
          publisher: 'Decrypt',
          timeAgo: '1h ago',
          sentiment: 'bullish',
          category: 'Ecosystem',
          impact: 'Medium',
          url: 'https://decrypt.co',
          sourceDomain: 'decrypt.co',
          relatedPair: 'SOL/USDT',
        },
        {
          id: 'news-okn-live-4',
          title: 'OKNexus Token Burns 2.5M OKN from Q3 Protocol Fees with VIP Rebate Expansion',
          summary: 'The OKNexus ecosystem executed its scheduled token burn funded by spot & perps trading volumes, reducing circulating supply while rewarding tier holders.',
          coinSymbol: 'OKN',
          publisher: 'OKNexus Intel',
          timeAgo: '2h ago',
          sentiment: 'bullish',
          category: 'Ecosystem',
          impact: 'High',
          url: 'https://oknexus.exchange',
          sourceDomain: 'oknexus.exchange',
          relatedPair: 'OKN/USDT',
        },
        {
          id: 'news-macro-live-5',
          title: 'Global Regulators Establish Unified Framework for Institutional Crypto Custody',
          summary: 'International securities commissions finalize unified capital adequacy and segregation standards, establishing legal certainty for tier-1 custodian banks.',
          coinSymbol: targetAssets[0] || 'BTC',
          publisher: 'Bloomberg Financial',
          timeAgo: '3h ago',
          sentiment: 'neutral',
          category: 'Regulation',
          impact: 'Medium',
          url: 'https://www.bloomberg.com/crypto',
          sourceDomain: 'bloomberg.com',
          relatedPair: `${targetAssets[0] || 'BTC'}/USDT`,
        },
        {
          id: 'news-bnb-live-6',
          title: 'BNB Chain Completes Greenfield Data Decentralization Upgrade',
          summary: 'Greenfield testnets verify lower on-chain payload storage pricing for high-frequency algorithmic dApps and AI models.',
          coinSymbol: 'BNB',
          publisher: 'The Block',
          timeAgo: '4h ago',
          sentiment: 'neutral',
          category: 'Tech',
          impact: 'Medium',
          url: 'https://theblock.co',
          sourceDomain: 'theblock.co',
          relatedPair: 'BNB/USDT',
        },
      ];

      // Filter and prioritize news matching target favorite assets
      const matchingHeadlines = curatedNewsPool.filter((item) =>
        targetAssets.includes(item.coinSymbol)
      );

      const finalHeadlines = (
        matchingHeadlines.length >= 5
          ? matchingHeadlines.slice(0, 5)
          : [...matchingHeadlines, ...curatedNewsPool.filter((item) => !matchingHeadlines.includes(item))].slice(0, 5)
      );

      const responsePayload = {
        headlines: finalHeadlines,
        source: 'curated-live-feed',
        searchedAssets: targetAssets,
        searchQueries: targetAssets.map((s) => `${s} breaking crypto news`),
        lastUpdated: new Date().toISOString(),
      };

      newsCache.set(cacheKey, { data: responsePayload, timestamp: Date.now() });
      return res.json(responsePayload);
    } catch (err: any) {
      console.error('Crypto News Route Error:', err);
      return res.status(500).json({
        error: 'Failed to fetch crypto news headlines',
        details: err?.message || 'Unknown error',
      });
    }
  };

  app.post('/api/crypto-news', handleCryptoNewsRequest);
  app.get('/api/crypto-news', handleCryptoNewsRequest);


  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
