import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { StorageConfig } from 'src/common/config/storage.config';

export interface UploadParams {
  key: string;
  body: Buffer | Readable;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  key: string;
  url?: string;
  etag?: string;
}

export interface UrlOptions {
  expiresIn?: number; // seconds
}

@Injectable()
export class S3StorageProvider {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(private readonly storageConfig: StorageConfig) {
    this.bucket = 'public'; // Could be configurable
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

  async upload(params: UploadParams): Promise<UploadResult> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
      Metadata: params.metadata,
    });

    const result = await this.client.send(command);

    // Generate URL for the uploaded file
    const url = await this.getUrl(params.key);

    return {
      key: params.key,
      url,
      etag: result.ETag,
    };
  }

  async download(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await this.client.send(command);

    if (!response.Body) {
      throw new Error(`File not found: ${key}`);
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    const stream = response.Body as Readable;

    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.client.send(command);
  }

  async exists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.client.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  async getUrl(key: string, options?: UrlOptions): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    // Generate presigned URL if expiration is specified, otherwise public URL
    if (options?.expiresIn) {
      return getSignedUrl(this.client, command, {
        expiresIn: options.expiresIn,
      });
    }

    // For public buckets, return direct URL
    // Format: http://endpoint/bucket/key
    const endpoint = this.storageConfig.url.replace(/\/$/, '');
    return `${endpoint}/${this.bucket}/${key}`;
  }

  async stream(key: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await this.client.send(command);

    if (!response.Body) {
      throw new Error(`File not found: ${key}`);
    }

    return response.Body as Readable;
  }
}

