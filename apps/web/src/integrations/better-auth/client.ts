import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { emailOTPClient, inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { type BetterAuthClient } from 'api/src/auth/better-auth.service';

let browserAuthClient: ReturnType<typeof initAuthClient> | undefined;

function getRequiredApiUrl() {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) throw new Error('VITE_API_URL is required');
  return apiUrl;
}

function initAuthClient(fetchOptions: RequestInit) {
  return createAuthClient({
    baseURL: getRequiredApiUrl(),
    basePath: '/auth/client',
    plugins: [inferAdditionalFields<BetterAuthClient>(), tanstackStartCookies(), emailOTPClient()],
    fetchOptions,
  });
}

function getClientAuthClient() {
  if (!browserAuthClient) {
    browserAuthClient = initAuthClient({
      credentials: 'include',
    });
  }

  return browserAuthClient;
}

function getServerAuthClient() {
  const { headers } = getRequest();

  return initAuthClient({
    headers,
    credentials: 'include',
  });
}

export const authClient = createIsomorphicFn()
  .server(getServerAuthClient)
  .client(getClientAuthClient);
