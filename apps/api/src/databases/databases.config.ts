import { ConfigType, registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  redis: {
    url: process.env.REDIS_URL!,
  },
  postgres: {
    url: process.env.POSTGRES_URL!,
  },
}));

export type DatabaseConfig = ConfigType<typeof databaseConfig>;
