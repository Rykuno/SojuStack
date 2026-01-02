import { Inject } from '@nestjs/common';
import { betterAuth, BetterAuthOptions } from 'better-auth';
import { emailOTP, openAPI } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { Cache } from '@nestjs/cache-manager';
import { seconds } from '@nestjs/throttler';
import { TransactionHost } from '@nestjs-cls/transactional';
import { DrizzleTransactionClient } from 'src/databases/drizzle.provider';
import * as schema from 'src/databases/drizzle.schema';
import { MailService } from 'src/notifications/mail.service';
import { AuthConfig } from 'src/common/config/auth.config';
import { AppConfig } from 'src/common/config/app.config';

const BETTER_AUTH = Symbol('BETTER_AUTH');
export const InjectBetterAuth = () => Inject(BETTER_AUTH);
export type BetterAuth = ReturnType<typeof BetterAuthProvider.useFactory>;

export const BetterAuthProvider = {
  provide: BETTER_AUTH,
  inject: [TransactionHost, MailService, Cache, AppConfig, AuthConfig],
  useFactory: (
    txHost: TransactionHost<DrizzleTransactionClient>,
    mailService: MailService,
    cache: Cache,
    appConfig: AppConfig,
    authConfig: AuthConfig,
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
          if (ttl) await cache.set(key, value, seconds(ttl));
          else await cache.set(key, value);
        },
        delete: async (key) => {
          await cache.del(key);
        },
      },
      secret: authConfig.secret,
      appName: appConfig.name,
      baseURL: appConfig.url,
      basePath: authConfig.basePath,
      trustedOrigins: authConfig.trustedOrigins,
      session: {
        cookieCache: {
          enabled: true,
          maxAge: 60 * 5,
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
      emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }) => {
          return mailService.sendVerificationEmail({
            to: user.email,
            props: {
              expirationHours: 24,
              userEmail: user.email,
              verificationUrl: url,
            },
          });
        },
        autoSignInAfterVerification: true,
        expiresIn: 3600, // 1 hour
      },
      emailAndPassword: {
        resetPasswordTokenExpiresIn: 3600, // 1 hour
        enabled: true,
        autoSignIn: true,
        sendResetPassword: async ({ user, url }) => {
          return mailService.sendPasswordResetEmail({
            to: user.email,
            props: {
              expirationHours: 1,
              userEmail: user.email,
              resetUrl: url,
            },
          });
        },
      },
      plugins: [
        emailOTP({
          overrideDefaultEmailVerification: true,
          otpLength: 6,
          expiresIn: 300,
          allowedAttempts: 5,
          sendVerificationOTP: async ({ email, otp, type }) => {
            if (type === 'sign-in') {
              return mailService.sendSignInOtpEmail({
                to: email,
                props: {
                  otpCode: otp,
                  expiresInSeconds: 300,
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
