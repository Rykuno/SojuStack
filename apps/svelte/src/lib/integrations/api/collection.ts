import type { paths } from 'api/generated/openapi';
import type createClient from 'openapi-fetch';

export abstract class ApiCollection {
  protected readonly client: ReturnType<typeof createClient<paths>>;
  protected readonly customFetch: typeof fetch;

  constructor(client: ReturnType<typeof createClient<paths>>, customFetch = fetch) {
    this.client = client;
    this.customFetch = customFetch;
  }
}
