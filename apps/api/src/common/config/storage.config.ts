import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty, IsString } from 'class-validator';

@Configuration()
export class StorageConfig {
  @IsString()
  @IsNotEmpty()
  @Value('STORAGE_ENDPOINT')
  endpoint!: string;

  @IsString()
  @IsNotEmpty()
  @Value('STORAGE_REGION', { default: 'us-east-1' })
  region!: string;

  @IsString()
  @IsNotEmpty()
  @Value('STORAGE_ACCESS_KEY')
  accessKey!: string;

  @IsString()
  @IsNotEmpty()
  @Value('STORAGE_SECRET_KEY')
  secretKey!: string;
}
