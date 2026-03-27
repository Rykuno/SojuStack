import { mutationOptions, queryOptions } from '@tanstack/svelte-query';
import { ApiCollection } from '../collection.ts';
import { auth } from '$lib/integrations/auth/client';

export class AuthCollection extends ApiCollection {
  constructor(
    client: ConstructorParameters<typeof ApiCollection>[0],
    fetch?: typeof globalThis.fetch,
  ) {
    super(client, fetch);
  }

  queryKeys = ['auth'];

  session() {
    return queryOptions({
      queryKey: [...this.queryKeys, 'session'],
      queryFn: () =>
        auth(this.fetch)
          .getSession()
          .then((data) => data?.data ?? null),
    });
  }

  signOut() {
    return mutationOptions({
      mutationFn: () => auth(this.fetch).signOut(),
    });
  }

  sendSignInOtp() {
    return mutationOptions({
      mutationFn: async (email: string) =>
        auth(this.fetch).emailOtp.sendVerificationOtp({
          email,
          type: 'sign-in',
        }),
    });
  }

  verifySignInOtp() {
    return mutationOptions({
      mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
        const { data, error } = await auth(this.fetch).signIn.emailOtp({ email, otp });
        if (error) throw error;
        return data;
      },
    });
  }

  refreshSession() {
    return mutationOptions({
      mutationFn: () => auth(this.fetch).updateSession(),
    });
  }
}
