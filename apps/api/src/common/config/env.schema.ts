import z from 'zod/v4';

export const envSchema = z.object({
  APP_NAME: z.string().default('Kimchi Stack'),
  BASE_URL: z.string(),
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(['development', 'production', 'staging', 'testing']),
  DATABASE_URL: z.string(),
  CACHE_URL: z.string(),
  STORAGE_URL: z.string(),
  STORAGE_REGION: z.string(),
  STORAGE_ACCESS_KEY: z.string(),
  STORAGE_SECRET_KEY: z.string(),
  MAIL_DOMAIN: z.string(),
  MAILPIT_URL: z.string().default('http://localhost:8025'),
  AUTH_SECRET: z.string(),
  AUTH_TRUSTED_ORIGINS: z
    .string()
    .default('http://localhost:3000')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
});

export type Env = z.infer<typeof envSchema>;
