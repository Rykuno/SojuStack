import { createId } from '@paralleldrive/cuid2';
import { AnyPgColumn, bigint, index, pgTable, text } from 'drizzle-orm/pg-core';
import { timestampz } from '../database.utils';
import { users } from './users.table';

export const files = pgTable('files', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  storageKey: text('storage_key').notNull(),
  name: text('name').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
  createdAt: timestampz('created_at').defaultNow().notNull(),
  updatedAt: timestampz('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});
