import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Config, DatabaseConfig } from 'src/common/configs/config.interface.js';
import { relations } from './drizzle.realtions';
import * as schema from './drizzle.schema';

export type DatabaseClient = NodePgDatabase<typeof schema, typeof relations>;

@Injectable()
export class DrizzleService {
  client: DatabaseClient;
  schema = schema;

  constructor(private readonly configService: ConfigService<Config>) {
    const dbConfig = this.configService.getOrThrow<DatabaseConfig>('database');
    this.client = drizzle(dbConfig.postgres.connectionString, {
      relations,
    });
  }
}
