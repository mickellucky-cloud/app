import { Router, Request, Response } from 'express';

export const aiBotRouter = Router();

let botStrategies = [
  {
    id: 'bot-strat-1',
    symbol: 'BTC/USDT',
    strategyType: 'Spot Grid',
    lowerPrice: 82000.00,
    upperPrice: 94000.00,
    gridCount: 30,
    allocatedUsd: 5000.00,
    totalProfitUsd: 412.80,
    apy: 38.4,
    status: 'running',
    runtimeHours: 72,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

/**
 * GET /api/ai-bot/strategies
 * Returns user's active and past AI quantitative bot strategies
 */
aiBotRouter.get('/strategies', (req: Request, res: Response) => {
  return res.json({
    success: true,
    strategies: botStrategies,
  });
});

/**
 * POST /api/ai-bot/start
 * Launches a new AI Quantitative Grid Bot strategy
 */
aiBotRouter.post('/start', (req: Request, res: Response) => {
  const { symbol, lowerPrice, upperPrice, gridCount, allocatedUsd } = req.body;

  if (!symbol || !allocatedUsd) {
    return res.status(400).json({ error: 'Missing symbol or allocatedUsd' });
  }

  const newBot = {
    id: `bot-strat-${Date.now()}`,
    symbol: symbol.toUpperCase(),
    strategyType: 'Spot Grid',
    lowerPrice: Number(lowerPrice) || 82000,
    upperPrice: Number(upperPrice) || 95000,
    gridCount: Number(gridCount) || 25,
    allocatedUsd: Number(allocatedUsd),
    totalProfitUsd: 0.00,
    apy: 36.2,
    status: 'running',
    runtimeHours: 0,
    createdAt: new Date().toISOString(),
  };

  botStrategies.unshift(newBot);

  return res.status(201).json({
    success: true,
    message: `AI Grid Bot launched for ${newBot.symbol}`,
    bot: newBot,
  });
});

/**
 * POST /api/ai-bot/stop
 * Terminates an active AI bot and liquidates or retains base assets
 */
aiBotRouter.post('/stop', (req: Request, res: Response) => {
  const { id, sellBaseAsset } = req.body;
  const bot = botStrategies.find((b) => b.id === id);

  if (bot) {
    bot.status = 'stopped';
  }

  return res.json({
    success: true,
    message: `AI Grid Bot ${id} stopped`,
    bot,
  });
});
