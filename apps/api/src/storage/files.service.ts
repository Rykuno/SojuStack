import { Injectable, NotFoundException } from '@nestjs/common';
import { S3Service } from './s3.service';
import { createId } from '@paralleldrive/cuid2';
import { DatabaseTransactionClient } from 'src/databases/database.provider';
import { files } from 'src/databases/database.schema';
import { takeFirstOrThrow } from 'src/databases/database.utils';
import { eq } from 'drizzle-orm';
import { StorageConfig } from 'src/common/config/storage.config';
import { TransactionHost } from '@nestjs-cls/transactional';

@Injectable()
export class FilesService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly txHost: TransactionHost<DatabaseTransactionClient>,
    private readonly storageConfig: StorageConfig,
  ) {}

  create(file: Express.Multer.File) {
    return this.txHost.tx.transaction(async (tx) => {
      const fileRecord = await tx
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
    });
  }

  async update(key: string, file: Express.Multer.File) {
    return this.txHost.tx.transaction(async (tx) => {
      const fileRecord = await tx.query.files.findFirst({
        where: {
          storageKey: key,
        },
      });
      if (!fileRecord) throw new NotFoundException('File not found');
      await this.delete(key);
      return this.create(file);
    });
  }

  delete(key: string) {
    return this.txHost.tx.transaction(async (tx) => {
      await tx.delete(files).where(eq(files.storageKey, key));
      await this.s3Service.deleteObject({
        bucketName: this.storageConfig.bucketName,
        key,
      });
    });
  }
}
