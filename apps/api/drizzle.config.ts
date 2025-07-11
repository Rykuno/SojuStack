import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/databases/postgres/postgres.schema.ts',
  out: './src/databases/postgres/migrations',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
