import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { generateOpenApiSpecs } from './utils/openapi';
import chalk from 'chalk';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfig } from './common/config/app.config';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const { cors, port, isProduction } = app.get(AppConfig);

  /* -------------------------------------------------------------------------- */
  /*                                 Middlewares                                */
  /* -------------------------------------------------------------------------- */
  app.enableCors(cors);
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
    const document = setupSwagger(app);
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

function setupSwagger(app: INestApplication) {
  const { name } = app.get(AppConfig);

  const config = new DocumentBuilder()
    .setTitle(`${name} API`)
    .setDescription(`The ${name} API`)
    .setVersion('1.0')
    .addTag(name)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/openapi',
    apiReference({
      sources: [
        { content: document, title: `${name} API` },
        { url: '/auth/client/open-api/generate-schema', title: 'BetterAuth' },
      ],
    }),
  );

  return document;
}
