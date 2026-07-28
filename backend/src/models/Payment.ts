import mongoose, { Schema, type Document } from 'mongoose';

export type PaymentStatus = 'created' | 'paid' | 'failed';

export interface IPayment extends Document {
  reportId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    reportId: { type: String, required: true },
    razorpayOrderId: { type: String, required: true, unique: true, index: true },
    razorpayPaymentId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'payments',
  }
);

PaymentSchema.index({ createdAt: -1 });

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
