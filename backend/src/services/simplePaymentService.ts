import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { getRazorpay } from '../config/razorpay.js';
import { Payment } from '../models/Payment.js';
import { logger } from '../utils/logger.js';

// ₹5 launch offer — 500 paise
const LAUNCH_PRICE_PAISE = parseInt(process.env.LAUNCH_PRICE_PAISE ?? '500', 10);

export async function createSimpleOrder(
  name?: string,
  email?: string,
  phone?: string
): Promise<{
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}> {
  const razorpay = getRazorpay();
  const internalId = uuidv4();

  const order = await razorpay.orders.create({
    amount: LAUNCH_PRICE_PAISE,
    currency: 'INR',
    receipt: `launch_${internalId.slice(0, 20)}`,
    notes: {
      type: 'direct_launch',
      ...(name && { name }),
      ...(email && { email }),
    },
  });

  logger.info('SimplePayment', `Order created: ${order.id as string} for ${email ?? 'unknown'}`);

  await Payment.create({
    reportId: `direct_${internalId}`,
    razorpayOrderId: order.id,
    amount: LAUNCH_PRICE_PAISE,
    currency: 'INR',
    status: 'created',
  });

  return {
    orderId: order.id as string,
    amount: LAUNCH_PRICE_PAISE,
    currency: 'INR',
    key: process.env.RAZORPAY_KEY_ID ?? '',
  };
}

export interface VerifiedPayment {
  paymentId: string;
  orderId: string;
  paymentStatus: 'paid';
}

export async function verifySimplePayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<VerifiedPayment> {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error('Razorpay key secret is not configured.');
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    logger.warn('SimplePayment', `Signature mismatch for order: ${razorpayOrderId}`);
    throw Object.assign(new Error('Payment verification failed. Invalid signature.'), {
      statusCode: 401,
    });
  }

  const updated = await Payment.findOneAndUpdate(
    { razorpayOrderId },
    { $set: { razorpayPaymentId, status: 'paid' } },
    { new: true }
  );

  if (!updated) {
    // Payment was cryptographically verified but no DB record matched.
    // This happens if Payment.create() failed during order creation.
    // Log for manual reconciliation — do NOT reject the response,
    // as the money has already been captured by Razorpay.
    logger.warn(
      'SimplePayment',
      `Verified payment ${razorpayPaymentId} but no Payment record found for order ${razorpayOrderId} — requires manual reconciliation`
    );
  }

  logger.info('SimplePayment', `Payment verified: ${razorpayPaymentId}`);

  return {
    paymentId: razorpayPaymentId,
    orderId: razorpayOrderId,
    paymentStatus: 'paid',
  };
}
