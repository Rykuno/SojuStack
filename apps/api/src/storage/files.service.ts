import { Injectable, NotFoundException } from '@nestjs/common';
import { S3Service } from './s3.service';
import { createId } from '@paralleldrive/cuid2';
import { DrizzleTransactionClient } from 'src/databases/drizzle.provider';
import { files } from 'src/databases/drizzle.schema';
import { takeFirstOrThrow } from 'src/databases/drizzle.utils';
import { eq } from 'drizzle-orm';
import { StorageConfig } from 'src/common/config/storage.config';
import { TransactionHost, Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class FilesService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly txHost: TransactionHost<DrizzleTransactionClient>,
    private readonly storageConfig: StorageConfig,
  ) {}

  @Transactional()
  async create(file: Express.Multer.File) {
    const storageKey = createId();

    await this.s3Service.putObject({
      bucketName: this.storageConfig.bucketName,
      key: storageKey,
      file: file.buffer,
    });

    try {
      return await this.txHost.tx
        .insert(files)
        .values({
          name: file.originalname,
          mimeType: file.mimetype,
          sizeBytes: file.size,
          storageKey,
        })
        .returning()
        .then(takeFirstOrThrow);
    } catch (error) {
      // Compensate uploaded object if the DB write fails.
      await this.s3Service.deleteObject({
        bucketName: this.storageConfig.bucketName,
        key: storageKey,
      });
      throw error;
    }
  }

  @Transactional()
  async update(key: string, file: Express.Multer.File) {
    const fileRecord = await this.txHost.tx.query.files.findFirst({
      where: {
        storageKey: key,
      },
    });
    if (!fileRecord) throw new NotFoundException('File not found');

    // Keep the storage key stable and replace object contents/metadata in-place.
    await this.s3Service.putObject({
      bucketName: this.storageConfig.bucketName,
      key,
      file: file.buffer,
    });

    return this.txHost.tx
      .update(files)
      .set({
        name: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
      })
      .where(eq(files.storageKey, key))
      .returning()
      .then(takeFirstOrThrow);
  }

  @Transactional()
  async delete(key: string) {
    await this.s3Service.deleteObject({
      bucketName: this.storageConfig.bucketName,
      key,
    });
    await this.txHost.tx.delete(files).where(eq(files.storageKey, key));
  }
}
