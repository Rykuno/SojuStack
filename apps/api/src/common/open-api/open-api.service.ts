import { INestApplication, Inject, Injectable, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, type OpenAPIObject } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import openapiTS from 'openapi-typescript';
import { astToString, type OpenAPI3 } from 'openapi-typescript/dist/index.js';
import ts from 'typescript';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { AppConfig } from '../config';
import { type ConfigType } from '@nestjs/config';

const OUTPUT_DIRECTORY = 'generated';
const OUTPUT_FILE = 'openapi.d.ts';
const OUTPUT_PATH = path.resolve(OUTPUT_DIRECTORY, OUTPUT_FILE);

@Injectable()
export class OpenApiService {
  private readonly logger = new Logger(OpenApiService.name);

  constructor(@Inject(AppConfig.KEY) private readonly appConfig: ConfigType<typeof AppConfig>) {}

  setup(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle(this.appConfig.name)
      .setDescription(`${this.appConfig.name} API`)
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const cleanedDocument = cleanupOpenApiDoc(document);

    app.use(
      '/openapi',
      apiReference({
        sources: [
          { content: cleanedDocument, title: this.appConfig.name },
          { url: '/auth/client/open-api/generate-schema', title: 'BetterAuth' },
        ],
      }),
    );

    return cleanedDocument;
  }

  generateTypesInBackground(document: OpenAPIObject): void {
    void this.generateTypes(document).catch((error: unknown) => {
      this.logger.error('Failed to generate OpenAPI types', error);
    });
  }

  async generateTypes(document: OpenAPIObject): Promise<boolean> {
    const contents = await this.buildTypeDefinitions(document);

    if (!(await this.haveTypeDefinitionsChanged(contents))) {
      return false;
    }

    await mkdir(OUTPUT_DIRECTORY, { recursive: true });
    await writeFile(OUTPUT_PATH, contents, 'utf8');
    this.logger.log(`Generated OpenAPI types at ${OUTPUT_PATH}`);

    return true;
  }

  private async buildTypeDefinitions(document: OpenAPIObject): Promise<string> {
    const blobType = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('Blob'));
    const nullType = ts.factory.createLiteralTypeNode(ts.factory.createNull());
    const ast = await openapiTS(document as OpenAPI3, {
      transform(schema) {
        if (schema.format !== 'binary') {
          return;
        }

        return schema.nullable ? ts.factory.createUnionTypeNode([blobType, nullType]) : blobType;
      },
    });

    return astToString(ast);
  }

  private async haveTypeDefinitionsChanged(nextContents: string): Promise<boolean> {
    try {
      await access(OUTPUT_PATH);
      const currentContents = await readFile(OUTPUT_PATH, 'utf8');
      return currentContents !== nextContents;
    } catch {
      return true;
    }
  }
}
