import { betterAuth } from 'better-auth';
import { emailOTP, openAPI } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { Cache } from '@nestjs/cache-manager';
import { TransactionHost } from '@nestjs-cls/transactional';
import { DrizzleTransactionClient } from 'src/database/drizzle.provider';
import * as schema from 'src/database/drizzle.schema';
import { MailService } from 'src/mail/mail.service';
import { hoursToSeconds, minutesToSeconds, secondsToMilliseconds } from 'date-fns';
import { EnvService } from 'src/common/env/env.service';
import { AuthService } from './auth.service';
import slugify from 'slugify';

export const BETTER_AUTH_PROVIDER = Symbol('BETTER_AUTH_PROVIDER');
export type BetterAuth = ReturnType<typeof BetterAuthProvider.useFactory>;

export const BetterAuthProvider = {
  provide: BETTER_AUTH_PROVIDER,
  inject: [TransactionHost, Cache, MailService, EnvService, AuthService],
  useFactory: (
    txHost: TransactionHost<DrizzleTransactionClient>,
    cache: Cache,
    mailService: MailService,
    envService: EnvService,
    authService: AuthService,
  ) => {
    return betterAuth({
      database: drizzleAdapter(txHost.tx, {
        provider: 'pg',
        schema: {
          ...schema,
          user: schema.users,
          session: schema.sessions,
          account: schema.accounts,
          verification: schema.verifications,
        },
      }),
      advanced: {
        cookiePrefix: slugify(envService.app.name),
        database: {
          generateId: false,
        },
      },
      secondaryStorage: {
        get: async (key) => {
          const value = await cache.get<string>(key);
          return value ?? null;
        },
        set: async (key, value, ttl) => {
          if (ttl) await cache.set(key, value, secondsToMilliseconds(ttl));
          else await cache.set(key, value);
        },
        delete: async (key) => {
          await cache.del(key);
        },
      },
      secret: envService.auth.secret,
      appName: envService.app.name,
      baseURL: envService.app.url,
      basePath: envService.auth.basePath,
      trustedOrigins: envService.auth.trustedOrigins,
      rateLimit: {
        enabled: true,
        storage: 'secondary-storage',
      },
      session: {
        storeSessionInDatabase: true,
        freshAge: hoursToSeconds(1),
      },
      databaseHooks: {
        user: {
          create: {
            async after(user) {
              return authService.afterUserCreated(user);
            },
          },
        },
        session: {
          create: {
            async before(session) {
              const updatedSession = await authService.beforeSessionCreated(session);
              return {
                data: {
                  ...updatedSession,
                },
              };
            },
          },
        },
      },
      user: {
        changeEmail: {
          enabled: true,
          sendChangeEmailVerification: async ({
            user,
            newEmail,
            url,
          }: {
            user: { email: string };
            newEmail: string;
            url: string;
          }) => {
            await mailService.sendChangeEmailVerification({
              to: user.email,
              props: {
                newEmail,
                verificationUrl: url,
              },
            });
          },
        },
      },
      plugins: [
        emailOTP({
          overrideDefaultEmailVerification: true,
          otpLength: 6,
          expiresIn: minutesToSeconds(5),
          allowedAttempts: 5,
          sendVerificationOTP: async ({ email, otp, type }) => {
            if (type === 'sign-in') {
              return mailService.sendSignInOtp({
                to: email,
                props: {
                  otpCode: otp,
                  expiresInSeconds: minutesToSeconds(5),
                },
              });
            }
          },
        }),
        openAPI({
          disableDefaultReference: true,
        }),
      ],
    });
  },
};
