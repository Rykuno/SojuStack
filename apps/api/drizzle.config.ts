// @ts-nocheck
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/databases/drizzle.schema.ts',
  out: './src/databases/migrations',
  dbCredentials: {
    url: process.env['DATABASE_URL']!,
  },
});
