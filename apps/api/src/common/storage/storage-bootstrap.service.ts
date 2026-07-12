import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageBucket } from './enums/storage.enum';

@Injectable()
export class StorageBootstrapService implements OnApplicationBootstrap {
  constructor(private readonly storageService: StorageService) {}

  async onApplicationBootstrap() {
    await this.setupStorage();
  }

  private async setupStorage() {
    const buckets = [StorageBucket.Public, StorageBucket.Private];

    for (const bucketName of buckets) {
      const bucketExists = await this.storageService.bucketExists(bucketName);

      if (!bucketExists) {
        await this.storageService.createBucket(bucketName);
      }
    }

    await this.storageService.setBucketPolicy(
      StorageBucket.Public,
      this.storageService.getPublicBucketPolicy(StorageBucket.Public),
    );
  }
}
