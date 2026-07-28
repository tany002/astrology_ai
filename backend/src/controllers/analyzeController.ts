import type { Request, Response, NextFunction } from 'express';
import { analyzeAndGenerateReport, PalmAnalysisError } from '../services/palmAnalysisService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export async function analyzeController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { imageUrl } = req.body as { imageUrl?: string };

    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
      sendError(res, 'A valid image URL is required.', 400);
      return;
    }

    logger.info('AnalyzeController', `Starting AI pipeline for: ${imageUrl}`);
    const startTime = Date.now();

    const { reportId, preview } = await analyzeAndGenerateReport(imageUrl);

    const elapsed = Date.now() - startTime;
    logger.info('AnalyzeController', `AI pipeline complete in ${elapsed}ms. reportId: ${reportId}`);

    sendSuccess(
      res,
      { reportId, preview, paymentStatus: 'pending' },
      'Palm analysis complete',
      201
    );
  } catch (error) {
    if (error instanceof PalmAnalysisError) {
      sendError(res, error.message, error.statusCode);
      return;
    }
    logger.error('AnalyzeController', 'Analysis failed', error);
    next(error);
  }
}
