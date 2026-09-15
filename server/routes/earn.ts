import { Router, Request, Response } from 'express';

export const earnRouter = Router();

const earnProducts = [
  { id: 'earn-usdt', symbol: 'USDT', name: 'Tether USD Earn', apy: 12.5, term: 'Flexible', minDeposit: 10, totalStakedUsd: 14200000 },
  { id: 'earn-btc', symbol: 'BTC', name: 'Bitcoin Real Yield', apy: 4.8, term: 'Flexible', minDeposit: 0.001, totalStakedUsd: 89000000 },
  { id: 'earn-sol', symbol: 'SOL', name: 'Solana PoS Validator Yield', apy: 7.2, term: 'Flexible', minDeposit: 0.1, totalStakedUsd: 31000000 },
  { id: 'earn-okn', symbol: 'OKN', name: 'OKNexus VIP Vault Lockup', apy: 18.5, term: '30 Days', minDeposit: 500, totalStakedUsd: 6500000 },
];

/**
 * GET /api/earn/products
 * Returns active yield products and APY tiers
 */
earnRouter.get('/products', (req: Request, res: Response) => {
  return res.json({
    success: true,
    products: earnProducts,
  });
});

/**
 * POST /api/earn/subscribe
 * Subscribes balance to an earn staking product
 */
earnRouter.post('/subscribe', (req: Request, res: Response) => {
  const { productId, amount } = req.body;
  if (!productId || !amount) {
    return res.status(400).json({ error: 'Missing productId or amount' });
  }

  const product = earnProducts.find((p) => p.id === productId);

  return res.status(201).json({
    success: true,
    message: `Successfully subscribed ${amount} to ${product?.name || productId}`,
    subscribedAt: new Date().toISOString(),
  });
});
