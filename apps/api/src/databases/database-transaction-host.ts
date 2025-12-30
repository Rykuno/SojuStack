import { TransactionHost } from '@nestjs-cls/transactional';
import { DatabaseClient } from './database.provider';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseTransactionHost extends TransactionHost<
  TransactionalAdapterDrizzleOrm<DatabaseClient>
> {}
