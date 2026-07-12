import { registerAs } from '@nestjs/config';
import { z } from 'zod/v4';
import { envSchema } from './env.schema';

export const cacheConfigSchema = z.object({
  url: envSchema.shape.CACHE_URL,
});

export default registerAs(
  'cache',
  (): z.infer<typeof cacheConfigSchema> => ({
    url: z.string().parse(process.env.CACHE_URL!),
  }),
);
