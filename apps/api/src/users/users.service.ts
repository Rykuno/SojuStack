import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { StorageService } from 'src/storage/storage.service';
import { PrismaService } from 'src/databases/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
  ) {}

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.image) await this.uploadImage(id, updateUserDto.image);

    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: updateUserDto.name,
      },
    });
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

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        image: key,
      },
    });
  }

  findMany() {
    return this.prisma.user.findMany();
  }
}
