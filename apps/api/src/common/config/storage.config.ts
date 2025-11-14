import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Configuration()
export class StorageConfig {
  @IsString()
  @IsNotEmpty()
  @Value('STORAGE_HOST')
  host!: string;

  @IsNumber()
  @IsNotEmpty()
  @Value('STORAGE_PORT', { parse: parseInt })
  port!: number;

  @IsString()
  @IsNotEmpty()
  @Value('STORAGE_ACCESS_KEY')
  accessKey!: string;

  @IsString()
  @IsNotEmpty()
  @Value('STORAGE_SECRET_KEY')
  secretKey!: string;
}