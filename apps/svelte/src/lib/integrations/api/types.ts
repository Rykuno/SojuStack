import type { components } from 'api/generated/openapi';

export interface Collection {
  queryKeys: string[];
}

type Schema = components['schemas'];

export type Todo = Schema['TodoDto'];
export type CreateTodo = Schema['CreateTodoDto'];
export type UpdateTodo = Schema['UpdateTodoDto'];
