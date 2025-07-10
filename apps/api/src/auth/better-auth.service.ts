import { Inject, Injectable } from '@nestjs/common';
import { PostgresService } from 'src/databases/postgres/postgres.service';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth';
import { openAPI } from 'better-auth/plugins';
import { MailService } from 'src/notifications/mail.service';
import { BetterAuthConfig, betterAuthConfig } from './better-auth.config';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class BetterAuthService {
  readonly basePath = '/auth/client';
  readonly client: ReturnType<typeof betterAuth>;

  constructor(
    @Inject(betterAuthConfig.KEY)
    private betterAuthConfig: BetterAuthConfig,
    private postgresService: PostgresService,
    private mailService: MailService,
    @Inject(CACHE_MANAGER)
    private cache: Cache,
  ) {
    this.client = betterAuth({
      database: drizzleAdapter(this.postgresService.client, {
        provider: 'pg',
        schema: {
          ...this.postgresService.schema,
          user: this.postgresService.schema.users,
          account: this.postgresService.schema.accounts,
          session: this.postgresService.schema.sessions,
          verification: this.postgresService.schema.verifications,
        },
      }),
      secondaryStorage: {
        get: async (key) => {
          const value = await this.cache.get<string>(key);
          return value ? value : null;
        },
        set: async (key, value, ttl) => {
          if (ttl) await this.cache.set(key, value, ttl * 1000);
          else await this.cache.set(key, value);
        },
        delete: async (key) => {
          await this.cache.del(key);
        },
      },
      secret: this.betterAuthConfig.secret,
      baseURL: this.betterAuthConfig.baseUrl,
      basePath: this.basePath,
      trustedOrigins: this.betterAuthConfig.trustedOrigins,
      advanced: {
        database: {
          generateId: false,
        },
      },
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
              to: user.email, // verification email must be sent to the current user email to approve the change
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
              requestTime: new Date().toLocaleString(),
            },
          });
        },
      },
      plugins: [
        openAPI({
          path: '/reference',
        }),
      ],
    });
  }
}
