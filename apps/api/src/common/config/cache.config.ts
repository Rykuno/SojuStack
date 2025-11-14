import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty, IsString } from 'class-validator';

@Configuration()
export class CacheConfig {
  @IsString()
  @IsNotEmpty()
  @Value('CACHE_URL')
  url!: string;
}
