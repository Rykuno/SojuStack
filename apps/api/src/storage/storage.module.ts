import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ConfigModule } from '@nestjs/config';
import { DatabasesModule } from 'src/databases/databases.module';
import { FilesWriteRepository } from './repositories/files-write.repository';
import { FileStorageService } from './file-storage.service';
import { ImageStorageService } from './image-storage.service';
import { FilesReadRepository } from './repositories/files-read.repository';

@Module({
  imports: [ConfigModule, DatabasesModule],
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
