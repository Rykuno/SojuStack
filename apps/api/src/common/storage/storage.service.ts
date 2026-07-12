import {
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  ListBucketsCommand,
  ListObjectsCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { type StorageBucket } from './enums/storage.enum';
import { StorageConfig } from 'src/common/config';
import { type ConfigType } from '@nestjs/config';

type PublicBucketPolicy = Awaited<ReturnType<StorageService['getPublicBucketPolicy']>>;
type BucketObjectLocation = {
  bucket: StorageBucket;
  key: string;
};

export type BucketPolicy = PublicBucketPolicy | undefined;

@Injectable()
export class StorageService {
  private readonly client: S3Client;

  constructor(
    @Inject(StorageConfig.KEY)
    private readonly storageConfig: ConfigType<typeof StorageConfig>,
  ) {
    const config: S3ClientConfig = {
      region: this.storageConfig.region,
      credentials: {
        accessKeyId: this.storageConfig.accessKey,
        secretAccessKey: this.storageConfig.secretKey,
      },
      endpoint: this.storageConfig.url,
      forcePathStyle: true,
    };
    this.client = new S3Client(config);
  }

  createBucket(bucketName: string) {
    return this.client.send(
      new CreateBucketCommand({
        Bucket: bucketName,
      }),
    );
  }

  setBucketPolicy(bucketName: string, policy: BucketPolicy) {
    return this.client.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(policy),
      }),
    );
  }

  deleteBucket(bucketName: string) {
    return this.client.send(
      new DeleteBucketCommand({
        Bucket: bucketName,
      }),
    );
  }

  listBuckets() {
    return this.client.send(new ListBucketsCommand({}));
  }

  async bucketExists(bucketName: string) {
    return this.client
      .send(new HeadBucketCommand({ Bucket: bucketName }))
      .then(() => true)
      .catch(() => false);
  }

  listObjects(bucketName: string) {
    return this.client.send(
      new ListObjectsCommand({
        Bucket: bucketName,
      }),
    );
  }

  putObject({
    bucket,
    key,
    file,
    contentType,
  }: {
    bucket: StorageBucket;
    key: string;
    file: Buffer;
    contentType?: string;
  }) {
    return this.client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file,
        ContentType: contentType,
      }),
    );
  }

  deleteObject({ bucket, key }: BucketObjectLocation) {
    return this.client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
  }

  async getObject({ bucket, key }: BucketObjectLocation) {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );

    // get object content
    if (response.Body) {
      const chunks: Buffer[] = [];
      // AWS SDK v3 Body is a Readable stream in Node.js
      const body = response.Body as NodeJS.ReadableStream;

      for await (const chunk of body) {
        chunks.push(chunk as Buffer);
      }

      return Buffer.concat(chunks);
    }
    throw new Error('Object not found');
  }

  getPublicBucketPolicy(bucketName: string) {
    return {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: { AWS: '*' },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };
  }
}
