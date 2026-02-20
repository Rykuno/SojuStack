import { Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DatabaseConfig } from 'src/common/config/database.config';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import * as schema from './drizzle.schema';
import { relations } from './drizzle.relations';

export const DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER';
export const InjectDrizzle = () => Inject(DRIZZLE_PROVIDER);

type DrizzleClient = ReturnType<typeof drizzleProvider.useFactory>;
export type DrizzleTransactionClient = TransactionalAdapterDrizzleOrm<DrizzleClient>;

export const drizzleProvider = {
  provide: DRIZZLE_PROVIDER,
  inject: [DatabaseConfig],
  useFactory: (databaseConfig: DatabaseConfig) => {
    return drizzle(databaseConfig.url, { schema, relations });
  },
};
