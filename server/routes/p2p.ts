import { Router, Request, Response } from 'express';

export const p2pRouter = Router();

const merchants = [
  {
    id: 'm-1',
    merchantName: 'CryptoNexus_Pro',
    verified: true,
    ordersCount: 3420,
    completionRate: 99.4,
    price: 1.002,
    fiatSymbol: 'USD',
    cryptoSymbol: 'USDT',
    minLimit: 50,
    maxLimit: 15000,
    paymentMethods: ['Bank Wire', 'Wise', 'Revolut'],
    type: 'sell',
  },
  {
    id: 'm-2',
    merchantName: 'EuroFast_Escrow',
    verified: true,
    ordersCount: 1890,
    completionRate: 98.8,
    price: 0.925,
    fiatSymbol: 'EUR',
    cryptoSymbol: 'USDT',
    minLimit: 100,
    maxLimit: 25000,
    paymentMethods: ['SEPA Instant', 'Revolut'],
    type: 'sell',
  },
];

let p2pOrders = [
  {
    id: 'p2p-ord-501',
    merchantName: 'CryptoNexus_Pro',
    type: 'buy',
    cryptoAmount: 500,
    cryptoSymbol: 'USDT',
    fiatAmount: 501.00,
    fiatSymbol: 'USD',
    status: 'pending_payment',
    escrowLocked: true,
    paymentWindowMinutes: 15,
    createdAt: new Date().toISOString(),
  },
];

/**
 * GET /api/p2p/ads
 * Searches verified merchant liquidity offers
 */
p2pRouter.get('/ads', (req: Request, res: Response) => {
  const { fiat, crypto, type } = req.query;
  let results = [...merchants];

  if (type) results = results.filter((m) => m.type === type);
  if (fiat) results = results.filter((m) => m.fiatSymbol.toUpperCase() === (fiat as string).toUpperCase());

  return res.json({
    success: true,
    ads: results,
  });
});

/**
 * POST /api/p2p/orders
 * Locks crypto into OKNexus multi-sig escrow and generates fiat payment ticket
 */
p2pRouter.post('/orders', (req: Request, res: Response) => {
  const { merchantId, cryptoAmount, fiatAmount, paymentMethod } = req.body;

  if (!merchantId || !cryptoAmount) {
    return res.status(400).json({ error: 'Missing merchantId or cryptoAmount' });
  }

  const orderId = `p2p-ord-${Date.now()}`;
  const newOrder = {
    id: orderId,
    merchantId,
    merchantName: 'CryptoNexus_Pro',
    type: 'buy',
    cryptoAmount: Number(cryptoAmount),
    cryptoSymbol: 'USDT',
    fiatAmount: Number(fiatAmount) || Number(cryptoAmount),
    fiatSymbol: 'USD',
    paymentMethod: paymentMethod || 'Bank Wire',
    status: 'pending_payment',
    escrowLocked: true,
    paymentWindowMinutes: 15,
    createdAt: new Date().toISOString(),
  };

  p2pOrders.unshift(newOrder);

  return res.status(201).json({
    success: true,
    message: 'Cryptocurrency locked in escrow. Please complete fiat transfer within 15 minutes.',
    order: newOrder,
  });
});

/**
 * GET /api/p2p/orders
 * Returns list of user's active and completed P2P orders
 */
p2pRouter.get('/orders', (req: Request, res: Response) => {
  return res.json({
    success: true,
    orders: p2pOrders,
  });
});

/**
 * POST /api/p2p/orders/:id/confirm-payment
 * Buyer marks fiat payment as sent
 */
p2pRouter.post('/orders/:id/confirm-payment', (req: Request, res: Response) => {
  const { id } = req.params;
  const order = p2pOrders.find((o) => o.id === id);
  if (order) order.status = 'paid_waiting_release';

  return res.json({
    success: true,
    message: 'Payment marked as confirmed. Waiting for merchant verification & escrow release.',
    order,
  });
});

/**
 * POST /api/p2p/orders/:id/release-crypto
 * Seller releases crypto escrow to buyer's wallet
 */
p2pRouter.post('/orders/:id/release-crypto', (req: Request, res: Response) => {
  const { id } = req.params;
  const order = p2pOrders.find((o) => o.id === id);
  if (order) {
    order.status = 'completed';
    order.escrowLocked = false;
  }

  return res.json({
    success: true,
    message: 'Cryptocurrency successfully released to buyer wallet.',
    order,
  });
});
