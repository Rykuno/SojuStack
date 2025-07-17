import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js';
import { Injectable } from '@nestjs/common';
import { Config, DatabaseConfig } from 'src/common/configs/config.interface.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DrizzleService {
  client: NodePgDatabase<typeof schema>;
  schema: typeof schema = schema;

  constructor(private readonly configService: ConfigService<Config>) {
    const dbConfig = this.configService.getOrThrow<DatabaseConfig>('database');
    this.client = drizzle(dbConfig.postgres.connectionString, { schema });
  }
}
