import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { FileCreateInput } from 'src/generated/prisma/models';
import { PrismaClient } from 'src/generated/prisma/client';

@Injectable()
export class FilesWriteRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaClient>
    >,
  ) {}

  async create(values: FileCreateInput) {
    return this.txHost.tx.file.create({
      data: values,
    });
  }

  delete(id: string) {
    return this.txHost.tx.file.delete({
      where: { id },
    });
  }
}
