import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { emailOTPClient, organizationClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

function getRequiredApiUrl() {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error('VITE_API_URL is required');
  }
  return apiUrl;
}

function initAuthClient(fetchOptions: RequestInit) {
  return createAuthClient({
    baseURL: getRequiredApiUrl(),
    basePath: '/auth/client',
    plugins: [emailOTPClient(), organizationClient()],
    fetchOptions,
  });
}

function getClientAuthClient() {
  return initAuthClient({
    credentials: 'include',
  });
}

function getServerAuthClient() {
  const { headers } = getRequest();
  return initAuthClient({
    headers: Object.fromEntries(headers),
    credentials: 'include',
  });
}

export const authClient = createIsomorphicFn()
  .server(getServerAuthClient)
  .client(getClientAuthClient);
