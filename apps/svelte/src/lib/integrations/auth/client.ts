import { emailOTPClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

let browserAuthClient: ReturnType<typeof initAuthClient> | undefined;

function initAuthClient(fetch?: typeof globalThis.fetch) {
  return createAuthClient({
    baseURL: 'http://localhost:8000',
    basePath: '/auth/client',
    plugins: [emailOTPClient()],
    fetchOptions: {
      credentials: 'include',
      ...(fetch ? { customFetchImpl: fetch } : {}),
    },
  });
}

export type AuthClient = ReturnType<typeof initAuthClient>;

export function auth(fetch?: typeof globalThis.fetch) {
  if (fetch) {
    return initAuthClient(fetch);
  }

  browserAuthClient ??= initAuthClient();
  return browserAuthClient;
}
