import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from './env.schema';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T) {
    return this.configService.get(key, { infer: true });
  }

  get app() {
    return {
      name: this.get('APP_NAME'),
      isProduction: this.get('NODE_ENV') === 'production',
      environment: this.get('NODE_ENV'),
      url: this.get('BASE_URL'),
      port: this.get('PORT'),
    };
  }

  get auth() {
    return {
      secret: this.get('AUTH_SECRET'),
      trustedOrigins: this.get('AUTH_TRUSTED_ORIGINS'),
      basePath: '/auth/client',
    };
  }

  get database() {
    return {
      url: this.get('DATABASE_URL'),
    };
  }

  get cache() {
    return {
      url: this.get('CACHE_URL'),
    };
  }

  get storage() {
    return {
      url: this.get('STORAGE_URL'),
      region: this.get('STORAGE_REGION'),
      accessKey: this.get('STORAGE_ACCESS_KEY'),
      secretKey: this.get('STORAGE_SECRET_KEY'),
    };
  }

  get mail() {
    return {
      domain: this.get('MAIL_DOMAIN'),
      mailpit: {
        url: this.get('MAILPIT_URL'),
      },
    };
  }
}
