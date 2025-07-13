import type { Config } from './config.interface';
import { Environment } from './env-validation';

const config: Config = {
  app: {
    isProduction: process.env.NODE_ENV === Environment.Production,
    port: 8080,
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
      ],
      credentials: true,
    },
  },
  database: {
    postgres: {
      connectionString: process.env.POSTGRES_URL!,
    },
    redis: {
      connectionString: process.env.REDIS_URL!,
    },
  },
  auth: {
    betterAuth: {
      basePath: '/auth/client',
      secret: process.env.AUTH_SECRET!,
      baseUrl: process.env.BASE_URL!,
      trustedOrigins: ['http://localhost:3000'],
    },
  },
  mail: {
    name: 'SojuStack',
    addresses: {
      noreply: `noreply@${process.env.MAIL_DOMAIN!}`,
    },
    mailpit: {
      url: 'http://localhost:8025',
    },
  },
};

export default (): Config => ({
  ...config,
});
