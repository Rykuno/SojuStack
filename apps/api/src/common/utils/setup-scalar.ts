import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { EnvService } from '../env/env.service';

export function setupScalar(app: INestApplication) {
  const envService = app.get(EnvService);

  const config = new DocumentBuilder()
    .setTitle(envService.app.name)
    .setDescription(`${envService.app.name} API`)
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const cleanedDocument = cleanupOpenApiDoc(document);

  SwaggerModule.setup('swagger', app, cleanedDocument, { yamlDocumentUrl: '/openapi.yaml' });

  app.use(
    '/openapi',
    apiReference({
      sources: [
        { content: cleanedDocument, title: `Example API` },
        { url: '/auth/client/open-api/generate-schema', title: 'BetterAuth' },
      ],
    }),
  );

  return document;
}
