import { createId } from '@paralleldrive/cuid2';
import { boolean, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { timestamps } from '../drizzle.utils';

export const users = pgTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified')
      .$defaultFn(() => false)
      .notNull(),
    image: text('image'),
    ...timestamps,
  },
  (table) => [uniqueIndex('users_email_idx').on(table.email)],
);
