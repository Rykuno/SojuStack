import { TransactionHost, Transactional } from '@nestjs-cls/transactional';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { basename } from 'node:path';
import { DrizzleTransactionClient } from 'src/databases/drizzle.provider';
import { files } from 'src/databases/drizzle.schema';
import { takeFirstOrThrow } from 'src/databases/drizzle.utils';
import { S3Service } from './s3.service';
import { type StorageBucket } from './storage.constants';
import { normalizeStorageFileName, normalizeStorageKey } from './storage.utils';

type FileRecord = typeof files.$inferSelect;
type FileMetadata = Pick<FileRecord, 'name' | 'mimeType' | 'sizeBytes'>;
type StoredObjectLocation = Pick<FileRecord, 'bucket' | 'storageKey' | 'mimeType'>;
type StoredObjectSnapshot = StoredObjectLocation & {
  file: Buffer;
};
type StoredFilePayload = {
  bucket: StorageBucket;
  storageKey: string;
  file: Buffer;
  metadata: FileMetadata;
};

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    private readonly s3Service: S3Service,
    private readonly txHost: TransactionHost<DrizzleTransactionClient>,
  ) {}

  async get(bucket: StorageBucket, key: string) {
    const fileRecord = await this.getRecordOrThrow(bucket, key);

    return this.s3Service.getObject({
      bucket: fileRecord.bucket,
      key: fileRecord.storageKey,
    });
  }

  async exists(bucket: StorageBucket, key: string) {
    const storageKey = normalizeStorageKey(key);
    return Boolean(await this.getRecord(bucket, storageKey));
  }

  @Transactional()
  async put(
    bucket: StorageBucket,
    key: string,
    contents: Buffer | string,
    options?: { contentType?: string },
  ) {
    const storageKey = normalizeStorageKey(key);
    const file = this.toBuffer(contents);

    await this.writeFile({
      bucket,
      storageKey,
      file,
      metadata: {
        name: basename(storageKey),
        mimeType: options?.contentType ?? 'application/octet-stream',
        sizeBytes: file.length,
      },
    });

    return storageKey;
  }

  @Transactional()
  async putFileAs(bucket: StorageBucket, file: Express.Multer.File, name: string) {
    const storageKey = normalizeStorageFileName(name);

    await this.writeFile({
      bucket,
      storageKey,
      file: file.buffer,
      metadata: {
        name: basename(storageKey),
        mimeType: file.mimetype || 'application/octet-stream',
        sizeBytes: file.size,
      },
    });

    return storageKey;
  }

  @Transactional()
  async delete(bucket: StorageBucket, key: string) {
    const storageKey = normalizeStorageKey(key);
    const fileRecord = await this.getRecord(bucket, storageKey);

    if (!fileRecord) {
      return false;
    }

    const previousObject = await this.createStoredObjectSnapshot(fileRecord);

    await this.deleteStoredObject(fileRecord);

    try {
      await this.deleteFileRecord(bucket, storageKey);
      return true;
    } catch (error) {
      await this.safelyRestoreStoredObject(previousObject);
      throw error;
    }
  }

  async size(bucket: StorageBucket, key: string) {
    return (await this.getRecordOrThrow(bucket, key)).sizeBytes;
  }

  async mimeType(bucket: StorageBucket, key: string) {
    return (await this.getRecordOrThrow(bucket, key)).mimeType;
  }

  private toBuffer(contents: Buffer | string) {
    return Buffer.isBuffer(contents) ? contents : Buffer.from(contents);
  }

  private async getRecord(bucket: StorageBucket, storageKey: string) {
    return this.txHost.tx.query.files.findFirst({
      where: {
        bucket,
        storageKey,
      },
    });
  }

  private async getRecordOrThrow(bucket: StorageBucket, key: string) {
    const storageKey = normalizeStorageKey(key);
    const fileRecord = await this.getRecord(bucket, storageKey);

    if (!fileRecord) {
      throw new NotFoundException('File not found');
    }

    return fileRecord;
  }

  private async writeFile(payload: StoredFilePayload) {
    const existingFileRecord = await this.getRecord(payload.bucket, payload.storageKey);

    if (!existingFileRecord) {
      await this.createFile(payload);
      return;
    }

    await this.replaceFile(existingFileRecord, payload);
  }

  private async createFile(payload: StoredFilePayload) {
    await this.storeObject(payload);

    try {
      await this.insertFileRecord(payload);
    } catch (error) {
      await this.safelyDeleteStoredObject(payload);
      throw error;
    }
  }

  private async replaceFile(existingFileRecord: FileRecord, payload: StoredFilePayload) {
    const previousObject = await this.createStoredObjectSnapshot(existingFileRecord);

    await this.storeObject(payload);

    try {
      await this.updateFileRecord(payload);
    } catch (error) {
      await this.safelyRestoreStoredObject(previousObject);
      throw error;
    }
  }

  private insertFileRecord({
    bucket,
    storageKey,
    metadata,
  }: Pick<StoredFilePayload, 'bucket' | 'storageKey' | 'metadata'>) {
    return this.txHost.tx
      .insert(files)
      .values({
        ...metadata,
        bucket,
        storageKey,
      })
      .returning()
      .then(takeFirstOrThrow);
  }

  private updateFileRecord({
    bucket,
    storageKey,
    metadata,
  }: Pick<StoredFilePayload, 'bucket' | 'storageKey' | 'metadata'>) {
    return this.txHost.tx
      .update(files)
      .set(metadata)
      .where(and(eq(files.bucket, bucket), eq(files.storageKey, storageKey)))
      .returning()
      .then(takeFirstOrThrow);
  }

  private deleteFileRecord(bucket: StorageBucket, storageKey: string) {
    return this.txHost.tx
      .delete(files)
      .where(and(eq(files.bucket, bucket), eq(files.storageKey, storageKey)));
  }

  private storeObject({ bucket, storageKey, file, metadata }: StoredFilePayload) {
    return this.s3Service.putObject({
      bucket,
      key: storageKey,
      file,
      contentType: metadata.mimeType,
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
