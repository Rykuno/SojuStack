import { Module } from '@nestjs/common';
import { PostgresService } from './postgres/postgres.service';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './databases.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
  ],

  providers: [PostgresService],
  exports: [PostgresService],
})
export class DatabasesModule {}
