import { Injectable } from '@nestjs/common';
import { count, eq } from 'drizzle-orm';
import { files } from 'src/databases/drizzle.schema';
import { DrizzleService } from 'src/databases/drizzle.service';
import { takeFirstOrThrow } from 'src/databases/drizzle.utils';

@Injectable()
export class FilesReadRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  async findOneById(id: string) {
    return this.drizzleService.client
      .select()
      .from(files)
      .where(eq(files.id, id));
  }

  async findOneByStorageKey(storageKey: string) {
    return this.drizzleService.client
      .select()
      .from(files)
      .where(eq(files.storageKey, storageKey));
  }

  async findCountByStorageKey(
    storageKey: string,
    tx = this.drizzleService.client,
  ) {
    return this.drizzleService.client
      .select({ count: count() })
      .from(files)
      .where(eq(files.storageKey, storageKey))
      .then(takeFirstOrThrow)
      .then((result) => result.count);
  }
}
