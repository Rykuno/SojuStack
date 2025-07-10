import { ConfigType, registerAs } from '@nestjs/config';
import { Environment } from './env-validation';

export const appConfig = registerAs('app', () => ({
  isProduction: process.env.NODE_ENV === Environment.Production,
  port: process.env.PORT || 3000,
}));

export type AppConfig = ConfigType<typeof appConfig>;
