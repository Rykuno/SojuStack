import { createId } from '@paralleldrive/cuid2';
import { index, pgTable, text } from 'drizzle-orm/pg-core';
import { users } from './users.table';
import { timestampz } from '../database.utils';

export const accounts = pgTable(
  'accounts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestampz('access_token_expires_at'),
    refreshTokenExpiresAt: timestampz('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestampz('created_at').notNull().defaultNow(),
    updatedAt: timestampz('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [index('accounts_user_id_idx').on(table.userId)],
);
