import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppConfig } from 'src/common/config/app.config';

export function setupScalar(app: INestApplication) {
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
