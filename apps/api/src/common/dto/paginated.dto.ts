import { Type as ClassReference } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export default function Paginated<TItem>(
  TItemClass: ClassReference<TItem>,
) {
  abstract class PaginatedOptions {
    @ApiProperty()
    nextCursor!: string;

    @ApiProperty()
    cursor!: number;

    @ApiProperty()
    limit!: number;
  }

  abstract class PaginatedResponse {
    @ApiProperty({ type: [TItemClass] })
    @IsArray()
    @Type(() => TItemClass)
    results!: Array<TItem>;

    @ApiProperty({ type: PaginatedOptions })
    @Type(() => PaginatedResponse)
    pagination!: PaginatedOptions;
  }

  return PaginatedResponse;
}
