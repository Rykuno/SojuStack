import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';
import { StorageConfig } from 'src/common/config/storage.config';

@Injectable()
export class BucketConfigService implements OnModuleInit {
  private readonly logger = new Logger(BucketConfigService.name);
  private readonly client: S3Client;
  private readonly bucket = 'public';

  constructor(private readonly storageConfig: StorageConfig) {
    this.client = new S3Client({
      endpoint: this.storageConfig.url,
      region: this.storageConfig.region,
      credentials: {
        accessKeyId: this.storageConfig.accessKey,
        secretAccessKey: this.storageConfig.secretKey,
      },
      forcePathStyle: true,
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
    await this.ensureBucketPolicy();
  }

  private async ensureBucketExists() {
    try {
      // Check if bucket exists
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      this.logger.log(`Bucket "${this.bucket}" already exists`);
    } catch (error: any) {
      // Bucket doesn't exist, create it
      if (
        error.name === 'NotFound' ||
        error.$metadata?.httpStatusCode === 404
      ) {
        try {
          await this.client.send(
            new CreateBucketCommand({ Bucket: this.bucket }),
          );
          this.logger.log(`Created bucket "${this.bucket}"`);
        } catch (createError) {
          this.logger.error(
            `Failed to create bucket "${this.bucket}":`,
            createError,
          );
          throw createError;
        }
      } else {
        this.logger.error(`Failed to check bucket "${this.bucket}":`, error);
        throw error;
      }
    }
  }

  private async ensureBucketPolicy() {
    try {
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'PublicReadGetObject',
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucket}/*`],
          },
        ],
      };

      await this.client.send(
        new PutBucketPolicyCommand({
          Bucket: this.bucket,
          Policy: JSON.stringify(policy),
        }),
      );

      this.logger.log(
        `Bucket policy set for "${this.bucket}" (public read access)`,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to set bucket policy for "${this.bucket}":`,
        error,
      );
      // Don't throw - policy setting is not critical for basic functionality
    }
  }
}
