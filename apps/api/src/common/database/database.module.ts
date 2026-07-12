import { Global, Module } from '@nestjs/common';
import { DrizzleModule } from '@nest-native/drizzle';
import * as schema from './drizzle.schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { relations } from './drizzle.relations';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { DatabaseConfig } from '../config';

@Global()
@Module({
  imports: [
    DrizzleModule.forRootAsync({
      imports: [ConfigModule.forFeature(DatabaseConfig)],
      inject: [DatabaseConfig.KEY],
      useFactory: (config: ConfigType<typeof DatabaseConfig>) => {
        const client = new Pool({
          connectionString: config.url,
        });

        return {
          schema,
          connection: drizzle({ relations, client }),
          shutdown: () => client.end(),
        };
      },
    }),
  ],
})
export class DatabaseModule {}
