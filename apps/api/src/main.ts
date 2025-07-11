import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { generateOpenApiSpec } from './utils/openapi';
import chalk from 'chalk';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './common/configs/env-validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<EnvironmentVariables>);
  /* -------------------------------------------------------------------------- */
  /*                                 Validation                                 */
  /* -------------------------------------------------------------------------- */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  /* -------------------------------------------------------------------------- */
  /*                                    Cors                                    */
  /* -------------------------------------------------------------------------- */
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
    credentials: true,
  });

  /* -------------------------------------------------------------------------- */
  /*                                   Swagger                                  */
  /* -------------------------------------------------------------------------- */
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/openapi', app, document, {
    jsonDocumentUrl: 'openapi/json',
    yamlDocumentUrl: 'openapi/yaml',
  });

  void generateOpenApiSpec(document);

  const port = configService.getOrThrow('PORT', { infer: true });
  await app.listen(port, () => {
    console.log(chalk.green(`🚀 Server is running on port ${port}`));
  });
}

void bootstrap();
