import { Injectable } from '@nestjs/common';
import { S3StorageProvider } from '../providers/s3-storage.provider';
import { FileMetadataService } from './file-metadata.service';
import { StorageOperationException } from '../exceptions/storage.exception';

export interface UploadFileResult {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  url?: string;
}

export interface DeleteFileOptions {
  /**
   * If true, delete from storage even if other references exist
   */
  forceDelete?: boolean;
}

@Injectable()
export class FileStorageService {
  constructor(
    private readonly storageProvider: S3StorageProvider,
    private readonly fileMetadataService: FileMetadataService,
  ) {}

  /**
   * Upload a file and create metadata record
   */
  async upload(file: Express.Multer.File): Promise<UploadFileResult> {
    try {
      // Create metadata record first
      const metadata = await this.fileMetadataService.create({
        name: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
      });

      // Upload to storage
      const uploadResult = await this.storageProvider.upload({
        key: metadata.storageKey,
        body: file.buffer,
        contentType: file.mimetype,
      });

      return {
        id: metadata.id,
        name: metadata.name,
        mimeType: metadata.mimeType,
        sizeBytes: Number(metadata.sizeBytes),
        storageKey: metadata.storageKey,
        url: uploadResult.url,
      };
    } catch (error) {
      throw new StorageOperationException('upload', error as Error);
    }
  }

  /**
   * Delete a file and its metadata
   * Handles reference counting to avoid deleting files that are still referenced
   */
  async delete(id: string, options: DeleteFileOptions = {}): Promise<void> {
    try {
      // Get file metadata
      const file = await this.fileMetadataService.findById(id);

      // Check if we should delete from storage
      const shouldDeleteFromStorage =
        options.forceDelete ||
        (await this.fileMetadataService.shouldDeleteFromStorage(
          file.storageKey,
        ));

      // Delete metadata record
      await this.fileMetadataService.delete(id);

      // Delete from storage if needed
      if (shouldDeleteFromStorage) {
        await this.storageProvider.delete(file.storageKey);
      }
    } catch (error) {
      throw new StorageOperationException('delete', error as Error);
    }
  }

  /**
   * Get file download URL
   */
  async getUrl(id: string, expiresIn?: number): Promise<string> {
    try {
      const file = await this.fileMetadataService.findById(id);
      return this.storageProvider.getUrl(file.storageKey, {
        expiresIn,
      });
    } catch (error) {
      throw new StorageOperationException('getUrl', error as Error);
    }
  }

  /**
   * Download a file
   */
  async download(id: string): Promise<Buffer> {
    try {
      const file = await this.fileMetadataService.findById(id);
      return this.storageProvider.download(file.storageKey);
    } catch (error) {
      throw new StorageOperationException('download', error as Error);
    }
  }

  /**
   * Stream a file (useful for large files)
   */
  async stream(id: string) {
    try {
      const file = await this.fileMetadataService.findById(id);
      return this.storageProvider.stream(file.storageKey);
    } catch (error) {
      throw new StorageOperationException('stream', error as Error);
    }
  }
}
