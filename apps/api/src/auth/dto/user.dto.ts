import { createZodDto } from 'nestjs-zod';
import z from 'zod/v4';

export const UserSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    password: z.string(),
  })
  .meta({ id: 'User' });

export class UserDto extends createZodDto(UserSchema) {}
