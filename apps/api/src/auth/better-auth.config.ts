import { ConfigType, registerAs } from '@nestjs/config';

export const betterAuthConfig = registerAs('better-auth', () => ({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseUrl: process.env.BASE_URL!,
  trustedOrigins: ['http://localhost:3000'],
}));

export type BetterAuthConfig = ConfigType<typeof betterAuthConfig>;
