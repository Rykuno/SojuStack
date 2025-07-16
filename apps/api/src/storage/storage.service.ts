import * as Minio from 'minio';
import * as sharp from 'sharp';
import { type ResizeOptions } from 'sharp';
import { policy } from './storage.policy.js';
import { Injectable } from '@nestjs/common';
import { Config, StorageConfig } from 'src/common/configs/config.interface.js';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';

type Upload = {
  file: File;
  key?: string;
  resizeOptions?: ResizeOptions;
};

@Injectable()
export class StorageService {
  private readonly client: Minio.Client;
  private readonly bucket = 'dev';

  constructor(private readonly configService: ConfigService<Config>) {
    const storageConfig =
      this.configService.getOrThrow<StorageConfig>('storage');
    console.log(storageConfig);
    this.client = new Minio.Client({
      endPoint: storageConfig.host,
      port: storageConfig.port,
      accessKey: storageConfig.accessKey,
      secretKey: storageConfig.secretKey,
      useSSL: false,
    });
  }

  async onModuleInit() {
    await this.configureStorage();
  }

  async configureStorage() {
    const bucketExists = await this.client.bucketExists(this.bucket);
    if (bucketExists) {
      await this.configureBucketPolicy();
    } else {
      await this.client.makeBucket('dev');
      await this.configureBucketPolicy();
    }
  }

  async configureBucketPolicy() {
    await this.client.setBucketPolicy('dev', policy);
  }

  async upload({ file, resizeOptions, key }: Upload) {
    let buffer = await this.convertToBuffer(file);
    if (resizeOptions) {
      if (!file.type.startsWith('image'))
        throw new Error("Can't resize non-image files");
      buffer = await this.resizeImage(buffer, resizeOptions);
    }

    const fileKey = key || randomUUID();
    await this.client.putObject(this.bucket, fileKey, buffer, file.size, {
      'Content-Type': file.type,
    });
    return { key: fileKey };
  }

  async remove(key: string) {
    return this.client.removeObject(this.bucket, key);
  }

  private async convertToBuffer(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  private async resizeImage(fileBuffer: Buffer, resizeOptions: ResizeOptions) {
    return sharp(fileBuffer).resize(resizeOptions).webp().toBuffer();
  }
}
