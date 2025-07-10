import { ConfigType, registerAs } from '@nestjs/config';

export const postgresConfig = registerAs('postgres', () => ({
  url: process.env.POSTGRES_URL!,
}));

export type PostgresConfig = ConfigType<typeof postgresConfig>;
