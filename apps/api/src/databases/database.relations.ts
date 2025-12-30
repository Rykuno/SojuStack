import { defineRelations } from 'drizzle-orm/relations';
import * as schema from './database.schema';

export const relations = defineRelations(schema, (r) => ({
  files: {},
  users: {},
  sessions: {},
  accounts: {},
  verifications: {},
}));
