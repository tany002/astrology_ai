import mongoose, { Schema, type Document } from 'mongoose';
import type { FullReport, ReportPreview, PalmAnalysis, PaymentStatus } from '../types/index.js';

export interface IReport extends Document {
  reportId: string;
  email?: string;
  phone?: string;
  imageUrl: string;
  preview: ReportPreview;
  fullReport: FullReport;
  analysis: PalmAnalysis;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  razorpayOrderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reportId: { type: String, required: true, unique: true, index: true },
    email: { type: String },
    phone: { type: String },
    imageUrl: { type: String, required: true },
    preview: {
      personality: { type: String, required: true },
      love: { type: String, required: true },
    },
    fullReport: { type: Schema.Types.Mixed, required: true },
    analysis: { type: Schema.Types.Mixed, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
      index: true,
    },
    paymentId: { type: String },
    razorpayOrderId: { type: String },
  },
  {
    timestamps: true,
    collection: 'reports',
  }
);

ReportSchema.index({ createdAt: -1 });

export const Report = mongoose.model<IReport>('Report', ReportSchema);
