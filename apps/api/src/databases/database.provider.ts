import { Inject } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { relations } from './drizzle.relations';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { DatabaseConfig } from 'src/common/config/database.config';

export type DatabaseClient = NodePgDatabase<typeof relations, typeof relations>;
export type DatabaseTransactionAdapter =
  TransactionalAdapterDrizzleOrm<DatabaseClient>;

export const DB_PROVIDER = 'DB_PROVIDER';
export const InjectDb = () => Inject(DB_PROVIDER);

export const dbProvider = {
  provide: DB_PROVIDER,
  inject: [DatabaseConfig],
  useFactory: (databaseConfig: DatabaseConfig) => {
    return drizzle(databaseConfig.url, {
      relations,
    });
  },
};
