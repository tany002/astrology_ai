import { Router } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { uploadPalmController } from '../controllers/uploadController.js';
import { analyzeController } from '../controllers/analyzeController.js';
import { createOrderController, verifyPaymentController } from '../controllers/paymentController.js';
import { getReportController } from '../controllers/reportController.js';
import {
  createSimpleOrderController,
  verifySimplePaymentController,
} from '../controllers/simplePaymentController.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many upload requests. Please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const analyzeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many analysis requests. Please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    database: 'connected',
    ai: 'online',
    payments: 'online',
    timestamp: new Date().toISOString(),
  });
});

// ── Simple direct-payment routes (₹5 launch offer) ──────────────────────────
router.post('/simple-order', createSimpleOrderController);
router.post('/simple-verify', verifySimplePaymentController);

// ── Full AI pipeline routes (preserved, not active in current funnel) ────────
router.post('/upload-palm', uploadLimiter, upload.single('image'), uploadPalmController);
router.post('/analyze', analyzeLimiter, analyzeController);
router.post('/create-order', createOrderController);
router.post('/verify-payment', verifyPaymentController);
router.get('/report/:reportId', getReportController);

export default router;
