import { createZodDto } from 'nestjs-zod';
import z from 'zod/v4';

export const CreateTodoSchema = z
  .object({
    title: z.string().trim().min(1).max(255),
    description: z.string().trim().max(2000).optional().default(''),
    completed: z.boolean().optional().default(false),
  })
  .meta({ id: 'CreateTodoDto' });

export class CreateTodoDto extends createZodDto(CreateTodoSchema) {}
