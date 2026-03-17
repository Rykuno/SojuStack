import { createZodDto } from 'nestjs-zod';
import z from 'zod/v4';

export const UpdateTodoSchema = z
  .object({
    title: z.string().trim().min(1).max(255).optional(),
    description: z.string().trim().max(2000).optional(),
    completed: z.boolean().optional(),
  })
  .refine(
    (value) =>
      value.title !== undefined || value.description !== undefined || value.completed !== undefined,
    {
      message: 'At least one field must be provided.',
    },
  )
  .meta({ id: 'UpdateTodoDto' });

export class UpdateTodoDto extends createZodDto(UpdateTodoSchema) {}
