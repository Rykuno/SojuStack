import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { Collection } from '../types';
import { authClient } from '#/integrations/better-auth/client';

export class AuthCollection implements Collection {
  queryKeys = ['auth'];

  session() {
    return queryOptions({
      queryKey: [...this.queryKeys, 'session'],
      queryFn: () =>
        authClient()
          .getSession()
          .then(({ data }) => data?.session ?? null),
    });
  }

  user() {
    return queryOptions({
      queryKey: [...this.queryKeys, 'session'],
      queryFn: () =>
        authClient()
          .getSession()
          .then(({ data }) => data?.user ?? null),
    });
  }

  signOut() {
    return mutationOptions({
      mutationFn: () => authClient().signOut(),
    });
  }

  sendSignInOtp() {
    return mutationOptions({
      mutationFn: async (email: string) =>
        authClient().emailOtp.sendVerificationOtp({
          email,
          type: 'sign-in',
        }),
    });
  }

  verifySignInOtp() {
    return mutationOptions({
      mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
        const { data, error } = await authClient().signIn.emailOtp({ email, otp });
        if (error) throw error;
        return data;
      },
    });
  }

  refreshSession() {
    return mutationOptions({
      mutationFn: () => authClient().updateSession(),
    });
  }
}
