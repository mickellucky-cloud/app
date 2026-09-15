import { Router, Request, Response } from 'express';

export const alertsRouter = Router();

let alerts = [
  {
    id: 'alert-1',
    symbol: 'BTC/USDT',
    targetPrice: 90000.00,
    direction: 'rises_above',
    status: 'active',
    note: 'Take profit level 1',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'alert-2',
    symbol: 'ETH/USDT',
    targetPrice: 3200.00,
    direction: 'drops_below',
    status: 'active',
    note: 'DCA re-entry signal',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

/**
 * GET /api/alerts
 * Returns user's configured price trigger alerts
 */
alertsRouter.get('/', (req: Request, res: Response) => {
  return res.json({
    success: true,
    alerts,
  });
});

/**
 * POST /api/alerts
 * Creates a new price trigger alert with push/email notifications
 */
alertsRouter.post('/', (req: Request, res: Response) => {
  const { symbol, targetPrice, direction, note } = req.body;

  if (!symbol || !targetPrice) {
    return res.status(400).json({ error: 'Missing symbol or targetPrice' });
  }

  const newAlert = {
    id: `alert-${Date.now()}`,
    symbol: symbol.toUpperCase(),
    targetPrice: Number(targetPrice),
    direction: direction || 'rises_above',
    status: 'active',
    note: note || '',
    createdAt: new Date().toISOString(),
  };

  alerts.unshift(newAlert);

  return res.status(201).json({
    success: true,
    message: `Alert created for ${newAlert.symbol} @ $${newAlert.targetPrice}`,
    alert: newAlert,
  });
});

/**
 * DELETE /api/alerts/:id
 * Removes a price trigger alert
 */
alertsRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  alerts = alerts.filter((a) => a.id !== id);

  return res.json({
    success: true,
    message: `Alert ${id} deleted`,
  });
});
