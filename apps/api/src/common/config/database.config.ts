import { registerAs } from '@nestjs/config';
import { z } from 'zod/v4';
import { envSchema } from './env.schema';

export const databaseConfigSchema = z.object({
  url: envSchema.shape.DATABASE_URL,
});

export default registerAs(
  'database',
  (): z.infer<typeof databaseConfigSchema> => ({
    url: process.env.DATABASE_URL!,
  }),
);
