import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { cloudinary } from '../config/cloudinary.js';
import { logger } from '../utils/logger.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function validateImageFile(file: Express.Multer.File): { valid: boolean; error?: string; statusCode?: number } {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return { valid: false, error: 'Invalid image format. Please upload a JPG, PNG, or WEBP file.', statusCode: 415 };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: 'Image is too large. Maximum size is 10 MB.', statusCode: 413 };
  }
  return { valid: true };
}

export async function uploadImageToCloudinary(buffer: Buffer, mimetype: string): Promise<string> {
  const filename = uuidv4();

  const formatMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };

  const format = formatMap[mimetype] ?? 'jpg';

  logger.info('UploadService', `Uploading image to Cloudinary: ${filename}`);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'astrologer-ai/palms',
        public_id: filename,
        resource_type: 'image',
        format: 'webp',
        transformation: [
          { quality: 'auto:good', fetch_format: 'auto', width: 1200, crop: 'limit' },
        ],
      },
      (error, result) => {
        if (error) {
          logger.error('UploadService', 'Cloudinary upload failed', error);
          reject(new Error('Failed to upload image. Please try again.'));
          return;
        }
        if (!result?.secure_url) {
          reject(new Error('Upload completed but no URL returned.'));
          return;
        }
        logger.info('UploadService', `Image uploaded successfully: ${result.secure_url}`);
        resolve(result.secure_url);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}
