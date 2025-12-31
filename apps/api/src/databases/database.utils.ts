import { NotFoundException } from '@nestjs/common';
import { customType, timestamp } from 'drizzle-orm/pg-core';

export const citext = customType<{ data: string }>({
  dataType() {
    return 'citext';
  },
});

export const timestampz = (name: string) =>
  timestamp(name, {
    withTimezone: true,
    mode: 'date',
    precision: 3, // milliseconds - matches JavaScript Date precision
  });

// get the first element of an array or return undefined
export const takeFirst = <T>(values: T[]): T | undefined => {
  return values.shift();
};

// get the first element of an array or throw a 404 error
export const takeFirstOrThrow = <T>(values: T[]): T => {
  const value = values.shift();
  if (value === undefined)
    throw new NotFoundException('The requested resource was not found.');
  return value;
};
