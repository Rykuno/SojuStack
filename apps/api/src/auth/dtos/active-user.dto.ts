import { User } from 'better-auth';
import { Transform } from 'class-transformer';

const STORAGE_URL = process.env['STORAGE_URL']?.replace(/\/+$/, '') ?? 'http://localhost:9000';
const STORAGE_BUCKET = process.env['STORAGE_BUCKET_NAME'] ?? 'public';

export class ActiveUserDto implements User {
  id!: string;
  name!: string;
  emailVerified!: boolean;
  email!: string;
  createdAt!: Date;
  updatedAt!: Date;
  @Transform(({ value }) => (value ? `${STORAGE_URL}/${STORAGE_BUCKET}/${value}` : null))
  image?: string | null;
}
