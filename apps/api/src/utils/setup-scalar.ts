import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { cleanupOpenApiDoc } from 'nestjs-zod';

export function setupScalar(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle(`Example API`)
    .setDescription(`The Example API`)
    .setVersion('1.0')
    .addTag('Example')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/openapi',
    apiReference({
      sources: [
        { content: cleanupOpenApiDoc(document), title: `Example API` },
        // { url: '/auth/client/open-api/generate-schema', title: 'BetterAuth' },
      ],
    }),
  );

  return document;
}
