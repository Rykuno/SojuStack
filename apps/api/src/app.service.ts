import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { S3Service } from './storage/s3.service';
import { StorageConfig } from './common/config/storage.config';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private readonly s3Service: S3Service,
    private readonly storageConfig: StorageConfig,
  ) {}

  async onApplicationBootstrap() {
    await this.setupStorage();
  }

  private async setupStorage() {
    const bucketExists = await this.s3Service.bucketExists(this.storageConfig.bucketName);

    if (bucketExists) return;
    await this.s3Service.createBucket(this.storageConfig.bucketName);
    await this.s3Service.setBucketPolicy(
      this.storageConfig.bucketName,
      this.s3Service.getPublicBucketPolicy(this.storageConfig.bucketName),
    );
  }
}
