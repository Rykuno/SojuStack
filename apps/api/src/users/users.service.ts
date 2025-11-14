import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { users } from 'src/databases/drizzle.schema';
import { eq } from 'drizzle-orm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { DatabaseTransactionAdapter } from 'src/databases/database.provider';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: TransactionHost<DatabaseTransactionAdapter>,
  ) {}

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.db.tx
      .update(users)
      .set({
        name: updateUserDto.name,
      })
      .where(eq(users.id, id))
      .returning();
  }

  findMany() {
    return this.db.tx.select().from(users);
  }
}
