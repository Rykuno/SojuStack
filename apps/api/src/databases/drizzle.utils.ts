import { NotFoundException } from '@nestjs/common';
import { customType, timestamp } from 'drizzle-orm/pg-core';

export const takeFirst = <T>(values: T[]): T | undefined => {
  return values.shift() || undefined;
};

export const takeFirstOrThrow = <T>(values: T[]): T => {
  const value = values.shift();
  if (!value)
    throw new NotFoundException('The requested resource was not found.');
  return value;
};

export const citext = customType<{ data: string }>({
  dataType() {
    return 'citext';
  },
});

export const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
};
