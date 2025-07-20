import { Injectable } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { openAPI } from 'better-auth/plugins';
import { MailService } from 'src/notifications/mail.service';
import { Cache } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import {
  AuthConfig,
  Config,
  DatabaseConfig,
} from 'src/common/configs/config.interface';
import { seconds } from '@nestjs/throttler';
import { Pool } from 'pg';

@Injectable()
export class BetterAuthService {
  readonly client: ReturnType<typeof betterAuth>;
  private readonly authConfig: AuthConfig;

  constructor(
    private configService: ConfigService<Config>,
    private mailService: MailService,
    private cache: Cache,
  ) {
    this.authConfig = this.configService.getOrThrow<AuthConfig>('auth');
    this.client = betterAuth({
      database: new Pool({
        connectionString:
          this.configService.getOrThrow<DatabaseConfig>('database').postgres
            .connectionString,
      }),
      advanced: {
        database: {
          useNumberId: false,
          generateId: false,
        },
      },
      account: {
        modelName: 'account',
        fields: {
          id: 'id',
          accountId: 'account_id',
          providerId: 'provider_id',
          userId: 'user_id',
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
          idToken: 'id_token',
          accessTokenExpiresAt: 'access_token_expires_at',
          refreshTokenExpiresAt: 'refresh_token_expires_at',
          scope: 'scope',
          password: 'password',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
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
        modelName: 'session',
        fields: {
          id: 'id',
          expiresAt: 'expires_at',
          token: 'token',
          ipAddress: 'ip_address',
          userAgent: 'user_agent',
          userId: 'user_id',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
        cookieCache: {
          enabled: true,
          maxAge: 60 * 5,
        },
      },
      user: {
        modelName: 'user',
        fields: {
          id: 'id',
          name: 'name',
          email: 'email',
          emailVerified: 'email_verified',
          image: 'image',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
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
        modelName: 'verification',
        fields: {
          id: 'id',
          identifier: 'identifier',
          value: 'value',
          expiresAt: 'expires_at',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }) => {
          console.log('sendVerificationEmail', user, url);
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
