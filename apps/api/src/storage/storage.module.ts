import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { FilesService } from './files.service';

@Module({
  providers: [S3Service, FilesService],
  exports: [FilesService, S3Service],
})
export class StorageModule {}
