import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { OpenApiService } from './common/open-api/open-api.service';
import { ConfigType } from '@nestjs/config';
import { AppConfig, AuthConfig } from './common/config';
import { registerDayJsPlugins } from './app.setup';

registerDayJsPlugins();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const openApiService = app.get(OpenApiService);
  const appConfig = app.get<ConfigType<typeof AppConfig>>(AppConfig.KEY);
  const authConfig = app.get<ConfigType<typeof AuthConfig>>(AuthConfig.KEY);

  app.set('trust proxy', 'loopback');
  app.enableCors(appConfig.cors);
  app.use(cookieParser(authConfig.secret));
  app.use(helmet());
  app.enableShutdownHooks();

  if (!appConfig.isProduction) {
    const openApiDocument = openApiService.setup(app);
    openApiService.generateTypesInBackground(openApiDocument);
  }

  await app.listen(8008);
}

void bootstrap();
