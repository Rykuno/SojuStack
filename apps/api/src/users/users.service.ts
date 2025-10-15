import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { DrizzleService } from 'src/databases/drizzle.service';
import { users } from 'src/databases/drizzle.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.drizzleService.client
      .update(users)
      .set({
        name: updateUserDto.name,
      })
      .where(eq(users.id, id))
      .returning();
  }

  findMany() {
    return this.drizzleService.client.select().from(users);
  }
}
