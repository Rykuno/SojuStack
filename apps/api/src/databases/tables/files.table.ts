import { bigint, pgTable, text } from 'drizzle-orm/pg-core';
import { timestamps } from '../drizzle.utils';
import { createId } from '@paralleldrive/cuid2';

export const files = pgTable('files', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  storageKey: text('storage_key').notNull(),
  name: text('name').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
  ...timestamps,
});


