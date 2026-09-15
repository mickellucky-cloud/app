import { Router, Request, Response } from 'express';

export const spotRouter = Router();

const markets = [
  { symbol: 'BTC/USDT', base: 'BTC', quote: 'USDT', name: 'Bitcoin', price: 87450.25, change24h: 3.42, high24h: 88200.00, low24h: 84900.00, volume24hUsd: 1452093000, category: 'hot' },
  { symbol: 'ETH/USDT', base: 'ETH', quote: 'USDT', name: 'Ethereum', price: 3450.12, change24h: 2.15, high24h: 3520.00, low24h: 3380.00, volume24hUsd: 890450000, category: 'hot' },
  { symbol: 'SOL/USDT', base: 'SOL', quote: 'USDT', name: 'Solana', price: 190.45, change24h: 6.84, high24h: 195.00, low24h: 178.00, volume24hUsd: 620120000, category: 'gainers' },
  { symbol: 'OKN/USDT', base: 'OKN', quote: 'USDT', name: 'OKNexus Token', price: 0.2504, change24h: 14.82, high24h: 0.2650, low24h: 0.2180, volume24hUsd: 48900000, category: 'hot' },
  { symbol: 'DOGE/USDT', base: 'DOGE', quote: 'USDT', name: 'Dogecoin', price: 0.1650, change24h: -1.25, high24h: 0.1720, low24h: 0.1610, volume24hUsd: 210000000, category: 'losers' },
  { symbol: 'SUI/USDT', base: 'SUI', quote: 'USDT', name: 'Sui Network', price: 3.12, change24h: 8.54, high24h: 3.25, low24h: 2.85, volume24hUsd: 135000000, category: 'gainers' },
];

let openOrders = [
  {
    id: 'ord-101',
    symbol: 'BTC/USDT',
    side: 'buy',
    type: 'limit',
    price: 86100.00,
    amount: 0.05,
    filled: 0.00,
    status: 'open',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'ord-102',
    symbol: 'ETH/USDT',
    side: 'sell',
    type: 'limit',
    price: 3580.00,
    amount: 1.25,
    filled: 0.00,
    status: 'open',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
];

/**
 * GET /api/spot/markets
 * Returns 24h ticker list, volume, and statistics for all spot trading pairs
 */
spotRouter.get('/markets', (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: markets,
  });
});

/**
 * GET /api/spot/orderbook/:symbol
 * Returns live bid/ask orderbook depth
 */
spotRouter.get('/orderbook/:symbol', (req: Request, res: Response) => {
  const symbol = (req.params.symbol || 'BTC/USDT').replace('-', '/').toUpperCase();
  const basePrice = symbol.includes('BTC') ? 87450 : symbol.includes('ETH') ? 3450 : 190;

  const bids = [
    [basePrice - 2, 0.45],
    [basePrice - 5, 1.28],
    [basePrice - 10, 3.14],
    [basePrice - 15, 5.02],
    [basePrice - 25, 8.90],
  ];

  const asks = [
    [basePrice + 2, 0.52],
    [basePrice + 5, 1.15],
    [basePrice + 10, 2.80],
    [basePrice + 15, 4.30],
    [basePrice + 25, 7.60],
  ];

  return res.json({
    success: true,
    symbol,
    timestamp: Date.now(),
    bids,
    asks,
  });
});

/**
 * GET /api/spot/trades/:symbol
 * Returns recent executed market trades
 */
spotRouter.get('/trades/:symbol', (req: Request, res: Response) => {
  const symbol = (req.params.symbol || 'BTC/USDT').replace('-', '/').toUpperCase();
  const basePrice = symbol.includes('BTC') ? 87450 : 3450;

  const trades = [
    { id: 'tr-1', price: basePrice + 1.5, amount: 0.125, side: 'buy', time: new Date().toLocaleTimeString() },
    { id: 'tr-2', price: basePrice - 0.5, amount: 0.850, side: 'sell', time: new Date(Date.now() - 3000).toLocaleTimeString() },
    { id: 'tr-3', price: basePrice + 0.2, amount: 0.045, side: 'buy', time: new Date(Date.now() - 7000).toLocaleTimeString() },
  ];

  return res.json({
    success: true,
    symbol,
    trades,
  });
});

/**
 * POST /api/spot/orders
 * Places a new limit or market spot order
 */
spotRouter.post('/orders', (req: Request, res: Response) => {
  const { symbol, side, type, price, amount, stopPrice } = req.body;

  if (!symbol || !side || !type || !amount) {
    return res.status(400).json({ error: 'Missing mandatory order fields (symbol, side, type, amount)' });
  }

  const newOrder = {
    id: `ord-${Date.now()}`,
    symbol: symbol.toUpperCase(),
    side: side.toLowerCase(),
    type: type.toLowerCase(),
    price: Number(price) || (side === 'buy' ? 87450 : 87450),
    amount: Number(amount),
    filled: type === 'market' ? Number(amount) : 0,
    status: type === 'market' ? 'filled' : 'open',
    createdAt: new Date().toISOString(),
  };

  if (newOrder.status === 'open') {
    openOrders.unshift(newOrder);
  }

  return res.status(201).json({
    success: true,
    message: type === 'market' ? 'Market order filled instantly' : 'Limit order placed into orderbook',
    order: newOrder,
  });
});

/**
 * DELETE /api/spot/orders/:id
 * Cancels an active limit order
 */
spotRouter.delete('/orders/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = openOrders.length;
  openOrders = openOrders.filter((o) => o.id !== id);

  return res.json({
    success: true,
    message: openOrders.length < initialLength ? `Order ${id} cancelled` : `Order ${id} removed`,
    cancelledId: id,
  });
});

/**
 * GET /api/spot/orders/open
 * Returns list of user's active unfilled orders
 */
spotRouter.get('/orders/open', (req: Request, res: Response) => {
  return res.json({
    success: true,
    orders: openOrders,
  });
});
