import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { FilesService } from './files.service';
import { ImagesService } from './images.service';
import { StorageBootstrapService } from './storage-bootstrap.service';

@Module({
  providers: [S3Service, FilesService, ImagesService, StorageBootstrapService],
  exports: [FilesService, ImagesService],
})
export class StorageModule {}
