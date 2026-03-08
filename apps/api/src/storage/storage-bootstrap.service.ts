import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { StorageConfig } from 'src/common/config/storage.config';
import { S3Service } from './s3.service';
import { StorageBucket } from './storage.constants';

@Injectable()
export class StorageBootstrapService implements OnApplicationBootstrap {
  constructor(
    private readonly s3Service: S3Service,
    private readonly storageConfig: StorageConfig,
  ) {}

  async onApplicationBootstrap() {
    await this.setupStorage();
  }

  private async setupStorage() {
    const buckets = [
      {
        name: this.s3Service.getBucketName(StorageBucket.Public),
        shouldEnablePublicRead: this.storageConfig.publicBucketReadEnabled,
      },
      {
        name: this.s3Service.getBucketName(StorageBucket.Private),
        shouldEnablePublicRead: false,
      },
    ];

    for (const bucket of buckets) {
      const bucketExists = await this.s3Service.bucketExists(bucket.name);

      if (!bucketExists) {
        await this.s3Service.createBucket(bucket.name);
      }

      if (bucket.shouldEnablePublicRead) {
        await this.s3Service.setBucketPolicy(
          bucket.name,
          this.s3Service.getPublicBucketPolicy(bucket.name),
        );
      }
    }
  }
}
