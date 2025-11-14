import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { eq, InferInsertModel } from 'drizzle-orm';
import { DatabaseTransactionAdapter } from 'src/databases/database.provider';
import { files } from 'src/databases/drizzle.schema';
import { takeFirstOrThrow } from 'src/databases/drizzle.utils';

type Create = Pick<
  InferInsertModel<typeof files>,
  'name' | 'storageKey' | 'mimeType' | 'sizeBytes'
>;

@Injectable()
export class FilesWriteRepository {
  constructor(
    private readonly db: TransactionHost<DatabaseTransactionAdapter>,
  ) {}

  async create(values: Create) {
    return this.db.tx
      .insert(files)
      .values(values)
      .returning()
      .then(takeFirstOrThrow);
  }

  delete(id: string) {
    return this.db.tx.delete(files).where(eq(files.id, id));
  }
}
