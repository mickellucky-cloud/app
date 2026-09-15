import { Router, Request, Response } from 'express';

export const walletRouter = Router();

// In-memory demo balances
let userBalances = {
  totalAssets: 42318.65,
  pnl24hUsd: 5420.50,
  pnl24hPct: 14.82,
  spotUsd: 28412.32,
  fundingUsd: 8236.17,
  earnUsd: 3670.16,
  futuresUsd: 2000.00,
  assets: [
    { symbol: 'USDT', name: 'Tether USD', total: 18450.25, available: 16200.00, inOrders: 2250.25, usdValue: 18450.25 },
    { symbol: 'BTC', name: 'Bitcoin', total: 0.285, available: 0.235, inOrders: 0.05, usdValue: 24923.25 },
    { symbol: 'ETH', name: 'Ethereum', total: 2.15, available: 2.15, inOrders: 0.00, usdValue: 7417.50 },
    { symbol: 'SOL', name: 'Solana', total: 14.50, available: 14.50, inOrders: 0.00, usdValue: 2755.00 },
    { symbol: 'OKN', name: 'OKNexus Token', total: 12500, available: 12500, inOrders: 0.00, usdValue: 3125.00 },
  ],
};

export interface WalletTransaction {
  id: string;
  type: string;
  currency: string;
  network: string;
  amount: number;
  status: string;
  txHash?: string;
  destinationAddress?: string;
  createdAt: string;
}

const transactions: WalletTransaction[] = [
  {
    id: 'tx-1',
    type: 'deposit',
    currency: 'USDT',
    network: 'TRC20',
    amount: 1500.00,
    status: 'completed',
    txHash: '9f8b4c2a1e0d3f7e6a5b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'tx-2',
    type: 'withdraw',
    currency: 'SOL',
    network: 'Solana',
    amount: 5.0,
    status: 'completed',
    txHash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

/**
 * GET /api/wallet/balances
 * Returns portfolio valuation, account sub-balances, and crypto asset breakdown
 */
walletRouter.get('/balances', (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: userBalances,
  });
});

/**
 * GET /api/wallet/deposit/address
 * Generates or retrieves institutional deposit address for selected crypto asset and chain
 */
walletRouter.get('/deposit/address', (req: Request, res: Response) => {
  const currency = ((req.query.currency as string) || 'USDT').toUpperCase();
  const network = ((req.query.network as string) || 'TRC20').toUpperCase();

  const networkAddressMap: Record<string, string> = {
    'TRC20': 'TXjK3m9V2wL4pQ8sN7zB1cDxEyFaG5hJk',
    'ERC20': '0x71C...49b6A3F8b72D8E2A7d1D92b67f10b7',
    'ARBITRUM ONE': '0x71C...49b6A3F8b72D8E2A7d1D92b67f10b7',
    'SOLANA': '7XwK...4pQ8sN7zB1cDxEyFaG5hJkm9V2wL',
    'BITCOIN': 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  };

  const address = networkAddressMap[network] || 'TXjK3m9V2wL4pQ8sN7zB1cDxEyFaG5hJk';

  return res.json({
    success: true,
    currency,
    network,
    address,
    memo: network.includes('TON') || network.includes('XRP') ? '8829410' : null,
    minDeposit: currency === 'USDT' ? 1.0 : 0.0005,
    confirmationsRequired: network === 'TRC20' ? 12 : network === 'SOLANA' ? 32 : 12,
    expectedArrival: network === 'SOLANA' ? '15 seconds' : '1-3 minutes',
  });
});

/**
 * POST /api/wallet/withdraw
 * Initiates verified crypto withdrawal
 */
walletRouter.post('/withdraw', (req: Request, res: Response) => {
  const { currency, network, amount, destinationAddress, twoFactorCode } = req.body;

  if (!currency || !network || !amount || !destinationAddress) {
    return res.status(400).json({ error: 'Missing required withdrawal fields' });
  }

  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: 'Invalid withdrawal amount' });
  }

  const txId = `wd_${Date.now()}`;
  const newTx = {
    id: txId,
    type: 'withdraw',
    currency: currency.toUpperCase(),
    network,
    amount: numAmount,
    destinationAddress,
    status: 'processing',
    createdAt: new Date().toISOString(),
  };

  transactions.unshift(newTx);

  return res.status(202).json({
    success: true,
    message: 'Withdrawal submitted for network verification',
    transaction: newTx,
  });
});

/**
 * POST /api/wallet/transfer
 * Transfers funds internally between Spot, Funding, Earn, and Futures accounts
 */
walletRouter.post('/transfer', (req: Request, res: Response) => {
  const { fromAccount, toAccount, currency, amount } = req.body;

  if (!fromAccount || !toAccount || !currency || !amount) {
    return res.status(400).json({ error: 'Missing transfer parameters' });
  }

  return res.json({
    success: true,
    message: `Transferred ${amount} ${currency} from ${fromAccount} to ${toAccount} (Zero Fee)`,
    transferredAt: new Date().toISOString(),
  });
});

/**
 * POST /api/wallet/convert
 * Executes instant zero-slippage OTC convert swap
 */
walletRouter.post('/convert', (req: Request, res: Response) => {
  const { fromCurrency, toCurrency, fromAmount } = req.body;

  if (!fromCurrency || !toCurrency || !fromAmount) {
    return res.status(400).json({ error: 'Missing convert parameters' });
  }

  const exchangeRate = 87450.0;
  const toAmount = fromCurrency === 'BTC' ? Number(fromAmount) * exchangeRate : Number(fromAmount) / exchangeRate;

  return res.json({
    success: true,
    fromCurrency,
    toCurrency,
    fromAmount: Number(fromAmount),
    toAmount,
    executedRate: exchangeRate,
    feeUsd: 0.00,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/wallet/transactions
 * Returns transaction ledger history
 */
walletRouter.get('/transactions', (req: Request, res: Response) => {
  return res.json({
    success: true,
    transactions,
  });
});
