import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { generateOpenApiSpecs } from './utils/openapi';
import chalk from 'chalk';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfig } from './common/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const { cors, port } = app.get(AppConfig);

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
  const config = new DocumentBuilder()
    .setTitle('SojuStack API')
    .setDescription('The SojuStack API')
    .setVersion('1.0')
    .addTag('SojuStack')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/openapi', app, document, {
    jsonDocumentUrl: 'openapi/json',
    yamlDocumentUrl: 'openapi/yaml',
  });

  void generateOpenApiSpecs([{ document }]);

  /* -------------------------------------------------------------------------- */
  /*                                   Server                                   */
  /* -------------------------------------------------------------------------- */
  await app.listen(port, () => {
    console.log(chalk.green(`🚀 Server is running on port ${port}`));
  });
}

void bootstrap();
