import { queryOptions } from '@tanstack/react-query';
import { authClient } from '../auth-client';
import { ApiHandler } from '../types';

export class AuthApi implements ApiHandler {
  queryKeys = ['auth'];

  sessionQueryOptions() {
    return queryOptions({
      queryKey: [...this.queryKeys, 'session'],
      staleTime: 30_000,
      gcTime: 300_000,
      queryFn: async () =>
        authClient()
          .getSession()
          .then((res) => res.data),
    });
  }

  async signOut() {
    return authClient()
      .signOut()
      .then((res) => res.data);
  }

  async sendSignInOtp(email: string) {
    return authClient()
      .emailOtp.sendVerificationOtp({ email, type: 'sign-in' })
      .then((res) => res.data);
  }

  async signInWithOtp(email: string, otp: string) {
    return authClient()
      .signIn.emailOtp({
        email,
        otp,
      })
      .then((res) => res.data);
  }
}
