import { Injectable } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { openAPI } from 'better-auth/plugins';
import { MailService } from 'src/notifications/mail.service';
import { Cache } from '@nestjs/cache-manager';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { ConfigService } from '@nestjs/config';
import { AuthConfig, Config } from 'src/common/configs/config.interface';
import { DrizzleService } from 'src/databases/drizzle.service';
import { seconds } from '@nestjs/throttler';

@Injectable()
export class BetterAuthService {
  readonly client: ReturnType<typeof betterAuth>;
  private readonly authConfig: AuthConfig;

  constructor(
    private configService: ConfigService<Config>,
    private drizzleService: DrizzleService,
    private mailService: MailService,
    private cache: Cache,
  ) {
    this.authConfig = this.configService.getOrThrow<AuthConfig>('auth');
    this.client = betterAuth({
      database: drizzleAdapter(this.drizzleService.client, {
        provider: 'pg',
        schema: {
          ...this.drizzleService.schema,
          user: this.drizzleService.schema.users,
          session: this.drizzleService.schema.sessions,
          account: this.drizzleService.schema.accounts,
          verification: this.drizzleService.schema.verifications,
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
      secret: this.authConfig.betterAuth.secret,
      baseURL: this.authConfig.betterAuth.baseUrl,
      basePath: this.authConfig.betterAuth.basePath,
      trustedOrigins: this.authConfig.betterAuth.trustedOrigins,
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
        openAPI({
          path: '/reference',
        }),
      ],
    });
  }
}
