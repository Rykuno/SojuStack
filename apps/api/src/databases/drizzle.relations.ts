import { defineRelations } from 'drizzle-orm';
import * as schema from './drizzle.schema';

export const relations = defineRelations(schema, (r) => ({
  users: {
    accounts: r.many.accounts({
      from: r.users.id,
      to: r.accounts.id,
    }),
    sessions: r.many.sessions({
      from: r.users.id,
      to: r.sessions.id,
    }),
  },
}));
