import { User } from 'better-auth';
import { Transform } from 'class-transformer';

export class ActiveUserDto implements User {
  id!: string;
  name!: string;
  emailVerified!: boolean;
  email!: string;
  createdAt!: Date;
  updatedAt!: Date;
  @Transform(({ value }) => (value ? `http://localhost:9000/dev/${value}` : null))
  image?: string | null;
}
