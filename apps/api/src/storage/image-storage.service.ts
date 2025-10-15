import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.service';
import sharp from 'sharp';

type Create = {
  file: Express.Multer.File;
  options?: {
    convertToWebp?: boolean;
    quality?: number;
  };
};

@Injectable()
export class ImageStorageService {
  constructor(private readonly storageService: StorageService) {}

  async create({file, options = {convertToWebp: true, quality: 80}}: Create) {
    let buffer = await sharp(file.buffer).toBuffer()

    if (options.convertToWebp) {
      buffer = await sharp(buffer).webp({ quality: options.quality }).toBuffer();
    }

    return this.storageService.create({
      ...file,
      buffer,
      originalname: file.originalname,
      mimetype: 'image/webp',
      size: buffer.byteLength,
    });
  }

  delete(id: string) {
    return this.storageService.delete(id, { forceDelete: false });
  }
}
