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
import { Injectable } from '@nestjs/common';
import { StorageConfig } from 'src/common/config/storage.config';

type PublicBucketPolicy = Awaited<ReturnType<S3Service['getPublicBucketPolicy']>>;

export type BucketPolicy = PublicBucketPolicy | undefined;

@Injectable()
export class S3Service {
  private readonly client: S3Client;

  constructor(private readonly storageConfig: StorageConfig) {
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

  putObject({ bucketName, key, file }: { bucketName: string; key: string; file: Buffer }) {
    return this.client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file,
      }),
    );
  }

  deleteObject({ bucketName, key }: { bucketName: string; key: string }) {
    return this.client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );
  }

  async getObject({ bucketName, key }: { bucketName: string; key: string }) {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: bucketName,
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

      return Buffer.concat(chunks).toString('utf-8');
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
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };
  }
}
