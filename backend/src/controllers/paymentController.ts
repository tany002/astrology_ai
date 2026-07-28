import type { Request, Response, NextFunction } from 'express';
import { createRazorpayOrder, verifyAndUnlockReport } from '../services/paymentService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export async function createOrderController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { reportId, email, phone } = req.body as {
      reportId?: string;
      email?: string;
      phone?: string;
    };

    if (!reportId || typeof reportId !== 'string') {
      sendError(res, 'reportId is required.', 400);
      return;
    }

    logger.info('PaymentController', `Creating order for reportId: ${reportId}`);

    const orderData = await createRazorpayOrder(
      reportId,
      email as string | undefined,
      phone as string | undefined
    );

    sendSuccess(res, orderData, 'Order created successfully', 201);
  } catch (error) {
    const err = error as { statusCode?: number; message: string };
    if (err.statusCode) {
      sendError(res, err.message, err.statusCode);
      return;
    }
    logger.error('PaymentController', 'Create order failed', error);
    next(error);
  }
}

export async function verifyPaymentController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { reportId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body as {
      reportId?: string;
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    if (!reportId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      sendError(res, 'Missing required payment verification fields.', 400);
      return;
    }

    logger.info('PaymentController', `Verifying payment for order: ${razorpay_order_id}`);

    const result = await verifyAndUnlockReport(
      reportId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    sendSuccess(res, result, 'Payment verified. Report unlocked.');
  } catch (error) {
    const err = error as { statusCode?: number; message: string };
    if (err.statusCode) {
      sendError(res, err.message, err.statusCode);
      return;
    }
    logger.error('PaymentController', 'Payment verification failed', error);
    next(error);
  }
}
