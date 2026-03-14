import { Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { FilesService } from './files.service';
import { type StorageBucketType } from './storage.constants';
import { getStorageFileExtension } from './storage.utils';

class StorageBucketClient {
  constructor(
    private readonly filesService: FilesService,
    private readonly bucket: StorageBucketType,
  ) {}

  get(key: string) {
    return this.filesService.get(this.bucket, key);
  }

  exists(key: string) {
    return this.filesService.exists(this.bucket, key);
  }

  put(key: string, contents: Buffer | string, options?: { contentType?: string }) {
    return this.filesService.put(this.bucket, key, contents, options);
  }

  putFile(file: Express.Multer.File) {
    const extension = getStorageFileExtension(file.originalname);
    return this.putFileAs(file, `${createId()}${extension}`);
  }

  putFileAs(file: Express.Multer.File, name: string) {
    return this.filesService.putFileAs(this.bucket, file, name);
  }

  delete(key: string) {
    return this.filesService.delete(this.bucket, key);
  }

  size(key: string) {
    return this.filesService.size(this.bucket, key);
  }

  mimeType(key: string) {
    return this.filesService.mimeType(this.bucket, key);
  }
}

@Injectable()
export class StorageService {
  constructor(private readonly filesService: FilesService) {}

  bucket(name: StorageBucketType) {
    return new StorageBucketClient(this.filesService, name);
  }
}
