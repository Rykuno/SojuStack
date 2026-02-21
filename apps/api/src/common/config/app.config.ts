import { Configuration, Value } from '@itgorillaz/configify';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { IsBoolean, IsNotEmpty, IsNumber, IsObject, IsString, IsUrl } from 'class-validator';

@Configuration()
export class AppConfig {
  @IsString()
  @Value('APP_NAME')
  name!: string;

  @IsNumber()
  @IsNotEmpty()
  @Value('APP_PORT', { parse: (value) => +value })
  port!: number;

  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  @Value('APP_URL')
  url!: string;

  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  @Value('APP_WEB_URL')
  webUrl!: string;

  @IsBoolean()
  @IsNotEmpty()
  @Value('NODE_ENV', {
    default: 'development',
    parse: (value) => value === 'production',
  })
  isProduction!: boolean;

  @IsObject()
  @IsNotEmpty()
  @Value('APP_WEB_URL', {
    parse: (origin: string): CorsOptions => ({
      origin,
      credentials: true,
      methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'user-agent', 'Accept'],
    }),
  })
  cors!: CorsOptions;
}
