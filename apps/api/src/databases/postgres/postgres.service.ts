import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as drizzleSchema from './postgres.schema.js';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseConfig, databaseConfig } from '../databases.config.js';

@Injectable()
export class PostgresService {
  client: NodePgDatabase<typeof drizzleSchema>;
  schema = drizzleSchema;

  constructor(
    @Inject(databaseConfig.KEY)
    private dbConfig: DatabaseConfig,
  ) {
    this.client = drizzle(this.dbConfig.postgres.url, {
      schema: drizzleSchema,
    });
  }
}
