import { mutationOptions, queryOptions } from '@tanstack/svelte-query';
import { requireData } from '../client.ts';
import type { CreateTodo, UpdateTodo } from '../types.ts';
import { ApiCollection } from '../collection.ts';

export class TodoCollection extends ApiCollection {
  queryKeys = ['todos'];

  constructor(
    client: ConstructorParameters<typeof ApiCollection>[0],
    fetch?: typeof globalThis.fetch,
  ) {
    super(client, fetch);
  }

  findMany() {
    return queryOptions({
      queryKey: [...this.queryKeys],
      queryFn: () => this.client.GET('/todos').then(requireData),
    });
  }

  findOne(id: string) {
    return queryOptions({
      queryKey: [...this.queryKeys, id],
      queryFn: () => this.client.GET('/todos/{id}', { params: { path: { id } } }).then(requireData),
    });
  }

  create() {
    return mutationOptions({
      mutationFn: (todo: CreateTodo) =>
        this.client.POST('/todos', { body: todo }).then(requireData),
    });
  }

  update() {
    return mutationOptions({
      mutationFn: ({ id, todo }: { id: string; todo: UpdateTodo }) =>
        this.client
          .PATCH('/todos/{id}', { params: { path: { id } }, body: todo })
          .then(requireData),
    });
  }

  delete() {
    return mutationOptions({
      mutationFn: (id: string) => this.client.DELETE('/todos/{id}', { params: { path: { id } } }),
    });
  }
}
