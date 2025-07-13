import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { ActiveUser } from './decorators/active-user.decorator';
import { Auth, AuthType } from './decorators/auth.decorator';
import { ActiveUserDto } from './dtos/active-user.dto';
import { PrismaService } from 'src/databases/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('/session')
  @Auth(AuthType.Public)
  session(@ActiveUser() user: ActiveUserDto) {
    // throw new InternalServerErrorException();
    return user;
  }
}
