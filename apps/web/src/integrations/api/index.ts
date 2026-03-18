import { AuthCollection } from './collections/auth.ts';
import { TodoCollection } from './collections/todos.ts';
export * from './collections/todos.ts';

export const api = {
  auth: new AuthCollection(),
  todos: new TodoCollection(),
};
