import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { TransactionHost } from '@nestjs-cls/transactional';
import { PrismaClient } from 'src/generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaClient>
    >,
  ) {}

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.txHost.tx.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
      },
    });
  }

  findMany() {
    return this.txHost.tx.user.findMany();
  }
}
