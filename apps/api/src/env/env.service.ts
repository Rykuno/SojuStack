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
      isProduction: this.get('NODE_ENV') === 'production',
      environment: this.get('NODE_ENV'),
      port: this.get('PORT'),
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
}
