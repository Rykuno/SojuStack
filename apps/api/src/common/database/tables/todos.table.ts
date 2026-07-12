import { createId } from '@paralleldrive/cuid2';
import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { timestampz } from '../drizzle.utils';

export const todos = pgTable('todos', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  completed: boolean('completed')
    .$defaultFn(() => false)
    .notNull(),
  createdAt: timestampz('created_at').defaultNow().notNull(),
  updatedAt: timestampz('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});
