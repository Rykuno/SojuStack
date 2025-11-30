import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { FileStorageService, UploadFileResult } from './file-storage.service';

interface UploadImageOptions {
  convertToWebp?: boolean;
  quality?: number;
  resize?: sharp.ResizeOptions;
}

@Injectable()
export class ImageStorageService {
  constructor(private readonly fileStorageService: FileStorageService) {}

  /**
   * Upload and process an image
   */
  async upload(
    file: Express.Multer.File,
    options: UploadImageOptions = {},
  ): Promise<UploadFileResult> {
    const { convertToWebp = true, quality = 80, resize } = options;

    // Process image
    let image = sharp(file.buffer);

    // Apply resize if specified
    if (resize) {
      image = image.resize(resize.width, resize.height, {
        ...resize,
      });
    }

    // Convert to WebP if requested
    if (convertToWebp) {
      image = image.webp({ quality });
    }

    const buffer = await image.toBuffer();

    // Create a modified file object for upload
    const processedFile: Express.Multer.File = {
      ...file,
      buffer,
      mimetype: convertToWebp ? 'image/webp' : file.mimetype,
      size: buffer.byteLength,
    };

    return this.fileStorageService.upload(processedFile);
  }

  /**
   * Delete an image
   * Uses reference counting - won't delete if other references exist
   */
  async delete(id: string): Promise<void> {
    // Don't force delete - use reference counting
    return this.fileStorageService.delete(id, { forceDelete: false });
  }

  /**
   * Get image URL
   */
  async getUrl(id: string, expiresIn?: number): Promise<string> {
    return this.fileStorageService.getUrl(id, expiresIn);
  }
}
