import { AuthCollection } from './collections/auth.ts';
import { TodoCollection } from './collections/todos.ts';
import { createApiClient } from './client.ts';
import type { ApiContext } from './types.ts';
export * from './collections/todos.ts';

export const api = (customFetch = fetch) => {
  const ctx: ApiContext = {
    client: createApiClient(customFetch),
    fetch: customFetch,
  };

  return {
    todos: new TodoCollection(ctx),
    auth: new AuthCollection(ctx),
  };
};
