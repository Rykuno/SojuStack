import { AuthCollection } from './collections/auth.ts';
import { TodoCollection } from './collections/todos.ts';
import { createApiClient } from './client.ts';
export * from './collections/todos.ts';

export const api = (customFetch = fetch) => ({
  todos: new TodoCollection(createApiClient(customFetch)),
  auth: new AuthCollection(createApiClient(customFetch), customFetch),
});
