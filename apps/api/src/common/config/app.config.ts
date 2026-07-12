import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { registerAs } from '@nestjs/config';
import { z } from 'zod/v4';
import { envSchema } from './env.schema';

export const appConfigSchema = z.object({
  name: envSchema.shape.APP_NAME,
  isProduction: z.boolean(),
  environment: envSchema.shape.NODE_ENV,
  url: envSchema.shape.BASE_URL,
  port: envSchema.shape.PORT,
  cors: z.custom<CorsOptions>(),
});

export default registerAs(
  'app',
  (): z.infer<typeof appConfigSchema> => ({
    name: process.env.APP_NAME ?? 'Kimchi Stack',
    isProduction: process.env.NODE_ENV === 'production',
    environment: envSchema.shape.NODE_ENV.parse(process.env.NODE_ENV),
    url: process.env.BASE_URL!,
    port: envSchema.shape.PORT.parse(process.env.PORT),
    cors: {
      origin: envSchema.shape.AUTH_TRUSTED_ORIGINS.parse(process.env.AUTH_TRUSTED_ORIGINS),
      methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'user-agent', 'Accept'],
      credentials: true,
    },
  }),
);
