import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsUrl({ require_tld: process.env.NODE_ENV === Environment.Production })
  BASE_URL: string;

  @IsString()
  AUTH_SECRET: string;

  @IsString()
  POSTGRES_URL: string;

  @IsString()
  REDIS_URL: string;

  @IsUrl({ require_tld: true, require_protocol: false })
  EMAIL_DOMAIN: string;

  @IsString()
  STORAGE_HOST: string;

  @IsNumber()
  STORAGE_PORT: number;

  @IsString()
  STORAGE_ACCESS_KEY: string;

  @IsString()
  STORAGE_SECRET_KEY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
