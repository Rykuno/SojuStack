import { PickType } from '@nestjs/swagger';
import { ActiveUserDto } from 'src/auth/dtos/active-user.dto';

export class UserDto extends PickType(ActiveUserDto, ['id', 'name', 'image']) {}
