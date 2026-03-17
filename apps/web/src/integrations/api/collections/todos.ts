import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { apiClient } from '../client.ts';
import type { Collection, CreateTodo, UpdateTodo } from '../types.ts';

export class TodoCollection implements Collection {
  queryKeys = ['todos'];

  findMany() {
    return queryOptions({
      queryKey: [...this.queryKeys],
      queryFn: () =>
        apiClient()
          .GET('/todos')
          .then(({ data }) => data ?? []),
    });
  }

  findOne(id: string) {
    return queryOptions({
      queryKey: [...this.queryKeys, id],
      queryFn: () =>
        apiClient()
          .GET('/todos/{id}', { params: { path: { id } } })
          .then(({ data }) => data),
    });
  }

  create() {
    return mutationOptions({
      mutationFn: (todo: CreateTodo) =>
        apiClient()
          .POST('/todos', { body: todo })
          .then(({ data }) => data),
    });
  }

  update() {
    return mutationOptions({
      mutationFn: ({ id, todo }: { id: string; todo: UpdateTodo }) =>
        apiClient()
          .PATCH('/todos/{id}', { params: { path: { id } }, body: todo })
          .then(({ data }) => data),
    });
  }

  delete() {
    return mutationOptions({
      mutationFn: (id: string) => apiClient().DELETE('/todos/{id}', { params: { path: { id } } }),
    });
  }
}
