import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupScalar } from './common/utils/setup-scalar';
import { EnvService } from './common/env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const envService = app.get(EnvService);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'user-agent', 'Accept'],
  });

  if (!envService.app.isProduction) {
    setupScalar(app);
  }

  await app.listen(envService.app.port);
}

void bootstrap();
