import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma.service';
import { betterAuth } from 'better-auth';
import { openAPI } from 'better-auth/plugins';
import { MailService } from 'src/notifications/mail.service';
import { Cache } from '@nestjs/cache-manager';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { ConfigService } from '@nestjs/config';
import { AuthConfig, Config } from 'src/common/configs/config.interface';

@Injectable()
export class BetterAuthService {
  readonly client: ReturnType<typeof betterAuth>;
  private readonly authConfig: AuthConfig;

  constructor(
    private configService: ConfigService<Config>,
    private prismaService: PrismaService,
    private mailService: MailService,
    private cache: Cache,
  ) {
    this.authConfig = this.configService.getOrThrow<AuthConfig>('auth');
    this.client = betterAuth({
      database: prismaAdapter(this.prismaService, {
        provider: 'postgresql',
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
      secret: this.authConfig.betterAuth.secret,
      baseURL: this.authConfig.betterAuth.baseUrl,
      basePath: this.authConfig.betterAuth.basePath,
      trustedOrigins: this.authConfig.betterAuth.trustedOrigins,
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
