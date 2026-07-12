import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageBootstrapService } from './storage-bootstrap.service';

@Module({
  providers: [StorageService, StorageBootstrapService],
  exports: [StorageService, StorageBootstrapService],
})
export class StorageModule {}
