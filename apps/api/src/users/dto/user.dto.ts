import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

import { ActiveUserDto } from 'src/auth/dtos/active-user.dto';

export class UserDto extends ActiveUserDto {
  @IsString()
  @Exclude()
  email: string;

  @Exclude()
  emailVerified: boolean;
}
