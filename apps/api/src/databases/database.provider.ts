import { Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DatabaseConfig } from 'src/common/config/database.config';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import * as schema from './database.schema';
import { relations } from './database.relations';

export const DB_PROVIDER = 'DB_PROVIDER';
export const InjectDb = () => Inject(DB_PROVIDER);

export type DatabaseClient = ReturnType<typeof dbProvider.useFactory>;
export type DatabaseTransactionClient =
  TransactionalAdapterDrizzleOrm<DatabaseClient>;

export const dbProvider = {
  provide: DB_PROVIDER,
  inject: [DatabaseConfig],
  useFactory: (databaseConfig: DatabaseConfig) => {
    return drizzle(databaseConfig.url, { schema, relations });
  },
};
