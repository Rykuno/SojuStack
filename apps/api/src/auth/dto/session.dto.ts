import { IsString, IsDate } from 'class-validator';
import { InferSelectModel } from 'drizzle-orm';
import { sessions } from 'src/databases/drizzle.schema';

export class SessionDto implements InferSelectModel<typeof sessions> {
  @IsString()
  id!: string;

  @IsString()
  token!: string;

  @IsString()
  userId!: string;

  @IsDate()
  expiresAt!: Date;

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;

  @IsString()
  ipAddress!: string | null;

  @IsString()
  userAgent!: string | null;
}
