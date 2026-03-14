import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupScalar } from './utils/setup-scalar';
import { EnvService } from './env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const envService = app.get(EnvService);

  if (envService.app.isProduction) {
    setupScalar(app);
  }

  await app.listen(envService.app.port);
}

void bootstrap();
