import { SupportFaqItem } from '../types';

export const INITIAL_SUPPORT_FAQS: SupportFaqItem[] = [
  {
    id: 'faq-1',
    category: 'deposit',
    question: 'How long do crypto deposits take to credit?',
    answer: 'Deposits are credited automatically once required block confirmations are reached:\n• USDT (TRC20): 1-3 minutes (~12 confirmations)\n• USDT/ETH (ERC20): 2-5 minutes (~12 confirmations)\n• BTC (Bitcoin): 10-30 minutes (2 confirmations)\n• SOL (Solana): 10-30 seconds (32 confirmations)\nMake sure you send only to the corresponding network address.',
    action: 'open_deposit',
    actionLabel: 'Go to Deposit Portal'
  },
  {
    id: 'faq-2',
    category: 'trading',
    question: 'What are my current trading fee rates?',
    answer: 'Your account is on VIP Tier 2:\n• Spot Maker Fee: 0.0800% (or 0.0600% using OKN deduction)\n• Spot Taker Fee: 0.1000%\n• Futures Maker: 0.0200% / Taker: 0.0500%\n• Instant Swap / Convert: 0.00% Zero Fee\nTrading volume recalculates daily at 00:00 UTC.',
    action: 'open_trade',
    actionLabel: 'Open Spot Trading'
  },
  {
    id: 'faq-3',
    category: 'security',
    question: 'How does Biometric authorization (Face ID / Touch ID) work?',
    answer: 'Biometric authorization secures high-value actions such as app unlock, withdrawals above 5,000 USDT, and API key generation. Your biometric data remains encrypted on your local secure enclave and is never transmitted over the network.',
    action: 'open_security',
    actionLabel: 'Security Settings'
  },
  {
    id: 'faq-4',
    category: 'bot',
    question: 'How does the AI Grid Auto-Trader Bot function?',
    answer: 'The OKNexus AI Grid Bot deploys automated buy and sell orders within a geometric price band calculated using historical volatility and RSI momentum. When market fluctuates, it takes micro-profits 24/7 without manual intervention.',
    action: 'open_ai_trader',
    actionLabel: 'Explore AI Trader'
  },
  {
    id: 'faq-5',
    category: 'p2p',
    question: 'Is my fiat payment protected during P2P Trading?',
    answer: 'Yes, OKNexus operates a 100% escrow protection guarantee. When you place a buy order, the merchant crypto is locked in OKNexus smart escrow. Only confirm release after you have physically received payment in your bank account.',
    action: 'open_p2p',
    actionLabel: 'Open P2P Desk'
  },
  {
    id: 'faq-6',
    category: 'earn',
    question: 'How are Earn savings rewards calculated and paid?',
    answer: 'OKNexus Earn yields (up to 18.5% APY on USDT and 6.2% on ETH) compound continuously. Yields accrue daily and are paid directly into your Funding wallet at 08:00 UTC every morning with zero lockup penalty on flexible products.',
    action: 'open_earn',
    actionLabel: 'View Earn Staking'
  }
];

export const NETWORK_STATUS_DATA = [
  { network: 'Bitcoin (BTC)', status: 'Operational', blockTime: '~9.8m', avgGas: '28 sat/vB', color: 'text-amber-400' },
  { network: 'Ethereum (ERC20)', status: 'Operational', blockTime: '~12.2s', avgGas: '16 Gwei', color: 'text-indigo-400' },
  { network: 'Tron (TRC20)', status: 'High Speed', blockTime: '~3.1s', avgGas: '0.8 USDT', color: 'text-rose-400' },
  { network: 'Solana (SOL)', status: 'Optimal', blockTime: '~420ms', avgGas: '<$0.001', color: 'text-emerald-400' },
  { network: 'Arbitrum One', status: 'Optimal', blockTime: '~250ms', avgGas: '0.1 Gwei', color: 'text-cyan-400' },
];

export const QUICK_PROMPTS = [
  '⚡ Check my VIP fees and trading discount',
  '💳 Why is my crypto deposit taking time?',
  '🤖 How to configure the 24/7 AI Grid Bot?',
  '🛡️ Run a 1-click Security & 2FA Health Audit',
  '📊 Explain Funding Wallet vs Spot Wallet',
  '👤 Talk to a Senior Human Specialist'
];
