import { Injectable } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { emailOTP, openAPI } from 'better-auth/plugins';
import { MailService } from 'src/notifications/mail.service';
import { Cache } from '@nestjs/cache-manager';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { seconds } from '@nestjs/throttler';
import { DatabaseTransactionAdapter } from 'src/databases/database.provider';
import { TransactionHost } from '@nestjs-cls/transactional';
import * as schema from 'src/databases/drizzle.schema';
import { AuthConfig } from 'src/common/config/auth.config';
import { AppConfig } from 'src/common/config/app.config';
import { emailOTPClient } from 'better-auth/client/plugins';

@Injectable()
export class BetterAuthService {
  readonly client: ReturnType<typeof betterAuth>;

  constructor(
    private readonly db: TransactionHost<DatabaseTransactionAdapter>,
    private mailService: MailService,
    private cache: Cache,
    private readonly appConfig: AppConfig,
    private readonly authConfig: AuthConfig,
  ) {
    this.client = betterAuth({
      database: drizzleAdapter(this.db.tx, {
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
        database: {
          generateId: false,
        },
      },
      secondaryStorage: {
        get: async (key) => {
          const value = await this.cache.get<string>(key);
          return value ? value : null;
        },
        set: async (key, value, ttl) => {
          if (ttl) await this.cache.set(key, value, seconds(ttl));
          else await this.cache.set(key, value);
        },
        delete: async (key) => {
          await this.cache.del(key);
        },
      },
      secret: this.authConfig.secret,
      baseURL: this.appConfig.url,
      basePath: this.authConfig.basePath,
      trustedOrigins: this.authConfig.trustedOrigins,
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
            await this.mailService.sendChangeEmailVerificationEmail({
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
          return this.mailService.sendVerificationEmail({
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
          return this.mailService.sendPasswordResetEmail({
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
              return this.mailService.sendSignInOtpEmail({
                to: email,
                props: {
                  otpCode: otp,
                },
              });
            }
          },
        }),
        openAPI({
          path: '/reference',
        }),
      ],
    });
  }
}
