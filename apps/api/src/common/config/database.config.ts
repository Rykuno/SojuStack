import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty, IsString } from 'class-validator';

@Configuration()
export class DatabaseConfig {
  @IsString()
  @IsNotEmpty()
  @Value('DATABASE_URL')
  url!: string;
}
