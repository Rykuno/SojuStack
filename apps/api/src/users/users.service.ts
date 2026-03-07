import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Transactional, TransactionHost } from '@nestjs-cls/transactional';
import { DrizzleTransactionClient } from 'src/databases/drizzle.provider';
import { eq } from 'drizzle-orm';
import { users } from 'src/databases/drizzle.schema';
import { ImagesService } from 'src/storage/images.service';
import { takeFirstOrThrow } from 'src/databases/drizzle.utils';
import { createId } from '@paralleldrive/cuid2';
import { S3Service } from 'src/storage/s3.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly txHost: TransactionHost<DrizzleTransactionClient>,
    private readonly imagesService: ImagesService,
    private readonly s3Service: S3Service,
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

    let imageStorageKey = existingUser.image;

    if (updateUserDto.image && !existingUser.image) {
      imageStorageKey = createId();
    }

    const updatedUser = await this.txHost.tx
      .update(users)
      .set({
        name: updateUserDto.name ?? existingUser.name,
        image: imageStorageKey,
      })
      .where(eq(users.id, id))
      .returning()
      .then(takeFirstOrThrow);

    if (updateUserDto.image) {
      if (existingUser.image) {
        await this.imagesService.update(existingUser.image, updateUserDto.image);
      } else if (imageStorageKey) {
        await this.imagesService.createWithStorageKey(imageStorageKey, updateUserDto.image);
      }
    }

    return {
      ...updatedUser,
      image: this.s3Service.getPublicObjectUrl(updatedUser.image),
    };
  }

  async findMany() {
    const userRecords = await this.txHost.tx.query.users.findMany();

    return userRecords.map((userRecord) => ({
      ...userRecord,
      image: this.s3Service.getPublicObjectUrl(userRecord.image),
    }));
  }
}
