import { Type as ClassReference } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export default function PaginationResponse<TItem>(
  TItemClass: ClassReference<TItem>,
) {
  abstract class PaginationResponse {
    @ApiProperty()
    nextCursor!: string;

    @ApiProperty()
    cursor!: number;

    @ApiProperty()
    limit!: number;
  }

  abstract class PaginatedType {
    @ApiProperty({ type: [TItemClass] })
    @IsArray()
    @Type(() => TItemClass)
    results!: Array<TItem>;

    @ApiProperty({ type: PaginationResponse })
    @Type(() => PaginationResponse)
    pagination!: PaginationResponse;
  }

  return PaginatedType;
}
