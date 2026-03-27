import { mutationOptions, queryOptions } from '@tanstack/svelte-query';
import { ApiCollection } from '../types.ts';
import { authClient } from '$lib/integrations/auth/client';

export class AuthCollection extends ApiCollection {
  readonly queryKeys = ['auth'];

  private auth() {
    return authClient(this.customFetch);
  }

  session() {
    return queryOptions({
      queryKey: [...this.queryKeys, 'session'],
      queryFn: () =>
        this.auth()
          .getSession()
          .then((data) => data?.data ?? null),
    });
  }

  signOut() {
    return mutationOptions({
      mutationFn: () => this.auth().signOut(),
    });
  }

  sendSignInOtp() {
    return mutationOptions({
      mutationFn: async (email: string) =>
        this.auth().emailOtp.sendVerificationOtp({
          email,
          type: 'sign-in',
        }),
    });
  }

  verifySignInOtp() {
    return mutationOptions({
      mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
        const { data, error } = await this.auth().signIn.emailOtp({ email, otp });
        if (error) throw error;
        return data;
      },
    });
  }

  refreshSession() {
    return mutationOptions({
      mutationFn: () => this.auth().updateSession(),
    });
  }
}
