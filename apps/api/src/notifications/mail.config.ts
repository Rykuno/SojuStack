import { ConfigType, registerAs } from '@nestjs/config';

export const mailConfig = registerAs('mail', () => ({
  name: 'SojuStack',
  addresses: {
    noreply: `noreply@${process.env.MAIL_DOMAIN!}`,
  },
  mailpit: {
    url: 'http://localhost:8025',
  },
}));

export type MailConfig = ConfigType<typeof mailConfig>;
