import { createId } from '@paralleldrive/cuid2';
import { bigint, pgTable, text } from 'drizzle-orm/pg-core';
import {
  StorageBucket,
  type StorageBucket as StorageBucketType,
} from 'src/storage/storage.constants';
import { timestampz } from '../drizzle.utils';

export const files = pgTable('files', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  bucket: text('bucket').$type<StorageBucketType>().notNull().default(StorageBucket.Public),
  storageKey: text('storage_key').notNull().unique(),
  name: text('name').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
  createdAt: timestampz('created_at').defaultNow().notNull(),
  updatedAt: timestampz('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});
