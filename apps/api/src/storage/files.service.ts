import { Injectable, NotFoundException } from '@nestjs/common';
import { S3Service } from './s3.service';
import { createId } from '@paralleldrive/cuid2';
import { DrizzleTransactionClient } from 'src/databases/drizzle.provider';
import { files } from 'src/databases/drizzle.schema';
import { takeFirstOrThrow } from 'src/databases/drizzle.utils';
import { eq } from 'drizzle-orm';
import { StorageConfig } from 'src/common/config/storage.config';
import { TransactionHost } from '@nestjs-cls/transactional';

@Injectable()
export class FilesService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly txHost: TransactionHost<DrizzleTransactionClient>,
    private readonly storageConfig: StorageConfig,
  ) {}

  async create(file: Express.Multer.File) {
    const fileRecord = await this.txHost.tx
      .insert(files)
      .values({
        name: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        storageKey: createId(),
      })
      .returning()
      .then(takeFirstOrThrow);

    await this.s3Service.putObject({
      bucketName: this.storageConfig.bucketName,
      key: fileRecord.storageKey,
      file: file.buffer,
    });

    return fileRecord;
  }

  async update(key: string, file: Express.Multer.File) {
    const fileRecord = await this.txHost.tx.query.files.findFirst({
      where: {
        storageKey: key,
      },
    });
    if (!fileRecord) throw new NotFoundException('File not found');

    // Delete old file record and S3 object
    await this.txHost.tx.delete(files).where(eq(files.storageKey, key));
    await this.s3Service.deleteObject({
      bucketName: this.storageConfig.bucketName,
      key,
    });

    // Create new file record and upload to S3
    return this.create(file);
  }

  async delete(key: string) {
    await this.txHost.tx.delete(files).where(eq(files.storageKey, key));
    await this.s3Service.deleteObject({
      bucketName: this.storageConfig.bucketName,
      key,
    });
  }
}
