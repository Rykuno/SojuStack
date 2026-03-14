import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { S3Service } from './s3.service';
import { StorageBucket } from './storage.constants';

@Injectable()
export class StorageBootstrapService implements OnApplicationBootstrap {
  constructor(private readonly s3Service: S3Service) {}

  async onApplicationBootstrap() {
    await this.setupStorage();
  }

  private async setupStorage() {
    const buckets = [StorageBucket.Public, StorageBucket.Private];

    for (const bucketName of buckets) {
      const bucketExists = await this.s3Service.bucketExists(bucketName);

      if (!bucketExists) {
        await this.s3Service.createBucket(bucketName);
      }
    }

    await this.s3Service.setBucketPolicy(
      StorageBucket.Public,
      this.s3Service.getPublicBucketPolicy(StorageBucket.Public),
    );
  }
}
