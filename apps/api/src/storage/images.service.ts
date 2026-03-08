import { BadRequestException, Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { FilesService } from './files.service';
import { StorageBucket } from './storage.constants';

@Injectable()
export class ImagesService {
  private static readonly allowedFormats = new Set(['jpeg', 'png', 'webp']);
  private static readonly mimeTypeByFormat: Record<string, string> = {
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
  };

  constructor(private readonly filesService: FilesService) {}

  async create(file: Express.Multer.File) {
    return this.withValidatedImage(file, (validFile) =>
      this.filesService.create(validFile, StorageBucket.Public),
    );
  }

  async createWithStorageKey(storageKey: string, file: Express.Multer.File) {
    return this.withValidatedImage(file, (validFile) =>
      this.filesService.createWithStorageKey(storageKey, validFile, StorageBucket.Public),
    );
  }

  async update(storageKey: string, file: Express.Multer.File) {
    return this.withValidatedImage(file, (validFile) =>
      this.filesService.update(storageKey, validFile),
    );
  }

  private async assertValidImage(file: Express.Multer.File) {
    if (!file.buffer.length) {
      throw new BadRequestException('Uploaded file is empty.');
    }

    const metadata = await sharp(file.buffer)
      .metadata()
      .catch(() => null);
    const format = metadata?.format;

    if (!format || !ImagesService.allowedFormats.has(format)) {
      throw new BadRequestException('Uploaded file must be a valid JPEG, PNG, or WEBP image.');
    }

    const expectedMimeType = ImagesService.mimeTypeByFormat[format];
    if (file.mimetype !== expectedMimeType) {
      throw new BadRequestException('File content does not match the provided MIME type.');
    }
  }

  private async withValidatedImage<T>(
    file: Express.Multer.File,
    callback: (file: Express.Multer.File) => Promise<T>,
  ) {
    await this.assertValidImage(file);
    return callback(file);
  }
}
