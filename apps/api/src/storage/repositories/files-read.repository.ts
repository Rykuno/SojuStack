import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma/client';

@Injectable()
export class FilesReadRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaClient>
    >,
  ) {}

  async findOneById(id: string) {
    return this.txHost.tx.file.findUnique({
      where: { id },
    });
  }

  async findOneByStorageKey(storageKey: string) {
    return this.txHost.tx.file.findFirst({
      where: { storageKey },
    });
  }

  async findCountByStorageKey(storageKey: string) {
    return this.txHost.tx.file.count({
      where: { storageKey },
    });
  }
}
