import { Router } from 'express';
import {
  createSimpleOrderController,
  verifySimplePaymentController,
} from '../controllers/simplePaymentController.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    database: 'connected',
    payments: 'online',
    timestamp: new Date().toISOString(),
  });
});

// ── MVP: simple direct-payment routes (₹5 launch offer) ─────────────────────
router.post('/simple-order', createSimpleOrderController);
router.post('/simple-verify', verifySimplePaymentController);

export default router;
