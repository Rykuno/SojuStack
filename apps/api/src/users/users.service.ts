import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Transactional, TransactionHost } from '@nestjs-cls/transactional';
import { DrizzleTransactionClient } from 'src/databases/drizzle.provider';
import { eq } from 'drizzle-orm';
import { users } from 'src/databases/drizzle.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly txHost: TransactionHost<DrizzleTransactionClient>,
  ) {}

  @Transactional()
  update(id: string, updateUserDto: UpdateUserDto) {
    return this.txHost.tx
      .update(users)
      .set({
        name: updateUserDto.name,
      })
      .where(eq(users.id, id))
      .returning();
  }

  findMany() {
    return this.txHost.tx.query.users.findMany();
  }
}
