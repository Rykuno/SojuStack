import { drizzle } from 'drizzle-orm/node-postgres';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import * as schema from './drizzle.schema';
import { relations } from './drizzle.relations';
import { EnvService } from '../common/env/env.service';

export const DRIZZLE_PROVIDER = Symbol('DRIZZLE_PROVIDER');
type DrizzleClient = ReturnType<typeof DrizzleProvider.useFactory>;
export type DrizzleTransactionClient = TransactionalAdapterDrizzleOrm<DrizzleClient>;

export const DrizzleProvider = {
  provide: DRIZZLE_PROVIDER,
  inject: [EnvService],
  useFactory: (envService: EnvService) => {
    return drizzle(envService.database.url, { schema, relations });
  },
};
