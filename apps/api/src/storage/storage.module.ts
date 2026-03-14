import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { FilesService } from './files.service';
import { StorageBootstrapService } from './storage-bootstrap.service';
import { StorageService } from './storage.service';

@Module({
  providers: [S3Service, FilesService, StorageService, StorageBootstrapService],
  exports: [StorageService],
})
export class StorageModule {}
