import {
  Controller,
  UseInterceptors,
  UploadedFile,
  Body,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth, AuthType } from 'src/auth/decorators/auth.decorator';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserDto } from 'src/auth/dtos/active-user.dto';
import { UserDto } from './dto/user.dto';
import { TransformDataInterceptor } from 'src/common/interceptors/transform-data.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('/me')
  @UseInterceptors(new TransformDataInterceptor(UserDto))
  @ApiConsumes('multipart/form-data')
  @Auth(AuthType.Required)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() image: Express.Multer.File,
    @ActiveUser() activeUser: ActiveUserDto,
  ) {
    return this.usersService.update(activeUser.id, {
      name: updateUserDto.name,
      image,
    });
  }
}
