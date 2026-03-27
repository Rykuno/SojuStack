import type { paths } from 'api/generated/openapi';
import type createClient from 'openapi-fetch';

export abstract class ApiCollection {
  protected readonly client: ReturnType<typeof createClient<paths>>;
  protected readonly fetch?: typeof globalThis.fetch;

  constructor(client: ReturnType<typeof createClient<paths>>, fetch?: typeof globalThis.fetch) {
    this.client = client;
    this.fetch = fetch;
  }
}
