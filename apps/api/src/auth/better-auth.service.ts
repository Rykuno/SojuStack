import { betterAuth, Session, User } from 'better-auth';
import { emailOTP, openAPI } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { Cache } from '@nestjs/cache-manager';
import { TransactionHost } from '@nestjs-cls/transactional';
import { DrizzleTransactionClient } from 'src/database/drizzle.provider';
import * as schema from 'src/database/drizzle.schema';
import { MailService } from 'src/mail/mail.service';
import { hoursToSeconds, minutesToSeconds, secondsToMilliseconds } from 'date-fns';
import { EnvService } from 'src/common/env/env.service';
import slugify from 'slugify';
import { QueueService } from 'src/queues/queue.service';
import { Injectable } from '@nestjs/common';

export type BetterAuthClient = BetterAuthService['client'];

@Injectable()
export class BetterAuthService {
  readonly client;

  constructor(
    private readonly txHost: TransactionHost<DrizzleTransactionClient>,
    private readonly cache: Cache,
    private readonly mailService: MailService,
    private readonly envService: EnvService,
    private readonly queueService: QueueService,
  ) {
    this.client = betterAuth({
      database: drizzleAdapter(this.txHost.tx, {
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
        cookiePrefix: slugify(this.envService.app.name, { lower: true, trim: true }),
        useSecureCookies: this.envService.app.isProduction,
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
          if (ttl) await this.cache.set(key, value, secondsToMilliseconds(ttl));
          else await this.cache.set(key, value);
        },
        delete: async (key) => {
          await this.cache.del(key);
        },
      },
      secret: this.envService.auth.secret,
      appName: this.envService.app.name,
      baseURL: this.envService.app.url,
      basePath: this.envService.auth.basePath,
      trustedOrigins: this.envService.auth.trustedOrigins,
      session: {
        storeSessionInDatabase: true,
        freshAge: hoursToSeconds(1),
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
          expiresIn: minutesToSeconds(5),
          allowedAttempts: 5,
          sendVerificationOTP: async ({ email, otp, type }) => {
            if (type === 'sign-in') {
              await this.queueService.dispatchMailSignInOtp({
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
