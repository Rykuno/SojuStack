import { AuthCollection } from './collections/auth.ts';
import { TodoCollection } from './collections/todos.ts';
import { ApiCollection } from './collection.ts';
import { createApiClient } from './client.ts';
export * from './collections/todos.ts';

class ApiCollectionModule extends ApiCollection {
  auth: AuthCollection;
  todos: TodoCollection;

  constructor(
    client: ConstructorParameters<typeof ApiCollection>[0],
    fetch?: typeof globalThis.fetch,
  ) {
    super(client, fetch);
    this.auth = new AuthCollection(this.client, this.fetch);
    this.todos = new TodoCollection(this.client, this.fetch);
  }
}

export const api = (fetch?: typeof globalThis.fetch) =>
  new ApiCollectionModule(createApiClient(fetch), fetch);
