import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name?: string;
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  image?: Express.Multer.File;
}
