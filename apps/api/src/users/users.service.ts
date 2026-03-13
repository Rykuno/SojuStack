import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Transactional, TransactionHost } from '@nestjs-cls/transactional';
import { DrizzleTransactionClient } from 'src/databases/drizzle.provider';
import { eq } from 'drizzle-orm';
import { users } from 'src/databases/drizzle.schema';
import { takeFirstOrThrow } from 'src/databases/drizzle.utils';
import { StorageService } from 'src/storage/storage.service';
import { StorageBucket } from 'src/storage/storage.constants';

@Injectable()
export class UsersService {
  constructor(
    private readonly txHost: TransactionHost<DrizzleTransactionClient>,
    private readonly storageService: StorageService,
  ) {}

  @Transactional()
  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.txHost.tx.query.users.findFirst({
      where: {
        id,
      },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const imageKey = `user-avatar-${id}`;
    const imagePath = updateUserDto.image ? imageKey : existingUser.image;

    const updatedUser = await this.txHost.tx
      .update(users)
      .set({
        name: updateUserDto.name ?? existingUser.name,
        image: imagePath,
      })
      .where(eq(users.id, id))
      .returning()
      .then(takeFirstOrThrow);

    if (updateUserDto.image) {
      await this.storageService.bucket(StorageBucket.Public).putFile(updateUserDto.image);
    }

    return updatedUser;
  }

  async findMany() {
    return this.txHost.tx.query.users.findMany();
  }
}
