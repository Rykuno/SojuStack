import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { setupScalar } from './setup-scalar';
import { generateOpenApiTypes } from './openapi-typescript';

async function main() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  try {
    const document = setupScalar(app);
    await generateOpenApiTypes(document);
  } finally {
    await app.close();
  }
}

void main();
