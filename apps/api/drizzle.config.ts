import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/common/database/drizzle.schema.ts',
  out: './src/common/database/migrations',
  strict: true,
  verbose: true,
  dbCredentials: {
    url: String(process.env.DATABASE_URL),
  },
});
