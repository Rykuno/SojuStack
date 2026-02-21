import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { FilesService } from './files.service';
import { ImagesService } from './images.service';

@Module({
  providers: [S3Service, FilesService, ImagesService],
  exports: [FilesService, ImagesService, S3Service],
})
export class StorageModule {}
