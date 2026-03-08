import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { generateOpenApiSpecs } from './utils/openapi';
import chalk from 'chalk';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfig } from './common/config/app.config';
import { setupScalar } from './utils/scalar';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const { cors, port, isProduction } = app.get(AppConfig);

  /* -------------------------------------------------------------------------- */
  /*                                 Middlewares                                */
  /* -------------------------------------------------------------------------- */
  app.enableCors(cors);
  app.set('trust proxy', true);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  /* -------------------------------------------------------------------------- */
  /*                                   OpenAPI                                  */
  /* -------------------------------------------------------------------------- */
  if (!isProduction) {
    const document = setupScalar(app);
    void generateOpenApiSpecs([{ document }]);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Server                                   */
  /* -------------------------------------------------------------------------- */
  await app.listen(port, () => {
    console.log(chalk.green(`🚀 Server is running on port ${port}`));
  });
}

void bootstrap();
