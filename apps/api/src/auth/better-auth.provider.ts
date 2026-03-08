import { betterAuth } from 'better-auth';
import { emailOTP, openAPI } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { Cache } from '@nestjs/cache-manager';
import { TransactionHost } from '@nestjs-cls/transactional';
import { DrizzleTransactionClient } from 'src/databases/drizzle.provider';
import * as schema from 'src/databases/drizzle.schema';
import { MailService } from 'src/notifications/mail.service';
import { AuthConfig } from 'src/common/config/auth.config';
import { AppConfig } from 'src/common/config/app.config';
import { hoursToSeconds, minutesToSeconds } from 'date-fns';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthService } from './auth.service';

export const BETTER_AUTH_PROVIDER = Symbol('BETTER_AUTH_PROVIDER');
export type BetterAuth = ReturnType<typeof BetterAuthProvider.useFactory>;

export const BetterAuthProvider = {
  provide: BETTER_AUTH_PROVIDER,
  inject: [TransactionHost, Cache, EventEmitter2, MailService, AppConfig, AuthConfig, AuthService],
  useFactory: (
    txHost: TransactionHost<DrizzleTransactionClient>,
    cache: Cache,
    eventEmitter: EventEmitter2,
    mailService: MailService,
    appConfig: AppConfig,
    authConfig: AuthConfig,
    authService: AuthService,
  ) => {
    const trustedOrigins = [...new Set([appConfig.webUrl, ...authConfig.trustedOrigins])];

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
        cookiePrefix: appConfig.name,
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
          await cache.set(key, value, ttl);
        },
        delete: async (key) => {
          await cache.del(key);
        },
      },
      secret: authConfig.secret,
      appName: appConfig.name,
      baseURL: appConfig.url,
      basePath: authConfig.basePath,
      trustedOrigins,
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
              await authService.afterUserCreated(user);
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
          sendChangeEmailVerification: async ({ user, newEmail, url }) => {
            await mailService.sendChangeEmailVerificationEmail({
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
              return mailService.sendSignInOtpEmail({
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
