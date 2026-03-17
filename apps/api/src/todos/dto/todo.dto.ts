import { createZodDto } from 'nestjs-zod';
import z from 'zod/v4';

const stringToDate = z.codec(z.iso.datetime(), z.date(), {
  decode: (isoString) => new Date(isoString),
  encode: (date) => date.toISOString(),
});

export const TodoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  completed: z.boolean(),
  createdAt: stringToDate,
  updatedAt: stringToDate,
});

export class TodoDto extends createZodDto(TodoSchema, { codec: true }) {}
