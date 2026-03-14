import { createId } from '@paralleldrive/cuid2';
import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { citext, timestampz } from '../drizzle.utils';

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  email: citext('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestampz('created_at').defaultNow().notNull(),
  updatedAt: timestampz('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});
