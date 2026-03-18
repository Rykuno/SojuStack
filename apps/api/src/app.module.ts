import {
  ZodValidationPipe,
  ZodSerializationException,
  createZodSerializerInterceptor,
} from 'nestjs-zod';
import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER, BaseExceptionFilter } from '@nestjs/core';
import { ZodError } from 'zod';
import { Module, HttpException, ArgumentsHost, Logger, Catch } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EnvModule } from './common/env/env.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './common/env/env.schema';
import { DatabaseModule } from './database/database.module';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { DRIZZLE_PROVIDER } from './database/drizzle.provider';
import { ClsModule } from 'nestjs-cls';
import { EnvService } from './common/env/env.service';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { HttpModule } from '@nestjs/axios';
import { HealthModule } from './health/health.module';
import { StorageModule } from './storage/storage.module';
import { TodosModule } from './todos/todos.module';
import { BullModule } from '@nestjs/bullmq';

@Catch(HttpException)
class HttpExceptionFilter extends BaseExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError();

      if (zodError instanceof ZodError) {
        this.logger.error(`ZodSerializationException: ${zodError.message}`);
      }
    }

    super.catch(exception, host);
  }
}

@Module({
  imports: [
    HttpModule.register({
      global: true,
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    ClsModule.forRoot({
      global: true,
      plugins: [
        new ClsPluginTransactional({
          imports: [DatabaseModule],
          adapter: new TransactionalAdapterDrizzleOrm({
            drizzleInstanceToken: DRIZZLE_PROVIDER,
          }),
        }),
      ],
    }),
    BullModule.forRootAsync({
      inject: [EnvService],
      useFactory: (envService: EnvService) => {
        return {
          connection: {
            host: envService.cache.url,
          },
        };
      },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [EnvService],
      useFactory: (envService: EnvService) => {
        console.log('registering cache module', envService.cache.url);
        return {
          stores: [createKeyv(envService.cache.url)],
        };
      },
    }),
    AuthModule,
    EnvModule,
    DatabaseModule,
    StorageModule,
    HealthModule,
    TodosModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: createZodSerializerInterceptor({
        reportInput: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
