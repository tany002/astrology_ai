import crypto from 'crypto';
import { getRazorpay } from '../config/razorpay.js';
import { Report } from '../models/Report.js';
import { Payment } from '../models/Payment.js';
import { logger } from '../utils/logger.js';

const PRICE_PAISE = parseInt(process.env.PRICE_PAISE ?? '29900', 10);

export async function createRazorpayOrder(
  reportId: string,
  email?: string,
  phone?: string
): Promise<{
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}> {
  const report = await Report.findOne({ reportId });
  if (!report) {
    throw Object.assign(new Error('Report not found.'), { statusCode: 404 });
  }

  if (report.paymentStatus === 'paid') {
    throw Object.assign(new Error('This report has already been paid for.'), { statusCode: 400 });
  }

  const razorpay = getRazorpay();

  const order = await razorpay.orders.create({
    amount: PRICE_PAISE,
    currency: 'INR',
    receipt: `receipt_${reportId.slice(0, 20)}`,
    notes: { reportId },
  });

  logger.info('PaymentService', `Razorpay order created: ${order.id}`);

  await Payment.create({
    reportId,
    razorpayOrderId: order.id,
    amount: PRICE_PAISE,
    currency: 'INR',
    status: 'created',
  });

  if (email || phone) {
    await Report.updateOne({ reportId }, { $set: { email, phone, razorpayOrderId: order.id } });
  } else {
    await Report.updateOne({ reportId }, { $set: { razorpayOrderId: order.id } });
  }

  return {
    orderId: order.id as string,
    amount: PRICE_PAISE,
    currency: 'INR',
    key: process.env.RAZORPAY_KEY_ID ?? '',
  };
}

export async function verifyAndUnlockReport(
  reportId: string,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<{ paymentStatus: string; reportId: string }> {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error('Razorpay key secret is not configured.');
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    logger.warn('PaymentService', `Signature verification failed for order: ${razorpayOrderId}`);
    throw Object.assign(new Error('Payment verification failed. Invalid signature.'), { statusCode: 401 });
  }

  logger.info('PaymentService', `Payment verified for order: ${razorpayOrderId}`);

  await Payment.updateOne(
    { razorpayOrderId },
    { $set: { razorpayPaymentId, status: 'paid' } }
  );

  await Report.updateOne(
    { reportId },
    { $set: { paymentStatus: 'paid', paymentId: razorpayPaymentId } }
  );

  logger.info('PaymentService', `Report unlocked: ${reportId}`);

  return { paymentStatus: 'paid', reportId };
}
