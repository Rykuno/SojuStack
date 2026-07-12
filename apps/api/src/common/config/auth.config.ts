import { registerAs } from '@nestjs/config';
import { z } from 'zod/v4';
import { envSchema } from './env.schema';

export const authConfigSchema = z.object({
  secret: envSchema.shape.AUTH_SECRET,
  trustedOrigins: envSchema.shape.AUTH_TRUSTED_ORIGINS,
  basePath: z.string(),
});

export default registerAs(
  'auth',
  (): z.infer<typeof authConfigSchema> => ({
    secret: process.env.AUTH_SECRET!,
    trustedOrigins: envSchema.shape.AUTH_TRUSTED_ORIGINS.parse(process.env.AUTH_TRUSTED_ORIGINS),
    basePath: '/auth/client',
  }),
);
