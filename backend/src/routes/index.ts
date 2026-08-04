import { Router } from 'express';
import mongoose from 'mongoose';
import {
  createSimpleOrderController,
  verifySimplePaymentController,
} from '../controllers/simplePaymentController.js';

const router = Router();

router.get('/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
  const isHealthy = dbState === 1;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    database: dbStatus,
    payments: 'online',
    timestamp: new Date().toISOString(),
  });
});

// ── MVP: simple direct-payment routes (₹5 launch offer) ─────────────────────
router.post('/simple-order', createSimpleOrderController);
router.post('/simple-verify', verifySimplePaymentController);

export default router;
