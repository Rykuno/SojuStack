import { Module } from '@nestjs/common';
import { FileStorageService } from './services/file-storage.service';
import { ImageStorageService } from './services/image-storage.service';
import { FileMetadataService } from './services/file-metadata.service';
import { BucketConfigService } from './services/bucket-config.service';
import { S3StorageProvider } from './providers/s3-storage.provider';

@Module({
  providers: [
    S3StorageProvider,
    BucketConfigService,
    FileMetadataService,
    FileStorageService,
    ImageStorageService,
  ],
  exports: [
    FileStorageService,
    ImageStorageService,
  ],
})
export class StorageModule {}
