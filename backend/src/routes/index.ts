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

// GET probes (wget, browser address bar) must not 404 — that looks like the
// route is missing. These endpoints only accept POST.
router.get('/simple-order', (_req, res) => {
  res.set('Allow', 'POST');
  res.status(405).json({
    success: false,
    message: 'Use POST /api/simple-order to create a payment order.',
  });
});

router.get('/simple-verify', (_req, res) => {
  res.set('Allow', 'POST');
  res.status(405).json({
    success: false,
    message: 'Use POST /api/simple-verify to verify a payment.',
  });
});

export default router;
