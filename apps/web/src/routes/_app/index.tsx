import { api } from '#/integrations/api';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { TrashIcon } from 'lucide-react';
import { Button } from '#/components/ui/button';
import { Checkbox } from '#/components/ui/checkbox';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '#/components/ui/item';
import { todoSchema, useCreateTodoForm } from '#/hooks/forms/use-todo-form';
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '#/components/ui/modal';
import { Suspense, useState } from 'react';
import { Spinner } from '#/components/ui/spinner';

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    void context.queryClient.prefetchQuery(api.todos.findMany());
  },
});

function RouteComponent() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className='max-w-2xl mx-auto mt-24 space-y-4'>
      <Button className='w-full' onClick={() => setOpen(true)}>
        Add Todo
      </Button>
      <Suspense fallback={<Spinner className='size-4 animate-spin' />}>
        <TodoList />
      </Suspense>
      <AddTodoModal open={open} onOpenChange={setOpen} />
    </div>
  );
}

function AddTodoModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const createTodoForm = useCreateTodoForm.useAppForm({
    defaultValues: {
      title: '',
      description: '',
      completed: false,
    },
    validators: {
      onBlur: todoSchema,
    },
    onSubmit: ({ value }) => {
      createTodoMutation.mutate(value);
      onOpenChange(false);
    },
  });

  const createTodoMutation = useMutation({
    onSuccess: () => void queryClient.invalidateQueries(),
    ...api.todos.create(),
  });

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Add Todo</ModalTitle>
          <ModalDescription>Add a new todo to your list</ModalDescription>
        </ModalHeader>
        <div className='flex flex-col gap-4'>
          <createTodoForm.AppForm>
            <div className='flex flex-col gap-2'>
              <createTodoForm.Label>Title</createTodoForm.Label>
              <createTodoForm.AppField
                name='title'
                children={(field) => (
                  <field.Input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='Walk dog'
                  />
                )}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <createTodoForm.Label>Description</createTodoForm.Label>
              <createTodoForm.AppField
                name='description'
                children={(field) => (
                  <field.Textarea
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='Walk dog for 30 minutes'
                  />
                )}
              />
            </div>
          </createTodoForm.AppForm>
        </div>
        <ModalFooter>
          <createTodoForm.AppForm>
            <ModalClose>Close</ModalClose>
            <createTodoForm.SubmitButton
              type='button'
              onClick={() => void createTodoForm.handleSubmit()}
            >
              Create
            </createTodoForm.SubmitButton>
          </createTodoForm.AppForm>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function TodoList() {
  const queryClient = useQueryClient();
  const { data: todos } = useSuspenseQuery(api.todos.findMany());

  const deleteTodoMutation = useMutation({
    onSuccess: () => void queryClient.invalidateQueries(),
    ...api.todos.delete(),
  });

  const updateTodoMutation = useMutation({
    onSuccess: () => void queryClient.invalidateQueries(),
    ...api.todos.update(),
  });

  return (
    <ItemGroup>
      {todos.map((todo) => (
        <Item key={todo.id} variant='outline'>
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() =>
              updateTodoMutation.mutate({ id: todo.id, todo: { completed: !todo.completed } })
            }
            aria-label={`Toggle ${todo.title}`}
          />
          <ItemContent>
            <ItemTitle>{todo.title}</ItemTitle>
            {todo.description ? <ItemDescription>{todo.description}</ItemDescription> : null}
          </ItemContent>
          <ItemActions>
            <Button
              variant='ghost'
              size='icon-xs'
              onClick={() => deleteTodoMutation.mutate(todo.id)}
            >
              <TrashIcon />
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}
