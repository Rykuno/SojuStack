import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma.service';

@Injectable()
export class FilesReadRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaService>
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
