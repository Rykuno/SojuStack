import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { FilesWriteRepository } from './repositories/files-write.repository';
import { FileStorageService } from './file-storage.service';
import { ImageStorageService } from './image-storage.service';
import { FilesReadRepository } from './repositories/files-read.repository';

@Module({
  providers: [
    StorageService,
    FilesWriteRepository,
    FilesReadRepository,
    FileStorageService,
    ImageStorageService,
  ],
  exports: [FileStorageService, ImageStorageService],
})
export class StorageModule {}
