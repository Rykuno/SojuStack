import type { ClientOptions } from 'openapi-fetch';
import type { paths } from 'api/generated/openapi';
import createClient from 'openapi-fetch';

type ApiResult<T> = {
  data?: T;
  response: Response;
};

export type ApiClient = ReturnType<typeof createClient<paths>>;

export function createApiClient(fetch?: ClientOptions['fetch']) {
  return createClient<paths>({
    baseUrl: 'http://localhost:8000',
    credentials: 'include',
    fetch,
  });
}

export const apiClient = createApiClient();

export function requireData<T>({ data, response }: ApiResult<T>) {
  if (!data) {
    throw new Error(`Expected response body for ${response.status} ${response.statusText}`);
  }

  return data;
}
