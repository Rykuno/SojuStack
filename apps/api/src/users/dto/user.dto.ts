import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsDate, IsString } from 'class-validator';
import { InferSelectModel } from 'drizzle-orm';
import { users } from 'src/databases/drizzle.schema';

export class UserDto implements InferSelectModel<typeof users> {
  @IsString()
  @Expose()
  id!: string;

  @IsString()
  @Expose()
  name!: string;

  @IsString()
  @Exclude()
  email!: string;

  @IsBoolean()
  @Expose()
  emailVerified!: boolean;

  @IsDate()
  @Expose()
  createdAt!: Date;

  @IsDate()
  @Expose()
  updatedAt!: Date;

  @IsString()
  @Expose()
  image!: string | null;
}
