import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  image!: string | null;
}
