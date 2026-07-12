import { registerAs } from '@nestjs/config';
import { z } from 'zod/v4';
import { envSchema } from './env.schema';

export const mailConfigSchema = z.object({
  domain: envSchema.shape.MAIL_DOMAIN,
  mailpit: z.object({
    url: envSchema.shape.MAILPIT_URL,
  }),
});

export default registerAs(
  'mail',
  (): z.infer<typeof mailConfigSchema> => ({
    domain: process.env.MAIL_DOMAIN!,
    mailpit: {
      url: process.env.MAILPIT_URL ?? 'http://localhost:8025',
    },
  }),
);
