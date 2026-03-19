import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupScalar } from './common/utils/setup-scalar';
import { EnvService } from './common/env/env.service';
import { generateOpenApiTypesInBackground } from './common/utils/openapi-typescript';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const envService = app.get(EnvService);

  app.set('trust proxy', 'loopback');
  app.enableCors(envService.app.cors);
  app.use(helmet());

  if (!envService.app.isProduction) {
    const openApiDocument = setupScalar(app);
    generateOpenApiTypesInBackground(openApiDocument);
  }

  await app.listen(envService.app.port);
}

void bootstrap();
