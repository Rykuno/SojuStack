import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  SwaggerModule.setup('/swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
    yamlDocumentUrl: 'swagger/yaml',
  });

  await app.listen(process.env.PORT ?? 8080);
}

void bootstrap();
