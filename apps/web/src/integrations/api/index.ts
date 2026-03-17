import { TodoCollection } from './collections/todos.ts';
export * from './collections/todos.ts';

export const api = {
  todos: new TodoCollection(),
};
