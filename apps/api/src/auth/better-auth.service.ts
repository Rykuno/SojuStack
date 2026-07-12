import { betterAuth, Session, User } from 'better-auth';
import { emailOTP, openAPI } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { Cache } from '@nestjs/cache-manager';
import { type DrizzleClient } from 'src/common/database/drizzle.type';
import * as schema from 'src/common/database/drizzle.schema';
import { MailService } from 'src/notifications/mail/mail.service';
import slugify from 'slugify';
import { Inject, Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nest-native/drizzle';
import { type ConfigType } from '@nestjs/config';
import { AppConfig, AuthConfig } from 'src/common/config';
import dayjs from 'dayjs';

export type BetterAuthClient = BetterAuthService['client'];

@Injectable()
export class BetterAuthService {
  readonly client;

  constructor(
    @InjectDrizzle()
    private readonly db: DrizzleClient,
    private readonly cache: Cache,
    private readonly mailService: MailService,
    @Inject(AuthConfig.KEY)
    private readonly authConfig: ConfigType<typeof AuthConfig>,
    @Inject(AppConfig.KEY)
    private readonly appConfig: ConfigType<typeof AppConfig>,
  ) {
    this.client = betterAuth({
      database: drizzleAdapter(this.db, {
        provider: 'pg',
        schema: {
          ...schema,
          user: schema.users,
          session: schema.sessions,
          account: schema.accounts,
          verification: schema.verifications,
        },
      }),
      account: {
        encryptOAuthTokens: true,
      },
      advanced: {
        cookiePrefix: slugify(this.appConfig.name, {
          lower: true,
          trim: true,
        }),
        useSecureCookies: this.appConfig.isProduction,
        database: {
          generateId: false,
        },
      },
      secondaryStorage: {
        get: async (key) => {
          const value = await this.cache.get<string>(key);
          return value ?? null;
        },
        set: async (key, value, ttl) => {
          if (ttl)
            await this.cache.set(key, value, dayjs.duration(ttl, 'seconds').asMilliseconds());
          else await this.cache.set(key, value);
        },
        delete: async (key) => {
          await this.cache.del(key);
        },
      },
      secret: this.authConfig.secret,
      appName: this.appConfig.name,
      baseURL: this.appConfig.url,
      basePath: this.authConfig.basePath,
      trustedOrigins: this.authConfig.trustedOrigins,
      session: {
        storeSessionInDatabase: true,
        freshAge: dayjs.duration(1, 'hours').asSeconds(),
        preserveSessionInDatabase: true,
      },
      databaseHooks: {
        user: {
          create: {
            after: async (user) => {
              return this.afterUserCreated(user);
            },
          },
        },
        session: {
          create: {
            before: async (session) => {
              const updatedSession = await this.beforeSessionCreated(session);
              return { data: { ...updatedSession } };
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
            await this.mailService.sendChangeEmailVerification({
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
          expiresIn: dayjs.duration(5, 'minutes').asSeconds(),
          allowedAttempts: 5,
          sendVerificationOTP: async ({ email, otp, type }) => {
            if (type === 'sign-in') {
              await this.mailService.sendSignInOtp({
                to: email,
                props: { otpCode: otp, expiresInSeconds: dayjs.duration(5, 'minutes').asSeconds() },
              });
            }
          },
        }),
        openAPI({
          disableDefaultReference: true,
        }),
      ],
    });
  }

  private async afterUserCreated(user: User): Promise<void> {
    console.log('afterUserCreated', user);
  }

  private async beforeSessionCreated(session: Session): Promise<Session> {
    return {
      ...session,
    };
  }
}
