import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { Config, StorageConfig } from 'src/common/configs/config.interface';
import { policy } from './storage.policy';
import { createId } from '@paralleldrive/cuid2';
import { DrizzleService } from 'src/databases/drizzle.service';
import { FilesWriteRepository } from './repositories/files-write.repository';
import { FilesReadRepository } from './repositories/files-read.repository';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly bucket = 'public';
  private readonly client: Minio.Client;

  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly filesWriteRepository: FilesWriteRepository,
    private readonly filesReadRepository: FilesReadRepository,
    private readonly drizzleService: DrizzleService,
  ) {
    const storageConfig =
      this.configService.getOrThrow<StorageConfig>('storage');
    this.client = new Minio.Client({
      endPoint: storageConfig.host,
      port: storageConfig.port,
      accessKey: storageConfig.accessKey,
      secretKey: storageConfig.secretKey,
      useSSL: false,
    });
  }

  private async configureBucket() {
    const bucketExists = await this.client.bucketExists(this.bucket);
    if (!bucketExists) await this.client.makeBucket(this.bucket);
    return this.client.setBucketPolicy(this.bucket, policy);
  }

  async create(file: Express.Multer.File) {
    return this.drizzleService.client.transaction(async (tx) => {
      try {
      // Create the file record
      const record = await this.filesWriteRepository.create({
        name: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        storageKey: createId(),
      }, tx);

      // Upload the file to the bucket
      await this.client.putObject(
        this.bucket,
        record.storageKey,
          file.buffer,
          file.size,
        )

        // Return the file record
        return record;
      } catch (error) {
        // Rollback the transaction if an error occurs
        tx.rollback();
        throw error;
      }
    });
  }

  async delete(id: string, {forceDelete = false}: {forceDelete?: boolean}) {
    const referenceCount = await this.filesReadRepository.findCountByStorageKey(id);
    
    return this.drizzleService.client.transaction(async (tx) => {
      try {
        await this.filesWriteRepository.delete(id, tx);
        
        // Delete the file if the references are being deleted
        if (forceDelete) {
          await this.client.removeObject(this.bucket, id);
        }

        // Delete the file if it has no other references
        if (!forceDelete && referenceCount === 1) {
          await this.client.removeObject(this.bucket, id);
        }

      } catch (error) {
        tx.rollback();
        throw error;
      }
    });
  }

  async onModuleInit() {
    await this.configureBucket();
  }
}
