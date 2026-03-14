import { Controller, UseInterceptors, UploadedFile, Body, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth, AuthType } from 'src/auth/decorators/auth.decorator';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { UserDto } from './dto/user.dto';
import { Serialize } from 'src/common/decorators/serialize.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('/me')
  @Serialize(UserDto)
  @Auth(AuthType.Required)
  @ApiOkResponse({ type: UserDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Body() updateUserDto: UpdateUserDto,
    @ActiveUser() activeUser: UserDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.usersService.update(activeUser.id, {
      name: updateUserDto.name,
      image,
    });
  }
}
