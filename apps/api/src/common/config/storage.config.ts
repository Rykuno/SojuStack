import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty, IsString } from 'class-validator';

@Configuration()
export class StorageConfig {
  @IsString()
  @IsNotEmpty()
  @Value('STORAGE_URL')
  url!: string;

  @IsString()
  @IsNotEmpty()
  @Value('STORAGE_REGION', { default: 'us-east-1' })
  region!: string;

  @IsString()
  @IsNotEmpty()
  @Value('STORAGE_PUBLIC_BUCKET_NAME', { default: 'public' })
  publicBucketName!: string;

  @IsString()
  @IsNotEmpty()
  @Value('STORAGE_PRIVATE_BUCKET_NAME', { default: 'private' })
  privateBucketName!: string;

  @IsString()
  @IsNotEmpty()
  @Value('STORAGE_ACCESS_KEY')
  accessKey!: string;

  @IsString()
  @IsNotEmpty()
  @Value('STORAGE_SECRET_KEY')
  secretKey!: string;
}
