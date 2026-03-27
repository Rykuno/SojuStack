import { emailOTPClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export type AuthClient = ReturnType<typeof authClient>;
export const authClient = (customFetch = fetch) => {
  return createAuthClient({
    baseURL: 'http://localhost:8000',
    basePath: '/auth/client',
    plugins: [emailOTPClient()],
    fetchOptions: {
      credentials: 'include',
      customFetchImpl: customFetch,
    },
  });
};
