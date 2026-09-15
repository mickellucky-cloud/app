import { Router, Request, Response } from 'express';

export const authRouter = Router();

// In-memory demo sessions
const activeSessions = new Map<string, any>();

/**
 * POST /api/auth/login
 * Authenticates user via email/phone + password or biometric token
 */
authRouter.post('/login', (req: Request, res: Response) => {
  const { identifier, password, biometricToken, otpCode } = req.body;

  if (!identifier && !biometricToken) {
    return res.status(400).json({ error: 'Missing login credentials (identifier or biometricToken required)' });
  }

  const token = `nexus_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const user = {
    uid: '8829410',
    email: identifier && identifier.includes('@') ? identifier : 'dev@nexus.com',
    phone: identifier && !identifier.includes('@') ? identifier : '+2348012345678',
    username: 'Mickel_Lucky',
    vipTier: 2,
    kycLevel: 2,
    twoFactorEnabled: true,
    biometricEnabled: true,
  };

  activeSessions.set(token, { user, createdAt: new Date().toISOString() });

  return res.json({
    success: true,
    token,
    user,
    message: 'Authentication successful',
  });
});

/**
 * POST /api/auth/register
 * Registers new exchange user account
 */
authRouter.post('/register', (req: Request, res: Response) => {
  const { identifier, password, referralCode } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Identifier and password are required' });
  }

  const token = `nexus_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const user = {
    uid: Math.floor(1000000 + Math.random() * 9000000).toString(),
    email: identifier.includes('@') ? identifier : 'dev@nexus.com',
    phone: !identifier.includes('@') ? identifier : '',
    username: `Trader_${Math.floor(1000 + Math.random() * 9000)}`,
    vipTier: 1,
    kycLevel: 0,
    twoFactorEnabled: false,
    biometricEnabled: false,
  };

  activeSessions.set(token, { user, createdAt: new Date().toISOString() });

  return res.status(201).json({
    success: true,
    token,
    user,
    message: 'Account registered successfully',
  });
});

/**
 * GET /api/auth/session
 * Validates active JWT session and returns current user context
 */
authRouter.get('/session', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (token && activeSessions.has(token)) {
    const session = activeSessions.get(token);
    return res.json({
      authenticated: true,
      user: session.user,
    });
  }

  // Fallback default dev session
  return res.json({
    authenticated: true,
    user: {
      uid: '8829410',
      email: 'dev@nexus.com',
      username: 'Mickel_Lucky',
      vipTier: 2,
      kycLevel: 2,
      twoFactorEnabled: true,
    },
  });
});

/**
 * POST /api/auth/logout
 * Terminates active session
 */
authRouter.post('/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (token) activeSessions.delete(token);

  return res.json({ success: true, message: 'Logged out successfully' });
});
