import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { generateOpenApiSpecs } from './utils/openapi';
import chalk from 'chalk';
import { ConfigService } from '@nestjs/config';
import { AppConfig, Config } from './common/configs/config.interface';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService<Config>);

  app.set('trust proxy', 'loopback');

  /* -------------------------------------------------------------------------- */
  /*                                 Middlewares                                */
  /* -------------------------------------------------------------------------- */
  app.enableCors(configService.getOrThrow<AppConfig>('app').cors);
  app.use(cookieParser('secret'));
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

  void generateOpenApiSpecs([{ document }]);

  /* -------------------------------------------------------------------------- */
  /*                                   Server                                   */
  /* -------------------------------------------------------------------------- */
  const port = configService.getOrThrow<AppConfig>('app').port;
  await app.listen(port, () => {
    console.log(chalk.green(`🚀 Server is running on port ${port}`));
  });
}

void bootstrap();
