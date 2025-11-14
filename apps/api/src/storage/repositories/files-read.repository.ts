import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { count, eq } from 'drizzle-orm';
import { DatabaseTransactionAdapter } from 'src/databases/database.provider';
import { files } from 'src/databases/drizzle.schema';
import { takeFirstOrThrow } from 'src/databases/drizzle.utils';

@Injectable()
export class FilesReadRepository {
  constructor(
    private readonly db: TransactionHost<DatabaseTransactionAdapter>,
  ) {}

  async findOneById(id: string) {
    this.db.tx.select().from(files).where(eq(files.id, id));
  }

  async findOneByStorageKey(storageKey: string) {
    return this.db.tx
      .select()
      .from(files)
      .where(eq(files.storageKey, storageKey));
  }

  async findCountByStorageKey(storageKey: string) {
    return this.db.tx
      .select({ count: count() })
      .from(files)
      .where(eq(files.storageKey, storageKey))
      .then(takeFirstOrThrow)
      .then((result) => result.count);
  }
}
