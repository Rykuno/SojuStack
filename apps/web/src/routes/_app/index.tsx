import { api } from '#/integrations/api';
import { useMutation, useQuery } from '@tanstack/react-query';
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '#/components/ui/modal';

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: todos = [], refetch } = useQuery(api.todos.findMany());

  const deleteTodoMutation = useMutation({
    onSuccess: () => void refetch(),
    ...api.todos.delete(),
  });
  const createTodoMutation = useMutation({
    onSuccess: () => void refetch(),
    ...api.todos.create(),
  });
  const updateTodoMutation = useMutation({
    onSuccess: () => void refetch(),
    ...api.todos.update(),
  });

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
    },
  });

  return (
    <div className='max-w-2xl mx-auto mt-24 space-y-4'>
      <Modal>
        <ModalTrigger>Test</ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Modal Title</ModalTitle>
            <ModalDescription>Modal Description</ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose>Close</ModalClose>
            <Button>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <h1>Todos</h1>
      <div>
        <createTodoForm.AppForm>
          <form
            className='flex flex-col gap-2'
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void createTodoForm.handleSubmit();
            }}
          >
            <createTodoForm.AppField
              name='title'
              children={(field) => (
                <field.Input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='Todo title'
                />
              )}
            />
            <createTodoForm.AppField
              name='description'
              children={(field) => (
                <field.Textarea
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='Description'
                />
              )}
            />
            <createTodoForm.AppForm>
              <createTodoForm.SubmitButton>Create</createTodoForm.SubmitButton>
            </createTodoForm.AppForm>
          </form>
        </createTodoForm.AppForm>
      </div>
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
    </div>
  );
}
