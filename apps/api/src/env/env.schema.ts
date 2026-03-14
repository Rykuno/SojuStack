import z from 'zod/v4';

export const envSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(['development', 'production', 'staging', 'testing']),
  DATABASE_URL: z.string(),
  CACHE_URL: z.string(),
  STORAGE_URL: z.string(),
  STORAGE_REGION: z.string(),
  STORAGE_ACCESS_KEY: z.string(),
  STORAGE_SECRET_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
