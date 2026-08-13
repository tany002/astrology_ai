import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('ErrorHandler', error.message, error);

  if (res.headersSent) return;

  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred. Please try again.',
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `The requested endpoint does not exist: ${req.method} ${req.path}`,
  });
}
