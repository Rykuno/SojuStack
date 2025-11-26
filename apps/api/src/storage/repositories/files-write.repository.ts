import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { FileCreateInput } from 'generated/prisma/models';
import { PrismaService } from 'src/databases/prisma.service';

@Injectable()
export class FilesWriteRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaService>
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
