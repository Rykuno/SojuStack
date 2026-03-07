import { Injectable, NotFoundException } from '@nestjs/common';
import { S3Service } from './s3.service';
import { createId } from '@paralleldrive/cuid2';
import { DrizzleTransactionClient } from 'src/databases/drizzle.provider';
import { files } from 'src/databases/drizzle.schema';
import { takeFirstOrThrow } from 'src/databases/drizzle.utils';
import { eq } from 'drizzle-orm';
import { TransactionHost, Transactional } from '@nestjs-cls/transactional';
import { type StorageBucket } from './storage.constants';

@Injectable()
export class FilesService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly txHost: TransactionHost<DrizzleTransactionClient>,
  ) {}

  @Transactional()
  async create(file: Express.Multer.File, bucket: StorageBucket) {
    const storageKey = createId();
    return this.createWithStorageKey(storageKey, file, bucket);
  }

  @Transactional()
  async createWithStorageKey(storageKey: string, file: Express.Multer.File, bucket: StorageBucket) {
    const createdFile = await this.txHost.tx
      .insert(files)
      .values({
        bucket,
        name: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        storageKey,
      })
      .returning()
      .then(takeFirstOrThrow);

    await this.s3Service.putObject({
      bucketName: this.s3Service.getBucketName(bucket),
      key: storageKey,
      file: file.buffer,
      contentType: file.mimetype,
    });

    return createdFile;
  }

  async read(key: string) {
    const fileRecord = await this.getByStorageKey(key);
    return this.s3Service.getObject({
      bucketName: this.s3Service.getBucketName(fileRecord.bucket),
      key,
    });
  }

  @Transactional()
  async update(key: string, file: Express.Multer.File) {
    const fileRecord = await this.getByStorageKey(key);

    const updatedFile = await this.txHost.tx
      .update(files)
      .set({
        name: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
      })
      .where(eq(files.storageKey, key))
      .returning()
    .then(takeFirstOrThrow);

    // Keep the storage key stable and replace object contents/metadata in-place.
    await this.s3Service.putObject({
      bucketName: this.s3Service.getBucketName(fileRecord.bucket),
      key,
      file: file.buffer,
      contentType: file.mimetype,
    });

    return updatedFile;
  }

  @Transactional()
  async delete(key: string) {
    const fileRecord = await this.getByStorageKey(key);

    await this.s3Service.deleteObject({
      bucketName: this.s3Service.getBucketName(fileRecord.bucket),
      key,
    });
    await this.txHost.tx.delete(files).where(eq(files.storageKey, key));
  }

  private async getByStorageKey(key: string) {
    const fileRecord = await this.txHost.tx.query.files.findFirst({
      where: {
        storageKey: key,
      },
    });

    if (!fileRecord) {
      throw new NotFoundException('File not found');
    }

    return fileRecord;
  }
}
