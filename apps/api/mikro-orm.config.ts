import 'dotenv/config';
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations'; // or `@mikro-orm/migrations-mongodb`

export default defineConfig({
  driver: PostgreSqlDriver,
  clientUrl: process.env.POSTGRES_URL,
  extensions: [Migrator],
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  debug: true,
  migrations: {
    path: './migrations',
  },
});
