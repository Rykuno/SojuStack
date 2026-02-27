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
  @Value('AUTH_TRUSTED_ORIGINS', {
    default: '',
    parse: (value: string) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
  })
  trustedOrigins!: string[];
}
