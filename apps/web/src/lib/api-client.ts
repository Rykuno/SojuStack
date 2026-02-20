import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { paths } from 'api/generated/openapi';
import createClient, { Middleware } from 'openapi-fetch';

type ApiClient = ReturnType<typeof createClient<paths>>;
type FetchImpl = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

let browserClient: ApiClient | undefined;

function toHeaderObject(headers?: HeadersInit) {
  if (!headers) return undefined;
  if (headers instanceof Headers) return Object.fromEntries(headers.entries());
  if (Array.isArray(headers)) return Object.fromEntries(headers);
  return headers;
}

async function getErrorMessage(response: Response) {
  let message = `${response.status} ${response.statusText}`;
  try {
    const body = await response.clone().json();
    message = body?.message ?? body?.error ?? message;
  } catch {
    // non-JSON body, keep default message
  }
  return message;
}

const errorMiddleware: Middleware = {
  async onResponse({ response }) {
    if (!response.ok) throw new Error(await getErrorMessage(response));
  },
};

const clientFetch: FetchImpl = (input, init) =>
  fetch(input, {
    ...init,
    credentials: 'include',
    headers: {
      ...(input instanceof Request ? toHeaderObject(input.headers) : undefined),
      ...toHeaderObject(init?.headers),
    },
  });

function initApiClient(opts?: { headers?: HeadersInit; fetch?: FetchImpl }) {
  const client = createClient<paths>({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
    headers: opts?.headers,
    fetch: opts?.fetch,
  });
  client.use(errorMiddleware);
  return client;
}

function getServerApiClient() {
  const { headers } = getRequest();
  return initApiClient({ headers: Object.fromEntries(headers) });
}

function getClientApiClient() {
  if (!browserClient) {
    browserClient = initApiClient({ fetch: clientFetch });
  }
  return browserClient;
}

export const apiClient = createIsomorphicFn().server(getServerApiClient).client(getClientApiClient);
