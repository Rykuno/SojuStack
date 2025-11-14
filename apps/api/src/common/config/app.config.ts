import { Configuration, Value } from '@itgorillaz/configify';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsUrl,
} from 'class-validator';

@Configuration()
export class AppConfig {
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
  isProduction: boolean = process.env['NODE_ENV'] === 'production';

  @IsObject()
  @IsNotEmpty()
  cors: CorsOptions = {
    origin: process.env['WEB_URL']!,
    methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
  };
}
