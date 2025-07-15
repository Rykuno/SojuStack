import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export interface Config {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  mail: MailConfig;
  storage: StorageConfig;
}

export interface AppConfig {
  isProduction: boolean;
  port: number;
  cors: CorsOptions;
}

export interface DatabaseConfig {
  postgres: {
    connectionString: string;
  };
  redis: {
    connectionString: string;
  };
}

export interface AuthConfig {
  betterAuth: {
    basePath: string;
    secret: string;
    baseUrl: string;
    trustedOrigins: string[];
  };
}

export interface MailConfig {
  name: string;
  addresses: {
    noreply: string;
  };
  mailpit: {
    url: string;
  };
}

export interface StorageConfig {
  host: string;
  port: number;
  accessKey: string;
  secretKey: string;
}
