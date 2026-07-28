import { Report } from '../models/Report.js';
import type { ReportPreview, FullReport } from '../types/index.js';

interface ReportResponse {
  reportId: string;
  paymentStatus: string;
  preview?: ReportPreview;
  report?: FullReport;
  createdAt: string;
}

export async function getReport(reportId: string): Promise<ReportResponse> {
  const doc = await Report.findOne({ reportId });
  if (!doc) {
    throw Object.assign(new Error('Report not found.'), { statusCode: 404 });
  }

  if (doc.paymentStatus === 'paid') {
    return {
      reportId: doc.reportId,
      paymentStatus: 'paid',
      report: doc.fullReport as FullReport,
      createdAt: doc.createdAt.toISOString(),
    };
  }

  return {
    reportId: doc.reportId,
    paymentStatus: 'pending',
    preview: doc.preview as ReportPreview,
    createdAt: doc.createdAt.toISOString(),
  };
}
