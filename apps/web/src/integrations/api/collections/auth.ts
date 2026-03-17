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
          .then(({ data }) => data?.session),
    });
  }

  user() {
    return queryOptions({
      queryKey: [...this.queryKeys, 'session'],
      queryFn: () =>
        authClient()
          .getSession()
          .then(({ data }) => data?.user),
    });
  }

  signOut() {
    return mutationOptions({
      mutationFn: () => authClient().signOut(),
    });
  }

  sendSignInOtp() {
    return mutationOptions({
      mutationFn: (email: string) =>
        authClient().emailOtp.sendVerificationOtp({ email, type: 'sign-in' }),
    });
  }

  verifySignInOtp() {
    return mutationOptions({
      mutationFn: ({ email, otp }: { email: string; otp: string }) =>
        authClient().signIn.emailOtp({ email, otp }),
    });
  }

  refreshSession() {
    return mutationOptions({
      mutationFn: () => authClient().updateSession(),
    });
  }
}
