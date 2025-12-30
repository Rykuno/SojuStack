import { createId } from '@paralleldrive/cuid2';
import { index, pgTable, text } from 'drizzle-orm/pg-core';
import { timestampz } from '../database.utils';

export const verifications = pgTable(
  'verifications',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestampz('expires_at').notNull(),
    createdAt: timestampz('created_at').notNull().defaultNow(),
    updatedAt: timestampz('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [index('verifications_identifier_idx').on(table.identifier)],
);
