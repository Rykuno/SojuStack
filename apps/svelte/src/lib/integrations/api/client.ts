import type { paths } from 'api/generated/openapi';
import createClient from 'openapi-fetch';

export type ApiClient = ReturnType<typeof createClient<paths>>;
export function createApiClient(customFetch = fetch) {
  return createClient<paths>({
    baseUrl: 'http://localhost:8000',
    credentials: 'include',
    fetch: customFetch,
  });
}
