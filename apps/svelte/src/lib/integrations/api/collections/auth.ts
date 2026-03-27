import { mutationOptions, queryOptions } from '@tanstack/svelte-query';
import { ApiCollection } from '../collection.ts';
import { authClient } from '$lib/integrations/auth/client';
import type { ApiClient } from '../client.ts';

export class AuthCollection extends ApiCollection {
  queryKeys = ['auth'];
  customFetch: typeof fetch;

  constructor(client: ApiClient, customFetch = fetch) {
    super(client);
    this.customFetch = customFetch;
  }

  session() {
    return queryOptions({
      queryKey: [...this.queryKeys, 'session'],
      queryFn: () =>
        authClient(this.customFetch)
          .getSession()
          .then((data) => data?.data ?? null),
    });
  }

  signOut() {
    return mutationOptions({
      mutationFn: () => authClient(this.customFetch).signOut(),
    });
  }

  sendSignInOtp() {
    return mutationOptions({
      mutationFn: async (email: string) =>
        authClient(this.customFetch).emailOtp.sendVerificationOtp({
          email,
          type: 'sign-in',
        }),
    });
  }

  verifySignInOtp() {
    return mutationOptions({
      mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
        const { data, error } = await authClient(this.customFetch).signIn.emailOtp({ email, otp });
        if (error) throw error;
        return data;
      },
    });
  }

  refreshSession() {
    return mutationOptions({
      mutationFn: () => authClient(this.customFetch).updateSession(),
    });
  }
}
