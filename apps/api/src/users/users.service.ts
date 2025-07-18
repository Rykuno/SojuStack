import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { StorageService } from 'src/storage/storage.service';
import { DrizzleService } from 'src/databases/drizzle.service';
import { users } from 'src/databases/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(
    private readonly storageService: StorageService,
    private readonly drizzleService: DrizzleService,
  ) {}

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.image) await this.uploadImage(id, updateUserDto.image);
    return this.drizzleService.client
      .update(users)
      .set({
        name: updateUserDto.name,
      })
      .where(eq(users.id, id))
      .returning();
  }

  private async uploadImage(userId: string, file: Express.Multer.File) {
    const { key } = await this.storageService.upload({
      key: `users/${userId}/avatar`,
      file: new File([file.buffer], `avatar`, {
        type: file.mimetype,
      }),
      resizeOptions: {
        height: 400,
        width: 400,
      },
    });

    return this.drizzleService.client
      .update(users)
      .set({
        image: key,
      })
      .where(eq(users.id, userId))
      .returning();
  }

  findMany() {
    return this.drizzleService.client.select().from(users);
  }
}
