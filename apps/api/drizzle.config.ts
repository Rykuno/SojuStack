import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/drizzle.schema.ts',
  out: './src/database/migrations',
  strict: true,
  verbose: true,
  dbCredentials: {
    url: String(process.env.DATABASE_URL),
  },
});
