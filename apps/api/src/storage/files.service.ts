import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
  private readonly logger = new Logger(FilesService.name);

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
    await this.putStoredFile({ bucket, key: storageKey, file });

    try {
      return await this.txHost.tx
        .insert(files)
        .values({
          ...this.toFileMetadata(file),
          bucket,
          storageKey,
        })
        .returning()
        .then(takeFirstOrThrow);
    } catch (error) {
      await this.tryDeleteStoredFile({ bucket, key: storageKey });
      throw error;
    }
  }

  async read(key: string) {
    const fileRecord = await this.getByStorageKey(key);
    return this.s3Service.getObject({
      bucket: fileRecord.bucket,
      key,
    });
  }

  @Transactional()
  async update(key: string, file: Express.Multer.File) {
    const fileRecord = await this.getByStorageKey(key);
    const previousContents = await this.s3Service.getObject({
      bucket: fileRecord.bucket,
      key,
    });

    await this.putStoredFile({ bucket: fileRecord.bucket, key, file });

    try {
      return await this.txHost.tx
        .update(files)
        .set(this.toFileMetadata(file))
        .where(eq(files.storageKey, key))
        .returning()
        .then(takeFirstOrThrow);
    } catch (error) {
      await this.tryRestoreStoredFile(fileRecord, previousContents);
      throw error;
    }
  }

  @Transactional()
  async delete(key: string) {
    const fileRecord = await this.getByStorageKey(key);
    const previousContents = await this.s3Service.getObject({
      bucket: fileRecord.bucket,
      key,
    });

    await this.s3Service.deleteObject({ bucket: fileRecord.bucket, key });

    try {
      await this.txHost.tx.delete(files).where(eq(files.storageKey, key));
    } catch (error) {
      await this.tryRestoreStoredFile(fileRecord, previousContents);
      throw error;
    }
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

  private toFileMetadata(file: Express.Multer.File) {
    return {
      name: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
    };
  }

  private putStoredFile({
    bucket,
    key,
    file,
  }: {
    bucket: StorageBucket;
    key: string;
    file: Pick<Express.Multer.File, 'buffer' | 'mimetype'>;
  }) {
    return this.s3Service.putObject({
      bucket,
      key,
      file: file.buffer,
      contentType: file.mimetype,
    });
  }

  private async tryDeleteStoredFile({ bucket, key }: { bucket: StorageBucket; key: string }) {
    try {
      await this.s3Service.deleteObject({ bucket, key });
    } catch (rollbackError) {
      this.logger.error(
        `Failed to roll back uploaded object "${key}" in bucket "${bucket}".`,
        rollbackError instanceof Error ? rollbackError.stack : undefined,
      );
    }
  }

  private async tryRestoreStoredFile(fileRecord: typeof files.$inferSelect, file: Buffer) {
    try {
      await this.s3Service.putObject({
        bucket: fileRecord.bucket,
        key: fileRecord.storageKey,
        file,
        contentType: fileRecord.mimeType,
      });
    } catch (rollbackError) {
      this.logger.error(
        `Failed to restore object "${fileRecord.storageKey}" in bucket "${fileRecord.bucket}".`,
        rollbackError instanceof Error ? rollbackError.stack : undefined,
      );
    }
  }
}
