import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { Input } from '#/components/ui/input';
import { Textarea } from '#/components/ui/textarea';
import { Button } from '#/components/ui/button';
import { z } from 'zod/v4';

const { fieldContext, formContext } = createFormHookContexts();

export const todoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().max(2000, 'Description must be 2000 characters or fewer'),
  completed: z.boolean(),
});

export const useCreateTodoForm = createFormHook({
  fieldComponents: {
    Input,
    Textarea,
  },
  formComponents: {
    Label: (props: React.ComponentProps<'label'>) => <label {...props} />,
    SubmitButton: (props) => <Button type='submit' {...props} />,
  },
  fieldContext,
  formContext,
});
