import { Global, Module } from '@nestjs/common';
import { drizzleProvider } from './drizzle.provider';

@Global()
@Module({
  providers: [drizzleProvider],
  exports: [drizzleProvider],
})
export class DatabasesModule {}
