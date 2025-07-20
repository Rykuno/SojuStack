import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { StorageService } from 'src/storage/storage.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { EntityRepository } from '@mikro-orm/core';

@Injectable()
export class UsersService {
  constructor(
    private readonly storageService: StorageService,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.image) await this.uploadImage(id, updateUserDto.image);

    await this.userRepository.nativeUpdate(
      { id },
      { name: updateUserDto.name },
    );

    return this.userRepository.findOne({ id });
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

    await this.userRepository.nativeUpdate({ id: userId }, { image: key });
  }

  findMany() {
    return this.userRepository.findAll();
  }
}
