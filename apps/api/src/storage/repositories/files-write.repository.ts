import { Injectable } from '@nestjs/common';
import { eq, InferInsertModel } from 'drizzle-orm';
import { files } from 'src/databases/drizzle.schema';
import { DrizzleService } from 'src/databases/drizzle.service';
import { takeFirstOrThrow } from 'src/databases/drizzle.utils';

type Create = Pick<
  InferInsertModel<typeof files>,
  'name' | 'storageKey' | 'mimeType' | 'sizeBytes'
>;

@Injectable()
export class FilesWriteRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(values: Create, tx = this.drizzleService.client) {
    return tx.insert(files).values(values).returning().then(takeFirstOrThrow);
  }

  delete(id: string, tx = this.drizzleService.client) {
    return tx.delete(files).where(eq(files.id, id));
  }
}
