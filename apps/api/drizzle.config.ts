import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/databases/drizzle.schema.ts',
  out: './src/databases/migrations',
  dbCredentials: {
    // @ts-expect-error
    url: process.env['POSTGRES_URL']!,
  },
});
