import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { StorageModule } from 'src/storage/storage.module';
import { DatabasesModule } from 'src/databases/databases.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [StorageModule, DatabasesModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
