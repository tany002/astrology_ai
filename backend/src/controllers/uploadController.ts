import type { Request, Response, NextFunction } from 'express';
import { validateImageFile, uploadImageToCloudinary } from '../services/uploadService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export async function uploadPalmController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const file = req.file;
    if (!file) {
      sendError(res, 'No image provided. Please upload a palm image.', 400);
      return;
    }

    const validation = validateImageFile(file);
    if (!validation.valid) {
      sendError(res, validation.error!, validation.statusCode ?? 400);
      return;
    }

    logger.info('UploadController', `Processing upload: ${file.originalname} (${file.size} bytes)`);

    const imageUrl = await uploadImageToCloudinary(file.buffer, file.mimetype);

    sendSuccess(res, { imageUrl }, 'Upload successful', 201);
  } catch (error) {
    logger.error('UploadController', 'Upload failed', error);
    next(error);
  }
}
