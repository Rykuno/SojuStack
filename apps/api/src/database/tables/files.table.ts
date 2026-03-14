import { createId } from '@paralleldrive/cuid2';
import { bigint, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { timestampz } from '../drizzle.utils';
import { type StorageBucketType } from '../../storage/storage.constants';

export const files = pgTable(
  'files',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    bucket: text('bucket').$type<StorageBucketType>().notNull(),
    storageKey: text('storage_key').notNull(),
    name: text('name').notNull(),
    mimeType: text('mime_type').notNull(),
    sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
    createdAt: timestampz('created_at').defaultNow().notNull(),
    updatedAt: timestampz('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [uniqueIndex('files_bucket_storage_key_idx').on(table.bucket, table.storageKey)],
);
