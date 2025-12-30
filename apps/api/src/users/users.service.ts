import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Transactional, TransactionHost } from '@nestjs-cls/transactional';
import { DatabaseTransactionClient } from 'src/databases/database.provider';
import { eq } from 'drizzle-orm';
import { users } from 'src/databases/database.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly txHost: TransactionHost<DatabaseTransactionClient>,
  ) {}

  @Transactional()
  async update(id: string, updateUserDto: UpdateUserDto) {
    this.txHost.tx
      .update(users)
      .set({
        name: updateUserDto.name,
      })
      .where(eq(users.id, id));
  }

  findMany() {
    return this.txHost.tx.query.users.findMany();
  }
}
