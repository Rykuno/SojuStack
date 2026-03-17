import { type OpenAPI3, astToString } from 'openapi-typescript/dist/index.js';
import openapiTS from 'openapi-typescript';
import fs from 'node:fs/promises';
import { Worker, isMainThread, workerData } from 'node:worker_threads';
import ts from 'typescript';
import { OpenAPIObject } from '@nestjs/swagger';
import path from 'node:path';
import * as fsSync from 'node:fs';
const OUTPUT_DIR = './generated';
const FILE_NAME = 'openapi.d.ts';

const OUTPUT_PATH = path.join(OUTPUT_DIR, FILE_NAME);
const BLOB = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('Blob')); // `Blob`
const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull()); // `null`

async function buildOpenApiTypeContents(document: OpenAPIObject) {
  const ast = await openapiTS(document as OpenAPI3, {
    transform(schemaObject, _metadata) {
      if (schemaObject.format === 'binary') {
        return schemaObject.nullable ? ts.factory.createUnionTypeNode([BLOB, NULL]) : BLOB;
      }
    },
  });
  return astToString(ast);
}

async function hasOpenApiTypesChanged(nextContents: string) {
  if (!fsSync.existsSync(OUTPUT_PATH)) {
    return true;
  }

  const currentContents = await fs.readFile(OUTPUT_PATH, 'utf8').catch(() => null);
  return currentContents !== nextContents;
}

export async function generateOpenApiTypes(document: OpenAPIObject) {
  const contents = await buildOpenApiTypeContents(document);
  const shouldGenerate = await hasOpenApiTypesChanged(contents);
  if (!shouldGenerate) return;

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_PATH, contents, 'utf8');
  return contents;
}

export function generateOpenApiTypesInBackground(document: OpenAPIObject) {
  const worker = new Worker(__filename, {
    workerData: document,
  });

  worker.on('error', (error) => {
    console.error('Failed to generate OpenAPI types in background:', error);
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`OpenAPI types worker exited with code ${code}`);
    }
  });

  worker.unref();
}

if (!isMainThread) {
  void generateOpenApiTypes(workerData as OpenAPIObject)
    .then(() => {
      console.log(`✅ OpenAPI types generated and saved to ${path.join(OUTPUT_DIR, FILE_NAME)}`);
    })
    .catch((error) => {
      console.error('OpenAPI types worker failed:', error);
      process.exitCode = 1;
    });
}
