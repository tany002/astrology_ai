import type { Request, Response, NextFunction } from 'express';
import { createSimpleOrder, verifySimplePayment } from '../services/simplePaymentService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export async function createSimpleOrderController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, phone } = req.body as {
      name?: string;
      email?: string;
      phone?: string;
    };

    logger.info('SimplePaymentController', `Creating order for ${email ?? 'guest'}`);

    const orderData = await createSimpleOrder(
      name as string | undefined,
      email as string | undefined,
      phone as string | undefined
    );

    sendSuccess(res, orderData, 'Order created successfully', 201);
  } catch (error) {
    logger.error('SimplePaymentController', 'Create order failed', error);
    next(error);
  }
}

export async function verifySimplePaymentController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      sendError(res, 'Missing required payment verification fields.', 400);
      return;
    }

    logger.info('SimplePaymentController', `Verifying payment: ${razorpay_payment_id}`);

    const result = await verifySimplePayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    sendSuccess(res, result, 'Payment verified successfully');
  } catch (error) {
    const err = error as { statusCode?: number; message: string };
    if (err.statusCode) {
      sendError(res, err.message, err.statusCode);
      return;
    }
    logger.error('SimplePaymentController', 'Payment verification failed', error);
    next(error);
  }
}
