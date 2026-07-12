import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { relations } from './drizzle.relations';

export type DrizzleClient = NodePgDatabase<typeof relations>;
