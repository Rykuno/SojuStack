import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
// import { policy } from './storage.policy';
import { createId } from '@paralleldrive/cuid2';
import { FilesWriteRepository } from './repositories/files-write.repository';
import { FilesReadRepository } from './repositories/files-read.repository';
import { StorageConfig } from 'src/common/config/storage.config';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly bucket = 'public';
  private readonly client: S3Client;

  constructor(
    private readonly filesWriteRepository: FilesWriteRepository,
    private readonly filesReadRepository: FilesReadRepository,
    private readonly storageConfig: StorageConfig,
  ) {
    this.client = new S3Client({
      endpoint: this.storageConfig.url,
      region: this.storageConfig.region,
      credentials: {
        accessKeyId: this.storageConfig.accessKey,
        secretAccessKey: this.storageConfig.secretKey,
      },
      forcePathStyle: true, // Required for LocalStack and S3-compatible services
    });
  }

  private async configureBucket() {
    try {
      // Check if bucket exists
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch (error: any) {
      // Bucket doesn't exist, create it
      if (
        error.name === 'NotFound' ||
        error.$metadata?.httpStatusCode === 404
      ) {
        await this.client.send(
          new CreateBucketCommand({ Bucket: this.bucket }),
        );
      } else {
        throw error;
      }
    }

    // Set bucket policy
    // await this.client.send(
    //   new PutBucketPolicyCommand({
    //     Bucket: this.bucket,
    //     Policy: policy,
    //   }),
    // );
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
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: record.storageKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    // Return the file record
    return record;
  }

  async delete(id: string, { forceDelete = false }: { forceDelete?: boolean }) {
    // Get the file record to retrieve the storageKey
    const file = await this.filesReadRepository.findOneById(id);
    if (!file) {
      return;
    }

    const referenceCount = await this.filesReadRepository.findCountByStorageKey(
      file.storageKey,
    );

    await this.filesWriteRepository.delete(id);

    // Delete the file if the references are being deleted
    if (forceDelete) {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: file.storageKey,
        }),
      );
    }

    // Delete the file if it has no other references
    if (!forceDelete && referenceCount === 1) {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: file.storageKey,
        }),
      );
    }
  }

  async onModuleInit() {
    await this.configureBucket();
  }
}
