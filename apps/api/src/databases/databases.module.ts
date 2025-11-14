import { Global, Module } from '@nestjs/common';
import { dbProvider } from './database.provider';

@Global()
@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabasesModule {}
