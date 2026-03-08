import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { S3Service } from './s3.service';
import { createId } from '@paralleldrive/cuid2';
import { DrizzleTransactionClient } from 'src/databases/drizzle.provider';
import { files } from 'src/databases/drizzle.schema';
import { takeFirstOrThrow } from 'src/databases/drizzle.utils';
import { eq } from 'drizzle-orm';
import { TransactionHost, Transactional } from '@nestjs-cls/transactional';
import { type StorageBucket } from './storage.constants';

type FileRecord = typeof files.$inferSelect;
type FileMetadata = Pick<FileRecord, 'name' | 'mimeType' | 'sizeBytes'>;
type StoredObjectLocation = Pick<FileRecord, 'bucket' | 'storageKey' | 'mimeType'>;
type StoredObjectSnapshot = StoredObjectLocation & {
  file: Buffer;
};

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
    await this.storeIncomingFile({ bucket, storageKey, file });

    try {
      return await this.insertFileRecord({ bucket, storageKey, file });
    } catch (error) {
      await this.safelyDeleteStoredObject({ bucket, storageKey });
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
    const previousObject = await this.createStoredObjectSnapshot(fileRecord);

    await this.storeIncomingFile({
      bucket: fileRecord.bucket,
      storageKey: key,
      file,
    });

    try {
      return await this.updateFileRecord(key, file);
    } catch (error) {
      await this.safelyRestoreStoredObject(previousObject);
      throw error;
    }
  }

  @Transactional()
  async delete(key: string) {
    const fileRecord = await this.getByStorageKey(key);
    const previousObject = await this.createStoredObjectSnapshot(fileRecord);

    await this.deleteStoredObject(fileRecord);

    try {
      await this.deleteFileRecord(key);
    } catch (error) {
      await this.safelyRestoreStoredObject(previousObject);
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

  private toFileMetadata(file: Express.Multer.File): FileMetadata {
    return {
      name: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
    };
  }

  private insertFileRecord({
    bucket,
    storageKey,
    file,
  }: {
    bucket: StorageBucket;
    storageKey: string;
    file: Express.Multer.File;
  }) {
    return this.txHost.tx
      .insert(files)
      .values({
        ...this.toFileMetadata(file),
        bucket,
        storageKey,
      })
      .returning()
      .then(takeFirstOrThrow);
  }

  private updateFileRecord(storageKey: string, file: Express.Multer.File) {
    return this.txHost.tx
      .update(files)
      .set(this.toFileMetadata(file))
      .where(eq(files.storageKey, storageKey))
      .returning()
      .then(takeFirstOrThrow);
  }

  private deleteFileRecord(storageKey: string) {
    return this.txHost.tx.delete(files).where(eq(files.storageKey, storageKey));
  }

  private storeIncomingFile({
    bucket,
    storageKey,
    file,
  }: {
    bucket: StorageBucket;
    storageKey: string;
    file: Pick<Express.Multer.File, 'buffer' | 'mimetype'>;
  }) {
    return this.s3Service.putObject({
      bucket,
      key: storageKey,
      file: file.buffer,
      contentType: file.mimetype,
    });
  }

  private deleteStoredObject({
    bucket,
    storageKey,
  }: Pick<StoredObjectLocation, 'bucket' | 'storageKey'>) {
    return this.s3Service.deleteObject({ bucket, key: storageKey });
  }

  private async createStoredObjectSnapshot(fileRecord: FileRecord): Promise<StoredObjectSnapshot> {
    const file = await this.s3Service.getObject({
      bucket: fileRecord.bucket,
      key: fileRecord.storageKey,
    });

    return {
      bucket: fileRecord.bucket,
      storageKey: fileRecord.storageKey,
      mimeType: fileRecord.mimeType,
      file,
    };
  }

  private async safelyDeleteStoredObject({
    bucket,
    storageKey,
  }: Pick<StoredObjectLocation, 'bucket' | 'storageKey'>) {
    try {
      await this.deleteStoredObject({ bucket, storageKey });
    } catch (rollbackError) {
      this.logger.error(
        `Failed to clean up object "${storageKey}" in bucket "${bucket}" after a database error.`,
        rollbackError instanceof Error ? rollbackError.stack : undefined,
      );
    }
  }

  private async safelyRestoreStoredObject(snapshot: StoredObjectSnapshot) {
    try {
      await this.s3Service.putObject({
        bucket: snapshot.bucket,
        key: snapshot.storageKey,
        file: snapshot.file,
        contentType: snapshot.mimeType,
      });
    } catch (rollbackError) {
      this.logger.error(
        `Failed to restore object "${snapshot.storageKey}" in bucket "${snapshot.bucket}" after a database error.`,
        rollbackError instanceof Error ? rollbackError.stack : undefined,
      );
    }
  }
}
