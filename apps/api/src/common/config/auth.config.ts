import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty, IsString } from 'class-validator';

@Configuration()
export class AuthConfig {
  @IsString()
  @IsNotEmpty()
  @Value('AUTH_SECRET')
  secret!: string;

  @IsString()
  @IsNotEmpty()
  basePath = '/auth/client';

  @IsString({ each: true })
  @IsNotEmpty()
  trustedOrigins = ['http://localhost:3000'];
}
