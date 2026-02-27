import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class HealthzDto {
  @ApiProperty({ example: 'ok' })
  @Expose()
  status!: 'ok';
}
