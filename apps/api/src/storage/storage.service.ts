import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';
import { policy } from './storage.policy';
import { createId } from '@paralleldrive/cuid2';
import { FilesWriteRepository } from './repositories/files-write.repository';
import { FilesReadRepository } from './repositories/files-read.repository';
import { StorageConfig } from 'src/common/config/storage.config';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly bucket = 'public';
  private readonly client: Minio.Client;

  constructor(
    private readonly filesWriteRepository: FilesWriteRepository,
    private readonly filesReadRepository: FilesReadRepository,
    private readonly storageConfig: StorageConfig,
  ) {
    this.client = new Minio.Client({
      endPoint: this.storageConfig.host,
      port: this.storageConfig.port,
      accessKey: this.storageConfig.accessKey,
      secretKey: this.storageConfig.secretKey,
      useSSL: false,
    });
  }

  private async configureBucket() {
    const bucketExists = await this.client.bucketExists(this.bucket);
    if (!bucketExists) await this.client.makeBucket(this.bucket);
    return this.client.setBucketPolicy(this.bucket, policy);
  }

  async create(file: Express.Multer.File) {
    // Create the file record
    const record = await this.filesWriteRepository.create({
      name: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      storageKey: `${createId()}.${file.mimetype.split('/')[1] ?? 'bin'}`,
    });

    // Upload the file to the bucket
    await this.client.putObject(
      this.bucket,
      record.storageKey,
      file.buffer,
      file.size,
    );

    // Return the file record
    return record;
  }

  async delete(id: string, { forceDelete = false }: { forceDelete?: boolean }) {
    const referenceCount =
      await this.filesReadRepository.findCountByStorageKey(id);

    await this.filesWriteRepository.delete(id);

    // Delete the file if the references are being deleted
    if (forceDelete) {
      await this.client.removeObject(this.bucket, id);
    }

    // Delete the file if it has no other references
    if (!forceDelete && referenceCount === 1) {
      await this.client.removeObject(this.bucket, id);
    }
  }

  async onModuleInit() {
    await this.configureBucket();
  }
}
