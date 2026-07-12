import { registerAs } from '@nestjs/config';
import { z } from 'zod/v4';
import { envSchema } from './env.schema';

export const storageConfigSchema = z.object({
  url: envSchema.shape.STORAGE_URL,
  region: envSchema.shape.STORAGE_REGION,
  accessKey: envSchema.shape.STORAGE_ACCESS_KEY,
  secretKey: envSchema.shape.STORAGE_SECRET_KEY,
});

export default registerAs(
  'storage',
  (): z.infer<typeof storageConfigSchema> => ({
    url: process.env.STORAGE_URL!,
    region: process.env.STORAGE_REGION!,
    accessKey: process.env.STORAGE_ACCESS_KEY!,
    secretKey: process.env.STORAGE_SECRET_KEY!,
  }),
);
