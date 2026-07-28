import type { Request, Response, NextFunction } from 'express';
import { getReport } from '../services/reportService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export async function getReportController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { reportId } = req.params;

    if (!reportId || typeof reportId !== 'string') {
      sendError(res, 'reportId is required.', 400);
      return;
    }

    logger.info('ReportController', `Fetching report: ${reportId}`);

    const report = await getReport(reportId);

    sendSuccess(res, report, 'Report retrieved successfully');
  } catch (error) {
    const err = error as { statusCode?: number; message: string };
    if (err.statusCode) {
      sendError(res, err.message, err.statusCode);
      return;
    }
    logger.error('ReportController', 'Failed to fetch report', error);
    next(error);
  }
}
