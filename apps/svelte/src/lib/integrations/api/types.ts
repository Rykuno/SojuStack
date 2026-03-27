import type { components } from 'api/generated/openapi';

import type { ApiClient } from './client.ts';

export type ApiContext = {
  client: ApiClient;
  fetch: typeof fetch;
};

export abstract class ApiCollection {
  protected readonly ctx: ApiContext;

  constructor(ctx: ApiContext) {
    this.ctx = ctx;
  }

  protected get client() {
    return this.ctx.client;
  }

  protected get customFetch() {
    return this.ctx.fetch;
  }
}

export interface Collection {
  queryKeys: string[];
}

type Schema = components['schemas'];

export type Todo = Schema['TodoDto'];
export type CreateTodo = Schema['CreateTodoDto'];
export type UpdateTodo = Schema['UpdateTodoDto'];
